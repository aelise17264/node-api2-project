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

module.exports = router