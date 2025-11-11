const Idea = require('../models/idea');

exports.voteIdea = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send('Você precisa estar logado para votar.');
    }

    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).send('Ideia não encontrada.');
    }

    // Impede votos em ideias já aprovadas
    if (idea.status === 'Aprovada') {
      return res.status(400).send('Esta ideia já foi aprovada e não pode receber mais votos.');
    }

    const userId = req.user._id.toString();

    // Adiciona o voto se o usuário ainda não votou
    if (!idea.votes.map(v => v.toString()).includes(userId)) {
      idea.votes.push(userId);
      idea.num_votes = idea.votes.length;

      if (idea.votes.length >= 3 && idea.status !== 'Aprovada') {
        idea.status = 'Aprovada';
      }

      await idea.save();
    }

    res.redirect('/ideas');
  } catch (err) {
    console.error('❌ Erro ao votar na ideia:', err);
    res.status(500).send('Erro ao votar na ideia');
  }
};


exports.unvoteIdea = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send('Você precisa estar logado para remover o voto.');
    }

    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).send('Ideia não encontrada.');
    }

    const userId = req.user._id.toString();

    // Remove o voto, se existir
    idea.votes = idea.votes.filter(v => v.toString() !== userId);
    idea.num_votes = idea.votes.length;

    // Se tinha sido aprovada, mas caiu abaixo de 3 votos, volta pra pendente
    if (idea.status === 'Aprovada' && idea.votes.length < 3) {
      idea.status = 'Pendente';
    }

    await idea.save();

    res.redirect('/ideas');
  } catch (err) {
    console.error('❌ Erro ao remover voto:', err);
    res.status(500).send('Erro ao retirar voto');
  }
};
