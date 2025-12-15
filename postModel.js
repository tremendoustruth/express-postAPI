const posts = [
    {
        id: 1,
        title: "How To Become Successful At Anything",
        author: "Dorgith Forlite",
        publicationDate: "2025-12-01",
        content: "Step 1. Believe in yourself! Step 2. Muster your determination! Step 3. Find resources! Step 4. Go for it! Step 5. Fail fast and iterate!",
        readTime: 1,
        likes: 0,
        tags: ["motivation", "self-improvement"],
        comments: [
            {
                id: 1,
                author: "Imedla Archer ",
                content: "Excellent generalizable guidance! Thanks!"
            },
            {
                id: 2,
                author: "Blabbity Bloopity",
                content: "Blab bloop bloop blab."
            }
        ]
    },
    {
        id: 2,
        title: "Ungrumpify Yourself Before Christmas",
        author: "Grinch",
        publicationDate: "2024-12-24",
        content: "Enjoy the Christmas lights, look at cute animals, and donate gifts and food for those in need.",
        readTime: 1,
        likes: 1000000,
        tags: ["holidays", "christmas", "mood", "animals", "helping"],
        comments: [
            {
                id: 3,
                author: "Sammy The Dog",
                content: "Bark! Woof!"
            },
            {
                id: 4,
                author: "Neighbor One",
                content: "Your compassion is touching, Grinch. Merry Christmas"
            }
        ]
    },
    {
        id: 3,
        title: "My Experience With CMU TechBridge",
        author: "Bushra Salama",
        publicationDate: "2025-12-11",
        content: "The instructors are helpful, caring, and invested in student success!",
        readTime: 1,
        likes: 6,
        tags: ["learning", "reviews", "Carnegie Mellon"],
        comments: [
            {
                id: 5,
                author: "Adam Mullen",
                content: "I'm considering taking this course myself! Thanks for the intel."
            },
            {
                id: 6,
                author: "Priyanka Shah",
                content: "Inspiring!"
            }
        ]
    }
]

// Helper functions: 

const readTimeCalc = (post) => {
    return Math.ceil(post.content.split(" ").length / 200)
}

const nextPostId = (posts) => {
    let maxId = 0;
    let nextId = 0;
    if (posts.length > 0) {
        maxId = Math.max(...posts.map((post) => post.id))
        nextId = maxId + 1
    } else {
        nextId = 1
    }
    return nextId;
}

const nextCommentId = (posts) => {
    if (posts.length == 0) {
        return false
    }
    let maxId = 0;
    let nextId = 0;
    for (let post of posts) {
        for (let comment of post.comments) {
            if (comment.id > maxId) {
                maxId = comment.id
            }
        }
    }
    nextId = maxId + 1
    return nextId
}

// Create post: 

const createPost = (newPost) => {
    const postToAdd = {
        id: nextPostId(posts),
        title: newPost.title,
        author: newPost.author,
        content: newPost.content,
        publicationDate: new Date().toISOString().slice(0, 10),
        readTime: readTimeCalc(newPost),
        likes: 0,
        tags: newPost.tags,
        comments: [],
    }
    posts.push(postToAdd);
    return postToAdd;
};

// Create comments by post id: 

const createComment = (id, newComment) => {
    const post = posts.find((post) => post.id === Number(id))
    if (!post) { throw new Error("Post does not exist") }
    const commentToAdd = {
        id: nextCommentId(posts),
        author: newComment.author,
        content: newComment.content
    }
    post.comments.push(commentToAdd)
    return post
}

// Read all posts: 

const readAllPosts = () => {
    return posts;
};

// Read one post by id: 

const readPost = (id) => {
    return posts.find((post) => post.id === Number(id))
};

// Read all comments in one post by id:

const readCommentsByPost = (id) => {
    const post = posts.find((post) => post.id === Number(id));
    if (!post) { throw new Error("Post does not exist") }
    return post.comments;
}

// Search posts by query (title and content):

const searchPosts = (query) => {
    const term = query.toLowerCase();
    const filteredPosts = posts.filter((post) => post.title.toLowerCase().includes(term) || post.content.toLowerCase().includes(term))
    return filteredPosts
}

const filterPosts = (authorTerm, tagTerm) => {
    let filterByAuthor = posts;
    let filterByBoth = posts;
    if (authorTerm) { filterByAuthor = posts.filter((post) => post.author.toLowerCase().includes(authorTerm)) }
    if (tagTerm) {
        filterByBoth = filterByAuthor.filter((post) => post.tags.includes(tagTerm))
    } else {
        filterByBoth = filterByAuthor;
    }
    return filterByBoth;
}

// Update (replace) post: 

const updatePost = (id, updatedPost) => {
    const targetIndex = posts.findIndex((post) => post.id === Number(id))
    if (targetIndex == -1) { throw new Error("Post does not exist") }
    const original = posts[targetIndex];
    const postToSave = {
        id: original.id,
        title: updatedPost.title,
        author: updatedPost.author,
        content: updatedPost.content,
        publicationDate: original.publicationDate,
        readTime: readTimeCalc(updatedPost),
        likes: original.likes,
        tags: original.tags,
        comments: original.comments
    }
    posts.splice(targetIndex, 1, postToSave)
    return posts[targetIndex]
}

// Update (replace) comment: 

const updateComment = (commentId, updatedContent) => {
    for (post of posts) {
        for (let j = 0; j < post.comments.length; j++) {
            if (post.comments[j].id === Number(commentId)) {
                const original = post.comments[j]
                const commentToAdd = {
                    id: original.id,
                    author: original.author,
                    content: updatedContent.content
                }
                post.comments.splice(j, 1, commentToAdd)
                console.log(post)
                return post.comments[j]
            }
        }
    }
    return false

}

// Delete post:

const deletePost = (id) => {
    const targetIndex = posts.findIndex((post) => post.id == id)
    if (targetIndex == -1) {
        throw new Error("Post does not exist.")
    }
    posts.splice(targetIndex, 1)
}

// Delete comment: 

const deleteComment = (commentId) => {
    for (post of posts) {
        for (let i = 0; i < post.comments.length; i++) {
            if (post.comments[i].id === Number(commentId)) {
                post.comments.splice(i, 1)
                return true
            }
        }
    }
    return false
}

// Increment likes by post id: 

const incrementLikes = (id) => {
    const post = posts.find((post) => post.id === Number(id));
    if (!post) { throw new Error("Post does not exist") }
    const newCount = post.likes + 1
    post.likes = newCount
    console.log(newCount, post)
    return newCount;
}

module.exports = {
    createPost,
    createComment,
    readAllPosts,
    readPost,
    readCommentsByPost,
    searchPosts,
    filterPosts,
    updatePost,
    updateComment,
    deletePost,
    deleteComment,
    incrementLikes,
};
