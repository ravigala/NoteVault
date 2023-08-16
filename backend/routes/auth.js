const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "Raviisagoodcoder$@"
const fetchuser = require('../middleware/fetchuser')

//ROUTE1 : Create a user using POST "/api/auth/createuser", No login required
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', "Enter a valid Email").isEmail(),
  body('password', 'Password must have a minimum of 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  // if there are errors return bad requests and the error
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    // create new user
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash
    });
    const data = {
      user:{
        id : user.id
      }
    }
    var authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({success, authtoken});    //es6 used here
    // res.json(user);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({success, error: 'Email already exists' });
    }
    console.error(error);
    res.status(500).json({error: 'Internal Server Error' });
  }
});


//ROUTE1 : Authenticate a user using POST "/api/auth/login", No login required
router.post('/login', [
  body('email', "Please login with correct credentials").isEmail(),
  body('password', 'Please login with correct credentials').exists(),

], async (req, res) => {
  // if there are errors return bad requests and the error
  const errors = validationResult(req);
  let success = false;
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {email, password} = req.body;

  try {
    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({success, error : 'Please login with correct credentials'})
    }

    const passwordCompare = await bcrypt.compare(password, user.password)
    if(!passwordCompare){
      return res.status(400).json({success, error : 'Please login with correct credentials'})
    }

    const data = {
      user:{
        id : user.id
      }
    }
    success = true;
    var authtoken = jwt.sign(data, JWT_SECRET);
    res.json({success, authtoken});    //es6 used here

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//ROUTE3 : Get loggedin user detail POST "/api/auth/getuser", Login required
router.post('/getuser', fetchuser ,async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});




module.exports = router;