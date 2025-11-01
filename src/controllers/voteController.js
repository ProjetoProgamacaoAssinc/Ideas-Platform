const Idea = require('../models/idea');

exports.voteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).send('Ideia não encontrada');

    const userId = req.user._id.toString();

    // Verifica se o usuário já votou
    if (idea.votes.includes(userId)) {
      return res.status(400).send('Você já votou nesta ideia');
    }

    // Adiciona o voto
    idea.votes.push(userId);
    idea.num_votes = idea.votes.length;

    await idea.save();

    res.redirect('/ideas');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao votar na ideia');
  }
};
