const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const mongoose = require("mongoose");
const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "Trainsheep Voes",
    author: "John Smith",
    url: "https://example.com/",
    likes: 99,
  },
  {
    title: "Junior Problems",
    author: "John Smith",
    url: "https://example.com/",
    likes: 55,
  },
  {
    title: "Salesman Road",
    author: "Jane Doe",
    url: "https://example.com/",
    likes: 66,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("GET operations", () => {
  test("get all blogs from database", async () => {
    const blogs = await api.get("/api/blogs");
    assert.strictEqual(blogs.body.length, initialBlogs.length);
  });

  test("verify that indentifier is id", async () => {
    const blogs = await api.get("/api/blogs");
    assert(blogs.body[0].hasOwnProperty("id"), true);
  });
});

describe("POST operations", () => {
  test("verify that new blog added", async () => {
    const newBlog = {
      title: "Testing is hard",
      author: "Jane Doe",
      url: "https://example.com/",
      likes: 22,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAfterNew = await api.get("/api/blogs");
    assert.strictEqual(blogsAfterNew.body.length, initialBlogs.length + 1);
  });

  test("verify that blog without likes set likes to zero", async () => {
    const newBlog = {
      title: "Testing is hard",
      author: "Jane Doe",
      url: "https://example.com/",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAfterNew = await api.get("/api/blogs");
    assert.strictEqual(
      blogsAfterNew.body[blogsAfterNew.body.length - 1].likes,
      0
    );
  });

  test("verify that blog without title or url returns bad request", async () => {
    const newBlog = {
      author: "Jane Doe",
      likes: 33,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const blogsAfterNew = await api.get("/api/blogs");
    assert.strictEqual(blogsAfterNew.body.length, initialBlogs.length);
  });
});

describe("delete and update", () => {
  test("verify that item can be deleted", async () => {
    const blogsAtStart = await api.get("/api/blogs");
    const blogToDelete = blogsAtStart.body[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
    const blogsAfterDeletion = await api.get("/api/blogs");

    assert.strictEqual(blogsAfterDeletion.body.length, initialBlogs.length - 1);
  });

  test("update blog", async () => {
    const blogsAtStart = await api.get("/api/blogs");
    const blogToUpdate = blogsAtStart.body[0];

    const newBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: 999,
    };

    await api.put(`/api/blogs/${blogToUpdate.id}`).send(newBlog);
    const blogsAfterDeletion = await api.get("/api/blogs");

    assert.strictEqual(newBlog.likes, blogsAfterDeletion.body[0].likes);
  });
});

after(async () => {
  await mongoose.connection.close();
});
