// app/api/users/route.js
import mongooseConnect from '@/utils/mongooseConnect';
import User from '@/models/User';
import Team from '@/models/Team';

export async function GET(request) {
  await mongooseConnect();

  try {
    // Alle Benutzer aus der Datenbank abrufen
    const users = await User.find()
      .select('username email teams createdAt') // Wähle relevante Felder
      .populate({
        path: 'teams', // Populiere die Teams
        select: 'name members', // Wähle nur den Namen und die Mitglieder des Teams
        populate: {
          path: 'members', // Populiere die Mitglieder des Teams
          select: 'username', // Wähle nur den Benutzernamen des Mitglieds
        },
      });

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Fehler beim Abrufen der Benutzer' }), { status: 500 });
  }
}
