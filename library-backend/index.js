const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v1: uuid } = require("uuid");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Author = require("./models/author");
const Book = require("./models/book");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        console.log("error connection to MongoDB:", error.message);
    });

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String genre: String): [Book!]
    allAuthors: [Author!]
  }
  type Mutation {
    addBook (
        title: String!
        author: String!
        published: Int!
        genres: [String!]
    ): Book
    editAuthor (
        name: String!
        setBornTo: Int!
    ): Author
  }
`;

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            if (args.genre) {
                return Book.find({ genres: { $in: [args.genre] } }).populate("author");
            }

            return await Book.find().populate("author");
        },
        allAuthors: async () => Author.find({}),
    },
    Author: {
        bookCount: async (root) => {
            const foundAuthor = await Author.findOne({ name: root.name });
            const foundBooks = await Book.find({ author: foundAuthor.id });
            return foundBooks.length;
        },
    },
    Mutation: {
        addBook: async (root, args) => {
            const author = await Author.findOne({});
            const book = new Book({ ...args, author: author });

            try {
                await newBook.save();
            } catch (error) {
                throw new GraphQLError("Saving user failed", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args.name,
                        error,
                    },
                });
            }

            return newBook;
        },
        editAuthor: async (root, args) => {
            // // Find the arg author name from the array of authors
            // const author = authors.find(({ name }) => name === args.name);
            // if (!author) {
            //     return null;
            // }

            // Find the arg author name from the author collection
            const author = await Author.findOne({ name: args.name });

            if (!author) {
                console.log("Return null");
                return null;
            }

            const filter = { name: args.name };
            const update = {
                born: args.setBornTo,
            };

            try {
                // const updatedAuthor = await Author.updateOne(filter, update);
                // const updatedAuthor = await Author.findOneAndUpdate(filter, update, { new: true });
                const updatedAuthor = await Author.findByIdAndUpdate(author.id, update, { new: true });
                return updatedAuthor;
            } catch (error) {
                throw new GraphQLError("Edit author failed", {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        invalidArgs: args.name,
                        error,
                    },
                });
            }
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

startStandaloneServer(server, {
    listen: { port: 4000 },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`);
});

// // // SOLUTION FOUND
// const { ApolloServer } = require("@apollo/server");
// const { startStandaloneServer } = require("@apollo/server/standalone");
// const { v1: uuid } = require("uuid");
// const { GraphQLError } = require("graphql");
// const jwt = require("jsonwebtoken");

// const mongoose = require("mongoose");
// mongoose.set("strictQuery", false);
// const Author = require("./models/author");
// const Book = require("./models/book");
// require("dotenv").config();

// const MONGODB_URI = process.env.MONGODB_URI;

// console.log("connecting to", MONGODB_URI);

// mongoose
//     .connect(MONGODB_URI)
//     .then(() => {
//         console.log("connected to MongoDB");
//     })
//     .catch((error) => {
//         console.log("error connection to MongoDB:", error.message);
//     });

// const typeDefs = `
//     type Author {
//         name: String!
//         born: Int
//         bookCount: Int!
//         id: ID!
//     }

//     input AuthorInput {
//         name: String!
//         born: Int
//     }

//     type Book {
//         title: String!
//         published: Int!
//         author: Author!
//         genres: [String!]!
//         id: ID!
//     }

//     type User {
//         username: String!
//         favoriteGenre: String!
//         id: ID!
//     }

//     type Token {
//         value: String!
//     }

//     type Query {
//         authorCount: Int!
//         bookCount: Int!
//         allBooks(author: String, genre: String): [Book!]!
//         allAuthors: [Author!]!
//         me: User
//     }

//     type Mutation {
//         addBook(title: String!, published: Int!, author: AuthorInput!, genres: [String!]!): Book
//         editAuthor(name: String!, setBornTo: Int!): Author
//         createUser(username: String!, favoriteGenre: String!): User
//         login(username: String!, password: String!): Token
//     }
// `;

// const resolvers = {
//     Query: {
//         // Correspond to the queries described in the schema
//         authorCount: () => Author.collection.countDocuments(),
//         bookCount: () => Book.collection.countDocuments(),
//         allBooks: async (root, args) => {
//             if (args.author) {
//                 const foundAuthor = await Author.findOne({ name: args.author });
//                 if (foundAuthor) {
//                     if (args.genre) {
//                         return await Book.find({ author: foundAuthor.id, genres: { $in: [args.genre] } }).populate("author");
//                     }
//                     return await Book.find({ author: foundAuthor.id }).populate("author");
//                 }
//                 return null;
//             }

