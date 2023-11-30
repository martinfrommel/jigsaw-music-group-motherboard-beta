// api/src/graphql/s3PresignedUrl.sdl.js
/**
 * Defines the GraphQL schema for S3 presigned URL operations.
 */
export const schema = gql`
  type Query {
    getPresignedUrl(
      fileType: String!
      fileName: String!
      user: UserInput!
    ): PresignedUrlResponse! @requireAuth
  }
  # This is a custom scalar that allows us to return a JSON object from a resolver.
  type Mutation {
    deleteFile(fileName: String!, user: UserInput!): Boolean! @requireAuth
  }

  input UserInput {
    firstName: String!
    lastName: String!
  }

  type PresignedUrlResponse {
    url: String!
    fields: JSONObject!
  }

  type S3Response {
    ok: Boolean!
    error: String
  }
`
