const { ApolloServer, gql } = require("apollo-server");
const rq = require("request-promise");

let books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling",
    pageCount: 500,
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton",
    pageCount: 250,
  },
];

const resolvers = {
  Query: {
    books: () => books,
    joke: async () => {
      try {
        const options = {
          json: true,
          url: "http://api.icndb.com/jokes/random?",
        };
        const {
          value: { joke },
        } = await rq(options);
        return joke;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    capsBook: () => {
      books = books.map((book) => ({
        ...book,
        title: book.title.toUpperCase(),
      }));
      return books;
    },
  },
};

// schema
const typeDefs = gql`
  type Book {
    title: String
    author: String
    pageCount: Int
  }

  type Mutation {
    capsBook: [Book]
  }

  type Query {
    books: [Book]
    joke: String
  }
`;

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
