const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route   Post api/auth
// @desc    Authorization & get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Password is required'
    ).exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // only enter to this condition  if there is error
      return res.status(400).json({ errors: errors.array() });
      // errors :errors.array() it will send that Name is required and other things as mesg
    }

    const { email, password } = req.body; // destructuring data coming from req body
    try {
      let user = await User.findOne({ email });
      //Check if user exists
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      // Compare passowrd with db exsisting password with user entered password 
      // using brcypt compare method which take two parameters 
      // compare(password_prsent_in_db, pass_entered_by_user_during_login)
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }





      // return jsonwebtoken
      const payload = {
        user: {
          id: user.id, // it will get generated id from database for particular user
        },
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
      // res.send('User registered');
    } catch (err) {
      console.log(err.message());
      res.status(500).send('Server error');
    }
  }
);
module.exports = router;
