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
    signUpToken: String
    signUpTokenExpiresAt: DateTime
    createdAt: DateTime
  }

  type Query {
    users: [User!]! @requireAuth(roles: ["admin", "moderator"])
    user(id: Int!): User @requireAuth
    userByName(firstName: String!, lastName: String!): User @requireAuth
    getRoles: [Role!]! @requireAuth(roles: ["admin", "moderator"])
    validateSignUpToken(signUpToken: String!): Boolean! @skipAuth
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

  # This is for when an Admin creates a user (main way of signing up on this page)
  input AdminCreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
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

  input SetUserPasswordInput {
    token: String!
    newPassword: String!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @skipAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth(roles: ["admin", "moderator"])
    updateUserPassword(id: String!, input: UpdatePasswordInput!): User!
      @requireAuth
    adminCreateUser(input: AdminCreateUserInput!): User!
      @requireAuth(roles: ["admin", "moderator"])
    setUserPassword(token: String!, newPassword: String!): User! @skipAuth
  }
`
