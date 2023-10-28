export const schema = gql`
  type Release {
    id: Int!
    userId: Int!
    songMasterReference: String!
    songTitle: String!
    productTitle: String
    artist: String!
    featuredArtist: String
    releaseDate: DateTime!
    previouslyReleased: Boolean!
    language: String!
    primaryGenre: String!
    secondaryGenre: String
    explicitLyrics: Boolean!
    isicUpcCode: String!
    pLine: String
    cLine: String
    length: Int!
    user: User!
  }

  type Query {
    releases: [Release!]! @requireAuth
    release(id: Int!): Release @requireAuth
    releasesPerUser(id: Int!, userId: Int!): Release @requireAuth
  }

  input CreateReleaseInput {
    userId: Int!
    songMasterReference: String!
    songTitle: String!
    productTitle: String
    artist: String!
    featuredArtist: String
    releaseDate: DateTime!
    previouslyReleased: Boolean!
    language: String!
    primaryGenre: String!
    secondaryGenre: String
    explicitLyrics: Boolean!
    isicUpcCode: String!
    pLine: String
    cLine: String
    length: Int!
  }

  input UpdateReleaseInput {
    userId: Int
    songMasterReference: String
    songTitle: String
    productTitle: String
    artist: String
    featuredArtist: String
    releaseDate: DateTime
    previouslyReleased: Boolean
    language: String
    primaryGenre: String
    secondaryGenre: String
    explicitLyrics: Boolean
    isicUpcCode: String
    pLine: String
    cLine: String
    length: Int
  }

  type Mutation {
    createRelease(input: CreateReleaseInput!): Release! @requireAuth
    updateRelease(id: Int!, input: UpdateReleaseInput!): Release! @requireAuth
    deleteRelease(id: Int!): Release! @requireAuth
  }
`

