"use client";
import { useState, useEffect } from 'react';
import Select from 'react-select';
import Link from 'next/link';

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'Low',
    status: 'Open',
    assignedUsers: [],
  });

  const [userOptions, setUserOptions] = useState([]); // To store the list of users for assignment

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/tickets', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Fehler beim Laden der Tickets: ${response.statusText}`);
        }

        const data = await response.json();
        setTickets(data);
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    };

    fetchTickets();

    const fetchUserOptions = async () => {
      try {
        const response = await fetch('/api/users', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          const userOptions = data.map(user => ({
            value: user._id,
            label: user.username,
          }));
          setUserOptions(userOptions);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Benutzer:', error);
      }
    };

    fetchUserOptions();
  }, []);

  const handleTicketChange = (e) => {
    const { name, value } = e.target;
    setNewTicket((prevTicket) => ({
      ...prevTicket,
      [name]: value,
    }));
  };

  const handleAssignedUsersChange = (selectedOptions) => {
    setNewTicket((prevTicket) => ({
      ...prevTicket,
      assignedUsers: selectedOptions.map(option => option.value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTicket),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Ticket erstellt:', data);
        setNewTicket({
          title: '',
          description: '',
          priority: 'Low',
          status: 'Open',
          assignedUsers: [],
        }); // Reset form
      } else {
        throw new Error('Fehler beim Erstellen des Tickets');
      }
    } catch (error) {
      setError(error.message);
      console.error('Fehler:', error);
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
      <h1>Ticketliste</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Fehleranzeige */}

      {tickets.length === 0 ? (
        <p>Keine Tickets gefunden.</p>
      ) : (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket._id}>
              <Link href={`/tickets/${ticket._id}`}>
                <strong>{ticket.title}</strong>
              </Link>
              <br />
              <em>{ticket.priority} - {ticket.status}</em>
              <p>{ticket.description}</p>
              <p><strong>Erstellt am:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>

              <strong>Zugewiesene Benutzer:</strong>
              <ul>
                {ticket.assignedUsers.map((assignedUser) => (
                  <li key={assignedUser._id}>
                    <Link href={`/users/${assignedUser._id}`}>
                      <a>{assignedUser.username}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}

      {/* Ticket Erstellungsformular */}
      <h2>Neues Ticket erstellen</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={newTicket.title}
            onChange={handleTicketChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={newTicket.description}
            onChange={handleTicketChange}
            required
          />
        </div>
        <div>
          <label>Priority:</label>
          <select
            name="priority"
            value={newTicket.priority}
            onChange={handleTicketChange}
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
        <div>
          <label>Status:</label>
          <select
            name="status"
            value={newTicket.status}
            onChange={handleTicketChange}
            required
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div>
          <label>Assigned Users:</label>
          {userOptions.length > 0 ? (
            <Select
              isMulti
              options={userOptions}
              value={userOptions.filter(option => newTicket.assignedUsers.includes(option.value))}
              onChange={handleAssignedUsersChange}
              placeholder="Wähle Benutzer"
              styles={customStyles}
            />
          ) : (
            <p>Keine Benutzer verfügbar.</p>
          )}
        </div>
        <button type="submit">Ticket erstellen</button>
      </form>
    </div>
  );
}
