export const schema = gql`
  enum PrimaryGenre {
    Alternative
    Blues
    ChildrensMusic
    Classical
    Comedy
    Country
    Dance
    Electronic
    HipHopRap
    Holiday
    Jazz
    Latino
    NewAge
    Pop
    RB
    Reggae
    Rock
    SingerSongwriter
    Soundtrack
    World
  }

  enum SecondaryGenre {
    AlternativeIndieRock
    DanceBreakbeat
    DanceElectroHouse
    DanceHouse
    DanceTechno
    ElectronicAmbient
    ElectronicElectronica
    ElectronicExperimental
    HipHopRapAlternativeRap
    HolidayChristmas
    LatinRegionalMexicano
    LatinSalsa
    PopAdultContemporary
    PopKPop
    PopPopRock
    PopSoftRock
    RBSoulFunk
    RockMetal
    WorldAfroBeat
  }
  type Release {
    id: Int!
    userId: Int!
    AWSFolderKey: String!
    songMasterReference: String!
    songArtworkReference: String!
    songTitle: String!
    productTitle: String
    artist: String!
    featuredArtist: String
    releaseDate: DateTime
    previouslyReleased: Boolean!
    language: String!
    primaryGenre: PrimaryGenre!
    secondaryGenre: SecondaryGenre
    explicitLyrics: Boolean!
    iscUpcCode: String!
    pLine: String
    cLine: String
    length: Int
    labelId: Int!
    label: Label!
    user: User!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Label {
    id: Int!
    name: String!
  }

  type Query {
    releases: [Release!]! @requireAuth(roles: ["admin", "moderator"])
    release(id: Int!, userId: Int!): Release @requireAuth
    releasesPerUser(userId: Int!): [Release!]! @requireAuth
    getPrimaryGenres: [PrimaryGenre!]! @requireAuth
    getSecondaryGenres: [SecondaryGenre!]! @requireAuth
  }

  input CreateReleaseInput {
    userId: Int!
    songMasterReference: String!
    songArtworkReference: String!
    AWSFolderKey: String!
    metadata: MetadataInput!
  }

  input MetadataInput {
    songTitle: String!
    productTitle: String
    artist: String!
    featuredArtist: String
    releaseDate: DateTime
    previouslyReleased: Boolean!
    language: String!
    primaryGenre: PrimaryGenre!
    secondaryGenre: SecondaryGenre
    explicitLyrics: Boolean!
    iscUpcCode: String
    pLine: String
    cLine: String
    label: LabelInput!
  }

  input LabelInput {
    name: String!
    id: String!
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
    primaryGenre: PrimaryGenre
    secondaryGenre: SecondaryGenre
    explicitLyrics: Boolean
    iscUpcCode: String
    pLine: String
    cLine: String
    length: Int
  }

  type Mutation {
    createRelease(input: CreateReleaseInput!): Boolean! @requireAuth
    updateRelease(id: Int!, input: UpdateReleaseInput!): Release!
      @requireAuth(roles: ["admin"])
    deleteRelease(id: Int!, userId: Int!): Release!
      @requireAuth(roles: ["admin"])
  }
`
