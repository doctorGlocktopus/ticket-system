// pages/api/tickets/[id]/status.js
import Ticket from '../../../../../models/Ticket'; // Passe den Pfad gegebenenfalls an
import dbConnect from '../../../../utils/dbConnect'; // Stelle sicher, dass die DB-Verbindung korrekt ist

export default async function handler(req, res) {
console.log(111)
  if (req.method === 'PUT') {
    const { id } = req.query; // Ticket-ID aus der URL
    const { status } = req.body; // Neuer Status

    try {
      await dbConnect(); // Sicherstellen, dass die DB-Verbindung hergestellt ist

      // Ticket finden und Status aktualisieren
      const ticket = await Ticket.findById(id);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket nicht gefunden' });
      }

      // Status aktualisieren, nur wenn der neue Status gültig ist
      const validStatuses = ['Open', 'In Progress', 'Closed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Ungültiger Status' });
      }

      ticket.status = status;
      await ticket.save(); // Ticket speichern

      return res.status(200).json(ticket); // Das aktualisierte Ticket zurückgeben
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Fehler beim Aktualisieren des Status' });
    }
  } else {
    return res.status(405).json({ message: 'Methode nicht erlaubt' });
  }
}
