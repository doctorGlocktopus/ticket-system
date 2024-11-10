// pages/api/tickets/[id]/assign.js
import Ticket from '../../../../../models/Ticket'; // Adjust the path if needed
import User from '../../../../../models/User'; // Import the User model
import dbConnect from '@/utils/mongooseConnect';

export async function PUT(req, { params }) {
  const { id } = params; // Get the dynamic `id` from the URL params

  try {
    // Connect to the database
    await dbConnect();

    // Get the userId from the request body
    const { userId } = await req.json();

    // Update the ticket with the new user
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { userId }, // Assuming `userId` is the field you're updating
      { new: true } // Return the updated ticket
    );

    if (!updatedTicket) {
      return new Response('Ticket not found', { status: 404 });
    }

    return new Response(JSON.stringify(updatedTicket), { status: 200 });
  } catch (error) {
    console.error('Error assigning user to ticket:', error);
    return new Response('Error assigning user', { status: 500 });
  }
}