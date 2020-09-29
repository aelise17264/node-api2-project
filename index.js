const express = require('express');

const server = express()

const postRouter = require('./routers/post-router')

server.use(express.json())

server.use('/api/posts', postRouter)

server.get('/', (req, res) => {
    res.send(`
      <h2>Lambda Writes</h>
      <p>Welcome to the Lambda Writes Blog Entries</p>
    `);
  });

server.listen(3000, () => {
    console.log('\n*** Server Running on http://localhost:3000 ***\n');
  });