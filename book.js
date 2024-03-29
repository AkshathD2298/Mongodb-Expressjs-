var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
 
var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json



mongoose.connect(database.url);

var Book= require('./models/book');
 
 
//get all employee data from db
app.get('/api/book_collection', function(req, res) {
	// use mongoose to get all todos in the database
	Book.find(function(err, book_collection) {
		// if there is an error retrieving, send the error otherwise send data
		if (err)
			res.send(err)
		res.json(book_collection); // return all employees in JSON format
	});
});

// get a employee with ID of 1
app.get('/api/book_collection/:book_id', function(req, res) {
	let id = req.params.book_id;
	Book.findById(id, function(err, book) {
		if (err)
			res.send(err)
 
		res.json(book);
	});
 
});


// create employee and send back all employees after creation
app.post('/api/book_collection', function(req, res) {

    // create mongose method to create a new record into collection
    console.log(req.body);

	Book.create({
        title:req.body.title,
author:req.body.author,
price:req.body.price,
pages:req.body.pages
	}, function(err, book) {
		if (err)
			res.send(err);
 
		// get and return all the employees after newly created employe record
		Book.find(function(err, book_collection) {
			if (err)
				res.send(err)
			res.json(book_collection);
		});
	});
 
});


// create employee and send back all employees after creation
app.put('/api/book_collection/:book_id', function(req, res) {
	// create mongose method to update an existing record into collection
    console.log(req.body);

	let id = req.params.book_id;
	var data = {
        title:req.body.title,
        author:req.body.author,
        price:req.body.price,
        pages:req.body.pages
	}

	// save the user
	Book.findByIdAndUpdate(id, data, function(err, book) {
	if (err) throw err;

	res.send('Successfully! Employee updated - '+book.title);
	});
});

// delete a employee by id
app.delete('/api/book_collection/:book_id', function(req, res) {
	console.log(req.params.book_id);
	let id = req.params.book_id;
	Book.remove({
		_id : id
	}, function(err) {
		if (err)
			res.send(err);
		else
			res.send('Successfully! Books has been Deleted.');	
	});
});

app.listen(port);
console.log("App listening on port : " + port);
