const router = require('express').Router();
const FileController = require('app/Controllers/fileController');
const authCheck = require('middlewares/authMiddleware');
const accessCheck = require('middlewares/accessMiddleware');
const uploader = require('middlewares/uploadFile');

router.post('/upload-song/:id', authCheck, accessCheck.allowedRoles('Admin'), uploader("mp3", 20, "mp3").single("mp3"), FileController.uploadSong);

module.exports = router;
