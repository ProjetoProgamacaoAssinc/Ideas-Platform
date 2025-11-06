const Idea = require('../models/idea');

module.exports = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      req.flash('error_msg', 'Ideia não encontrada');
      return res.redirect('/ideas');
    }
    if (idea.userId.toString() !== req.session.userId) {
      req.flash('error_msg', 'Você não tem permissão para esta ação');
      return res.redirect('/ideas');
    }
    next();
    
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Erro ao verificar permissões');
    res.redirect('/ideas');
  }
};