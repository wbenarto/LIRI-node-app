require("dotenv").config();
var axios = require("axios");
var Spotify = require("node-spotify-api");
var keys = require("./keys");
var fs = require("fs");
var request = require('request');
var inquirer = require('inquirer');

//initialize the spotify api with our client id and secret from .spotify
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var query = process.argv[3];


function getSongInfo(songName) {

    if (songName === undefined) {
        songName = "papercut";
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

            //NEED HELP
            for (var i = 0; i < songs.length; i++) {
                console.log(data);
                console.log("artist(s): " + songs[i].album.artists[0].name);
                console.log("song name: " + songs[i].name);
                console.log("preview song: " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
                console.log("-----------------------------------");
            }
        }
    );
}

function getConcertInfo(artistName) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp"
    console.log(queryURL);

    if (artistName === undefined) {
        console.log("Please input artist name.")
    };


    axios
        .get(queryURL)
        .then(function (response) {
            // var concert = response.data[i];
            // //NEED HELP
            // for ( var i = 0; i < concert.length; i++) {
            //     console.log(concert.venue.name);
            // }
            //convert date into mm/dd/yyyy
            var datetime =  new Date(response.data[0].datetime);
            var month = datetime.getMonth() + 1;
            var day = datetime.getDate();
            var year = datetime.getFullYear();
            var date = month + "/" + day + "/" + year;


            console.log(response.data[0])
            console.log("Lineup: " + response.data[0].lineup);
            console.log("Venue Name: " + response.data[0].venue.name);
            console.log("Venue Location: " + response.data[0].venue.city + ", " + response.data[0].venue.country);
            console.log("Concert Date: " + date);
        })

}

function getMovieInfo(movieName) {
    var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    if (movieName === undefined) {
        console.log("please insert movie title..")
    };

    axios
        .get(queryURL)
        .then(function (response) {
            var movie = response.data;
            // console.log(response);
            console.log("Title: " + movie.Title);
            console.log("Year: " + movie.Year);
            console.log("IMDB Ratings: " + movie.imdbRating);
            console.log("Rotten Tomatoes Ratings: " + movie.Ratings[1].Value)
            console.log("Country it was produced: " + movie.Country)
            console.log("Language: " + movie.Language)
            console.log("Plot: " + movie.Plot)
            console.log("Starring: " + movie.Actors)
        });
}

// if ( command === "spotify-this-song") {
//     getSongInfo(query);
// } else if ( command === "concert-this") {
//     getConcertInfo(query);
// } else if ( command === "movie-this") {
//     getMovieInfo(query);
// }

var questions = [{
    type: 'list',
    name: 'programs',
    message: 'What would you like to do?',
    choices: ['Spotify', 'Movie', 'Concert', 'Do what it says']
},
{
    type: 'input',
    name: 'movieChoice',
    message: 'What\'s the name of the movie you would like?',
    when: function (answers) {
        return answers.programs == 'Movie';
    }
},
{
    type: 'input',
    name: 'songChoice',
    message: 'What\'s the name of the song you would like?',
    when: function (answers) {
        return answers.programs == 'Spotify';
    }
},
{
    type: 'input',
    name: 'concertChoice',
    message: 'What\'s the artist of the concert you would like?',
    when: function (answers) {
        return answers.programs == 'Concert';
    }
},
];

inquirer
    .prompt(questions)
    .then(answers => {
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

