const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const isLoggedIn = require('../middlewares/isLoggedIn');
const Idea = require('../models/idea'); // Adicione isto se ainda não tiver

// Votar
router.post('/:id', isLoggedIn, voteController.voteIdea);

// Retirar voto
router.post('/unvote/:id', isLoggedIn, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).send('Ideia não encontrada');

    idea.votes = idea.votes.filter(
      (id) => id.toString() !== req.session.userId.toString()
    );
    await idea.save();

    res.redirect('/ideas');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao retirar voto');
  }
});

module.exports = router;
