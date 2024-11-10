// models/Ticket.js
import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'Open', enum: ['Open', 'In Progress', 'Closed'] },
});

const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
export default Ticket;
