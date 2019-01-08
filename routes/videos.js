const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load Video Model
require('../models/Video');
const Video = mongoose.model('videos');

// Video Index Page
router.get('/', ensureAuthenticated, (req, res) => {
  Video.find({user: req.user.id})
  .sort({date: 'desc'})
  .then(videos => {
    res.render('videos/index', {
      videos: videos
    });
  });
});

// Add video Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('videos/add');
});

// Edit video Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Video.findOne({
    _id: req.params.id
  })
  .then(video => {
    if(video.user != req.user.id){
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/videos');
    } else {
      res.render('videos/edit', {
        video: video
      });
    }
  });
});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
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
      details: req.body.details,
      user: req.user.id
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
router.put('/:id', ensureAuthenticated, (req, res) => {
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
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Video.remove({
    _id: req.params.id
  })
  .then(() => {
    req.flash('success_msg', 'Video removed');
    res.redirect('/videos');
  });
});

module.exports = router;