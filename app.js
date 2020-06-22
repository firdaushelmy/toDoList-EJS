const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname + '/date.js');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
const _ = require('lodash');

mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true })

const itemsSchema = ({
  task: {
    type: String,
    required: true
  }
});

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
  task: 'do laundry'
})

const item2 = new Item({
  task: 'Hit the + button to add task'
})

const item3 = new Item({
  task: '<---- hit this to delete a task'
})

const defaultItems = [item1, item2, item3];

app.get('/', function (req, res) {

  let day = date.getDate()
  Item.find({}, function (err, items) {
    if (items.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log('Successfully added defaultItems into DB')
        }
      })
      res.redirect('/')
    } else {
      res.render('list', { listTitle: day, newListItems: items });
    }
  })
})

app.post('/', function (req, res) {
  let itemName = req.body.newItem;

  Item.create({ task: itemName }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('data entry successful!');
    }
    res.redirect('/');
  })
});

app.post('/delete', function (req, res) {
  let deleteEntry = (req.body.checkboxDel)
  Item.deleteOne({ _id: deleteEntry }, function (err) {
    if (!err) {
      console.log('data entry successfully deleted');
    } res.redirect('/');
  })
})

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model('List', listSchema)

app.get('/:dynamicLink', function (req, res) {
  const dynamicLink = req.params.dynamicLink

  const list = new List({
    name: dynamicLink,
    items: defaultItems
  })
  list.save();

  Item.find({}, function (err, items) {
    res.render('dynamicLink', { listTitle: dynamicLink, newListItems: items });
  }
  )
});

app.get('/work', function (req, res) {
  res.render('list', { listTitle: 'Work List', newListItems: workItems });
});

app.get('/about', function (req, res) {
  res.render('about');
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`server is running at ${port}`);
});