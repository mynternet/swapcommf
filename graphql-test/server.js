const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');

const app = express();

const server = new ApolloServer({ typeDefs, resolvers });

(async () => {
  await server.start();

  server.applyMiddleware({ app });

  app.listen({ port: 3001 }, () => {
    console.log(`Server running at http://localhost:3001/graphql`);
  });
})();
