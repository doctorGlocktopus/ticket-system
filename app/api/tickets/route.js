import mongooseConnect from '@/utils/mongooseConnect';
import Ticket from '@/models/Ticket';

export async function GET(request) {
  await mongooseConnect();

  try {
    const tickets = await Ticket.find();
    return new Response(JSON.stringify(tickets), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error fetching tickets' }), { status: 500 });
  }
}

export async function POST(request) {
  await mongooseConnect();
  
  const { title, description, priority } = await request.json();

  try {
    const newTicket = new Ticket({ title, description, priority });
    await newTicket.save();
    
    return new Response(JSON.stringify(newTicket), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error creating ticket' }), { status: 500 });
  }
}
