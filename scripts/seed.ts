import { Prisma, Role } from '@prisma/client'
import { db } from 'api/src/lib/db'
import { v4 as uuidv4 } from 'uuid'

import { hashPassword } from '@redwoodjs/auth-dbauth-api'

import { setRandomAvatar } from '../api/src/lib/setRandomAvatar'

export default async () => {
  try {
    //
    // Manually seed via `yarn rw prisma db seed`
    // Seeds automatically with `yarn rw prisma migrate dev` and `yarn rw prisma migrate reset`
    //
    // Update "const data = []" to match your data model and seeding needs
    //
    const data: Prisma.UserCreateArgs['data'][] = [
      // To try this example data with the UserExample model in schema.prisma,
      // uncomment the lines below and run 'yarn rw prisma migrate dev'
      //
      // { name: 'alice', email: 'alice@example.com' },
      // { name: 'mark', email: 'mark@example.com' },
      // { name: 'jackie', email: 'jackie@example.com' },
      // { name: 'bob', email: 'bob@example.com' },
    ]
    console.log(
      "\nUsing the default './scripts/seed.{js,ts}' template\nEdit the file to add seed data\n"
    )

    // Note: if using PostgreSQL, using `createMany` to insert multiple records is much faster
    // @see: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#createmany
    await Promise.all(
      //
      // Change to match your data model and seeding needs
      //
      data.map(async (data: Prisma.UserCreateArgs['data']) => {
        const record = await db.user.createMany({ data })
        console.log(record)
      })
    )

    // If using dbAuth and seeding users, you'll need to add a `hashedPassword`
    // and associated `salt` to their record. Here's how to create them using
    // the same algorithm that dbAuth uses internally:

    const users = [
      {
        firstName: 'Martin',
        lastName: 'Frommel',
        email: 'martin@mixdock.co.uk',
        password: 'Enimyks1',
        role: Role.admin,
      },

    ]

    for (const user of users) {
      const randomNumber = uuidv4()
      const [hashedPassword, salt] = hashPassword(user.password)
      await db.user.createMany({
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.role,
          email: user.email,
          hashedPassword,
          salt,
          picture: setRandomAvatar(randomNumber),
        },
      })
    }
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
