if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://adminfha:93639363stack@ds253094.mlab.com:53094/videojs-prod'
  }
} else {
  module.exports = {mongoURI: 'mongodb://localhost/videojs-dev'
  }
}