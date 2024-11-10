import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendTicketAssignmentEmail(email, ticket) {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `New Ticket Assigned: ${ticket.title}`,
        text: `You have been assigned a new ticket: ${ticket.title}. Details: ${ticket.description}`
    });
}
