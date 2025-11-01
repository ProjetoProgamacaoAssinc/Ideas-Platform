const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');
const isLoggedIn = require('../middlewares/isLoggedIn');

// Listar ideias
router.get('/', ideaController.listIdeas);

// Nova ideia
router.get('/new', isLoggedIn, ideaController.createIdeaForm);
router.post('/', isLoggedIn, ideaController.createIdea);

// Editar ideia
router.get('/edit/:id', isLoggedIn, ideaController.editIdeaForm);
router.put('/:id', isLoggedIn, ideaController.updateIdea);

// Detalhes
router.get('/:id', ideaController.ideaDetail);

// Deletar
router.delete('/:id', isLoggedIn, ideaController.deleteIdea);

module.exports = router;
