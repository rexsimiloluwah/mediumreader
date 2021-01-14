const stopwords = require('./stopwords.json')["stopwords"];
// console.log(stopwords)

const computeWordFreq = (sentence) => {
    const word_freq = {}
    const sentence_cleaned = sentence.replace(/[^0-9a-z]/gi, ' ').replace(/[0-9]/g,'').toLowerCase().split(/\s/)
    sentence_cleaned.forEach(word => {
        if(!stopwords.includes(word) &&  word !== escape("")){
            if(Object.keys(word_freq).includes(word) ){
                word_freq[word] += 1
            }
            else{
                 word_freq[word] = 1
            }
        }
    })

    return Object.keys(word_freq).map(item => (
        {
            word: item,
            value: word_freq[item]
        }
    )).sort((a,b) => (a.value < b.value) ? 1 : -1).slice(0,40)
}

module.exports = computeWordFreq;

