const express = require("express");
const postRouter = express.Router();
const postModel = require("./postModel.js");

// Helper functions: 
const postNotFound = (res) => {
    res.status(404).send("Post not found!")
}

// Middleware for custom auth checks
const auth = (req, res, next) => {
    if (!req.headers.authorization || req.headers.authorization.split(" ")[1] !== "specialkey") {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
}

// Create a post: 

postRouter.post("/", auth, (req, res) => {
    if (!req.body ||
        !req.body.title ||
        !req.body.title.trim() ||
        !req.body.author ||
        !req.body.author.trim() ||
        !req.body.content ||
        !req.body.content.trim() ||
        !req.body.tags ||
        !Array.isArray(req.body.tags)
    ) {
        return res.sendStatus(400)
    }
    try {
        const newPost = postModel.createPost(req.body)
        res.status(201).json(newPost);
    } catch (err) {
        console.error(err)
        return res.sendStatus(400)
    }

})

// Create a comment by post id: 

postRouter.post("/:id/comment", auth, (req, res) => {
    if (!req.body ||
        !req.body.author ||
        !req.body.author.trim() ||
        !req.body.content ||
        !req.body.content.trim()
    ) {
        return res.sendStatus(400)
    }
    try {
        const post = postModel.createComment(req.params.id, req.body)
        res.json(post)
    } catch (err) {
        console.error(err)
        return postNotFound(res)

    }
})

// Read/Retrieve (GET): 

postRouter.get("/", (req, res) => {
    const posts = postModel.readAllPosts();
    res.json(posts)
})

postRouter.get("/search", (req, res) => {
    const q = req.query.q?.trim()
    if (!q) {
        res.status(400).send("You need a search query")
    }
    const filteredPosts = postModel.searchPosts(q)
    res.json(filteredPosts)
})

postRouter.get("/filter", (req, res) => {
    const author = req.query?.author?.toLowerCase()?.trim();
    const tag = req.query?.tag?.toLowerCase()?.trim();
    if (!author && !tag) {
        res.status(400).send("You need at least an author or a tag as part of your query!");
    }
    const filteredPosts = postModel.filterPosts(author, tag);
    res.json(filteredPosts)
})

postRouter.get("/:id", (req, res) => {
    const post = postModel.readPost(req.params.id);
    if (!post) {
        return postNotFound(res);
    }
    res.json(post)
})


postRouter.get("/:id/comments", (req, res) => {
    try {
        const comments = postModel.readCommentsByPost(req.params.id);
        if (comments.length == 0) {
            return res.status(204).send("No comments yet!")
        }
        res.json(comments)
    } catch (err) {
        console.error(err)
        return postNotFound(res)
    }
})


// Replace (PUT):

postRouter.put("/:id", auth, (req, res) => {
    if (!req.body || !req.body.title || !req.body.author || !req.body.content || !req.body.title.trim() || !req.body.author.trim() || !req.body.content.trim()) {
        return res.sendStatus(400)
    }
    try {
        const updatedPost = postModel.updatePost(req.params.id, req.body)
        res.json(updatedPost)

    } catch (err) {
        console.error(err);
        return postNotFound(res)
    }
})

postRouter.put("/comments/:commentId", auth, (req, res) => {
    if (!req.body || !req.body.content || !req.body.content.trim()) {
        return res.sendStatus(400)
    }
    const updatedComment = postModel.updateComment(req.params.commentId, req.body)
    if (!updatedComment) {
        res.status(404).json({ message: "Comment not found!" })
    } else {
        res.status(200).json(updatedComment)
    }
})

// Delete (DELETE): 

postRouter.delete("/:id", auth, (req, res) => {
    try {
        postModel.deletePost(req.params.id)
        res.status(200).json({ message: `Post with id: ${req.params.id} deleted successfully` })
    }
    catch (err) {
        console.error(err)
        postNotFound(res)
    }
})

postRouter.delete("/comments/:commentId", auth, (req, res) => {
    const success = postModel.deleteComment(req.params.commentId)
    if (success) {
        res.status(200).json({ message: `Comment with id: ${req.params.commentId} deleted successfully!` })
    } else {
        res.status(404).json({ message: "Comment not found!" })
    }
})

// Update (PATCH): 

postRouter.patch("/:id/like", auth, (req, res) => {
    try {
        const newCount = postModel.incrementLikes(req.params.id)
        res.status(200).json({ message: `The new likes count is ${newCount}` })
    } catch (err) {
        console.error(err)
        postNotFound(res)
    }
})




module.exports = postRouter