const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname + '/date.js');
const _ = require('lodash');
const app = express();
require('dotenv').config()

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(`${MONGO_URL}`, { useNewUrlParser: true, useUnifiedTopology: true })

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
      res.render('list', { listTitle: 'Today', newListItems: items });
    }
  })
})

app.post('/', function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    task: itemName
  })

  if (listName === 'Today') {
    item.save();
    res.redirect('/');
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect('/' + listName)
    })
  }
});

app.post('/delete', function (req, res) {
  const deleteEntry = req.body.checkboxDel
  const checkboxName = req.body.checkboxName

  if (checkboxName === 'Today') {
    Item.deleteOne({ _id: deleteEntry }, function (err) {
      if (!err) {
        console.log('data entry successfully deleted');
      } res.redirect('/');
    })
  } else {
    List.findOneAndUpdate({ name: checkboxName }, { $pull: { items: { _id: deleteEntry } } }, function (err, foundList) {
      if (!err) {
        res.redirect('/' + checkboxName)
      }
    })
  }
})

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model('List', listSchema)

app.get('/:dynamicLink', function (req, res) {
  const dynamicLink = _.capitalize(req.params.dynamicLink)

  List.findOne({ name: dynamicLink }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        // create new list
        const list = new List({
          name: dynamicLink,
          items: defaultItems
        });
        list.save();
        res.redirect('/' + dynamicLink)
      } else {
        // show an existing list
        res.render('list', { listTitle: foundList.name, newListItems: foundList.items });
      }
    }
  })
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