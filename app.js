const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.get('/', function (req, res) {
  res.send('initial page test');
})

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`server is running at ${port}`);
});