const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
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

// Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

// Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

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

// Video Index Page
app.get('/videos', (req, res) => {
  Video.find({})
  .sort({date: 'desc'})
  .then(videos => {
    res.render('videos/index', {
      videos: videos
    });
  });
});

// Add video Form
app.get('/videos/add', (req, res) => {
  res.render('videos/add');
});

// Edit video Form
app.get('/videos/edit/:id', (req, res) => {
  Video.findOne({
    _id: req.params.id
  })
  .then(video => {
    res.render('videos/edit', {
      video: video
    });
  });
});

// Process Form
app.post('/videos', (req, res) => {
  let errors = [];
  if(!req.body.title){
    errors.push({text: 'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text: 'Please add a details'});
  }
  if(errors.length > 0){
    res.render('videos/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Video(newUser)
    .save()
    .then(video => {
      req.flash('success_msg', 'Video added');
      res.redirect('/videos');
    });
  }
});

// Edit Form process
app.put('/videos/:id', (req, res) => {
  Video.findOne({
    _id: req.params.id
  })
  .then(video => {
    // new values
    video.title = req.body.title,
    video.details = req.body.details

    video.save()
    .then(video => {
      req.flash('success_msg', 'Video updated');
      res.redirect('/videos');
    });
  });
});

// Delete Form process
app.delete('/videos/:id', (req, res) => {
  Video.remove({
    _id: req.params.id
  })
  .then(() => {
    req.flash('success_msg', 'Video removed');
    res.redirect('/videos');
  });
});

app.listen(port, () => {
  console.log(`server run at port ${port}`);
});