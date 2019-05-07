const neo4j = require('neo4j-driver').v1;
const { makeAugmentedSchema } = require('neo4j-graphql-js');
const { typeDefs, resolvers } = require('./graphql-schema');
const { ApolloServer, gql, makeExecutableSchema } = require('apollo-server');

const schema = makeAugmentedSchema({
  typeDefs,
  resolvers
});

const driver = neo4j.driver(
  'bolt://localhost:7687', 
  neo4j.auth.basic('neo4j', 'deadmau5!')
);


const server = new ApolloServer({ 
  schema,
  context: { driver }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});