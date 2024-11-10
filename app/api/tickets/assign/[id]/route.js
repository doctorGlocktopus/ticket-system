import Ticket from '../../../../../models/Ticket'; // Passe den Pfad nach Bedarf an
import User from '../../../../../models/User'; // Importiere das User-Modell
import dbConnect from '@/utils/mongooseConnect'; // Deine Datenbankverbindung

export async function PUT(req, context) {
  const { id } = await context.params; // Warten, bis params aufgelöst ist

  try {
    // Stelle eine Verbindung zur Datenbank her
    await dbConnect();

    // Hole die userId aus dem Anfrage-Body
    const { userId } = await req.json();

    // Update das Ticket mit dem neuen Benutzer
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { $push: { assignedUsers: userId } }, // Verwende $push, um den Benutzer hinzuzufügen
      { new: true } // Rückgabe des aktualisierten Tickets
    );

    // Überprüfe, ob das Ticket gefunden wurde
    if (!updatedTicket) {
      return new Response('Ticket nicht gefunden', { status: 404 });
    }

    // Rückgabe des aktualisierten Tickets als Antwort
    return new Response(JSON.stringify(updatedTicket), { status: 200 });
  } catch (error) {
    console.error('Fehler beim Zuweisen des Benutzers zum Ticket:', error);
    return new Response('Fehler beim Zuweisen des Benutzers', { status: 500 });
  }
}
