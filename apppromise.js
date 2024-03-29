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

var Employee = require('./models/employee');
 
 
//get all employee data from db
app.get('/api/employees', function(req, res) {
    // use mongoose to get all todos in the database
    Employee.find()
        .then(employees => {
            res.json(employees); // return all employees in JSON format
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

// get a employee with ID
app.get('/api/employees/:employee_id', function(req, res) {
    let id = req.params.employee_id;
    Employee.findById(id)
        .then(employee => {
            if (!employee) {
                return res.status(404).send('Employee not found');
            }
            res.json(employee);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

// create employee and send back all employees after creation
app.post('/api/employees', function(req, res) {
    // create mongose method to create a new record into collection
    Employee.create({
        name: req.body.name,
        salary: req.body.salary,
        age: req.body.age
    })
        .then(employee => {
            res.status(201).json(employee);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

// update employee by ID
app.put('/api/employees/:employee_id', function(req, res) {
    let id = req.params.employee_id;
    var data = {
        name: req.body.name,
        salary: req.body.salary,
        age: req.body.age
    }

    // update the employee
    Employee.findByIdAndUpdate(id, data)
        .then(employee => {
            if (!employee) {
                return res.status(404).send('Employee not found');
            }
            res.send('Successfully! Employee updated - ' + employee.name);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

// delete a employee by id
app.delete('/api/employees/:employee_id', function(req, res) {
    let id = req.params.employee_id;
    Employee.findByIdAndDelete(id)
        .then(employee => {
            if (!employee) {
                return res.status(404).send('Employee not found');
            }
            res.send('Successfully! Employee has been Deleted.');
        })
        .catch(err => {
            res.status(500).send(err);
        });
});
app.listen(port);
console.log("App listening on port : " + port);