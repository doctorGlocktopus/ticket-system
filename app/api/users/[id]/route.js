// /app/api/users/[id]/route.js
import mongooseConnect from '@/utils/mongooseConnect';
import User from '@/models/User';
import Team from '@/models/Team';

export async function GET(request, { params }) {
  const { id } = await params; // Wir stellen sicher, dass wir auf die asynchronen `params` zugreifen

  if (!id) {
    return new Response(JSON.stringify({ error: 'Benutzer-ID fehlt' }), { status: 400 });
  }

  await mongooseConnect(); // Stelle sicher, dass die Verbindung zur DB hergestellt ist

  try {
    // Den Benutzer finden
    const user = await User.findById(id);

    // Wenn der Benutzer nicht gefunden wurde
    if (!user) {
      return new Response(JSON.stringify({ error: 'Benutzer nicht gefunden' }), { status: 404 });
    }

    // Suche nach allen Teams, in denen der Benutzer Mitglied ist
    const teams = await Team.find({ members: id });

    // Manuell die Teams zum Benutzer hinzufügen
    user.teams = teams;

    // Gebe den Benutzer mit den Teams zurück
    return new Response(JSON.stringify(user), { status: 200 });

  } catch (error) {
    console.error('Fehler beim Abrufen des Benutzers:', error);
    return new Response(JSON.stringify({ error: 'Fehler beim Abrufen des Benutzers' }), { status: 500 });
  }
}
