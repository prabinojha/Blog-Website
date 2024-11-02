const express = require('express');
const router = express.Router();
const database = require('../data/database');

router.get('/', function(request, response) {
    response.redirect('/posts');
});

router.get('/posts', function(request, response) {
    
     response.render('posts-list');
});

router.get('/new-post', async function(request, response) {
    const [authors] = await database.query('SELECT * FROM blog.authors');
    response.render('create-post', {authors: authors});
});

router.post('/posts', async function(request, response) {
    const values = [
        request.body.title,
        request.body.summary,
        request.body.content,
        request.body.author
    ];
    await database.query('INSERT INTO blog.posts (title, summary, body, author_id) VALUES (?)', [values]);
    response.redirect('/posts'); // redirecting to the GET response for /posts so can get the posts-list
});

module.exports = router;