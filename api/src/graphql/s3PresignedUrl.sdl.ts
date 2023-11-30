// api/src/graphql/s3PresignedUrl.sdl.js
/**
 * Defines the GraphQL schema for S3 presigned URL operations.
 */
export const schema = gql`
  type Query {
    getPresignedUrl(
      pregeneratedUrl: String
      fileType: String!
      fileName: String!
      user: UserInput!
    ): S3PresignedUrlResponse! @requireAuth
  }
  # This is a custom scalar that allows us to return a JSON object from a resolver.
  type Mutation {
    clearFileFromS3(filePath: String!, user: UserInput!): DeleteFileS3Response!
      @requireAuth
  }

  input UserInput {
    id: Int!
    firstName: String!
    lastName: String!
  }

  type S3PresignedUrlResponse {
    url: String!
    fields: JSONObject!
    folderKey: String!
  }

  type DeleteFileS3Response {
    ok: Boolean!
    error: String
  }
`
