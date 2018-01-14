require("dotenv").config();

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var args = process.argv;
logTxt(process.argv);

switch (args[0]) {
	case 'my-tweets':
		logTxt("Last 20 tweets and when they were created");
		break;
	case 'spotify-this-song':
		logTxt("Potify Song Info: Artist(s), song's name, Spotify preview link, album Name")
		logTxt("If no song is provided then your program will default to "The Sign" by Ace of Base.");
		break;
	case 'movie-this':
		logTxt("OMDB Movie Info: Title, Year, IMDB Rating, Rotten Tomatoes Rating, Country, Language, Plot, Actors?";
		logTxt("If no movie is provided then your program will default to 'Mr. Nobody.'");
		break;
	case 'do-what-it-says':
		logTxt('do-what-it-says');
		logTxt("Using the `fs` Node package, take the text inside of random.txt and use it to call a LIRI's commands";
		break;
	default:
		logTxt('Unknown Language - ' + args[0]);
		break;
}

function logTxt(txt) {
	console.log(txt);
	// **Bonus** code to append text line to log.txt

} 

