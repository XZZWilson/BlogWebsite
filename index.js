import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const posts = [];
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs", { posts });
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.post("/create", (req, res) => {
    // render(view(file to show, ejs), data(object, each property becomes var))
    // ex. existingPost.subject
    res.render("post.ejs");
});

app.post("/post", (req, res) => {
    // req.body.id is null or undefined (??) use an "" string instead
    // toString converts to string by force and trim cuts whitespace
  const idRaw = (req.body.id ?? "").toString().trim();
  const id = Number(idRaw);

  // Update path: only if id is a valid number
  if (idRaw !== "" && Number.isFinite(id)) {
    const idx = posts.findIndex(p => p.id === id);
    if (idx !== -1) {
      posts[idx] = {
        // ... is the spread operator and it means copy all properties from 
        // posts[idx] into this new object
        ...posts[idx], // keep id + createdOn
        subject: req.body.subject.trim(),
        content: req.body.content.trim(),
        // optional: add updated timestamp
        updatedOn: new Date(),
      };
      return res.redirect("/");
    }
    // If id is present but not found, fall through (or redirect)
  }

  // Create path
  const data = {
    id: Date.now(),
    subject: req.body.subject.trim(),
    content: req.body.content.trim(),
    createdOn: new Date(),
  }
  posts.push(data);

  res.redirect("/");
});

app.post("/post/edit", (req, res) => {
    const id = Number(req.body.id);
    // find - finds the object(element)
    const existingPost = posts.find(p => p.id == id);
    if (!existingPost)
    {
        return res.redirect("/");
    }
    res.render("post.ejs", { existingPost });
});

app.post("/delete", (req, res) => {
    // find the id of post to remove
    const id = Number(req.body.id);
    // for each post p, check if p.id matches the id I'm looking for 
    const index = posts.findIndex(p => p.id == id);
    if (index !== -1)
    {
        // remove exactly one post (splice(startIndex, how many to remove))
        posts.splice(index , 1); 
    }
    res.redirect("/");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});