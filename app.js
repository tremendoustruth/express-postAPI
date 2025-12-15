const express = require("express")
const morgan = require('morgan');
const postRouter = require("./postRoutes");
const app = express();
const PORT = 3000


app.use(morgan("dev"));
app.use(express.json());

// Middleware for custom request logger
app.use((req, res, next) => {
    console.log(`In the post router matching ${req.path} using method ${req.method}`);
    next();
})


app.get("/", (req, res) => {
    res.send("Welcome to the blog API!")
});

app.use("/posts", postRouter)

// Middleware function to handle 404 errors
app.use((_req, res, _next) => {
    res.status(404).send("Unfindable!")
})

// Central error handling middleware 
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Mysterious Error Message: no info for you!')
})


app.listen(PORT, () => console.log(`app listening at http://locallhost:${PORT}`));