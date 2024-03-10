const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((total, blog) => (total += blog.likes), 0);
};

const favoriteBlog = (blogs) => {
  const likes = blogs.map((blog) => blog.likes);
  const index = likes.indexOf(Math.max(...likes));
  return blogs[index];
};

const mostBlogs = (blogs) => {
  const authors = blogs.map((blog) => blog.author);
  const unique = new Set(authors);
  const results = [...unique].map((u) => {
    return {
      author: u,
      blogs: authors.filter((author) => author === u).length,
    };
  });
  const numBlogs = results.map((result) => result.blogs);
  const index = numBlogs.indexOf(Math.max(...numBlogs));
  return results[index];
};

const mostLikes = (blogs) => {
  const authors = blogs.map((blog) => blog.author);
  const unique = new Set(authors);
  const results = [...unique].map((u) => {
    return {
      author: u,
      likes: blogs
        .filter((blog) => blog.author === u)
        .reduce((total, blog) => (total += blog.likes), 0),
    };
  });
  const numLikes = results.map((result) => result.likes);
  const index = numLikes.indexOf(Math.max(...numLikes));
  return results[index];
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
