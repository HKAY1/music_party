'use strict'

const router = require('express').Router();
const authRouter = require('./auth');
const songRouter = require('./song');
const userRouter = require('./user');
const fileRouter = require('./file');

router.get('/', (req, res)=> {
    res.send('Welcome to music Party!');
})




 router.use('/auth', authRouter);
router.use('/file', fileRouter);
router.use('/songs',songRouter);
router.use('/users',userRouter);

module.exports = router;