import React from 'react';
import axios from 'axios';
import style from './index.module.scss';
import Select from 'react-select';
import Loader from 'react-loader-spinner';
import audioWave from '../../assets/images/audio_wave.png';
import computeWordFreq from '../../utils/wordFrequency';
import {WordCloud} from 'word-cloud-react';

const TextCloud = ({data}) => {
    return(
    <WordCloud 
        width={"auto"} 
        maxFont={40} 
        minFont={10} 
        logFunc={(x)=> Math.log2(x) * 5} 
        data={data}
        clickEvent={(x)=>console.log(x.word)} 
        color={['#71803F', '#F8AC1D','#598EC0','#E2543E','#1A3051','#F46F73','#8A87BB','#56CFCD','#297373','#FF8552','#F2E863','#C2F8CB','#3A6EA5','#FF6700','#C0C0C0','#4E4381','#523CBD',]}
    />
    )
}


const Main = props => {

    // Initialize window speech synthesis API
    const synth = window.speechSynthesis;

    const [url, setUrl] = React.useState(null);
    const [content, setContent] = React.useState(null);
    const [voices, setVoices] = React.useState({})
    const [loading, setLoading] = React.useState(null);
    const [voiceOptions, setVoiceOptions] = React.useState([])
    const [paused, setPaused] = React.useState(false);
    const [selectedVoice, setSelectedVoice] = React.useState("Microsoft Hazel Desktop - English (Great Britain)")
    const [pitch, setPitch] = React.useState(1);
    const [rate, setRate] = React.useState(1);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [wordcloud, setWordCloud] = React.useState([]);

    window.onload = () => {
        synth.cancel();
    }

    const speak = (text, mode = 'speak') => {

        setPaused(true);

        const speakText = new SpeechSynthesisUtterance(text);

        speakText.onend = e => {
            console.log("DONE SPEAKING...")
        }

        speakText.onerror = e => {
            console.error("AN ERROR OCCURRED...")
        }

        speakText.pitch = pitch;
        speakText.rate = rate;

        synth.speak(speakText)

        // speakText.voice = selectedVoice;
        voices.forEach(voice => {
            if (voice.name === selectedVoice){
                speakText.voice = voice;
            }
        })

        //fix stop after a while bug
        let r = setInterval(() => {
            console.log(synth.speaking);
            if (!synth.speaking) {
              clearInterval(r);
            } else {
              synth.resume();
            }
          }, 14000);
          //end fix stop after a while bug
    }

      const onClickResume = () => {
        setPaused(false)
        if(synth.paused) { /* unpause/resume narration */
            synth.resume();
        }
      }
      

    const onClickPause = () => {
        setPaused(false)
        if(synth.speaking && !synth.paused){ /* pause narration */
            synth.pause();
        }
    }
    
    const onClickStop = () => {
        setPaused(false);
       if(synth.speaking){
            synth.cancel();
        }
    }


    const getVoiceOptions = (voiceList) => {
        let options = []
        voiceList.forEach((voice) => {
            options.push({
                value : voice.name,
                label : `${voice.name} (${voice.lang})`
            })
        })
        console.log(options)
        return options;
    }


    React.useEffect( () => {
        const getVoices = () => {
            let voicesList = synth.getVoices()
            setVoices(voicesList);
            setVoiceOptions(getVoiceOptions(voicesList))
            console.log(voicesList);
        }
        axios.get("https://medred.glitch.me")
        getVoices();
        if (synth.onvoiceschanged !== undefined){
            synth.onvoiceschanged = getVoices
        }

    }, [synth])

    const handleChange = (e) => {
        setUrl(e.target.value);
    }

    const handleVoiceSelect = (e) => {
        setSelectedVoice(e.value)
    }

    const handlePitchChange = (e) => {
        setPitch(e.target.value);
    }

    const handleRateChange = (e) => {
        setRate(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setContent(null);
        setLoading(true);
        setErrorMessage(null);

        synth.cancel();

        axios.post("https://medred.glitch.me", {
            "URL" : url
        })
        .then( result => {
            setContent(result.data);
            setWordCloud(computeWordFreq(result.data));
            console.log(computeWordFreq(result.data))
            setLoading(false);
        })
        .catch(err => {
            setLoading(false);
            setErrorMessage(err.response.data.message);
            console.error(err)
        })

    }


    return(
        <section className = {style["main"]}>
            <div className = {style["container"]}>
            <div className = {style["header"]}>
                <h4>Medium Reader</h4>
                <p>🎧 LISTEN to your favourite medium blogposts, Enhance productivity and retention 😊.</p>
            </div>
            <div className = {style["container__main"]}>

            <img src = {audioWave} alt="audioWave"></img>
            <div className = {style["form__container"]}>
                <Select options = {voiceOptions} placeholder= "Select your preferred Language" onChange = {handleVoiceSelect}></Select>
                <Form handleChange = {handleChange} handleSubmit = {handleSubmit}></Form>

                <div className="slidecontainer">
                    <span>Rate :- {rate}</span>
                    <input onChange = {handleRateChange} type="range" name = "rate" min="0.5" max="10" step="0.5" defaultValue="1" className={style["slider"]} id="rate"></input>
                </div>

                <div className="slidecontainer">
                    <span>Pitch :- {pitch}</span>
                    <input onChange = {handlePitchChange} type="range" name = "pitch" min="0" max="10" step="0.5" defaultValue="1" className={style["slider"]} id="pitch"></input>
                </div>

            </div> 

            
            {loading ? 
            <Loader type="Audio" color="#FFFFFF" height={80} width={80} className = {style["loader"]}></Loader> : "" }

            {
                !content || errorMessage ? <p style={{textAlign: "center", color: "crimson"}}>{errorMessage}</p> :
                <div className = {style["audio__container"]}>
                    <button><i className = "bx bx-rewind-circle"></i></button>
                    {paused ? <button onClick = {onClickPause}><i className = "bx bx-pause-circle"></i></button> : 
                    <button onClick = {() => speak(content, 'speak')}><i className = "bx bx-play-circle"></i></button>} 
                    <button><i className = "bx bx-fast-forward-circle"></i></button>

                    <button onClick = {onClickStop} className = {style["stop__btn"]}><i className = "bx bx-stop"></i></button>
                  
                </div>
            }
             
             {wordcloud.length ? <TextCloud data = {wordcloud} />: ""}
            </div>
            <p className = {style["footer"]}>Still in development, <i className = "bx bxl-github"></i> View <a href="https://github.com/rexsimiloluwah/mediumreader">Github</a></p>
            </div>

        </section>
    )
}

export default Main;


const Form = props => {
    return(
        <>
        <form onSubmit = {props.handleSubmit}>
            <div className = {style["form__group"]}>
                <input type = "text" name = "url" id = "url" placeholder = "Paste Link to Article or Blogpost" onChange = {props.handleChange}></input>
                <button type = "submit">LISTEN <i className = "bx bx-headphone bx-2x"></i></button>
            </div>
        </form>
        </>
    )
}