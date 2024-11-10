import mongoose from 'mongoose';

const epicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
}, { timestamps: true });

const Epic = mongoose.models.Epic || mongoose.model('Epic', epicSchema);

export default Epic;
