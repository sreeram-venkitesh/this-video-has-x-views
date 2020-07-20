const fs = require('fs');
const express = require('express')
const readline = require('readline')
const { google } = require('googleapis')
const { App } = require("deta")

const app = App(express())

require('dotenv').config()

var OAuth2 = google.auth.OAuth2;

var SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl'];
var TOKEN_DIR = __dirname + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'youtube_nodejs.json';

function startFunction() {
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the YouTube API.
    authorize(JSON.parse(content), getChannel);
  });
}
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function (err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function (code) {
    rl.close();
    oauth2Client.getToken(code, function (err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + TOKEN_PATH);
  });
}

function getChannel(auth) {
  const youtube = google.youtube('v3');
  youtube.videos.list({
    auth: auth,
    id: 'YOUR_VIDEO_ID',
    part: 'snippet,statistics',
  }, function (err, result) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    } else {
      const video = result.data.items[0]
      const { viewCount } = video.statistics
      console.log(viewCount)

      const newTitle = `This video has got ${viewCount} views!`
      console.log(newTitle)

      video.snippet.title = newTitle

      youtube.videos.update(
        {
          auth: auth,
          part: "snippet",
          resource: {
            id: 'YOUR_VIDEO_ID',
            snippet: {
              "title": newTitle,
              "categoryId": video.snippet.category_id
            }
          }
        },
        (err, response) => {
          //console.log(response);
          if (err) {
            console.log(`There was an error updating ${err}`)
            return
          }
          if (response.data.items) {
            console.log("Done")
          }
        }
      )
    }
  })
}

app.get('/', (req, res) => res.send('Hello'))

app.lib.cron(event => {
  startFunction()
});


const PORT = 3000
if (!process.env.DETA_RUNTIME) {
  app.listen(PORT, () => {
    console.log('Listening to local port')
  })
}
// export 'app'
module.exports = app