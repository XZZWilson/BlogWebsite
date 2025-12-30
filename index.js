import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const posts = [];

app.get("/", (req, res) => {
    res.render("index.ejs", { posts });
});

app.use(express.urlencoded({ extended: true }));

app.post("/create", (req, res) => {
    const newPost = {
        id: Date.now(),
        subject: req.body.subject.trim(),
        content: req.body.content.trim(),
        createdOn: new Date() 
    };
    posts.push(newPost);
    res.redirect("/post");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});