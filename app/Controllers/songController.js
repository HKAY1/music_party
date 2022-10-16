'use strict'


const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;
const SongModel = mongoose.model('music');
const FavModel = mongoose.model('favMusic');
const BaseRepo = require('app/Repositories/baseRepository');
const { checkMissingFields, isValidMongoObjectId } = require('utils/commonFunctions');
const _ = require('lodash');

module.exports = {
    registerSong,
    updateSong,
    songList,
    songDetail,
    delteSong,
    likeSong,
    toggleSong,
    getlikedSong
}

const songFields = ["songName", "singer", "linkedTo","dateOfRelease"];
const favFeilds = ["songId","isLiked","userId"];

async function registerSong(req, res, next) {
    let body = req.body;
    let songbody = _.pick(body, songFields);

    let missingUserFields = checkMissingFields(body,songFields);
    if (missingUserFields.length) return next({ message: "Some fields are missing", fields: _.uniq([...missingUserFields]), status: 400 });

    try {
 
        
        const user = await BaseRepo.baseCreate(SongModel, songbody);

        if(!user) {
            return next({ message: "Internal Serever Error" });
        }
      
        
        res.data = user;

        return next();
    }
    catch (err) {
        return next(err);
    }
}

async function updateSong(req, res, next) {
    if (!req.params.id)
        return next({ message: "missing id from params", status: 400 });
    if (!isValidMongoObjectId(req.params.id)) {
        return next({ message: "Invalid  id", status: 400 });
    }
    let body = req.body;
    let songId = ObjectId(req.params.id);

    body = _.pick(body, ["singer", "songName"]);
 
    try {

        let song = await BaseRepo.baseDetail(SongModel, { _id: songId });

        if (!song) return next({ message: "User not found", status: 400 });

        await BaseRepo.baseUpdate(SongModel, { _id: songId }, body);

        res.data = { message: "Successfully updated " };

        return next();

    } catch (err) {
        return next(err)
    }
}

async function delteSong(req, res, next) {

    if (!req.params.id)
        return next({ message: "missing id from params", status: 400 });
    if (!isValidMongoObjectId(req.params.id)) {
        return next({ message: "Invalid  id", status: 400 });
    }

    const songId = ObjectId(req.params.id);


 
    try {

        let song = await BaseRepo.baseDetail(SongModel, { _id: songId });

        if (!song) return next({ message: "User not found", status: 400 });

        await BaseRepo.baseDelete(SongModel, { _id: songId });

        res.data = { message: "Successfully updated " };

        return next();

    } catch (err) {
        return next(err)
    }
}

async function songList(req, res, next) {
    let {  songName } = req.query;
    var searchParams = {};
    if(songName) searchParams.songName = {$regex : `^${songName}`, '$options' : 'i'};
    let params = {
        searchParams,
        limit: 10,
        // select: 'name imageUrl'

    };


    try {

        let song = await BaseRepo.baseList(SongModel, params);

        if (!song || !song.length)
            res.data = [];
        else
            res.data = song;

        return next();

    } catch (err) {
        return next(err);
    }
}

async function songDetail(req, res, next) {

    if (!req.params.id)
        return next({ message: "Missing User id from params", status: 400 });

    if (!isValidMongoObjectId(req.params.id)) 
        return next({ message: "Invalid User id", status: 400 });
    
    const userId = ObjectId(req.params.id);


    try {
        const user = await BaseRepo.baseDetailById(SongModel, userId);

        if (!user) return next({ message: "User Not Found" })

        res.data = user;

        return next();

    } catch (err) {
        return next(err);
    }
} 



// Fav Music//

async function likeSong(req, res, next) {

    var body = req.body
    body.userId = ObjectId(req.user.id)

    let songbody = _.pick(body, favFeilds);
    let missingUserFields = checkMissingFields(body,favFeilds);
    if (missingUserFields.length) return next({ message: "Some fields are missing", fields: _.uniq([...missingUserFields]), status: 400 });

    try {
 
        
        const user = await BaseRepo.baseCreate(FavModel, songbody);

        if(!user) {
            return next({ message: "Internal Serever Error" });
        }
      
        
        res.data = user;

        return next();
    }
    catch (err) {
        return next(err);
    }
}

async function toggleSong(req, res, next){
    const body = req.body;

    const accountId = ObjectId(req.user._id);
    if(!body || _.isEmpty(body)) return next({ message: "Some fields are missing", fields: ["songId",]})
    
    if (!body.songId) {
        return next({ message: "Missing or invalid id", status: 400 });
    }
    const songId = ObjectId(req.body.songId);
    
    try{
       const song = await BaseRepo.baseUpdate(FavModel, {userId: accountId,songId:songId}, {isLiked: body.isLiked});
       if(!song) return next({message: "Song not found.", status: 400});

       res.data = { message: "Song status updated successfully."};
       return next();
    }
    catch(err){
     return next(err);
    }
}

async function getlikedSong(req,res,next){
    let userid = ObjectId(req.user._id)
    
    var searchParams ={}
    searchParams.userId = userid;
    searchParams.isLiked = true

    let query=[
        {
            $match:searchParams
        },
        {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
        },
        {
            $lookup: {
              from: "musics",
              localField: "songId",
              foreignField: "_id",
              as: "song",
            },
        },
        {$unwind:"$user"},
        {$unwind:"$song"},
        {
            $project:{
                _id:1,
                user:"$user.name",
                song:"$song.songName",
                isLiked:1
            }
        }

    ]

    try {
        
        const song  = await BaseRepo.baseAggregate(FavModel,query);
        if(!song) return next({message:"Song Not found",status:400});

        res.data = song;
        return next();


    } catch (err) {
        return next(err)
    }


}