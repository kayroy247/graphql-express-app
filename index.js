var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    post(id: Int!): Post
    posts: [Post]

    createPost(title: String): Post
    
  }


  type Post {
      id: Int
      title: String
      comments: [Comment]
  }

  type Comment {
    id: Int
    text: String
    user: String
}
`);

const posts = [
    {
        id: 1,
        title: "this is the title",

    },

]
let id = 4;
class Post {
    constructor(post) {
        Object.assign(this, post)
        this.comments = post.comments || []
        this.id = id++;
    }

    async comments() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([{
                    text: 'what is up',
                    user: 'bobo'
                }])
            }, 1000)
        })

    }
}

// The root provides a resolver function for each API endpoint
var root = {

    post: (args) => {
        return new Post(posts.find(post => post.id == args.id))
    },
    posts: () => posts.map(post => new Post(post)),
    createPost: ({ title }) => {
        const post = new Post({ title })
        posts.push(post)
        return post
    }
};



var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');