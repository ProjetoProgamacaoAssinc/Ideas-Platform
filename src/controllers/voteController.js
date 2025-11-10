const Idea = require('../models/idea');

exports.voteIdea = async (req, res) => {
  try {
    // Verifica se o usuário está logado
    if (!req.user) {
      console.error('❌ Erro: Usuário não está logado.');
      return res.status(401).send('Você precisa estar logado para votar.');
    }

    // Busca a ideia
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      console.error('❌ Erro: Ideia não encontrada.');
      return res.status(404).send('Ideia não encontrada.');
    }

    const userId = req.user._id.toString();

    // Evita voto duplicado
    if (idea.votes.includes(userId)) {
      console.log('⚠️ Usuário já votou nessa ideia.');
      return res.status(400).send('Você já votou nesta ideia.');
    }

    // Adiciona o voto
    idea.votes.push(userId);
    idea.num_votes = idea.votes.length;

    // Se a ideia não tiver data, define uma
    if (!idea.date) {
      idea.date = new Date();
    }

    // Se tiver 3 votos ou mais, aprova
    if (idea.votes.length >= 3 && idea.status !== 'Aprovada') {
      idea.status = 'Aprovada';
    }

    await idea.save();

    console.log(`✅ Voto registrado com sucesso para a ideia: ${idea.title}`);

    res.redirect('/ideas');
  } catch (err) {
    console.error('❌ Erro detalhado ao votar na ideia:', err);
    res.status(500).send('Erro ao votar na ideia');
  }
};
