// app/teams/page.js
"use client";
import { useState, useEffect } from 'react';

export default function TeamsPage() {
    const [teams, setTeams] = useState([]);
    const [name, setName] = useState('');

    useEffect(() => {
        fetch('/api/teams')
            .then(res => res.json())
            .then(data => setTeams(data))
            .catch(err => console.error('Fehler beim Laden der Teams:', err));
    }, []);

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/teams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        if (response.ok) {
            const newTeam = await response.json();
            setTeams([...teams, newTeam]);
            setName('');
        }
    };

    return (
        <div>
            <h1>Teams</h1>
            <ul>
                {teams.map(team => (
                    <li key={team._id}>{team.name}</li>
                ))}
            </ul>
            <form onSubmit={handleCreateTeam}>
                <input
                    type="text"
                    placeholder="Teamname"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button type="submit">Team erstellen</button>
            </form>
        </div>
    );
}
