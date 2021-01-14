# Medium Reader 

🎧 LISTEN to your favourite medium blogposts, Enhance productivity and retention 😊.

## Why Medium Reader ?

I wanted to read a medium blog post concurrently while I was coding yesterday. So I thought having an app that could perform some sort of speech synthesis so you could listen to a text-based blog post would be fun and useful. I made an attempt at building it, and I hope to improve it soon.

## How does it work ?

I wrote a simple node server that scrapes the text content from a medium post on glitch (https://medred.glitch.me), so the react app then receives that text content, and the Speech Synthesis web APIs are used to convert the text content to speech which can be listened to. 
It isn't perfect however due to some issues with the Speech Synthesis APIs.

## Where can I find this web app ?

https://mediumreader.vercel.app

#### Kindly leave a star if you love this, Thanks !.

