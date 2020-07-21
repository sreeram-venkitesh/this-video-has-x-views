# this-video-has-x-views
## How to use the YouTube Data API to automatically update the title of a video with the number of views

### [Link to YouTube video tutorial](https://www.youtube.com/watch?v=QwecvVvESVU)

## Steps to recreate on your own

1. Clone this repo into your machine
2. Install [Deta CLI](https://docs.deta.sh/docs/micros/CLI) and login from your terminal 
3. Once in the project directory, run `deta new --node youtube-update`
4. Create a new app in your Google Cloud Dashboard
5. Add YouTube Data API v3 to your project
6. Create an OAuth Consent Screen and generate a new OAuth credential
7. Download the `client_secret.json` file into your project folder
8. Run `npm install` and `npm run` from your project directory after commenting out the lines regarding importing Deta and setting the cron
9. This will give you a url in the terminal (as shown in the video given above). Go to this url, paste the code you get back into your terminal.
10. Copy the contents of `client_secret.json` and the access tokens you just generated into the code where you use them (again, refer video).
11. Uncomment the lines for importing Deta and setting the cron
12. Run `deta deploy` and `deta cron set "10 minutes"`. This will set the code to run every 10 minutes


#### Keep in mind that the YouTube API has a daily usage quota of 10000 units. The read and write operation that I have done with this code is worth 57 units. So I can update as frequently as once every 8 minutes before running out of quota for the day. If you set it to run faster, you might get an API quota exceeded error.

You can check the Quota tab in the Google Cloud Dashboard to see your current usage.

For the logs on the server, make sure to check the visor for your project at the [Deta Web Dashboard](https://web.deta.sh)

### Happy Hacking!