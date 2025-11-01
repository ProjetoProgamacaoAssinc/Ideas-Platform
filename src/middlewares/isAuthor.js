import { findById } from '../models/idea.js';

export default async (req, res, next) => {
  const idea = await findById(req.params.id);
  if (!idea) return res.status(404).send('Ideia não encontrada');
  if (idea.author.toString() !== req.session.userId) {
    return res.status(403).send('Acesso negado');
  }
  next();
};
