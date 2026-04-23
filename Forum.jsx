import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: null,
  });
  const [commentText, setCommentText] = useState({});

  const fetchPosts = async () => {
    try {
      const res = await API.get("/forum");
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      alert("Failed to load forum posts");
    }
  };

  const createPost = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      alert("Please fill in title and content");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", form.title.trim());
      data.append("content", form.content.trim());

      if (form.image) {
        data.append("image", form.image);
      }

      await API.post("/forum", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setForm({ title: "", content: "", image: null });
      fetchPosts();
      alert("Post created successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create post");
    }
  };

  const addComment = async (id) => {
    if (!(commentText[id] || "").trim()) {
      alert("Please write a comment");
      return;
    }

    try {
      await API.post(`/forum/${id}/comment`, {
        text: commentText[id] || "",
      });
      setCommentText({ ...commentText, [id]: "" });
      fetchPosts();
    } catch (error) {
      alert("Failed to add comment");
    }
  };

  const upvote = async (id) => {
    try {
      await API.put(`/forum/${id}/upvote`);
      fetchPosts();
    } catch (error) {
      alert("Failed to upvote");
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "";

    let normalized = imageUrl.replace(/\\/g, "/").trim();

    if (!normalized.startsWith("/")) {
      normalized = `/${normalized}`;
    }

    if (!normalized.startsWith("/uploads/")) {
      normalized = normalized.replace(/^\/?uploads\/?/, "/uploads/");
    }

    return `http://localhost:5000${normalized}`;
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Discussion Forum</h1>
          <p className="text-sm text-gray-500 mt-1">
            Ask questions, share ideas, and learn together with the community
          </p>
        </div>

        {/* CREATE POST */}
        <form
          onSubmit={createPost}
          className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Create a New Post
              </h2>
              <p className="text-sm text-gray-500">
                Start a discussion with tutors and students
              </p>
            </div>

            <div className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
              {posts.length} Post{posts.length !== 1 ? "s" : ""}
            </div>
          </div>

          <input
            placeholder="Post Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 mb-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <textarea
            placeholder="Write your content..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={5}
            className="w-full bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 mb-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm({ ...form, image: e.target.files[0] || null })
            }
            className="w-full bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 mb-4 text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white file:rounded-xl file:cursor-pointer cursor-pointer focus:outline-none"
          />

          {form.image && (
            <p className="text-sm text-blue-700 mb-4">
              Selected image: {form.image.name}
            </p>
          )}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-3 rounded-xl shadow-sm transition"
          >
            Publish Post
          </button>
        </form>

        {/* POSTS */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                  <div className="w-full">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h2>

                    <p className="text-gray-600 text-sm leading-6 mb-4">
                      {post.content}
                    </p>

                    {post.imageUrl ? (
                      <img
                        src={getImageUrl(post.imageUrl)}
                        alt="Post"
                        className="w-full max-w-md rounded-2xl border border-blue-100 shadow-sm object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : null}
                  </div>

                  <div className="shrink-0">
                    <button
                      onClick={() => upvote(post._id)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium px-4 py-2 rounded-xl border border-blue-200 transition"
                    >
                      👍 Upvote
                    </button>
                  </div>
                </div>

                {/* META */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
                    <p className="text-xs text-gray-500 mb-1">Author</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {post.user?.name || "Unknown User"}
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
                    <p className="text-xs text-gray-500 mb-1">Upvotes</p>
                    <p className="text-sm font-semibold text-blue-700">
                      {post.upvotes?.length || 0}
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
                    <p className="text-xs text-gray-500 mb-1">Comments</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {post.comments?.length || 0}
                    </p>
                  </div>
                </div>

                {/* COMMENTS */}
                <div className="border-t border-blue-100 pt-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">
                    Comments
                  </h3>

                  <div className="space-y-3 mb-4">
                    {post.comments?.length > 0 ? (
                      post.comments.map((c, i) => (
                        <div
                          key={i}
                          className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3"
                        >
                          <p className="text-sm">
                            <span className="font-semibold text-blue-700">
                              {c.user?.name || "User"}:
                            </span>{" "}
                            <span className="text-gray-700">{c.text}</span>
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-500">
                        No comments yet. Be the first to comment.
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      placeholder="Write a comment..."
                      value={commentText[post._id] || ""}
                      onChange={(e) =>
                        setCommentText({
                          ...commentText,
                          [post._id]: e.target.value,
                        })
                      }
                      className="flex-1 bg-white border border-blue-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />

                    <button
                      onClick={() => addComment(post._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-sm transition"
                    >
                      Add Comment
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-blue-100 rounded-3xl p-10 text-center shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
                💬
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-sm text-gray-500">
                Start the first discussion by creating a post above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}