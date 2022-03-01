const express = require('express');
const router = express.Router();

const MainController = require('../controllers/MainController');
const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');
const LearningController = require('../controllers/LearningController');
const LessonController = require('../controllers/LessonController');

router.get('/', MainController.showHome);

// AUTH
router.get('/zarejestruj', AuthController.showRegister);
router.post('/zarejestruj', AuthController.register);
router.get('/zaloguj', AuthController.showLogin);
router.post('/zaloguj', AuthController.login);
router.get('/activate/:id', AuthController.activateAccount);
router.get('/wyloguj', AuthController.logout);

// // PROFILE
router.get('/profil/kokpit', UserController.showProfile);
router.post('/profil/ustawienia', UserController.update);
router.get('/profil/ustawienia', UserController.showSettings);
router.post('/profil/usun-konto/:id', UserController.deleteAccount);
router.get('/profil/slowka', UserController.showWordlist);
router.get('/profil/lekcje', UserController.showLessonlist);
router.post('/profil/slowka', UserController.addWord);
router.post('/profil/lekcje', UserController.addLesson);
router.get('/profil/slowka/powtarzaj', UserController.repeatWords);
router.get('/profil/slowka/wybor', UserController.chooseMethod);
router.post('/profil/slowka/wyczysc', UserController.deleteAllWords);
router.get('/profil/slowka/:id/usun', UserController.deleteWord);
router.post('/profil/slowka/:id/edytuj', UserController.editWord);

router.get('/profil/wybor', LearningController.chooseMethod);
router.get('/profil/wybierz-znaczenie-en', LearningController.selectMeaningEn);

router.get('/lekcje', LessonController.showLessons);
router.get('/lekcje/add', LessonController.addNewLesson);
router.get('/lekcje/:name', LessonController.showLessonWordlist);
router.get('/lekcje/:name/fiszki', LessonController.flipcardLesson);
router.get('/lekcje/:name/qwerty', LessonController.qwertyLesson);
router.get('/lekcje/:name/sprawdzian', LessonController.doTestFromLesson);
router.post('/lekcje/:name/sprawdzian', LessonController.checkTestFromLesson);

// NOT FOUND - 404
router.get('*', MainController.showNotFound)

module.exports = router;