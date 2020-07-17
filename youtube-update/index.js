// install express with `npm install express` 
const express = require('express')
const path = require('path')
const app = express()
require('dotenv').config()
const { google } = require('googleapis')
// var googleAuth = require('google-auth-library');

// var SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"];


// var OAuth2 = google.auth.OAuth2;

// var oauth2Client = new OAuth2(process.env.client_id, process.env.client_secret, 'https://localhost:3000');

const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client
    
});

async function youtubeFunction(){
    const result = await youtube.videos.list({
        id:'E3ngQLHRGKs',
        part:'statistics,snippet'
        
    })

    const video = result.data.items[0]

    const { viewCount } = video.statistics

    const newTitle = `This video has ${viewCount} views!`
    console.log(newTitle)
}

youtubeFunction()

app.get('/', (req, res) => res.sendFile(path.join(__dirname+'/index.html')))

const PORT=3000
if(!process.env.DETA_RUNTIME){
    app.listen(PORT,()=>{
        console.log('Listening to local port')
    })
}
// export 'app'
module.exports = app