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
    apiTokens: [ApiToken!]! @requireAuth
    apiToken(id: Int!): ApiToken @requireAuth
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
    createApiToken(input: CreateApiTokenInput!): ApiToken! @requireAuth
    updateApiToken(id: Int!, input: UpdateApiTokenInput!): ApiToken!
      @requireAuth
    deleteApiToken(id: Int!): ApiToken! @requireAuth
  }
`
