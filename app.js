require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const connection = require('./database/db-connection');
const app = express();
const bodyParser = require('body-parser');
const signupRoute = require("./routes/signup-route");
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true })); // For form data parsing


// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

// Session setup
app.use(
    session({
        secret: 'your_secret_key', // Replace with a strong secret key
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true, // Helps prevent XSS attacks
            secure: false, // Set to true for HTTPS (you'll need an HTTPS server)
            maxAge: 60000, // Session expires in 1 minute (you can adjust this)
        },
    }),
);

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
});

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.user_id) {
        return next();
    }
    // res.redirect("/login");
}

// Use the register route
app.use(signupRoute);

// Dashboard Route
app.get('/dashboard', isAuthenticated, (req, res) => {
    console.log(req.session);
    // Fetch user info from the database using the session's user_id
    connection.query(
        'SELECT username, role FROM users WHERE id = ?',
        [req.session.user_id],
        (err, results) => {
            if (err) throw err;

            const user = results[0]; // Assuming a single user will be returned
            res.render('dashboard.ejs', {title: 'Dashboard', user});
        },
    );
});

// Define a simple route
app.get('/', (req, res) => {
    res.render('index.ejs', {title: 'Home'});
});
app.get('/menus', (req, res) => {
    res.render('menus.ejs', {title: 'Menus'});
});
app.get('/products', (req, res) => {
    res.render('products.ejs', {title: 'Products'});
});
app.get('/contest', (req, res) => {
    res.render('contest.ejs', {title: 'Contest'});
});
app.get('/login', (req, res) => {
    res.render('login.ejs', {title: 'Login'});
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/login');
    });
});

app.get('/signup', (req, res) => {
    res.render('signup.ejs', {title: 'Sign Up', error: 'Error', success: 'Success'});
});

app.post('/login', (req, res) => {
    const {username, password} = req.body;

    // Query to check the credentials (using a simple example)
    connection.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, results) => {
            if (err) {
                return res.status(500).send('Database error: ' + err.message);
            }

            if (results.length > 0) {
                // User found, store in session
                req.session.user_id = results[0].id;
                req.session.username = results[0].username;
                req.session.role = results[0].role;
                res.redirect('/dashboard');
            } else {
                // Invalid credentials
                res.send('Invalid username or password');
            }
        },
    );
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
