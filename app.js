const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
require("dotenv").config();
const app = express();

//Connecting to Database
mongoose.connect(`${process.env.MONGOURI}`, {useNewUrlParser: true , useUnifiedTopology: true});
app.use(bodyParser.json());

//Mongoose Schema
var Schema = mongoose.Schema;
var employeeSchema = new mongoose.Schema({
    Keys: { type: Number, Required: 'Id is Required'},
    Name: {type: String, Required: 'Name of Employee is Required'},
    Email:{type: String},
    Phonenumber:{type : Number}
});

const Employee = mongoose.model('Employee', employeeSchema);

//Route For /employee 

app.route("/employees")

.get((req,res,next)=>{
    Employee.find((err,foundEmployee)=>{
        if(!err){
            res.json(foundEmployee);
        }else{
            res.json({message : "Can't Connect to Database"});
        }
    });
})
.post((req,res,next)=>{
        Employee.replaceOne({Keys: req.body.keys},{
                Keys    :   req.body.keys,
                Name    :   req.body.name,
                Email   :   req.body.email,
                Phonenumber :   req.body.phoneNumber
            },{upsert: true},(err, docs) =>{
                if(err){
                    res.json({message: "Can't Connect to Database"})
                }
                else{
                    res.json(docs);
                }
            }
        );
});

//Route for employee/:id

app.route("/employees/:id")

.get((req,res,next)=>{
  Employee.findOne({Keys: req.params.id}, function(err, foundEmployee){
    if (foundEmployee) {
      res.json(foundEmployee);
    } else {
      res.json({message: err});
    }
  });
});


app.listen(process.env.PORT||3000);