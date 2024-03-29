import type {
  QueryResolvers,
  MutationResolvers,
  UserRelationResolvers,
} from 'types/graphql'

import { hashPassword, hashToken } from '@redwoodjs/auth-dbauth-api'
import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
  ValidationError,
} from '@redwoodjs/graphql-server'

import { generateSignUpToken } from 'src/lib/auth/generateToken'
import { generateRandomPassword } from 'src/lib/auth/passwordUtils'
import { db } from 'src/lib/db'
import { genericEmailTemplate } from 'src/lib/emails/emailTemplates/genericEmailTemplate'
import { sendEmail } from 'src/lib/emails/sendEmail'

export const getRoles: QueryResolvers['getRoles'] = () => {
  return ['user', 'admin', 'moderator']
}

/**
 * Retrieves a list of users.
 *
 * @returns {Promise<User[]>} A promise that resolves to an array of User objects.
 * @throws {ForbiddenError} If the logged-in user is not an admin.
 */
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

/**
 * Retrieves a user based on the provided ID.
 *
 * @param {object} args - The arguments for the query resolver.
 * @param {string} args.id - The ID of the user to retrieve.
 * @param {object} context - The context object containing the current user information.
 * @param {object} context.currentUser - The currently logged-in user.
 * @returns {Promise<User>} - A promise that resolves to the user object.
 * @throws {ForbiddenError} - If the requested user is not the logged-in user and the logged-in user is not an admin.
 */
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

/**
 * Creates a new user.
 * @param input - The user input data.
 * @returns The created user.
 * @throws ForbiddenError if the current user does not have admin privileges.
 */
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

/**
 * Creates a new user with admin privileges.
 *
 * @param input - The input data for creating the user.
 * @returns The created user.
 * @throws {AuthenticationError} If the current user is not an admin.
 * @throws {ValidationError} If a unique token cannot be generated after multiple attempts.
 * @throws {ValidationError} If a user with the same email already exists.
 * @throws {SyntaxError} If there is an unexpected error while creating the user or sending the email.
 */
export const adminCreateUser: MutationResolvers['adminCreateUser'] = async ({
  input,
}) => {
  // Check if the user is an admin
  if (!context.currentUser || !context.currentUser.roles.includes('admin')) {
    throw new AuthenticationError('Only admins can create users.')
  }

  let user
  let token: string
  let expiration

  const maxTokenGenerationAttempts = 5
  let attempt = 0

  // Generate a unique reset token for the user
  while (attempt < maxTokenGenerationAttempts) {
    const generated = generateSignUpToken()
    token = generated.token
    expiration = generated.expiration

    // Check if the token already exists in the database
    const existingUserWithToken = await db.user.findUnique({
      where: { signUpToken: token },
    })

    if (existingUserWithToken) {
      console.log(
        'A user with this token already exists. Generating a new one.'
      )
    }

    if (!existingUserWithToken) {
      // Token is unique, break out of loop
      break
    }

    attempt += 1

    if (attempt === maxTokenGenerationAttempts) {
      throw new ValidationError(
        'Failed to generate a unique token after multiple attempts.'
      )
    }
  }
  const tempPassword = generateRandomPassword()
  const [hashedTempPassword, tempSalt] = hashPassword(tempPassword)

  try {
    // Create the user in the database
    user = await db.user.create({
      data: {
        ...input,
        hashedPassword: hashedTempPassword,
        salt: tempSalt,
        signUpToken: hashToken(token),
        signUpTokenExpiresAt: expiration,
      },
    })
  } catch (error) {
    // Check if the error is a unique constraint violation
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      throw new ValidationError('A user with this email already exists.')
    } else {
      // Log the error or handle other types of errors as needed
      console.error('Error creating user:', error)
      throw new SyntaxError('Failed to create user due to an unexpected error.')
    }
  }
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
      to: input.email,
      subject: 'Set Your Password',
      text: `Please set up your password by visiting the following link: ${process.env.WEBSITE_URL}/set-password?token=${token}`,
      html: emailHTML,
    })
  } catch (error) {
    throw new SyntaxError(`Failed to send email: ${error.message}`)
  }

  return user
}

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

export const updateUserPassword: MutationResolvers['updateUserPassword'] =
  async ({ id, input }) => {
    const { oldPassword, newPassword } = input

    // Fetch the user's current hashed password and salt from the database and
    const user = await db.user.findUnique({ where: { id: parseInt(id, 10) } })
    if (!user) {
      throw new UserInputError('User not found')
    }

    // Re-hash the old password with the stored salt
    const [rehashedOldPassword] = hashPassword(oldPassword, { salt: user.salt })

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

// Signup token validation
/**
 * Validates the sign-up token.
 *
 * @param signUpToken - The sign-up token to validate.
 * @returns A boolean indicating whether the token is valid or not.
 * @throws UserInputError if an error occurs during the validation process.
 */
export const validateSignUpToken: QueryResolvers['validateSignUpToken'] =
  async ({ signUpToken }) => {
    try {
      const hashedToken = hashToken(signUpToken)

      const user = await db.user.findUnique({
        where: { signUpToken: hashedToken },
      })
      console.log(signUpToken + hashedToken)
      if (!user) {
        return false // Instead of throwing an error, return false
      }

      const currentDate = new Date()
      if (currentDate > user.signUpTokenExpiresAt) {
        return false // Instead of throwing an error, return false
      }

      // ... any other logic related to token validation

      return true // Return true if all checks pass
    } catch (error) {
      console.log(signUpToken)
      throw new UserInputError(
        'Something went wrong... please contact the admin'
      )
    }
  }

/**
 * Sets the password for a user using a provided token.
 * @param token - The token used to verify the user's identity.
 * @param newPassword - The new password to set for the user.
 * @returns The updated user object.
 * @throws {SyntaxError} If the provided token does not match the user's signUpToken.
 * @throws {UserInputError} If the token is invalid or expired.
 */
export const setUserPassword: MutationResolvers['setUserPassword'] = async ({
  token,
  newPassword,
}) => {
  // Hash the provided token
  const hashedToken = hashToken(token)

  console.log('Original token: ' + token)
  console.log('Hashed token: ' + hashedToken)
  // Find the user by the hashed token and ensure the token hasn't expired
  const user = await db.user.findFirst({
    where: {
      signUpToken: hashedToken,
    },
  })

  if (hashedToken !== user.signUpToken) {
    throw new SyntaxError('The tokens do not match!')
  }
  // If no user is found or the token is expired, throw an error
  if (!user) {
    throw new UserInputError('Invalid or expired token')
  }
  const currentDate = new Date()
  if (currentDate > user.signUpTokenExpiresAt) {
    throw new UserInputError('The token has expired!') // Instead of throwing an error, return false
  }

  // Hash the new password
  const [hashedNewPassword, newSalt] = hashPassword(newPassword)

  // Update the user's hashedPassword, salt, and clear the signUpToken and signUpTokenExpiresAt
  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      hashedPassword: hashedNewPassword,
      salt: newSalt,
      signUpToken: null,
      signUpTokenExpiresAt: null,
    },
  })

  // Return the updated user
  return updatedUser
}