//             if (args.genre) {
//                 return Book.find({ genres: { $in: [args.genre] } }).populate("author");
//             }

//             return Book.find({}).populate("author");
//         },
//         allAuthors: async () => await Author.find({}),
//         me: (root, args, context) => {
//             return context.currentUser;
//         },
//     },

//     Author: {
//         bookCount: async (root) => {
//             const foundAuthor = await Author.findOne({ name: root.name });
//             const foundBooks = await Book.find({ author: foundAuthor.id });
//             return foundBooks.length;
//         },
//     },

//     // In GraphQL, all operations which cause a change are done with mutations.
//     Mutation: {
//         addBook: async (root, args, context) => {
//             // const foundBook = await Book.findOne({ title: args.title });
//             // const foundAuthor = await Author.findOne({ name: args.author.name });
//             // const currentUser = context.currentUser;

//             // if (!currentUser) {
//             //     throw new GraphQLError("Auth failed", {
//             //         extensions: {
//             //             code: "AUTH_FAILED",
//             //             invalidArgs: args.name,
//             //         },
//             //     });
//             // }

//             // if (foundBook) {
//             //     throw new GraphQLError("Saving user failed", {
//             //         extensions: {
//             //             code: "BAD_USER_INPUT",
//             //             invalidArgs: args.name,
//             //             error,
//             //         },
//             //     });
//             // }

//             // if (!foundAuthor) {
//             //     const author = new Author({ ...args.author });
//             //     try {
//             //         await author.save();
//             //     } catch (error) {
//             //         throw new GraphQLError("Saving user failed", {
//             //             extensions: {
//             //                 code: "BAD_USER_INPUT",
//             //                 invalidArgs: args.name,
//             //                 error,
//             //             },
//             //         });
//             //     }
//             // }

//             // const foundAuthor2 = await Author.findOne({ name: args.author.name });
//             const foundAuthor2 = await Author.findOne({});
//             const book = new Book({ ...args, author: foundAuthor2 });

//             try {
//                 await book.save();
//             } catch (error) {
//                 throw new GraphQLError("Saving user failed", {
//                     extensions: {
//                         code: "BAD_USER_INPUT",
//                         invalidArgs: args.name,
//                         error,
//                     },
//                 });
//             }
//             return book;
//         },
//         editAuthor: async (root, args, context) => {
//             const author = await Author.findOne({ name: args.name });
//             const currentUser = context.currentUser;

//             if (!currentUser) {
//                 throw new GraphQLError("Auth user failed", {
//                     extensions: {
//                         code: "AUTH_FAIL_INPUT",
//                         invalidArgs: args.name,
//                         error,
//                     },
//                 });
//             }

//             if (!author) {
//                 return null;
//             }

//             const filter = { name: args.name };
//             const options = {};
//             const updateDoc = {
//                 $set: {
//                     ...author,
//                     born: args.setBornTo,
//                 },
//             };

//             await Author.updateOne(filter, updateDoc, options);
//             return await Author.findOne({ name: args.name });
//         },
//         createUser: (root, args) => {
//             const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre });

//             return user.save().catch((error) => {
//                 throw new GraphQLError("Saving user failed", {
//                     extensions: {
//                         code: "BAD_USER_INPUT",
//                         invalidArgs: args.name,
//                         error,
//                     },
//                 });
//             });
//         },
//         login: async (root, args) => {
//             const user = await User.findOne({ username: args.username });

//             if (!user || args.password !== PASSWORD) {
//                 throw new GraphQLError("Wrong Credentials", {
//                     extensions: {
//                         code: "CREDENTIALS",
//                         invalidArgs: args.name,
//                         error,
//                     },
//                 });
//             }

//             const userForToken = {
//                 username: user.username,
//                 id: user._id,
//             };

//             return { value: jwt.sign(userForToken, JWT_SECRET) };
//         },
//     },
// };

// const server = new ApolloServer({
//     typeDefs,
//     resolvers,
// });

// startStandaloneServer(server, {
//     listen: { port: 4000 },
// }).then(({ url }) => {
//     console.log(`Server ready at ${url}`);
// });
