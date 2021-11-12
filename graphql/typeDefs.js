import gql from 'graphql-tag';

export const typeDefs = gql`
type Post{
    id:ID!
    body:String!
    createdAt:String!
    username:String!
}
  type Query{
    getPosts:[Post]
  }
`