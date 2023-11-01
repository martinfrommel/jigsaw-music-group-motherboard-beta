export const schema = gql`
  enum Role {
    user
    admin
    moderator
  }

  type User {
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
    hashedPassword: String!
    salt: String!
    resetToken: String
    resetTokenExpiresAt: DateTime
    roles: Role!
    releases: [Release]!
    picture: String!
  }

  type Query {
    users: [User!]! @requireAuth(roles: ["admin", "moderator"])
    user(id: Int!): User @requireAuth
    userByName(firstName: String!, lastName: String!): User @requireAuth
    getRoles(roles: Role): User @requireAuth
  }

  input CreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
    hashedPassword: String!
    salt: String!
    resetToken: String
    resetTokenExpiresAt: DateTime
    roles: Role!
    picture: String
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    email: String
    hashedPassword: String
    salt: String
    resetToken: String
    resetTokenExpiresAt: DateTime
    roles: Role
    picture: String
  }

  input UpdatePasswordInput {
    oldPassword: String!
    newPassword: String!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
      @requireAuth(roles: ["admin", "moderator"])
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth(roles: ["admin", "moderator"])
    updateUserPassword(id: String!, input: UpdatePasswordInput!): User!
      @requireAuth
  }
`
