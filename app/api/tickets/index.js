// pages/api/tickets/index.js
import { mongooseConnect } from '../../../lib/mongoose'; // Deine Mongoose-Verbindung
import Ticket from '../../../models/Ticket'; // Dein Ticket Model

// GET /api/tickets - Alle Tickets abfragen
export async function GET(req, res) {
  try {
    await mongooseConnect();  // Stelle sicher, dass du mit der DB verbunden bist
    const tickets = await Ticket.find(); // Alle Tickets abrufen
    res.status(200).json(tickets); // Die Liste der Tickets zurückgeben
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Tickets' });
  }
}

// POST /api/tickets - Ein neues Ticket erstellen
export async function POST(req, res) {
  try {
    const { title, description, priority } = req.body;
    await mongooseConnect(); // Stelle sicher, dass du mit der DB verbunden bist

    const newTicket = new Ticket({
      title,
      description,
      priority,
      createdAt: new Date(),
      status: 'Open',
    });

    const savedTicket = await newTicket.save(); // Speichere das neue Ticket in der DB
    res.status(201).json(savedTicket); // Gebe das erstellte Ticket zurück
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fehler beim Erstellen des Tickets' });
  }
}
