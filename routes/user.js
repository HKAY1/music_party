const router = require('express').Router();
const UserController = require('app/Controllers/userController');


router.post('/', UserController.registerUser);
router.put('/toogleStatus/:id',UserController.toggleAccountStatus);

 router.get('/',  UserController.userList);
 router.get('/:id',  UserController.userDetail);
router.put('/', UserController.updateUser);

// router.delete('/:id',UserController.inputDelete);


module.exports = router;