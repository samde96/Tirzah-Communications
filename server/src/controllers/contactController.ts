import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

interface QuoteRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  message: string;
}

export const submitQuote = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, company, service, message }: QuoteRequest = req.body;

    // Validation
    if (!name || !email || !service || !message) {
      return res.status(400).json({
        error: 'Please provide all required fields: name, email, service, and message',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Please provide a valid email address',
      });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Quote Request from ${name}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>This message was sent from the Tirzah contact form</em></p>
      `,
      replyTo: email,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send auto-reply to customer
    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for your quote request - Tirzah',
      html: `
        <h2>Thank you for contacting Tirzah!</h2>
        <p>Dear ${name},</p>
        <p>We have received your quote request and will get back to you as soon as possible.</p>
        <p>Here's a summary of what you sent:</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong> ${message}</p>
        <br>
        <p>Best regards,<br>The Tirzah Team</p>
      `,
    };

    await transporter.sendMail(autoReplyOptions);

    res.status(200).json({
      success: true,
      message: 'Quote request submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting quote:', error);
    res.status(500).json({
      error: 'Failed to submit quote request. Please try again later.',
    });
  }
};
