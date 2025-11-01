const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  ideaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  voteType: { type: String, enum: ['upvote', 'downvote'], required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

// Índice único (garante voto único por user + ideia)
voteSchema.index({ ideaId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
