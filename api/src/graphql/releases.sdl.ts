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
    Folk
    HipHopRap
    Holiday
    Jazz
    Latin
    NewAge
    Pop
    RBSoul
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

  enum IngestionStatus {
    pending
    processing
    complete
    error
  }

  enum ParticipantRole {
    Vocalist
    Producer
    Remixer
    Mixer
    Composer
    Conductor
    Soloist
    Performer
    Arranger
    SongWriter
    Engineer
    MasteringEngineer
    Choir
    Orchestra
    Ensemble
    Lyricist
    Publicist
    Other
  }
  type Release {
    id: Int!
    userId: Int!
    AWSFolderKey: String!
    songMasterReference: String!
    songArtworkReference: String!
    songTitle: String!
    productTitle: String
    artist: [String!]!
    otherParticipants: [otherParticipants!]
    featuredArtist: String
    releaseDate: DateTime!
    previouslyReleased: Boolean!
    language: String!
    primaryGenre: PrimaryGenre!
    secondaryGenre: SecondaryGenre
    explicitLyrics: Boolean!
    isrcCode: String!
    pLine: String
    cLine: String
    length: Int
    labelId: Int!
    label: Label!
    user: User!
    createdAt: DateTime
    updatedAt: DateTime
    ingestionStatus: IngestionStatus!
  }

  type otherParticipants {
    name: String!
    role: ParticipantRole!
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
    artist: [String!]!
    otherParticipants: [otherParticipantsInput!]
    featuredArtist: String
    releaseDate: DateTime
    previouslyReleased: Boolean!
    language: String!
    primaryGenre: PrimaryGenre!
    secondaryGenre: SecondaryGenre
    explicitLyrics: Boolean!
    isrcCode: String
    pLine: String
    cLine: String
    label: LabelInput!
  }

  input otherParticipantsInput {
    name: String!
    role: ParticipantRole!
  }

  input LabelInput {
    name: String!
    id: String!
  }

  input UpdateReleaseInput {
    songMasterReference: String
    songTitle: String
    productTitle: String
    artist: [String]
    featuredArtist: String
    releaseDate: DateTime
    previouslyReleased: Boolean
    language: String
    primaryGenre: PrimaryGenre
    secondaryGenre: SecondaryGenre
    explicitLyrics: Boolean
    isrcCode: String
    pLine: String
    cLine: String
    length: Int
    ingestionStatus: IngestionStatus
  }

  type Mutation {
    createRelease(input: CreateReleaseInput!): Int! @requireAuth
    updateRelease(id: Int!, input: UpdateReleaseInput!): Release!
      @requireAuth(roles: ["admin"])
    deleteRelease(id: Int!, userId: Int!): Release!
      @requireAuth(roles: ["admin"])
    runIngestion(id: Int!, userId: Int!): Release!
      @requireAuth(roles: ["admin", "moderator"])
  }
`
