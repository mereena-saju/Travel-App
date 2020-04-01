const dotenv = require('dotenv');
dotenv.config();

var path = require('path')
const express = require('express')
const mockAPIResponse = require('./mockAPI.js')
var bodyParser = require('body-parser')
var cors = require('cors')

var aylien = require('aylien_textapi');

// set aylien API credentias
var textapi = new aylien({
  application_id: process.env.API_ID,
  application_key: process.env.API_KEY
});

const app = express()

app.use(cors())

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.static('dist'))

console.log(__dirname)

app.get('/', function (req, res) {
  res.sendFile('dist/index.html')
  //res.sendFile(path.resolve('src/client/views/index.html'))
})

// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
  console.log('Example app listening on port 8081!')
})

app.post('/sentiment', function (req, res) {
  textapi.sentiment({ url: req.body.url }, (error, response) => {
    if (error === null) {
      projectData = {
        "polarity": response.polarity,
        "subjectivity": response.subjectivity,
        "polarityConfidence": response.polarity_confidence,
        "subjectivityConfidence": response.subjectivity_confidence
      };
      res.send(projectData);
      console.log(projectData);
    } else {
      console.log(error, "Error");
    }
  });
});

app.get('/test', function (req, res) {
  res.send(mockAPIResponse)
})
