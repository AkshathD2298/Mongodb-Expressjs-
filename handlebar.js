// Required modules
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var database = require('./config/database');
var path = require('path');

// Express app
var app = express();
// Start server
var port = process.env.PORT || 8000;
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// View engine setup
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));

app.set('view engine', '.hbs');

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
mongoose.connect(database.url);


// Book model
var Book = require('./models/book');

// Routes

// Render all books
app.get('/api/book_collection', function(req, res) {
    Book.find(function(err, book_collection) {
        if (err) {
            console.log(err);
        } else {
            
            res.render('index', { books:book_collection});
        }
    }).lean();
});

// Render form to add a new book
app.get('/add', function(req, res) {
    res.render('addbook');
});

// Insert a new book
app.post('/add', function(req, res) {
    var newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        pages: req.body.pages
    });

    newBook.save(function(err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/api/book_collection');
        }
    });
});


app.listen(port, function() {
    console.log('Server started on port ' + port);
});
