const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect('mongodb://localhost/videojs-dev', {
  useMongoClient: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Load Video Model
require('./models/Video');
const Video = mongoose.model('videos');

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Index route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About route
app.get('/about', (req, res) => {
  res.render('about');
});

// Add video Form
app.get('/videos/add', (req, res) => {
  res.render('videos/add');
});

app.listen(port, () => {
  console.log(`server run at port ${port}`);
});