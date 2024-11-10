"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TicketPage() {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await fetch('/api/tickets', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      try {
        const res = await fetch('/api/tickets');
        if (!res.ok) {
          throw new Error(`Fehler beim Laden der Tickets: ${res.statusText}`);
        }
        const data = await res.json();
        setTickets(data);
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    };
    fetchTickets();
  }, []);
  

  // Ticket erstellen
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority })
      });

      if (!response.ok) {
        throw new Error('Fehler beim Erstellen des Tickets');
      }

      const ticket = await response.json();
      setTickets([...tickets, ticket]); // Füge das neue Ticket zur Liste hinzu
      setTitle(''); // Leere das Eingabefeld
      setDescription(''); // Leere das Eingabefeld
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Ticketsystem</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Fehleranzeige */}

      <form onSubmit={handleCreateTicket}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beschreibung"
          required
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
        <button type="submit">Ticket erstellen</button>
      </form>

      <h2>Tickets</h2>
      <ul>
      {tickets.map((ticket) => (
        <li key={ticket._id}>
          <Link href={`/tickets/${ticket._id}`}>{ticket.title} - {ticket.priority}</Link>
        </li>
      ))}
      </ul>
    </div>
  );
}
