const express = require("express") ;
const router = express.Router() ;
const Todo = require("../models/Todo") ;
const authMiddleware = require("../middlware/authMiddleware") ;

router.use(authMiddleware) ;

//gets all todos 

router.get("/", async (req, res) => {
    try {
        const todos = await Todo.find({userId: req.user.userId});
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Add new todo

router.post("/",async (req,res) => {
    const todo = new Todo({
        task: req.body.task,
        userId: req.user.userId, // associate task with logged-in user
    }) ;
    try {
        const newTodo = await todo.save() ;
        res.status(201).json(newTodo) ;
    }catch(error){
        res.status(400).json({message:error.message}) ;
    }
})

// update todo (mark complete/incomplete)

router.patch("/:id",async (req,res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            {completed: req.body.completed} ,
            {new : true}
        ) ;
        res.json(updatedTodo) ;
    }catch(error){
        res.status(400).json({message:error.message}) ;
    }
}) ;

// Delete todo
router.delete("/:id", async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: "Todo deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//delete all tasks fro logged in user

router.delete("/", async (req, res) => {
    try {
        await Todo.deleteMany({userId: req.user.userId});
        res.json({ message: "All todos deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;