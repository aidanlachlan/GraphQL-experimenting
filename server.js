import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { buildSchema } from "graphql";
import { ruruHTML } from "ruru/server";
 
// Construct a schema using GraphQL schema language
const schema = buildSchema(/* GraphQL */ `
  type Query {
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`);
 
// The root provides a resolver function for each API endpoint
const root = {
  rollDice({ numDice, numSides }) {
    const output = [];
    const sides = numSides || 6;
    for (let i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * sides));
    }
    return output;
  },
};
 
const app = express();
app.all(
  "/graphql",
  createHandler({
    schema,
    rootValue: root,
  })
);

// Serve the GraphQL Playground
app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

app.listen(4000, () => {
  console.log("Running a GraphQL API server at localhost:4000/graphql");
});