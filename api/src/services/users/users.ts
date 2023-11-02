import type {
  QueryResolvers,
  MutationResolvers,
  UserRelationResolvers,
} from 'types/graphql'

import { hashPassword } from '@redwoodjs/auth-dbauth-api'
import {
  ForbiddenError,
  UserInputError,
  ValidationError,
} from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

export const users: QueryResolvers['users'] = () => {
  const currentUser = context.currentUser
  // If the requested user is not the logged-in user and the logged-in user is not an admin
  if (currentUser.roles !== 'admin') {
    throw new ForbiddenError(
      'You do not have the privileges to access this data.'
    )
  }
  return db.user.findMany()
}

export const user: QueryResolvers['user'] = ({ id }) => {
  // Protect against unauthorised queries
  const currentUser = context.currentUser

  // If the requested user is not the logged-in user and the logged-in user is not an admin
  if (id !== currentUser.id && currentUser.roles !== 'admin') {
    throw new ForbiddenError(
      'You do not have the privileges to access this data.'
    )
  }

  return db.user.findUnique({
    where: { id },
  })
}

export const createUser: MutationResolvers['createUser'] = ({ input }) => {
  // Protect against unauthorised queries
  const currentUser = context.currentUser.roles
  if (currentUser !== 'admin') {
    throw new ForbiddenError('You do not have the privileges to do this .')
  }

  return db.user.create({
    data: input,
  })
}

// export const adminCreateUser: MutationResolvers['adminCreateUser'] = async ({
//   input,
// }) => {
//   // Check if the user is an admin
//   if (!context.currentUser || !context.currentUser.roles.includes('admin')) {
//     throw new AuthenticationError('Only admins can create users.')
//   }

//   let user
//   let token: string
//   let expiration

//   const maxTokenGenerationAttempts = 5
//   let attempt = 0

//   // Generate a unique reset token for the user
//   while (attempt < maxTokenGenerationAttempts) {
//     const generated = generateSignUpToken()
//     token = generated.token
//     expiration = generated.expiration

//     // Check if the token already exists in the database
//     const existingUserWithToken = await db.user.findUnique({
//       where: { signUpToken: token },
//     })

//     if (!existingUserWithToken) {
//       // Token is unique, break out of loop
//       break
//     }

//     attempt += 1

//     if (attempt === maxTokenGenerationAttempts) {
//       throw new ValidationError(
//         'Failed to generate a unique token after multiple attempts.'
//       )
//     }
//   }

//   try {

//     // Create the user in the database
//     user = await db.user.create({
//       data: {
//         ...input,
//         hashedPassword: await hashPassword(tempPassword),  // You'll need to implement hashPassword function.
//         salt: generateSalt(), // You'll need to implement generateSalt function.
//         signUpToken: token,
//         signUpTokenExpiresAt: expiration,
//       },
//     })
//   } catch (error) {
//     throw new SyntaxError(`Failed to create user: ${error.message}`)
//   }

//   try {
//     // Send the email to the user to set their password
//     sendEmail({
//       to: input.email,
//       subject: 'Set Your Password',
//       text: '',
//       html: `Click the link to set your password: ${process.env.WEBSITE_URL}/set-password?token=${token}`,
//     })
//   } catch (error) {
//     throw new SyntaxError(`Failed to send email: ${error.message}`)
//   }

//   return user
// }

export const deleteUser: MutationResolvers['deleteUser'] = ({ id }) => {
  // Protect against unauthorised queries
  const currentUser = context.currentUser
  if (id !== currentUser.id && currentUser.roles !== 'admin') {
    throw new ForbiddenError('You do not have the privileges to do this .')
  }
  return db.user.delete({
    where: { id },
  })
}

export const User: UserRelationResolvers = {
  releases: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).releases()
  },
}

// A function to update the user password securely. Uses the ChangePasswordForm

export const updateUserPassword = async ({ id, input }) => {
  const { oldPassword, newPassword } = input

  // Fetch the user's current hashed password and salt from the database and
  const user = await db.user.findUnique({ where: { id: parseInt(id, 10) } })
  if (!user) {
    throw new UserInputError('User not found')
  }

  // Re-hash the old password with the stored salt
  const [rehashedOldPassword] = hashPassword(oldPassword, user.salt)

  // Verify the old password by comparing the re-hashed old password to the stored hashed password
  if (rehashedOldPassword !== user.hashedPassword) {
    throw new ValidationError('Incorrect old password')
  }

  // Hash the new password
  const [hashedPassword, salt] = hashPassword(newPassword)

  // Update the user's password in the database
  return db.user.update({
    data: {
      hashedPassword,
      salt,
    },
    where: { id: parseInt(id, 10) },
  })
}
