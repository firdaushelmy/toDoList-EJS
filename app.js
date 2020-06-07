const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  const today = new Date();
  const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let dayIndex = today.getDay()
  let callingDay = day[dayIndex]

  res.render('list', { kindOfDay: callingDay });
})

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`server is running at ${port}`);
});