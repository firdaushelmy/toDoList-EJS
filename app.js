const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs')


const app = express();

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  const today = new Date();
  var day = '';

  if (today.getDay() === 6) {
    res.send('Yayy its the weekend');
  } else {
    res.send('i have to work today');
  }
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`server is running at ${port}`);
});