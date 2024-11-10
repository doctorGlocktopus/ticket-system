"use client";
// app/users/[id]/page.js
import { useEffect, useState } from 'react';

export default function UserPage({ params }) {
  const { id } = params; // Benutzer-ID aus den Parametern

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) throw new Error('Benutzer nicht gefunden');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUser();
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!user) return <p>Benutzer wird geladen...</p>;

  return (
    <div>
      <h1>{user.username}</h1>
      <p>Email: {user.email}</p>
      <p>Created At: {new Date(user.createdAt).toLocaleDateString()}</p>
      <h2>Teams</h2>
      <ul>
        {user.teams && user.teams.length > 0 ? (
          user.teams.map((team) => (
            <li key={team._id}>
              <strong>{team.name}</strong> (Created At: {new Date(team.createdAt).toLocaleDateString()})
            </li>
          ))
        ) : (
          <p>Der Benutzer gehört keinem Team an.</p>
        )}
      </ul>
    </div>
  );
}