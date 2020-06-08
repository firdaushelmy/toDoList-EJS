const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const items = [];

app.get('/', function (req, res) {
  const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  let callingDay = day[today.getDay()]

  res.render('list', { kindOfDay: callingDay, newListItems: items });
})

app.post('/', function (req, res) {
  let item = req.body.newItem;
  items.push(item);
  res.redirect('/');
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`server is running at ${port}`);
});