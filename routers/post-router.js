const express = require('express')

const router = express.Router()

const Posts = require('../data/db')

let nextId = 9;

router.get('/', (req, res) => {
    Posts.find(req.query)
    .then(post => {
        res.status(200).json(post)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: "The posts information could not be retrieved." })
    })
})

router.post('/', (req, res) => {
    const {title, contents} = req.body;
    if(!title || ! contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    Posts.insert({title, contents})
    .then(post => {
        post.id = nextId++;
       
        res.status(201).json({message: 'New Post'})
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: "There was an error while saving the post to the database" })
    })
})

router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    Posts.findById(id)
    .then(post => {
        if(!post.id == id){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        
        }else{
            res.status(200).json(post)
            }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: "The post information could not be retrieved." })
    })
})

router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
    .then(post => {
        if(post > 0){
            res.status(200).json({message: 'Post removed'})
        }else{
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: "The post could not be removed" })
    })
})

router.put('/:id', (req, res) => {
    const updatedPost = req.body;
    const id = Number(req.params.id)
    Posts.findById(id)
    .then(post =>{
        if(!post.id == id){
            res.status(404).json({ message: "The post with the specified ID does not exist." })

        }
    })
const {title, contents} = req.body

    if(!title || ! contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }

    Posts.update(id, updatedPost)
    .then(post => {
      
            res.status(200).json(post)
        
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: "The post information could not be modified." })
    })
})

router.get('/:id/comments', (req, res) => {
    const id = Number(req.params.id);
    Posts.findPostComments(id)
    .then((comment) => {
        if(comment === undefined){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        
        }
            res.status(200).json(comment)
            
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: "The comments information could not be retrieved." })
})
})

router.post('/:id/comments', (req, res) => {
    const {text} = req.body;
    const id = Number(req.params.id);
    
    Posts.findById(id)
    .then(post => {
        if(post === undefined)
        res.status(404).json({message:
             "The post with the specified ID does not exist."})
        if(!req.body.text){
            res.status(400).json({ errorMessage: "Please provide text for the comment." })
            }
    })
   
    Posts.insertComment({post_id: id, text: text})
    .then(comment => {
        
        res.status(201).json(comment)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: "There was an error while saving the comment to the database" })
    })
})

module.exports = router