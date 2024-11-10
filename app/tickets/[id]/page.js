"use client"; // Mark as a client-side component

import React, { useState, useEffect } from 'react'; // Explicitly import React
import { useRouter } from 'next/navigation'; // Import useRouter to get the dynamic `id`
import Link from 'next/link';

export default function TicketPage({ params }) {
  const { id } = params; // Extract the dynamic `id` from the params
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(''); // Local state to manage the status change
  const [userId, setUserId] = useState(''); // Local state to manage the selected user
  const [users, setUsers] = useState([]); // List of users to assign

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/tickets/${id}`);
        if (!response.ok) {
          throw new Error('Fehler beim Laden des Tickets');
        }
        const data = await response.json();
        setTicket(data);
        setStatus(data.status); // Initialize status from the fetched ticket
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users'); // Assume there's an endpoint to fetch users
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError('Fehler beim Laden der Benutzer');
      }
    };

    if (id) {
      fetchTicket();
      fetchUsers();
    }
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(`/api/tickets/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren des Status');
      }

      const updatedTicket = await response.json();
      setTicket(updatedTicket); // Update local state with the new ticket data
      setStatus(newStatus); // Update local status state
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAssignUser = async () => {
    try {
      const response = await fetch(`/api/tickets//assign/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Hinzufügen des Benutzers');
      }

      const updatedTicket = await response.json();
      setTicket(updatedTicket); // Update local state with the new ticket data
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <p>Ticket wird geladen...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!ticket) {
    return <p>Ticket nicht gefunden.</p>;
  }

  // Format the createdAt date
  const createdAtDate = new Date(ticket.createdAt).toLocaleString();

  return (
    <div>
      <h1>Ticket: {ticket.title}</h1>
      <p><strong>Priorität:</strong> {ticket.priority}</p>
      <p><strong>Status:</strong>
        <select value={status} onChange={(e) => handleStatusChange(e.target.value)}>
          <option value="Open">Offen</option>
          <option value="In Progress">In Bearbeitung</option>
          <option value="Closed">Geschlossen</option>
        </select>
      </p>
      <p><strong>Beschreibung:</strong> {ticket.description}</p>
      <p><strong>Erstellt am:</strong> {createdAtDate}</p>

      <h3>Benutzer hinzufügen</h3>
      <select onChange={(e) => setUserId(e.target.value)} value={userId}>
        <option value="">Wählen Sie einen Benutzer</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>{user.username}</option>
        ))}
      </select>
      <button onClick={handleAssignUser}>Benutzer zuweisen</button>
    </div>
  );
}
