const ForumPost = require("../models/ForumPost");

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const post = await ForumPost.create({
      user: req.user._id,
      title,
      content,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
    });

    res.status(201).json({ message: "Post created", post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find()
      .populate("user", "name")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!req.body.text || !req.body.text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    post.comments.push({
      user: req.user._id,
      text: req.body.text.trim(),
    });

    await post.save();
    res.json({ message: "Comment added", post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upvotePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyUpvoted = post.upvotes.some(
      (id) => String(id) === String(req.user._id)
    );

    if (!alreadyUpvoted) {
      post.upvotes.push(req.user._id);
      await post.save();
    }

    res.json({ message: "Post upvoted", post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  addComment,
  upvotePost,
};