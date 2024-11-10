"use client"; // Mark as a client-side component

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TicketPage({ params }) {
  const { id } = params; // Extract the dynamic `id` from the params
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/tickets/${id}`);
        if (!response.ok) {
          throw new Error('Fehler beim Laden des Tickets');
        }
        const data = await response.json();
        setTicket(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) { // Ensure id is available before making the fetch call
      fetchTicket();
    }
  }, [id]); // Refetch when `id` changes

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
      <p><strong>Status:</strong> {ticket.status}</p>
      <p><strong>Beschreibung:</strong> {ticket.description}</p>
      <p><strong>Erstellt am:</strong> {createdAtDate}</p>
    </div>
  );
}
