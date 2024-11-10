// app/api/teams/[id]/route.js
import mongooseConnect from '@/utils/mongooseConnect';
import Team from '@/models/Team';

export async function GET(request, { params }) {
  await mongooseConnect();

  const { id } = params; // Extract the team ID from the URL params

  if (!id) {
    return new Response(JSON.stringify({ error: 'Team-ID ist erforderlich.' }), { status: 400 });
  }

  try {
    // Find the team by its ID and populate its members
    const team = await Team.findById(id).populate('members'); // populate to get user data for members

    if (!team) {
      return new Response(JSON.stringify({ error: 'Team nicht gefunden.' }), { status: 404 });
    }

    // Return the found team along with its members
    return new Response(JSON.stringify(team), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Fehler beim Abrufen des Teams.' }), { status: 500 });
  }
}
