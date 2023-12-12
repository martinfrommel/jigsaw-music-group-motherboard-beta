import { Role } from '@prisma/client'
import { db } from 'api/src/lib/db'
import { v4 as uuidv4 } from 'uuid'

import { hashPassword, hashToken } from '@redwoodjs/auth-dbauth-api'

import { generateSignUpToken } from '../api/src/lib/auth/generateToken'
import { generateRandomPassword } from '../api/src/lib/auth/passwordUtils'
import { genericEmailTemplate } from '../api/src/lib/emails/emailTemplates/genericEmailTemplate'
import { sendEmail } from '../api/src/lib/emails/sendEmail'

export default async () => {
  const setRandomAvatar = () => {
    const seed = uuidv4()
    return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`
  }
  try {
    const users = [
      {
        firstName: 'Martin',
        lastName: 'Frommel',
        email: 'martin@mixdock.co.uk',
        role: Role.admin,
        picture: setRandomAvatar(),
      },
      // {
      //   firstName: 'Admin',
      //   email: 'admin@jigsawmusicgroup.com',
      //   Role: Role.admin,
      //   picture: setRandomAvatar(),

      // },
      // {
      //   firstName: 'Chris',
      //   lastName: 'Priest',
      //   email: 'chris@jigsawmusicgroup.com',
      //   Role: Role.admin,
      //   picture: setRandomAvatar(),

      // },
      // {
      //   firstName: 'Connor',
      //   lastName: 'Hunnisett',
      //   email: 'connor@jigsawmusicgroup.com',
      //   Role: Role.admin,
      //   picture: setRandomAvatar(),
      // },
    ]

    for (const user of users) {
      const tempPassword = generateRandomPassword()
      const [hashedTempPassword, tempSalt] = hashPassword(tempPassword)

      const generated = generateSignUpToken()
      const token = generated.token
      const expiration = generated.expiration

      // Create the user in the database
      await db.user.create({
        data: {
          ...user,
          hashedPassword: hashedTempPassword,
          salt: tempSalt,
          signUpToken: hashToken(token),
          signUpTokenExpiresAt: expiration,
        },
      })
      try {
        // Construct the email HTML using the generic template function
        const emailHTML = genericEmailTemplate({
          title: 'Set Your Password',
          heading: 'Set Your Password',
          paragraph: `${user.firstName}, an account has been created for you at Jigsaw Music Group, so that you can start submitting your releases. Click the button below to set up your password and get started.`,
          link: `${process.env.WEBSITE_URL}/set-password?token=${token}`,
          linkText: 'Set your password',
          disclaimer: 'If you did not request this email, please ignore it.',
        })

        // Send the email with the constructed HTML content
        await sendEmail({
          to: user.email,
          subject: 'Set Your Password',
          text: `Please set up your password by visiting the following link: ${process.env.WEBSITE_URL}/set-password?token=${token}`,
          html: emailHTML,
        })
      } catch (error) {
        throw new SyntaxError(`Failed to send email: ${error.message}`)
      }
    }
  } catch (error) {
    throw new Error(error)
  }
}
