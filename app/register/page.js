// app/register/page.js
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });
        if (response.ok) {
            router.push('/login');
        } else {
            alert('Registrierung fehlgeschlagen!');
        }
    };

    return (
        <div>
            <h1>Registrieren</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nutzername" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Registrieren</button>
            </form>
        </div>
    );
}
