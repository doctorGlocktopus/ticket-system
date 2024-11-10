"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Select from 'react-select';

export default function TeamPage({ params }) {
  const { id } = params;
  const [team, setTeam] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]); // Users to select from
  const [selectedUsers, setSelectedUsers] = useState([]); // Users to add to team

  // Load team details and users for selection
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`/api/teams/${id}`);
        if (!response.ok) {
          throw new Error('Fehler beim Laden des Teams');
        }
        const data = await response.json();
        setTeam(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

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

    fetchTeam();
    fetchUsers();
  }, [id]);

  // Add selected users to the team
  const handleAddUsersToTeam = async () => {
    if (selectedUsers.length < 1) {
      setError('Mindestens ein Benutzer muss ausgewählt werden.');
      return;
    }

    try {
      const response = await fetch(`/api/teams/${id}/add-users`, {
        method: 'POST', // POST used for adding users to the team
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIds: selectedUsers.map(user => user.value),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Fehler beim Hinzufügen der Benutzer');
      } else {
        const updatedTeam = await response.json();
        setTeam(updatedTeam); // Update team state with new members
        setSelectedUsers([]); // Reset selected users
      }
    } catch (error) {
      setError('Fehler beim Hinzufügen der Benutzer');
      console.error(error);
    }
  };

  if (loading) {
    return <p>Team wird geladen...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!team) {
    return <p>Team nicht gefunden.</p>;
  }

  // Styling for react-select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: '100%', 
      minHeight: '40px',
    }),
    menu: (provided) => ({
      ...provided,
      maxHeight: '300px',
      overflowY: 'auto',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e1e1e1',
    }),
  };

  return (
    <div>
      <h1>Team: {team.name}</h1>
      <h2>Mitglieder:</h2>
      <ul>
        {team.members.map((member) => (
          <li key={member._id}>
            <Link href={`/users/${member._id}`}>
              <strong>{member.username}</strong>
            </Link>
          </li>
        ))}
      </ul>

      <h3>Benutzer zu diesem Team hinzufügen</h3>
      <Select
        isMulti
        options={users}
        value={selectedUsers}
        onChange={setSelectedUsers}
        placeholder="Wähle Benutzer"
        styles={customStyles}
      />

      <button onClick={handleAddUsersToTeam}>Benutzer hinzufügen</button>
    </div>
  );
}
