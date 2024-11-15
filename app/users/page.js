"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Fehler beim Laden der Benutzer: ${response.statusText}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Benutzerliste</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Fehleranzeige */}

      {users.length === 0 ? (
        <p>Keine Benutzer gefunden.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <Link href={`/users/${user._id}`}>
                  <strong>{user.username}</strong>
              </Link> 
              - {user.email}
              <br />
              <strong>Teams:</strong> 
              {user.teams.length > 0 ? (
                <ul>
                  {user.teams.map((team) => (
                    <li key={team._id}>
                      <strong>{team.name}</strong> - Mitglieder:
                      <ul>
                        {team.members.map((member) => (
                          <li key={member._id}>
                            <Link href={`/users/${member._id}`}>
                              <a><strong>{member.username}</strong></a>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <span>Keine Teams</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
