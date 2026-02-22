CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  post_id INT NOT NULL,
  author_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_post
    FOREIGN KEY(post_id)
    REFERENCES posts(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_author
    FOREIGN KEY(author_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);