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
        res.status(500).json({ message: 'Error retrieving posts'})
    })
})

router.post('/', (req, res) => {
    const {title, contents} = req.body;
    
    Posts.insert({title, contents})
    .then(post => {
        post.id = nextId++;
        res.status(201).json({message: 'New Post'})
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({message: 'Error adding post'
        })
    })
})

router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    Posts.findById(id)
    .then(post => {
        if(!post.id == id){
            res.status(404).json({message: 'Post not found'})
        
        }else{
            res.status(200).json(post)
            }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({message: 'Error finding post'
        })
    })
})

router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
    .then(post => {
        if(post > 0){
            res.status(200).json({message: 'Post removed'})
        }else{
            res.status(404).json({message: 'Could not find post'})
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({message: 'Error removing post'})
    })
})

router.put('/:id', (req, res) => {
    const updatedPost = req.body;
    const id = Number(req.params.id)
    Posts.update(id, updatedPost)
    .then(post => {
        if(post){
            res.status(200).json(post)
        }else{
            res.status(404).json({message: 'Could not find post'})
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({message: 'Error updating post'})
    })
})

router.get('/:id/comments', (req, res) => {
    const id = Number(req.params.id);
    Posts.findPostComments(id)
    .then((comment) => {
        if(comment === undefined){
            res.status(404).json({message: 'Comments not found'})
        
        }
            res.status(200).json(comment)
            
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({message: 'Error finding comments'
        })
})
})

router.post('/:id/comments', (req, res) => {
    const {text} = req.body;
    const id = Number(req.params.id);

    Posts.findById(id)
    .then(comment => {
        if(commmet === undefined)
        res.status(404).json({message: "The post with the specified ID does not exist."})
        if(!{text}){
        res.status(400)
        }
    })
    Posts.insertComment({post_id: id, text: text})
    .then(comment => {
        res.status(201).json(comment)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({error: "The post information could not be modified."
        })
    })
})

module.exports = router