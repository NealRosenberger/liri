
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');

// * Twitter keys
var keys = require('./keys.js');
var twitterKeys = keys.twitterKeys;

// command line arguments

var cmdArgs = process.argv;

// The LIRI command will  be the second command line 
var liriCommand = cmdArgs[2];

// The parameter 
var liriArg = '';
for (var i = 3; i < cmdArgs.length; i++) {
	liriArg += cmdArgs[i] + ' ';
}

// retrieveTweets will retrieve last 20 tweets and display 
function retrieveTweets() {

	fs.appendFile('./log.txt', 'User Command: node liri.js my-tweets\n\n', (err) => {
		if (err) throw err;
	});

	
	var client = new Twitter(twitterKeys);

	// Set to my Twitter handle
	var params = {screen_name: 'Neal1981', count: 20};

	// Retrievetweets
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
			var errorStr = 'ERROR: Retrieving user tweets -- ' + error;

				fs.appendFile('./log.txt', errorStr, (err) => {
				if (err) throw err;
				console.log(errorStr);
			});
			return;
		} else {
			// print user tweets
			var outputStr = '------------------------\n' +
							'User Tweets:\n' + 
							'------------------------\n\n';

			for (var i = 0; i < tweets.length; i++) {
				outputStr += 'Created on: ' + tweets[i].created_at + '\n' + 
							 'Tweet content: ' + tweets[i].text + '\n' +
							 '------------------------\n';
			}
			// Append  to the log file
			fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
				if (err) throw err;
				console.log(outputStr);
			});
		}
	});
}

// __________________________________________________________________________________________________________
// __________________________________________________________________________________________________________
// __________________________________________________________________________________________________________

// spotifySong will retrieve information on a song from Spotify
function spotifySong(song) {
	// Append the command to the log file
	fs.appendFile('./log.txt', 'User Command: node liri.js spotify-this-song ' + song + '\n\n', (err) => {
		if (err) throw err;
	});

	// Defaults to Ace 0f Spades by Motorhead
	var search;
	if (song === '') {
		search = 'Ace of Spades';
	} else {
		search = song;
	}

	spotify.search({ type: 'track', query: search}, function(error, data) {
	    if (error) {
			var errorStr1 = 'ERROR: Retrieving Spotify track -- ' + error;

			fs.appendFile('./log.txt', errorStr1, (err) => {
				if (err) throw err;
				console.log(errorStr1);
			});
			return;
	    } else {
			var songInfo = data.tracks.items[0];
			if (!songInfo) {
				var errorStr2 = 'ERROR: song not found, try again';

				// Append the error string to the log file
				fs.appendFile('./log.txt', errorStr2, (err) => {
					if (err) throw err;
					console.log(errorStr2);
				});
				return;
			} else {
				// print the song information
				var outputStr = '------------------------\n' + 
								'Song Information:\n' + 
								'------------------------\n\n' + 
								'Song Name: ' + songInfo.name + '\n'+ 
								'Artist: ' + songInfo.artists[0].name + '\n' + 
								'Album: ' + songInfo.album.name + '\n' + 
								'Preview Here: ' + songInfo.preview_url + '\n';

				// Append the output to the log file
				fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
					if (err) throw err;
					console.log(outputStr);
				});
			}
	    }
	});
}


// __________________________________________________________________________________________________________
// __________________________________________________________________________________________________________
// __________________________________________________________________________________________________________

// retrieveOMDBInfo will retrieve information on a movie from the OMDB database
function retrieveOBDBInfo(movie) {
	
	fs.appendFile('./log.txt', 'User Command: node liri.js movie-this ' + movie + '\n\n', (err) => {
		if (err) throw err;
	});

	// If no movie is provided, LIRI defaults to 'Mr. Nobody'
	var search;
	if (movie === '') {
		search = 'Mr. Nobody';
	} else {
		search = movie;
	}

	// Replace spaces with '+' for the query string
	search = search.split(' ').join('+');

	// Construct the query string
	var queryStr = 'http://www.omdbapi.com/?t=' + search + '&plot=full&tomatoes=true';

	// Send the request to OMDB
	request(queryStr, function (error, response, body) {
		if ( error || (response.statusCode !== 200) ) {
			var errorStr1 = 'ERROR: Retrieving OMDB entry -- ' + error;

			// Append the error string to the log file
			fs.appendFile('./log.txt', errorStr1, (err) => {
				if (err) throw err;
				console.log(errorStr1);
			});
			return;
		} else {
			var data = JSON.parse(body);
			if (!data.Title && !data.Released && !data.imdbRating) {
				var errorStr2 = 'ERROR: No movie info retrieved, please check the spelling of the movie name!';

				// Append the error string to the log file
				fs.appendFile('./log.txt', errorStr2, (err) => {
					if (err) throw err;
					console.log(errorStr2);
				});
				return;
			} else {
		    	// Printmovie information
		    	var outputStr = '------------------------\n' + 
								'Movie Information:\n' + 
								'------------------------\n\n' +
								'Movie Title: ' + data.Title + '\n' + 
								'Year Released: ' + data.Released + '\n' +
								'IMBD Rating: ' + data.imdbRating + '\n' +
								'Country Produced: ' + data.Country + '\n' +
								'Language: ' + data.Language + '\n' +
								'Plot: ' + data.Plot + '\n' +
								'Actors: ' + data.Actors + '\n' + 
								'Rotten Tomatoes Rating: ' + data.tomatoRating + '\n' +
								'Rotten Tomatoes URL: ' + data.tomatoURL + '\n';

				// Append the output to the log file
				fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
					if (err) throw err;
					console.log(outputStr);
				});
			}
		}
	});
}

// __________________________________________________________________________________________________________
// __________________________________________________________________________________________________________
// __________________________________________________________________________________________________________

// Should read file to determine the desired command and then execute
function doIt() {
	// Append the command to the log file
	fs.appendFile('./log.txt', 'User Command: node liri.js do-what-it-says\n\n', (err) => {
		if (err) throw err;
	});

	// Read in the file containing the command
	fs.readFile('./random.txt', 'utf8', function (error, data) {
		if (error) {
			console.log('ERROR: Reading random.txt -- ' + error);
			return;
		} else {
			// Split out the command name and the parameter name
			var cmdString = data.split(',');
			var command = cmdString[0].trim();
			var param = cmdString[1].trim();

			switch(command) {
				case 'my-tweets':
					retrieveTweets(); 
					break;

				case 'spotify-this-song':
					spotifySong(param);
					break;

				case 'movie-this':
					retrieveOBDBInfo(param);
					break;
			}
		}
	});
}

// Determine which LIRI command is being requested by the user
if (liriCommand === 'my-tweets') {
	retrieveTweets(); 

} else if (liriCommand === `spotify-this-song`) {
	spotifySong(liriArg);

} else if (liriCommand === `movie-this`) {
	retrieveOBDBInfo(liriArg);

} else if (liriCommand ===  `do-what-it-says`) {
	doAsYerTold();

} else {
	// Append the command to the log file
	fs.appendFile('./log.txt', 'User Command: ' + cmdArgs + '\n\n', (err) => {
		if (err) throw err;

		// If the user types in a command that LIRI does not recognize, output the Usage menu 
		// which lists the available commands.
		outputStr = 'Usage:\n' + 
				   '    node liri.js my-tweets\n' + 
				   '    node liri.js spotify-this-song "<song_name>"\n' + 
				   '    node liri.js movie-this "<movie_name>"\n' + 
				   '    node liri.js do-what-it-says\n';

	
		fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
			if (err) throw err;
			console.log(outputStr);
		});
	});
}