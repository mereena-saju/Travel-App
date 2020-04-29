
const fetch = require("node-fetch");
const dotenv = require('dotenv');
dotenv.config();

var path = require('path')
const express = require('express')
const mockAPIResponse = require('./mockAPI.js')
var bodyParser = require('body-parser')
var cors = require('cors')

const app = express()

app.use(cors())

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.static('dist'))

//console.log(__dirname)

//-----------------------------------------------------------------------------------------------------
//GLOBAL VARIABLES
const pixApi_key = process.env.PIX_API_KEY;
const pixBaseUrl = 'https://pixabay.com/api/?key=';
const username = process.env.USRNAME;
const api_key = process.env.API_KEY;
const geoAddressBaseUrl = 'http://api.geonames.org/geoCodeAddressJSON?q=';
const weatherBaseUrlCurrent = 'http://api.weatherbit.io/v2.0/current?key=';
const weatherBaseUrlForecast = 'http://api.weatherbit.io/v2.0/forecast/daily?key=';
projectData = {};

app.get('/', function (req, res) {
  res.sendFile('dist/index.html')
  //res.sendFile(path.resolve('src/client/views/index.html'))
})

// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
  console.log('Example app listening on port 8081!')
})


app.get('/test', function (req, res) {
  res.send(mockAPIResponse)
})




//GEONAMES API
let geoAddress = {};
app.post('/getGeoAddress', function (req, res) {
  let city = req.body.city;
  let url = geoAddressBaseUrl + city + '&username=' + username;
  (async () => {
    const geo = await get(url);
    res.send(geo);
  })()
});

//WEATHERBIT CURRENT API
let currentWeather = {};
app.post('/getCurrent', function (req, res) {
  var lat = req.body.lat;
  var lng = req.body.lng;
  let url = weatherBaseUrlCurrent + api_key + '&lat=' + lat + '&lon=' + lng;
  (async () => {
    const currentWeather = await get(url);
    res.send(currentWeather);
  })()
});

//WEATHERBIT FORECAST API
let forecastWeather = {};
app.post('/getForecast', function (req, res) {
  var lat = req.body.lat;
  var lng = req.body.lng;
  let url = weatherBaseUrlForecast + api_key + '&lat=' + lat + '&lon=' + lng;
  (async () => {
    const forecastWeather = await get(url);
    res.send(forecastWeather);
  })()
});

//PIXABAY API
let data = {};
app.post('/getPixabay', function (req, res) {
  let q = req.body.query;
  let url = pixBaseUrl + pixApi_key + '&q=' + q + '&image_type=photo';
  (async () => {
    const p = await get(url);
    data = { "img": p.hits[0].pageURL };
    res.send(p);
  })()
});

//ASYNC GET
const get = async (url = '') => {
  const pix = await fetch(url);
  try {
    let json = await pix.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}