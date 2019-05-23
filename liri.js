//Require dotenv npm to link Spotify keys file
require("dotenv").config();
var keys = require("./keys.js");
var request = require("request")
var Spotify = require('node-spotify-api');

//Save spotify key to a variable
var spotify = new Spotify(keys.spotify);

//Require moment npm
var moment = require('moment');
moment().format();

var fs = require("fs")

var nodeArgs = process.argv;
var userInput = "";
var prettyUserInput = "";
