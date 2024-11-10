// pages/api/tickets/[id]/assign.js
import Ticket from '../../../../models/Ticket'; // Adjust the path if needed
import User from '../../../../models/User'; // Import the User model
import dbConnect from '../../../../utils/dbConnect'; // Adjust the path

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { id } = req.query; // Ticket ID from URL
    const { userId } = req.body; // The user to assign to the ticket

    try {
      await dbConnect(); // Ensure DB connection

      // Find the ticket
      const ticket = await Ticket.findById(id);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket nicht gefunden' });
      }

      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Benutzer nicht gefunden' });
      }

      // Add the user to the assignedUsers array
      ticket.assignedUsers.push(user._id);
      await ticket.save(); // Save the ticket with the new user assigned

      return res.status(200).json(ticket); // Return the updated ticket
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Fehler beim Zuweisen des Benutzers' });
    }
  } else {
    return res.status(405).json({ message: 'Methode nicht erlaubt' });
  }
}
