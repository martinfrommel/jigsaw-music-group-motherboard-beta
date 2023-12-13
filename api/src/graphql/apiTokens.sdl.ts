export const schema = gql`
  type ApiToken {
    id: Int!
    accessToken: String!
    refreshToken: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    accessTokenExpiresAt: DateTime
    refreshTokenExpiresAt: DateTime
  }

  type Query {
    apiTokens: [ApiToken!]! @requireAuth(roles: ["admin"])
    apiToken(id: Int!): ApiToken @requireAuth(roles: ["admin"])
  }

  input CreateApiTokenInput {
    accessToken: String!
    refreshToken: String!
    accessTokenExpiresAt: DateTime
    refreshTokenExpiresAt: DateTime
  }

  input UpdateApiTokenInput {
    accessToken: String
    refreshToken: String
    accessTokenExpiresAt: DateTime
    refreshTokenExpiresAt: DateTime
  }

  type Mutation {
    createApiToken(input: CreateApiTokenInput!): ApiToken!
      @requireAuth(roles: ["admin"])
    updateApiToken(id: Int!, input: UpdateApiTokenInput!): ApiToken!
      @requireAuth(roles: ["admin"])
    deleteApiToken(id: Int!): ApiToken! @requireAuth(roles: ["admin"])
  }
`
