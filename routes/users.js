const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');
// to show and update the profile 
router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);
// to show sign in and sign up page
router.get('/sign-in', usersController.signIn);
router.get('/sign-up', usersController.signUp);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
), usersController.createSession);
// forgot password
// to redirect to enter email for reset password page
router.get('/forgot-password', usersController.forgotPassword);
// get the email 
router.post('/forgot-password-mail', usersController.forgotPasswordMail);
// page to reset password(contains token)
router.get('/reset-link/:token', usersController.resetLink);
// reset password
router.post('/reset', usersController.reset);
router.post('/create', usersController.create);

// sign out user
router.get('/sign-out', usersController.destroySession);

// google authentication
router.get('/auth/google', passport.authenticate('google', {scope : ['profile','email']}));
router.get('/auth/google/callback', passport.authenticate('google',{failureRedirect : '/users/sign-in'}), usersController.createSession);

// facebook authentication
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }) );
router.get('/auth/facebook/callback', passport.authenticate('facebook',{failureRedirect : '/users/sign-in'}), usersController.createSession);

// twitter authentication
router.get('/auth/twitter', passport.authenticate('twitter') );
router.get('/auth/twitter/callback', passport.authenticate('twitter',{failureRedirect : '/users/sign-in'}), usersController.createSession);


module.exports = router;