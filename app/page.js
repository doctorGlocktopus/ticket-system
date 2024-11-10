// app/page.js
import Link from 'next/link';

export default function HomePage() {
    return (
        <div>
            <h1>Willkommen im Ticketsystem</h1>
            <nav>
                <ul>
                    <li><Link href="/login">Login</Link></li>
                    <li><Link href="/register">Registrieren</Link></li>
                    <li><Link href="/tickets">Tickets</Link></li>
                    <li><Link href="/teams">Teams</Link></li>
                </ul>
            </nav>
        </div>
    );
}
