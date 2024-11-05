const express = require('express');
const router = express.Router();
const database = require('../data/database');

router.get('/', function(request, response) {
    response.redirect('/posts');
});

router.get('/posts', async function(request, response) {
    const query = `
        SELECT posts.*, authors.name AS author_name FROM blog.posts
        INNER JOIN blog.authors ON posts.author_id = authors.id
    `;
    const [posts] = await database.query(query);
    response.render('posts-list', {posts: posts});
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

router.get('/posts/:id', async function(request, response) {
    const query = `
        SELECT posts.*, authors.name AS author_name, authors.email AS author_email FROM posts
        INNER JOIN authors ON posts.author_id = authors.id
        WHERE posts.id = ?
    `;
    // array of posts that will still only hold one post
    const [posts] = await database.query(query, [request.params.id])

    if (!posts || posts.length === 0) {
        return response.status(404).render('404');
    }
    response.render('post-detail', {post: posts[0]});
});

module.exports = router;