
const graphql= require('graphql');
const _= require('lodash');
//import models
const Book= require('../models/books');
const Author= require('../models/authors');

const {
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = graphql;

//dummy data
// var books= [
//     {name:'A', genre:'AA', id:'1', authorId:'1'},
//     {name:'B', genre:'BB', id:'2', authorId:'2'},
//     {name:'C', genre:'CC', id:'3', authorId:'3'},
//     {name:'Aa', genre:'AAa', id:'4', authorId:'1'},
//     {name:'Bb', genre:'BBb', id:'5', authorId:'2'},
//     {name:'Cc', genre:'CCc', id:'6', authorId:'3'}
// ];

// var authors= [
//     {name:'D', age: 35, id:'1'},
//     {name:'E', age: 45, id:'2'},
//     {name:'F', age: 55, id:'3'}
// ];

//creating a first Book type object
const BookType= new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID},
        name: { type: GraphQLString},
        genre: { type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args){
                //return _.find(authors, {id: parent.authorId});
            }
        }
    })
});

//creating a Author type object
const AuthorType= new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        book: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                //return _.filter(books, {authorId: parent.id});
            }
        }
    })
});

//creating a mutation object for mongodb operations
const Mutation= new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        //add author to database
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve(parent, args){

                let author= new Author({
                     
                    name: args.name,
                     age: args.age

                });
                //save to database
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type: GraphQLString},
                genre: {type: GraphQLString},
                authorId: {type: GraphQLID}
            },
            resolve(parent, args){

                let book= new Book({

                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        }
    }
});

//creating root of the query
const RootQuery= new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                //code to get data from db
                //return _.find(books, {id: args.id});
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                //return _.find(authors, {id: args.id});
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                //return books;
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent,args){
                //return authors;
            }
        }
    }
});

module.exports= new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});