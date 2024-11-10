// pages/api/tickets/[id]/status.js
import Ticket from '../../../../../models/Ticket'; // Passe den Pfad gegebenenfalls an
import dbConnect from '@/utils/mongooseConnect';

export async function PUT(req, { params }) {
  const { id } = params; // Get the dynamic `id` from the URL params

  try {
    await dbConnect(); // Ensure DB is connected before performing DB operations

    // Get the status from the request body
    const { status } = await req.json();

    // Find the ticket by ID and update the status
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated ticket object
    );

    if (!updatedTicket) {
      return new Response('Ticket not found', { status: 404 });
    }

    return new Response(JSON.stringify(updatedTicket), { status: 200 });
  } catch (error) {
    console.error('Error updating status:', error);
    return new Response('Error updating status', { status: 500 });
  }
}