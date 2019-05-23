const { ApolloServer, gql, PubSub } = require("apollo-server");
const movies = require("./mocks/movies");
const categories = require("./mocks/categories");
const { getMoviesForCategory } = require("./utils");
var _ = require("lodash");

const pubsub = new PubSub();

const typeDefs = gql`
  type Query {
    hello: String!
    getMovie(id: Int!): Movie!
    getMovies(name: String): [Movie!]
    getCategories: [Category!]
    addVote(movie_id: Int): Movie!
  }
  type Movie {
    vote_count: Int
    id: Int
    video: Boolean
    vote_average: Float
    title: String
    popularity: Float
    poster_path: String
    original_language: String
    original_title: String
    category_ids: [Int]
    category: Category
    backdrop_path: String
    adult: Boolean
    overview: String
    release_date: String
  }
  type Category {
    id: Int
    name: String
  }
  type Mutation {
    addVote(movie_id: ID!): Movie!
  }
`;

const resolvers = {
  Query: {
    hello: (parent, args, ctx, info) => "Hello world!!",
    getMovie: (parent, { id }, ctx, info) => _.find(movies, { id: id }),
    getMovies: (parent, { name }, ctx, info) => getMoviesForCategory(name),
    getCategories: (parent, args, ctx, info) => categories,
    addVote: (parent, { movie_id }, ctx, info) => {
      let movie = _.find(movies, { id: movie_id });
      movie.vote_count++;
      return movie;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: true,
  playground: {
    settings: {
      "editor.theme": "light"
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
