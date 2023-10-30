import * as nodemailer from 'nodemailer'

interface Options {
  to: string | string[]
  subject: string
  text: string
  html: string
}

export async function sendEmail({ to, subject, text, html }: Options) {
  console.log('Sending email to:', to)

  if (!process.env.SENDMAIL_ADDRESS || !process.env.BREVO_API_KEY) {
    return { error: 'Email configuration environment variables are missing' }
  }

  let transporter
  try {
    transporter = nodemailer.createTransport({
      host: 'smtp-relay.sendinblue.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SENDMAIL_ADDRESS,
        pass: process.env.BREVO_API_KEY,
      },
    })
  } catch (err) {
    console.error('Error initializing email transporter:', err.message)
    return { error: 'Failed to initialize email transporter' }
  }

  try {
    const info = await transporter.sendMail({
      from: 'Jigsaw Music Group <admin@jigsawmusicgroup.com>',
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      text,
      html,
    })

    return { success: true, info }
  } catch (err) {
    console.error('Error sending email:', err.message)
    return { error: 'Failed to send email' }
  }
}
