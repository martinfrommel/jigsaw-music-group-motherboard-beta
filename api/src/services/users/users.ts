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

export const updateUser: MutationResolvers['updateUser'] = ({ id, input }) => {
  // Protect against unauthorised queries
  const currentUser = context.currentUser
  if (id !== currentUser.id && currentUser.roles !== 'admin') {
    throw new ForbiddenError('You do not have the privileges to do this .')
  }
  return db.user.update({
    data: input,
    where: { id },
  })
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
