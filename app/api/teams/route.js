// app/api/teams/route.js
import mongooseConnect from '@/utils/mongooseConnect';
import Team from '@/models/Team';
import User from '@/models/User';

// POST-Route für das Erstellen eines Teams
export async function POST(request) {
  await mongooseConnect();

  const { name, userIds } = await request.json(); // Name des Teams und Benutzer-IDs

  if (!name || !userIds || userIds.length < 2) {
    return new Response(JSON.stringify({ error: 'Mindestens zwei Benutzer müssen ausgewählt werden.' }), { status: 400 });
  }

  try {
    // Überprüfe, ob alle Benutzer existieren
    const users = await User.find({ '_id': { $in: userIds } });

    if (users.length !== userIds.length) {
      return new Response(JSON.stringify({ error: 'Ein oder mehrere Benutzer existieren nicht.' }), { status: 400 });
    }

    // Erstelle das Team
    const newTeam = new Team({ name, members: userIds });
    await newTeam.save();

    // Rückgabe des neu erstellten Teams
    return new Response(JSON.stringify(newTeam), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// GET-Route für das Abrufen aller Teams
export async function GET(request) {
  await mongooseConnect();

  try {
    // Alle Teams aus der Datenbank abfragen
    const teams = await Team.find().populate('members'); // populate() um die Benutzerinformationen der Mitglieder zu laden
    return new Response(JSON.stringify(teams), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Fehler beim Abrufen der Teams.' }), { status: 500 });
  }
}
