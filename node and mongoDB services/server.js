const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Schema = mongoose.Schema;



const app = express();




app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

// Bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect to Mongo
mongoose
  .connect("mongodb://127.0.0.1:27017/registeredemployees",{ useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

  const employeeSchema = new Schema({
  firstName: { type: String},
  lastName: { type: String},
  email:   { type: String},
  password:   { type: String},
  aadhaar: { type: String}
});

// Group Schema

const groupSchema = new Schema({
groupName : {type:String},
groupDescription: {type: String},
createdBy: {type: String},
status: {type: String}
});

const groupModel = mongoose.model('contactsgroup', groupSchema);


// Contact Schema

const contactSchema = new Schema({
 employeeName : {type:String},
 employeeId: {type: String},
 email: {type: String},
 phone: {type: String},
 aadhaar: {type: String},
 createdBy: {type: String},
 inGroup: {type: String},
 status: {type: String}
});

const contactModel = mongoose.model('listofcontacts', contactSchema);


  const employee = mongoose.model('employees', employeeSchema);
  

// Register User  
  
  app.post('/register', function (req, res) {
  let newUser = new employee({
      "firstName":req.body.firstName,
      "lastName": req.body.lastName, 
      "email": req.body.email,
      "password": req.body.password,
      "aadhaar": req.body.aadhaar
    });
	
	employee.find().then((users) =>{
        console.log("received", users);
		let registeredEmails = users.map((user) => user.email);
		if(registeredEmails.indexOf(newUser.email) !== -1){
			return res.json({success: false, msg: 'User already registered!'});
			
		}
		else{			
	  bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
      if(err) throw err;
      newUser.password = hash;
      newUser.save().then((user) => res.status(200).json(user));
    });
  });
			
		}
	});
  
  

});

//getEmployee for Authentication

getUserByEmail = function(email, callback) {
  const query = {email: email}
  employee.findOne(query, callback);
}

//compare password for user authentication
comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if(err) throw err;
    callback(null, isMatch);
  });
}
  
app.post('/authenticate', function (req, res) {
  
  const email = req.body.email;
  const password = req.body.password;
  

  getUserByEmail(email, function (err, user) {
    if(err) throw err;
    if(!user) {
      return res.json({success: false, msg: 'User not found'});
    }

    comparePassword(password, user.password, function (err, isMatch) {
      if(err) throw err;
      if(isMatch) {
        const token = jwt.sign({data: user}, "secret", {
          expiresIn: 100000 //100000 seconds
        });
        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            email: user.email
          }
        })
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});
  
//Passport


let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = "secret";
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    employee.findById(jwt_payload.data._id, (err, user) => {
      if(err) {
		  console.log("in error");
        return done(err, false);
      }

      if(user) {
		  console.log("in success null");
        return done(null, user);
      } else {
		  console.log("in success false");
        return done(null, false);
      }
    });
  }));
  
  //Create Group
  
   app.post("/creategroup",passport.authenticate('jwt', {session:false}),function(req,res){  

    const groupData = new groupModel(
    {
      groupName : req.body.groupName,
      groupDescription: req.body.groupDescription,
	  createdBy: req.body.createdBy,
	  status: req.body.status
    });
    groupData.save().then((group) => res.status(200).json(group));    

  });
  
   app.post("/getGroups",passport.authenticate('jwt', {session:false}),function(req,res){
	  let value = [];
	  value.push((req.body)["createdBy"]);
      filter = {"createdBy":{$in:value}};
      groupModel.find(filter).then((groups) => res.status(200).json(groups));
  });
  
  app.post("/getGroupById",function(req,res){
	
	let id = (req.body.groupId);
    groupModel.findById(id).then((group) => res.status(200).json(group));    
  });
  
  
  app.put("/updateGroup",function(req,res){
	  console.log("received updated group", req);
	  
	groupModel.findByIdAndUpdate(
    req.body.groupId,
    req.body.group,
    {new: true},

    // the callback function
    (err, group) => {
    // Handle any possible database errors
        if (err) return res.status(500).send(err);
        return res.status(200).json(group);
    }
)
  });
  
  app.post("/deleteGroup",function(req,res){	  
    groupModel.remove({ "_id" : req.body.groupId }).then((group) => res.status(200).json(group));    
  });
  
  //Create Contacts
  
   app.post("/createContact",passport.authenticate('jwt', {session:false}),function(req,res){  

    const contactData = new contactModel(
    {
    employeeName : req.body.employeeName,
    employeeId: req.body.employeeId,
	email: req.body.email,
	phone: req.body.phone,
	aadhaar: req.body.aadhaar,
	createdBy: req.body.createdBy,
	inGroup: req.body.inGroup,
	status: req.body.status
    });
    contactData.save().then((contact) => res.status(200).json(contact));    
  });
  
  app.post("/getContacts",passport.authenticate('jwt', {session:false}),function(req,res){
	  let value = [];
	  value.push({"createdBy": (req.body)["createdBy"]});
	  value.push({"inGroup": (req.body)["inGroup"]});
      contactModel.find({$and:value}).then((contacts) => res.status(200).json(contacts));
  });
  
  
  app.put("/updateContact",function(req,res){
	  console.log("received updated contact", req);
	  
	contactModel.findByIdAndUpdate(
    req.body.contactId,
    req.body.contact,
    {new: true},

    // the callback function
    (err, contact) => {
    // Handle any possible database errors
        if (err) return res.status(500).send(err);
        return res.status(200).json(contact);
    }
)
  });
  
  app.post("/deleteContact",function(req,res){	  
    contactModel.remove({ "_id" : req.body.contactId }).then((contact) => res.status(200).json(contact));    
  });
  
  app.post("/getContactById",function(req,res){
	  console.log("received to receive contact");	
	let id = (req.body.contactId);
    contactModel.findById(id).then((contact) => res.status(200).json(contact));    
  });
  
//************************************************


//Authenticate User

app.post('/authenticate', function (req, res) {
  
  const username = req.body.username;
  const password = req.body.password;
  

  getUserByUsername(username, function (err, user) {
    if(err) throw err;
    if(!user) {
      return res.json({success: false, msg: 'User not found'});
    }

    comparePassword(password, user.password, function (err, isMatch) {
      if(err) throw err;
      if(isMatch) {
        const token = jwt.sign({data: user}, "secret", {
          expiresIn: 100000 // 1 week
        });
        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            username: user.username
          }
        })
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});


//*****************************************************************
 


    app.listen(8080, () => console.log("server started on port 8080"));
