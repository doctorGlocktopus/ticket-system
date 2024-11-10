import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'Open', enum: ['Open', 'In Progress', 'Closed'] },
  assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
});

const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);

export default Ticket;
