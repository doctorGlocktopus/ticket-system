"use client"; // Mark as a client-side component

import React, { useState, useEffect } from 'react'; // Explicitly import React
import { useRouter } from 'next/navigation'; // Import useRouter to get the dynamic `id`
import Link from 'next/link';

export default function TicketPage({ params }) {
  const { id } = React.use(params);
  
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);
  const [loadingTicket, setLoadingTicket] = useState(true); // Für das Ticket
  const [loadingUsers, setLoadingUsers] = useState(true); // Für die Benutzer
  const [status, setStatus] = useState('');
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]);

  // Daten für das Ticket und die Benutzer laden
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/tickets/${id}`);
        if (!response.ok) {
          throw new Error('Fehler beim Laden des Tickets');
        }
        const data = await response.json();
        setTicket(data);
        setStatus(data.status);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingTicket(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError('Fehler beim Laden der Benutzer');
      } finally {
        setLoadingUsers(false);
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
      setTicket(updatedTicket);
      setStatus(newStatus);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAssignUser = async () => {
    try {
      const response = await fetch(`/api/tickets/assign/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Hinzufügen des Benutzers');
      }

      const updatedTicket = await response.json();
      setTicket(updatedTicket);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loadingTicket || loadingUsers) {
    return <p>Lade Daten...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!ticket) {
    return <p>Ticket nicht gefunden.</p>;
  }

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

      <h3>Zugewiesene Benutzer</h3>
      {ticket.assignedUsers && ticket.assignedUsers.length > 0 ? (
        <ul>
          {ticket.assignedUsers.map((userId, index) => {
            const assignedUser = users.find(user => user._id === userId);
            return assignedUser ? (
              <li key={assignedUser._id}>{assignedUser.username}</li>
            ) : (
              <li key={index}>Benutzer nicht gefunden</li>
            );
          })}
        </ul>
      ) : (
        <p>Keine Benutzer zugewiesen</p>
      )}
    </div>
  );
}
