const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');
// to route user to sing in page(in any condition) if he is not logged in
const passport = require('passport'); // ref RI1

console.log('Router loaded');


router.get('/', passport.checkAuthentication, homeController.home); // RI1
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/likes', require('./likes'));

// for api
router.use('/api',require('./api'));
// for any further routes, access from here
// router.use('/routerName', require('./routerfile));


module.exports = router;