import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    const { email, password } = await request.json();
    const user = await User.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return new Response(JSON.stringify({ token }), { status: 200 });
    }
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
}
