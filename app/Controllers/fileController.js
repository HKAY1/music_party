'use strict'

const mongoose = require('mongoose');
const SongModel = mongoose.model('music');
const BaseRepo = require('app/Repositories/baseRepository');
const fs = require('fs');



function getNewFilePath(currPath) {
  const newPath = _config.appUrl + currPath.substring(7);
  return newPath;
}

module.exports = {

  uploadSong: async function (req, res, next) {
    console.log(req.params.id)
    console.log(req.mp3)
    if (!req.params.id || !req.file)
      return res.status(500).json({ msg: "something failed." });

    let newPath = getNewFilePath(req.file.path);

    let song = await BaseRepo.baseDetailById(SongModel,req.params.id)

    //if already file (remove old file)
    if (song.songName) {
      let oldFile = 'public/' + song.songName.substring(_config.appUrl.length);
      fs.unlink(oldFile, function (err) {
        if (err) {
          console.log("Error in removing file -> ", err);
        }
        else {
          console.log("removed old file successfully");
        }
      });
    }

    BaseRepo.baseUpdate(SongModel,
      { _id: req.params.id },
      {
       $set:{ songUrl: newPath}
      },
      {
        returnOriginal: false
      })
      .then(result => {
        console.log("song upload result : ", result);
        return res.status(200).json({ success: true, songUrl: result.songUrl });
      })
      .catch(err => {
        return next(err);
      })

  },
}
