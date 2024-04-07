const joi = require('joi');

module.exports = {
  createUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      password: joi.string().min(6).max(32).required().label('Password'),
      confirmpassword: joi.string().min(6).max(32).required().label('Confirm Password')
    },
  },

  updateUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
    },
  },

  patchUser: {
    body: {
      oldpassword: joi.string().min(6).max(32).required().label('Old Password'),
      newpassword: joi.string().min(6).max(32).required().label('New Password'),
      confirmnewpassword: joi.string().min(6).max(32).required().label('Confirm New Password')
    }
  }
};
