require("dotenv").config();
var axios = require("axios");
var Spotify = require("node-spotify-api");
var keys = require("./keys");
var fs = require("fs");
var inquirer = require('inquirer');

//Setting the template for output
var space = "\n";
var header = "====== Extraordinary Liri has found this based on your query ...======";
var footer = "================= Thank you for using Liri by W.B ====================";

//Function to write to log
function writeToLog(output) {
    fs.appendFile("log.txt", space + output, function(err) {
        if(err) {
            console.log(err);
            return;
        }
    })
};

//initialize the spotify api with our client id and secret from .spotify
var spotify = new Spotify(keys.spotify);

//Spotify request
function getSongInfo(songName) {

    if ( songName === undefined ) {
        songName = "The Sign";
    }

    spotify.search(
        {
            type: "track",
            query: songName,
            limit: 1
        },
        function (err, data) {
            if (err) {
                console.log(err);
                return;
            }

            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                // console.log(data);
                
                //Template for search result
                output = space + header + space + space + 
                space + "Song Title                    : " + songs[i].name + 
                space + "Artist(s)                     : " + songs[i].album.artists[0].name + 
                space + "Album name                    : " + songs[i].album.name +
                space + "Click on link to preview song : " + songs[i].preview_url + 
                space + space  + space + footer;

                console.log(output);
                writeToLog(output);
            }
        }
    );
};

//OMDB request
function getMovieInfo(movieName) {
    
    if ( movieName === undefined ) {
        movieName = "Mr Nobody";
    };

    var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    
    axios
        .get(queryURL)
        .then(function (response) {
            var movie = response.data;
            // console.log(movie);

            //Template for search result
            output = space + header + space + space +
            space + "Movie Title             : " + movie.Title +
            space + "Released                : " + movie.Year +
            space + "IMDB Ratings            : " + movie.imdbRating +
            space + "Rotten Tomatoes Ratings : " + movie.Ratings[1].Value +
            space + "Country it was produced : " + movie.Country +
            space + "Language                : " + movie.Language +
            space + "Starring                : " + movie.Actors +
            space + "Box Office              : " + movie.BoxOffice +
            space + "Awards                  : " + movie.Awards +
            space + "Go to their website     : " + movie.Website +
            space + "Plot                    : " + movie.Plot +
            space + space  + space + footer;

            console.log(output);
            writeToLog(output);

        });
};

//Bands in town request
function getConcertInfo(artistName) {
    
    if (artistName === undefined ) {
        artistName = "drake";
    };
    
    var queryURL = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";

    console.log(queryURL);
    axios
        .get(queryURL)
        .then(function (response) {

            //convert date into mm/dd/yyyy
            var datetime =  new Date(response.data[0].datetime);
            var month = datetime.getMonth() + 1;
            var day = datetime.getDate();
            var year = datetime.getFullYear();
            var date = month + "/" + day + "/" + year;

            // console.log(response.data[0]);

            //Template for search result
            output = space + header + space + space + 
            space + "Performing in this event   : " + response.data[0].lineup +
            space + "Venue Name                 : " + response.data[0].venue.name + 
            space + "Venue Location             : " + response.data[0].venue.city + ", " + response.data[0].venue.country + 
            space + "Concert Date               : " + date +
            space + space  + space + footer;

            console.log(output);
            writeToLog(output);
        })
};

//DO WHAT IT SAYS
function doWhatItSays() {
    // Reads the random text file and passes it to the spotify function
    fs.readFile("random.txt", "utf8", function(error, data) {
        getSongInfo(data);
    });
};

//Set a new variable for questions to be inputted in inquirer
var questions = [{
    type: 'list',
    name: 'programs',
    message: 'What would you like to do?',
    choices: ['Movie', 'Spotify', 'Concert', 'Do what it says']
},
{
    type: 'input',
    name: 'movieChoice',
    message: 'What\'s the name of the movie you would like to search? ',
    when: function (answers) {
        return answers.programs == 'Movie';
    }
},
{
    type: 'input',
    name: 'songChoice',
    message: 'What\'s the name of the song you would like to search? ',
    when: function (answers) {
        return answers.programs == 'Spotify';
    }
},
{
    type: 'input',
    name: 'concertChoice',
    message: 'Who would you like to see perform live next? ',
    when: function (answers) {
        return answers.programs == 'Concert';
    }
}
];

//Instead using process.argv, we simplify the input using inquirer. Less work for the users.
inquirer
    .prompt(questions)
    .then(function(answers) {
        // Depending on which program the user chose to run it will do the function for that program
        switch (answers.programs) {
            case 'Spotify':
                getSongInfo(answers.songChoice);
                break;
            case 'Movie':
                getMovieInfo(answers.movieChoice);
                break;
            case 'Concert':
                getConcertInfo(answers.concertChoice);
                break;
            case 'Do what it says':
                doWhatItSays();
                break;
            default:
                console.log('LIRI doesn\'t know that');
        }
    });

