import type {
  QueryResolvers,
  MutationResolvers,
  UserRelationResolvers,
} from 'types/graphql'

import { hashPassword } from '@redwoodjs/auth-dbauth-api'

import { db } from 'src/lib/db'

export const users: QueryResolvers['users'] = () => {
  return db.user.findMany()
}

export const user: QueryResolvers['user'] = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const createUser: MutationResolvers['createUser'] = ({ input }) => {
  return db.user.create({
    data: input,
  })
}

export const updateUser: MutationResolvers['updateUser'] = ({ id, input }) => {
  return db.user.update({
    data: input,
    where: { id },
  })
}

export const deleteUser: MutationResolvers['deleteUser'] = ({ id }) => {
  return db.user.delete({
    where: { id },
  })
}

export const User: UserRelationResolvers = {
  releases: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).releases()
  },
}

export const updateUserPassword = async ({ id, input }) => {
  const { oldPassword, newPassword } = input;

  // Fetch the user's current hashed password and salt from the database
  const user = await db.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error('User not found');
  }

  // Re-hash the old password with the stored salt
  const [rehashedOldPassword] = hashPassword(oldPassword, user.salt);

  // Verify the old password by comparing the re-hashed old password to the stored hashed password
  if (rehashedOldPassword !== user.hashedPassword) {
    throw new Error('Incorrect old password');
  }

  // Hash the new password
  const [hashedPassword, salt] = hashPassword(newPassword);

  // Update the user's password in the database
  return db.user.update({
    data: {
      hashedPassword,
      salt,
    },
    where: { id },
  });
}
