const express = require('express')
const profilesRouter = express.Router()
const ProfileModel = require('./schema')
const UserModel = require('../users/schema')
const auth = require('../../middleware/auth')
const request = require('request')
require('dotenv').config()

// get current loged in user profile
profilesRouter.get("/me", auth, async (req, res, next) => {
  try {
    const profile = await ProfileModel.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])
    if (!profile) {
      return res.status(400).send('there is no profile for this user')
    }
    res.send(profile)
  } catch (error) {
    next(error)
  }
})

// create a profile
profilesRouter.post("/", auth, async (req, res, next) => {
  const {
    company,
    website,
    location,
    bio,
    status,
    githuusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
  } = req.body;

  // build profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githuusername) profileFields.githuusername = githuusername;
  if (skills) {
    profileFields.skills = skills.split(",").map((skill) => skill.trim());
  }
  console.log(profileFields.skills);

  // build socil object
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;

  try {
    let profile = await ProfileModel.findOne({ user: req.user.id });
    if (profile) {
      //update
      profile = await profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    } else {
      // create profile
      const profile = new ProfileModel(profileFields);
      await profile.save();
      res.json(profile);
    }
  } catch (error) {
    next(error);
  }
});


// get all profiles

profilesRouter.get("/", async (req, res, next) => {
  try {
    const profiles = await ProfileModel.find(req.query).populate('user', ['name', 'avatar'])
    res.send(profiles)

  } catch (error) {
    next(error)

  }

})

// get profiles by user id
profilesRouter.get("/user/:user_id", async (req, res, next) => {
  try {
    const profile = await ProfileModel.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])
    if (profile) {
      res.send(profile)
    } else {
      res.status(400).json({ msg: "there is no profile for this user" })
    }

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ ms: 'profile not found' })
    }
    next(error)

  }

})

//delete profile with the user that created it
//delete profile, user and post
profilesRouter.delete("/", auth, async (req, res, next) => {
  //remove profile
  await ProfileModel.findOneAndRemove({ user: req.user.id })

  // remove user
  await UserModel.findOneAndRemove({ _id: req.user.id })
  res.json({ msg: 'user deleted' })
})


// put /profile/experience
//@@desc Add profile experience

profilesRouter.put('/experience', auth, async (req, res, next) => {

  const { title, company, location, from, to, current, description } = req.body
  const newEdu = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }
  try {
    const profile = await ProfileModel.findOne({ user: req.user.id })
    profile.education.unshift(newEdu)
    await profile.save()
    res.json(profile)


  } catch (error) {
    next(error)
  }

})


// dlete experience
profilesRouter.delete("/education/:edu_id", auth, async (req, res, next) => {
  try {
    const profile = await ProfileModel.findOne({ user: req.user.id })
    //get remove index
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.exp_id)
    profile.education.splice(removeIndex, 1)
    await profile.save()
    res.json(profile)

  } catch (error) {
    next(error)

  }

})
// put /profile/education
//@@desc Add profile experience

profilesRouter.put('/education', auth, async (req, res, next) => {

  const { school, degree, fieldOfStudy, from, to, current, description } = req.body
  const newExp = {
    school,
    degree,
    fieldOfStudy,
    from,
    to,
    current,
    description
  }
  try {
    const profile = await ProfileModel.findOne({ user: req.user.id })
    profile.experience.unshift(newExp)
    await profile.save()
    res.json(profile)


  } catch (error) {
    next(error)
  }

})


// dlete experience
profilesRouter.delete("/experience/:exp_id", auth, async (req, res, next) => {
  try {
    const profile = await ProfileModel.findOne({ user: req.user.id })
    //get remove index
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)
    profile.experience.splice(removeIndex, 1)
    await profile.save()
    res.json(profile)

  } catch (error) {
    next(error)

  }

})


// get profile/github/:username
// get user repos from github

profilesRouter.get("/github/:username", (req, res, next) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.client_id}&client_secret=${process.env.github_secret}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };
    request(options, (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200) {
       return res.status(404).json({ msg: "No github profile found" });
      }
      res.json(JSON.parse(body));
    });
  } catch (error) {
    next(error);
  }
});



module.exports = profilesRouter