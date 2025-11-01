const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const isLoggedIn = require('../middlewares/isLoggedIn');

// Rota de votar em uma ideia
router.post('/:id', isLoggedIn, voteController.voteIdea);

module.exports = router;
