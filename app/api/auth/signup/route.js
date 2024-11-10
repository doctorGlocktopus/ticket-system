import User from '@/models/User';
import bcrypt from 'bcryptjs';
import mongooseConnect from '@/utils/mongooseConnect';

export async function POST(request) {
    await mongooseConnect();
    const { username, email, password } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
}
