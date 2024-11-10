import { mongooseConnect } from '../../../lib/mongoose';  // Deine Mongoose-Verbindung
import Ticket from '../../../models/Ticket';  // Dein Ticket Model

// GET /api/tickets/[id]
export async function GET(req, res) {
  try {
    const { id } = req.query;  // Extrahiere die ID aus der URL
    await mongooseConnect();  // Stelle sicher, dass du mit der DB verbunden bist

    // Finde das Ticket anhand der ID
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket nicht gefunden' });
    }

    res.status(200).json(ticket);  // Rückgabe des gefundenen Tickets
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen des Tickets' });
  }
}

// PUT /api/tickets/[id]
export async function PUT(req, res) {
  try {
    const { id } = req.query;  // Extrahiere die ID aus der URL
    const { title, description, priority, status } = req.body;

    await mongooseConnect();  // Stelle sicher, dass du mit der DB verbunden bist

    // Aktualisiere das Ticket anhand der ID
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { title, description, priority, status },
      { new: true }  // Gibt das aktualisierte Ticket zurück
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: 'Ticket nicht gefunden' });
    }

    res.status(200).json(updatedTicket);  // Rückgabe des aktualisierten Tickets
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Aktualisieren des Tickets' });
  }
}

// DELETE /api/tickets/[id]
export async function DELETE(req, res) {
  try {
    const { id } = req.query;  // Extrahiere die ID aus der URL
    await mongooseConnect();  // Stelle sicher, dass du mit der DB verbunden bist

    // Lösche das Ticket anhand der ID
    const deletedTicket = await Ticket.findByIdAndDelete(id);
    if (!deletedTicket) {
      return res.status(404).json({ message: 'Ticket nicht gefunden' });
    }

    res.status(200).json({ message: 'Ticket erfolgreich gelöscht' });  // Bestätigung der Löschung
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen des Tickets' });
  }
}
