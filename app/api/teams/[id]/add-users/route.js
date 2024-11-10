// app/api/teams/[id]/add-users/route.js
import mongooseConnect from '@/utils/mongooseConnect';
import Team from '@/models/Team';
import User from '@/models/User';

export async function POST(request, { params }) {
  await mongooseConnect();

  // Warten, bis die `params` asynchron abgerufen sind
  const { id } = params;  // params wird hier asynchron abgerufen, so wie es Next.js verlangt

  const { userIds } = await request.json(); // Benutzer-IDs aus dem Body holen

  if (!userIds || userIds.length < 1) {
    return new Response(JSON.stringify({ error: 'Mindestens ein Benutzer muss ausgewählt werden.' }), { status: 400 });
  }

  try {
    // Finde das Team anhand der ID
    const team = await Team.findById(id);
    if (!team) {
      return new Response(JSON.stringify({ error: 'Team nicht gefunden' }), { status: 404 });
    }

    // Überprüfe, ob alle Benutzer existieren
    const users = await User.find({ '_id': { $in: userIds } });
    if (users.length !== userIds.length) {
      return new Response(JSON.stringify({ error: 'Ein oder mehrere Benutzer existieren nicht.' }), { status: 400 });
    }

    // Benutzer zum Team hinzufügen
    team.members.push(...userIds);
    await team.save();

    return new Response(JSON.stringify(team), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Fehler beim Hinzufügen der Benutzer zum Team' }), { status: 500 });
  }
}
