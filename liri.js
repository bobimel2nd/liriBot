logInit();

var args = process.argv;
require("dotenv").config();
var all = require("./keys.js");
var twitter = all.twitter;
var spotify = all.spotify;

DoCommands();

function logInit() {
	var fs = require('fs');
	if (fs.existsSync('LastRun.log')) fs.unlinkSync('LastRun.log');
}

function logText(txt, obj) {
	var timestamp = require('time-stamp');
 	var now = timestamp('YYYY/MM/DD HH:mm:ss');
 	var fs = require('fs');
	console.log(txt);
	fs.appendFileSync('AllRun.log', now.toString() + " - " + txt + '\n');
	fs.appendFileSync('LastRun.log', now.toString() + " - " + txt + '\n');
	if (obj) {
		console.log(obj);
		fs.appendFileSync('AllRun.log', obj);
		fs.appendFileSync('LastRun.log', obj);
	}
} 


function DoCommands() {
	logText('================================================================================================');
	switch (args[2]) {
		case 'my-tweets':
			if (args.length < 4) args.push("20");
			twitterTweets();
			break;
		case 'spotify-this-song':
			if (args.length < 4) args.push("Rapid Roy");
			spotifySong();
			break;
		case 'movie-this':
			if (args.length < 4) args.push("2001: A Space Odyssey");
			responseOMDB();
			break;
		case 'do-what-it-says':
			if (args.length < 4) args.push("Random.txt");
			fsDoWhatItSays();
			break;
		default:
			logText('Unknown Command:', args);
			break;
	}
}

function twitterTweets() {
	logText("My Twitter Tweets");
	var Twitter = require('twitter');
	var client = new Twitter({
		consumer_key: process.env.TWITTER_CONSUMER_KEY,
		consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
		access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
		access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
	});
	client.get('statuses/user_timeline', {screen_name: 'BoltUpBob'}, function(error, tweets, response) {
	 	if (error) throw error;
	 	var max = parseInt(args[3]);
	 	if (max > tweets.length) max = tweets.length;
	 	for (var i=0; i<max; i++) {
		 	logText("[" + tweets[i].created_at + "] " + tweets[i].text);
	 	}
	});
}

function spotifySong() {
	logText("Spotify Song Info for '" + args[3] + "'");
	var Spotify = require('node-spotify-api');
	var spotify = new Spotify({
		id: process.env.SPOTIFY_ID,
		secret: process.env.SPOTIFY_SECRET
	});

	spotify.search({ type: 'track', query: args[3] }, function(err, data) {
		if (err) return logText('Error occurred: ' + err);
		var firstTrack = data.tracks.items[0];
		logText("Artist:  " + firstTrack.artists[0].name);
		logText("Album:   " + firstTrack.album.name);
		logText("Title:   " + firstTrack.name);
		logText("Track:   " + firstTrack.track_number);
		logText("Preview: " + firstTrack.preview_url);
	});
}

function responseOMDB() {
	logText("OMDB Movie Info for '" + args[3] + "'");
	var request = require('request');
	request("http://www.omdbapi.com/?s=" + args[3] + "&plot=short&r=json&apikey=trilogy", function (error, response, body) {
		var firstMovie = JSON.parse(body).Search[0];
		request("https://www.omdbapi.com/?i=" + firstMovie.imdbID + "&y=&plot=Full&apikey=trilogy", function (error, response, body) {
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
		});	
	});	
}

function fsDoWhatItSays() {
	logText('do-what-it-says in ' + args[3]);
	var fs = require('fs');
	fs.readFile(args[3], function(err, data) {
		var newArgs = data.toString().split(',');
		args[2] = newArgs[0];
		args[3] = newArgs[1];
		DoCommands();
	});
}

