const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

const port = 3000;

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

app.listen(port, () => {
  console.log(`server run at port ${port}`);
});