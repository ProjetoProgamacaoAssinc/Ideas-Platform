const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');
const isLoggedIn = require('../middlewares/isLoggedIn');
const isAuthor = require('../middlewares/isAuthor');

// Listar ideias
router.get('/', ideaController.listIdeas);

// Nova ideia
router.get('/new', isLoggedIn, ideaController.createIdeaForm);
router.post('/', isLoggedIn, ideaController.createIdea);

// Editar ideia
router.get('/edit/:id', isLoggedIn, isAuthor, ideaController.editIdeaForm);
router.put('/:id', isLoggedIn, isAuthor, ideaController.updateIdea);

// Detalhes
router.get('/:id', ideaController.ideaDetail);

// Deletar
router.delete('/:id', isLoggedIn, isAuthor, ideaController.deleteIdea);

module.exports = router;
