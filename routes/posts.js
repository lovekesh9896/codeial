const express = require('express');
const router = express.Router();
const passport = require('passport');


const postsController = require('../controllers/posts_controller');
console.log('posts is loaded');

router.get('/',postsController.posts);
router.post('/create-new-post',passport.checkAuthentication,postsController.createPost);
module.exports = router;