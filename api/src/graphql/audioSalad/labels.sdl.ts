export const schema = gql`
  type Label {
    id: Int!
    name: String!
  }
  type Query {
    getLabels: [Label!] @requireAuth
  }
`
