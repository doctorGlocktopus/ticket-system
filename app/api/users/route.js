// app/api/users/route.js
import mongooseConnect from '@/utils/mongooseConnect';
import User from '@/models/User';
import Team from '@/models/Team';

export async function GET(request) {
  await mongooseConnect();

  try {
    // Alle Benutzer aus der Datenbank abrufen
    const users = await User.find()

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Fehler beim Abrufen der Benutzer' }), { status: 500 });
  }
}
