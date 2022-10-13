const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')
const User = require('../../models/User');
// @route   Post api/users
// @desc    Register User
// @access  Public
router.post('/', [
    check('name','Name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password','Please enter a password with 6 or more characters').isLength({min:6})

],(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // only enter to this condition  if there is error  
        return res.status(400).json({errors :errors.array()});
        // errors :errors.array() it will send that Name is required and other things as mesg
    }

    const {name,email,password}= req.body; // destructuring data coming from req body
    try{
    //See if user exists

    //Get users gravatar

    //Encrypt Passoword

    // return jaonwebtoken
    res.send('User route');
    }catch(err){
        console.log(err.message());
        res.status(500).send('Server error');
    }
    
})

module.exports = router;