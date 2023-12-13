import * as nodemailer from 'nodemailer'

interface Options {
  to: string | string[]
  subject: string
  text: string
  html: string
}

export async function sendEmail({ to, subject, text, html }: Options) {
  console.log('Sending email to:', to)

  if (
    !process.env.EMAIL_ADDRESS ||
    !process.env.EMAIL_API_KEY ||
    !process.env.SMTP_RELAY
  ) {
    throw new SyntaxError(
      'Email configuration environment variables are missing!'
    )
  }

  let transporter
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_RELAY,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_API_KEY,
      },
    })
  } catch (err) {
    console.error('Error initializing email transporter:', err.message)
    throw new SyntaxError('Error initializing email transporter:', err.message)
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
    console.error(err.message)
    throw new SyntaxError('Error sending email:' + err.message)
  }
}
