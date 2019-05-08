const neo4j = require('neo4j-driver').v1;
const { makeAugmentedSchema } = require('neo4j-graphql-js');
const { typeDefs, resolvers } = require('./graphql-schema');
const { makeExecutableSchema } = require('apollo-server');
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");

const schema = makeAugmentedSchema({
  typeDefs,
  resolvers
});

const driver = neo4j.driver(
  'bolt://54.183.239.18:7687',
  //'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'deadmau5!')
);

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../ui/build")))

const server = new ApolloServer({ 
  schema: schema,
  context: ({ req }) => {
    return {
      driver,
      req
    };
  }
});

server.applyMiddleware({ app, path: "/" });
app.listen(4000, "0.0.0.0");