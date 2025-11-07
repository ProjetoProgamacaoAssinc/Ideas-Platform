const Idea = require('../models/idea');

// Listar ideias
exports.listIdeas = async (req, res) => {
  try {
    const filter = {};

    // Categoria
    const category = req.query.category;
    if (category && category !== '') {
      filter.category = category;
    }

    // Status
    const status = req.query.status;
    if (status && status !== '') {
      filter.status = status;
    }

    // Filtro por data
    const dateFilter = req.query.date;
    if (dateFilter && dateFilter !== '') {
      const now = new Date();
      let fromDate;

      if (dateFilter === 'today') {
        fromDate = new Date(now.setHours(0, 0, 0, 0));
      } else if (dateFilter === 'week') {
        fromDate = new Date();
        fromDate.setDate(now.getDate() - 7);
      } else if (dateFilter === 'month') {
        fromDate = new Date();
        fromDate.setMonth(now.getMonth() - 1);
      }

      if (fromDate) {
        filter.createdAt = { $gte: fromDate };
      }
    }

    const ideas = await Idea.find(filter).sort({ createdAt: -1 }).lean();

    res.render('ideas/index.hbs', {
      title: 'Ideias em Destaque',
      ideas,
      user: req.user,
      category,
      status,
      date: dateFilter
    });
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

    req.flash('success_msg', 'Ideia enviada com sucesso!');
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
