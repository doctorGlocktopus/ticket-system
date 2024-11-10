"use client";
import { useState, useEffect } from 'react';
import Select from 'react-select';
import Link from 'next/link';

export default function CreateTeamPage() {
  const [users, setUsers] = useState([]); // Benutzer aus der Datenbank
  const [selectedUsers, setSelectedUsers] = useState([]); // Ausgewählte Benutzer
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]); // Alle Teams
  const [loading, setLoading] = useState(true); // Lade-Status für Teams

  // Benutzer laden
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        const userOptions = data.map(user => ({
          value: user._id,
          label: user.username,
        }));
        setUsers(userOptions);
      } catch (error) {
        console.error('Fehler beim Laden der Benutzer:', error);
      }
    };
    fetchUsers();
  }, []);

  // Alle Teams beim Start der Komponente laden
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/teams');
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Teams');
        }
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        setError('Fehler beim Laden der Teams');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedUsers.length < 2) {
      setError('Mindestens zwei Benutzer müssen ausgewählt werden.');
      return;
    }

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: teamName,
          userIds: selectedUsers.map(user => user.value),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Fehler beim Erstellen des Teams');
      } else {
        const newTeam = await response.json();
        alert('Team erstellt: ' + newTeam.name);
        // Team zu der Liste hinzufügen
        setTeams([...teams, newTeam]);
      }
    } catch (error) {
      setError('Fehler beim Erstellen des Teams');
      console.error(error);
    }
  };

  // Styling für react-select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: '100%', // Setzt die Breite des Select-Feldes
      minHeight: '40px', // Stellt sicher, dass das Feld eine ausreichende Höhe hat
    }),
    menu: (provided) => ({
      ...provided,
      maxHeight: '300px', // Maximale Höhe des Dropdowns
      overflowY: 'auto', // Ermöglicht das Scrollen, wenn mehr als 5 Elemente vorhanden sind
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e1e1e1', // Beispiel für das Styling von ausgewählten Werten
    }),
  };

  return (
    <div>
      <h1>Team erstellen</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Fehleranzeige */}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Teamname</label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
            placeholder="Name des Teams"
          />
        </div>

        <div>
          <label>Benutzer hinzufügen</label>
          <Select
            isMulti
            options={users}
            value={selectedUsers}
            onChange={setSelectedUsers}
            placeholder="Wähle Benutzer"
            required
            styles={customStyles} // Wendet das benutzerdefinierte Styling an
          />
        </div>

        <button type="submit">Team erstellen</button>
      </form>

      <h2>Bereits erstellte Teams</h2>
      {loading ? (
        <p>Teams werden geladen...</p>
      ) : (
        <ul>
          {teams.map((team) => (
            <li key={team._id}>
              <Link href={`/teams/${team._id}`}><strong>{team.name}</strong> - Mitglieder: {team.members.map(member => member.username).join(', ')}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
