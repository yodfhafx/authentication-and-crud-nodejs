const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Load Video Model
require('../models/Video');
const Video = mongoose.model('videos');

// Video Index Page
router.get('/', (req, res) => {
  Video.find({})
  .sort({date: 'desc'})
  .then(videos => {
    res.render('videos/index', {
      videos: videos
    });
  });
});

// Add video Form
router.get('/add', (req, res) => {
  res.render('videos/add');
});

// Edit video Form
router.get('/edit/:id', (req, res) => {
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
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  Video.remove({
    _id: req.params.id
  })
  .then(() => {
    req.flash('success_msg', 'Video removed');
    res.redirect('/videos');
  });
});

module.exports = router;