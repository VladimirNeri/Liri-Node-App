//NPM Packages installed 
require("dotenv").config();
var keys = require("./keys.js");
var request = require("request")
var Spotify = require("node-spotify-api");
var moment = require("moment");
        moment().format();
var fs = require("fs");
var axios = require("axios");
var spotify = new Spotify(keys.spotify);
var nodeArgs = process.argv;
var userInput = "";
var text = "";
var action = process.argv[2];

//Get user input for song/artist/movie name from process.argv[3].  Activity 18. 
for (var i = 3; i < nodeArgs.length; i++) {
    //If userInput is more than 1 word
    if (i > 3 && i < nodeArgs.length) {
        userInput = userInput + nodeArgs[i];
    }
    //If userInput is only 1 word
    else {
        userInput += nodeArgs[i];
    }
}

function runLiri() {
    //Switch-case will direct which function gets run. Activity 15. 
    switch (action) {
        case "concert-this":
            bandsInTown();                   
            break;                          
          
        case 'spotify-this-song':
            spotSong();
            break;
          
        case 'movie-this':
            movieInfo();
            break;
          
        case 'do-what-it-says':
            getRandom();
            break;  
        }
    };

    function bandsInTown(){

            //Append userInput to log.txt. Activity 14.
                fs.appendFile("log.txt", userInput + "\n----------------\n", function (error) {
                    if (error) {
                    console.log(error);
                    };
                });
            
            //Run request to bandsintown with the specified artist
            var queryURL = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp";

                axios.get(queryURL)
                .then(function(response) {
                    //console.log(response.data)
                    for (var i = 0; i < response.data.length; i++) {
                        console.log("Venue: " + response.data[i].venue.name);
                        console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                    
                    var date = response.data[i].datetime;
                    date = moment(date).format("MM/DD/YYYY");
                        console.log("Date: " + date)
                        fs.appendFileSync("log.txt", "Venue: " + response.data[i].venue.name + "\nLocation: " + response.data[i].venue.city + ", " + 
                                        response.data[i].venue.country + "\nDate: " + date + "\n----------------\n", function (error) {
                            if (error) {
                                //console.log(error);
                            }});
                        }
                })
                .catch(function(error) {
                    if (error.response) {
                        //console.log("Error");
                    }
                });
    }
        
    function spotSong() {
        //If no song provided search "The Sign"
            if (!userInput) {
                userInput = "the sign ace of base";
                text = userInput;
            }
            //Append userInput to log.txt
            fs.appendFile("log.txt", text + "\n----------------\n", function (error) {
                if (error) {
                    console.log(error);
                };
            });
        
            // From Node-Spotify-API
            spotify.search({
                type: "track",
                query: userInput})
                .then(function(response) {
                    // console.log(response);
                    var info = response.tracks.items
                    for (var i = 0; i < info.length; i++) {
                        var albumObject = info[i].album;
                        var trackName = info[i].name
                        var preview = info[i].preview_url
                        var artistsInfo = albumObject.artists
                        for (var j = 0; j < artistsInfo.length; j++) {
                            console.log("Artist: " + artistsInfo[j].name);
                            console.log("Song Name: " + trackName);
                            console.log("Preview of Song: " + preview);
                            console.log("Album Name: " + albumObject.name);
                            console.log("----------------");
                           
                            fs.appendFile("log.txt", "Artist: " + artistsInfo[j].name + "\nSong Name: " + trackName + "\nPreview of Song: " + preview + "\nAlbum Name: " 
                                + albumObject.name + "\n----------------\n", function (error) {
                                if (error) {
                                    console.log(error);
                                };
                            });
                        } 
                    }
            }) 
            .catch(function(err) {
                console.log(err);
            });
        };

        function movieInfo() {
             //If no movie provided search "Mr. Nobody"
             if (!userInput) {
                userInput = "Mr. Nobody";
                text = userInput;
            }

            //Append userInput to log.txt. Activity 14. 
            fs.appendFile("log.txt", text + "\n----------------\n", function (error) {
                if (error) {
                    console.log(error);
                };
            });
            //Run request to OMDB
            var queryURL = "https://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";

            axios.get(queryURL).then(
                function(response) {
                    console.log("Title: " + response.data.Title);
                    console.log("Release Year: " + response.data.Year);
                    console.log("IMDB Rating: " + response.data.Ratings[0].Value);
                    console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                    console.log("Country: " + response.data.Country);
                    console.log("Language: " + response.data.Language);
                    console.log("Plot: " + response.data.Plot);
                    console.log("Actors: " + response.data.Actors);
                    
                    fs.appendFile("log.txt", "Title: " + response.data.Title + "\nRelease Year: " + response.data.Year + "\nIMDB Rating: " + response.data.Ratings[0].Value + "\nRotten Tomatoes Rating: " +
                    response.data.Ratings[1].Value + "\nCountry: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors + "\n----------------\n",
                        function(error) {
                            if (error) {
                                console.log(error);
                            };
                        });
                })
                .catch(function(error) {
                    if (error.response) {
                        console.log("Error");
                    }
                });
        }

        function getRandom() {
            //Read random.txt file. Activity 12
            fs.readFile("random.txt", "utf8", function (error, data) {
                if (error) {
                return console.log(error)
            }
            //Split data into array
            var textArr = data.split(",");
            action = textArr[0];
            userInput = textArr[1];
            text = userInput;
            runLiri();
                })
            }
        
runLiri();

        