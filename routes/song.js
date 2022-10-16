const router = require('express').Router();
const SongController = require('app/Controllers/songController');

const authCheck = require('middlewares/authMiddleware');
const accessCheck = require('middlewares/accessMiddleware');


router.post('/',authCheck,accessCheck.allowedRoles("Admin"), SongController.registerSong);

 router.get('/',authCheck,  SongController.songList);
 router.get('/:id',authCheck,  SongController.songDetail);
router.put('/:id',authCheck,accessCheck.allowedRoles("Admin"), SongController.updateSong);

router.delete('/:id',authCheck,accessCheck.allowedRoles("Admin"),SongController.delteSong);


// Fav songs//

router.post('/like-song',authCheck,SongController.likeSong);
router.put('/toggle-songs/song',authCheck,SongController.toggleSong);
router.get('/fav-music/list',authCheck,SongController.getlikedSong);


module.exports = router;