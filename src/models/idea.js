const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, default: "Pendente" },
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true, collection: 'ideas' });

module.exports = mongoose.model('Idea', ideaSchema);
