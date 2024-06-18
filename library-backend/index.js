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
        // personCount: async () => Person.collection.countDocuments(),
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            // let filteredBooks = books;

            // if (args.genre) {
            //     filteredBooks = filteredBooks.filter(({ genres }) => genres.includes(args.genre));
            // }
            // if (args.author) {
            //     filteredBooks = filteredBooks.filter(({ author }) => author === args.author);
            // }
            // return filteredBooks;
            return Book.find({});
        },
        allAuthors: async () => Author.find({}),
    },
    Author: {
        bookCount: (root) => books.filter(({ author }) => author === root.name).length,
    },
    Book: {
        author: ({ name }) => {
            return {
                name,
            };
        },
    },
    Mutation: {
        addBook: async (root, args) => {
            // if (!authors.find(({ name }) => name === args.author)) {
            //     const author = {
            //         name: args.author,
            //         id: uuid(),
            //     };
            //     authors = authors.concat(author);
            // }
            // const book = { ...args };
            // books = books.concat(book);
            // return book;

            // const newBook = new Book({ ...args });
            // console.log(author);
            // let author = authors.find(author => author.name === args.author);

            // let author = { name: args.author };
            // if (!author) {
            //   author = { name: args.author }; // You can set age or other fields if necessary
            //   authors.push(author);
            // }

            const author = await Author.findOne({});
            // console.log(author._id);
            // const book = new Book({ ...args, author: author });

            const newBook = new Book({
                title: args.title,
                published: args.published,
                author: author._id,
                genres: args.genres,
            });

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
        editAuthor: (root, args) => {
            const author = authors.find(({ name }) => name === args.name);
            if (!author) {
                return null;
            }

            const updatedAuthor = { ...author, born: args.setBornTo };
            authors = authors.map((author) => (author.name === args.name ? updatedAuthor : author));
            return updatedAuthor;
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
