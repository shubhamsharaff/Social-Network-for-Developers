const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
// @route   Post api/users
// @desc    Register User
// @access  Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })

], async (req, res) => {
    console.log('working')
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // only enter to this condition  if there is error  
        return res.status(400).json({ errors: errors.array() });
        // errors :errors.array() it will send that Name is required and other things as mesg
    }

    const { name, email, password } = req.body; // destructuring data coming from req body
    try {
        let user = await User.findOne({ email })
        //Check if user exists
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }
        // Get users gravatar
        // we are going to pass user email to gravatar url with someoptions like size 
        let avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })
        // creating new instance of user to encrypt password
        user = new User({
            name,
            email,
            avatar,
            password
        })

        //Encrypt Passoword
        const salt = await bcrypt.genSalt(10); // Generating salt 
        user.password = await bcrypt.hash(password, salt); // Hashing the password and storing it to user
        await user.save(); // will save user in db 

        // return jsonwebtoken
        const payload = {
            user: {
                id: user.id // it will get generated id from database for particular user  
            }
        }
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token })
            }
        );
        res.send('User registered');
    } catch (err) {
        console.log(err.message());
        res.status(500).send('Server error');
    }


})

module.exports = router;