const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', async (req, res) => {
  try {

    // Here using populate method to get particular field from db
    // In this case : It will pick only name and avatar from User Schema
    // and leave other properties
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);

    if (!profiles) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.send(500).send('Server Error');
  }
});

// @route   Post api/profile/
// @desc    Create or update Profile
// @access  Public
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // if there are errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // destructure the request
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    console.log(profileFields);

    if (skills) {
      // assigning array value to object with seperation of values using comma as
      // split
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    console.log(profileFields.skills);

    // Build Social Object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // Update profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      profile = new Profile(profileFields);
      // saving profile value to db
      await profile.save();
      // send profile as response
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {

    // Here using populate method to get particular field from db
    // In this case : It will pick only name and avatar from User Schema
    // and leave other properties
    const profile = await Profile.findOne({user :req.params.user_id}).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'Profile Not Found' });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    if(err.kind == 'ObjectId')
    {
      return res.status(400).json({ msg: 'Profile Not Found' });
    }
    res.send(500).send('Server Error');
  }
});


// @route   Delete api/profile
// @desc    Delete profile,user & posts
// @access  Private
router.delete('/api/profile', auth ,async (req, res) => {
  try {
    // @todo - To remove users posts
    // It will remove user profile
    await Profile.findOneAndRemove({user :req.user_id})
    
    // It will remove user 
    await User.findOneAndRemove({_id :req.user_id})

    res.json({msg:"User Deleted"});
  } catch (err) {
    console.log(err.message);
    if(err.kind == 'ObjectId')
    {
      return res.status(400).json({ msg: 'Profile Not Found' });
    }
    res.send(500).send('Server Error');
  }
});




module.exports = router;
