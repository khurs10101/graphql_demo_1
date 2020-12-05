
const express= require('express');
const graphQlHTTP= require('express-graphql');
const schema= require('./schema/schema');
const mongoose= require('mongoose');



const app= express();

//connect to mongoDB Atlas online
mongoose.connect('');
mongoose.connection.once('open', ()=>{
    console.log("Connected to mongoDB Atlas");
})


//setting up route localhost:4000/graphql
app.use('/graphql', graphQlHTTP({
    schema: schema,
    graphiql: true
}))

app.listen(4000,()=> {
    console.log("Now listening for requests on port 4000");
})
