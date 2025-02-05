require('dotenv').config();
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Define a simple route
app.get('/', (req, res) => {
    res.render('index.ejs');
});
app.get('/menus', (req, res) => {
    res.render('menus.ejs');
});
app.get('/products', (req, res) => {
    res.render('products.ejs');
});
app.get('/contest', (req, res) => {
    res.render('contest.ejs');
});
app.get('/login', (req, res) => {
    res.render('login.ejs');
});
app.get('/signup', (req, res) => {
    res.render('singup.ejs');
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
