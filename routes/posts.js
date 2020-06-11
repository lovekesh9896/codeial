const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts_controller');
console.log('posts is loaded');
router.get('/',postsController.posts);
module.exports = router;