const Idea = require('../models/idea');

// Listar ideias
exports.listIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 }).lean();
    res.render('ideas/index.hbs', { title: 'Ideias em Destaque', ideas, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar ideias');
  }
};
exports.ideaDetail = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id).lean();
    if (!idea) return res.status(404).send('Ideia não encontrada');

    const userHasVoted = req.user ? idea.votes.some(v => v.toString() === req.user._id.toString()) : false;

    const isAuthor = req.user?._id.toString() === idea.userId.toString();
    res.render('ideas/idea_detail.hbs', { 
      idea, 
      user: req.user, 
      isAuthor, 
      userHasVoted 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao exibir ideia');
  }
};
exports.createIdeaForm = (req, res) => {
  res.render('ideas/idea_form.hbs', { idea: {}, user: req.user });
};

exports.createIdea = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send('Você precisa estar logado para criar uma ideia.');
    }

    const { title, description, category } = req.body;

    const newIdea = new Idea({
      userId: req.user._id,
      title,
      description,
      category,
      status: 'Pendente',
      votes: [], 
    });

    await newIdea.save();

    res.redirect('/ideas');
  } catch (err) {
    console.error('Erro ao criar ideia:', err);
    res.status(500).send('Erro ao criar ideia');
  }
};

exports.editIdeaForm = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id).lean();
    if (!idea) return res.status(404).send('Ideia não encontrada');

    res.render('ideas/idea_form.hbs', { idea, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar ideia');
  }
};

exports.updateIdea = async (req, res) => {
  try {
    const { title, description, category, status } = req.body;
    await Idea.findByIdAndUpdate(req.params.id, { title, description, category, status });
    res.redirect('/ideas');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar ideia');
  }
};

// Deletar ideia
exports.deleteIdea = async (req, res) => {
  try {
    await Idea.findByIdAndDelete(req.params.id);
    res.redirect('/ideas');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao deletar ideia');
  }
};
