logInit();
var dashes = "=".repeat(100);
var indent = 0;

var args = process.argv;
require("dotenv").config();
var all = require("./keys.js");
var twitter = all.twitter;
var spotify = all.spotify;
var readyForNextCommand;
var subJSONs = [];


DoCommands(args[2], args[3]);

function DoCommands(cmd, val) {
	cmd = cmd.toLowerCase();
	val = val.toLowerCase();
	logText(dashes);
	switch (cmd) {
		case 'my-tweets':
			if (val === undefined) val=20;
			twitterTweets(val);
			break;
		case 'spotify-this-song':
			if (val === undefined) val="rapid roy";
			spotifySong(val);
			break;
		case 'movie-this':
			if (val === undefined) val="2001: a space odyssey";
			responseOMDB(val);
			break;
		case 'do-what-it-says':
			if (val === undefined) val="random.txt";
			if (subJSONs.indexOf(val) !== -1) {
				logText("Canceled recursive call do-what-it-says " + val)
				break;
			}
			fsDoWhatItSays(val);
			break;
		default:
			logText('Unknown Command:', cmd);
			break;
	}
}

function twitterTweets(val) {
	readyForNextCommand = false;
	let max = parseInt(val);
	logText("My Twitter Tweets (" + max + " max)");
	var Twitter = require('twitter');
	var client = new Twitter({
		consumer_key: process.env.TWITTER_CONSUMER_KEY,
		consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
		access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
		access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
	});
	client.get('statuses/user_timeline', {screen_name: 'BoltUpBob'}, (error, tweets, response) => {
	 	if (error) throw error;
	 	if (max > tweets.length) max = tweets.length;
	 	for (var i=0; i<max; i++) {
		 	logText("[" + tweets[i].created_at + "] " + tweets[i].text);
	 	}
		readyForNextCommand = true;
	});
}

function spotifySong(val) {
	readyForNextCommand = false;
	logText("Spotify Song Info for '" + val + "'");
	var Spotify = require('node-spotify-api');
	var spotify = new Spotify({
		id: process.env.SPOTIFY_ID,
		secret: process.env.SPOTIFY_SECRET
	});
	spotify.search({ type: 'track', query: val }, (error, data) => {
		if (error) throw error;
		var firstTrack = data.tracks.items[0];
		logText("Artist:  " + firstTrack.artists[0].name);
		logText("Album:   " + firstTrack.album.name);
		logText("Title:   " + firstTrack.name);
		logText("Track:   " + firstTrack.track_number);
		logText("Preview: " + firstTrack.preview_url);
		readyForNextCommand = true;
	});
}

function responseOMDB(val) {
	readyForNextCommand = false;
	logText("OMDB Movie Info for '" + val + "'");
	var request = require('request');
	request("http://www.omdbapi.com/?s=" + val + "&plot=short&r=json&apikey=trilogy", (error, response, body) => {
	 	if (error) throw error;
		var firstMovie = JSON.parse(body).Search[0];
		request("https://www.omdbapi.com/?i=" + firstMovie.imdbID + "&y=&plot=Full&apikey=trilogy", (error, response, body) => {
		 	if (error) throw error;
			var zMovie = JSON.parse(body);
			var Ratings = ""
			for (var i=0; i<zMovie.Ratings.length; i++) {
				if (Ratings !== "") Ratings += "; ";
				Ratings += zMovie.Ratings[i].Source + ":" + zMovie.Ratings[i].Value;
			}
			logText("Title:    " + zMovie.Title);
			logText("Year:     " + zMovie.Year);
			logText("Ratings:  " + Ratings);
			logText("Rated:    " + zMovie.Rated);
			logText("Release:  " + zMovie.Released);
			logText("Runtime:  " + zMovie.Runtime);
			logText("Genre:    " + zMovie.Genre);
			logText("Country:  " + zMovie.Country);
			logText("Language: " + zMovie.Language);
			logText("Director: " + zMovie.Director);
			logText("Writer:   " + zMovie.Writer);
			logText("Actors:   " + zMovie.Actors);
			logText("Poster:   " + zMovie.Poster);
			logText("Plot:     " + zMovie.Plot);
			readyForNextCommand = true;
		});
	});
}

function fsDoWhatItSays(val) {
	logText('do-what-it-says in ' + val);
	indent++;
	subJSONs.push(val);
	var fs = require('fs');
	var nxtCommand = JSON.parse(fs.readFileSync(val).toString());
	readyForNextCommand = true;
	doNextCommand(nxtCommand);
}

function doNextCommand(data) {
	let dataJSON = data;
	let waitForComplete = setInterval( () => {
		if(readyForNextCommand) {
			clearInterval(waitForComplete);
			if (dataJSON.length === 0) {
				logText(dashes);
				indent--;
				logText('do-what-it-says in ' + subJSONs.pop() + " completed.");
			} else {
				DoCommands(dataJSON[0].Action, dataJSON[0].Value);
				dataJSON.splice(0, 1);
				doNextCommand(dataJSON);
			}
		}
	}, 100);
}

function logInit() {
	var fs = require('fs');
	if (fs.existsSync('LastRun.log')) fs.unlinkSync('LastRun.log');
}

function logText(txt, obj) {
	var timestamp = require('time-stamp');
 	var now = timestamp('YYYY/MM/DD HH:mm:ss');
 	var fs = require('fs');
 	txt = " ".repeat(indent*4) + txt
	console.log(txt);
	fs.appendFileSync('AllRun.log', now.toString() + " - " + txt + '\n');
	fs.appendFileSync('LastRun.log', now.toString() + " - " + txt + '\n');
	if (obj) {
		console.log(obj);
		fs.appendFileSync('AllRun.log', obj);
		fs.appendFileSync('LastRun.log', obj);
	}
}