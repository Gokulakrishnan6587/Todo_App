//using express and mongoose
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//instance express
const app=express();
//json data decode it(middle ware)
app.use(express.json())
app.use(cors())

//sample todo storage items
/* let todos=[]; */

//connecting mongo db
mongoose.connect('mongodb://localhost:27017/todo-app')
.then(() =>{
    console.log("DB Connected")
})
.catch((err) =>{
    console.log(err)
})

//creating schema(for creating these mongoose insert data in specific collection)
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})

//creating model
const todoModel = mongoose.model('Todo',todoSchema);

//create a new todo item
app.post('/todos', async(req,res) => {
    const {title,description} = req.body;
    // const newTodo = {
    //     id: todos.length + 1, title, description
    // };
    // todos.push(newTodo);
    // console.log(todos);
    
    try{
        const newTodo = new todoModel({title,description})
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch(err){
        console.log(err)
        res.status(500).json({Message: err.message});
    }
})

//get all items
app.get('/todos', async(req,res) => {
    try{
        const todos = await todoModel.find();
        res.json(todos);
    }catch(err){
        console.log(err)
        res.status(500).json({Message: err.message});
    }
})

//upd todo item
app.put("/todos/:id", async(req,res) =>{
    try{
        const {title,description} = req.body;
    const id = req.params.id;
    const updatedTodo = await todoModel.findByIdAndUpdate(
        id,
        {title,description},
        {new:true}
    )
    
    if(!updatedTodo) {
        return res.status(404).json({Message: "Todo not found"})
    }
    res.json(updatedTodo)
    }catch(err){
        console.log(err)
        res.status(500).json({Message: err.message});
    }
})

//delete todo item
app.delete("/todos/:id", async(req,res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (err) {
        console.log(err)
        res.status(500).json({Message: err.message});
    }
})

//Start server
const port=8000;
app.listen(port,() => {
    console.log("server is listening to port " + port);
})

