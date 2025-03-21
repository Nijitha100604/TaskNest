//Using Express 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// create an instance of express

const app = express();

// Creating a middleware

app.use(express.json());
app.use(cors());


// sample in-memory storage

// let todos = [];

// Connecting mongoDB

mongoose.connect('mongodb://localhost:27017/todo-app')
.then(()=>{
    console.log('DB connected!')
})
.catch((err)=>{
    console.log(err);
})

// creating schema

const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description:{
        required: true,
        type: String
    } 
})

// creating model

const todoModel = mongoose.model('Todo', todoSchema);

// create a new todo Item

app.post('/todos',async(req,res)=>{
    const {title, description} = req.body;


    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // };

    // todos.push(newTodo);
    // console.log(todos);

    try{
        const newTodo = new todoModel({title,description});
        await newTodo.save();
        res.status(201).json(newTodo);
    }catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
    
})


// Get all items

app.get('/todos',async(req,res)=>{
    
    try{
      const todos = await todoModel.find();
      res.status(201).json(todos);

    }catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
})

// Update a todo item

app.put("/todos/:id", async(req, res)=>{

    try{
    const {title, description} = req.body;
    const id = req.params.id;
    const updatedTodo = await todoModel.findByIdAndUpdate(
        id,
        {
            title,
            description
        },
        {new: true}
    )

    if(!updatedTodo){
        return res.status(404).json({message: "Todo not found"});
    }

    res.json(updatedTodo);
    }catch(error)
    {
        console.log(error);
        res.status(500).json({message: error.message});
    }
    
})

// Delete an Todo item

app.delete('/todos/:id', async(req, res)=>{
    try{
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
    }catch(error){
        res.status(500).json({message: error.message});
    }
})


// start the server

const port = 8000;
app.listen(port, ()=>{
    console.log("Server is listening to port "+port);
})
