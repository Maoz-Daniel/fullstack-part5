function PostArticle({ post }) {
  return (
    <article className="post-card post-card--selected">
      <p className="post-card__meta">Post #{post.id}</p>
      <h1 className="panel__title">{post.title}</h1>
      <p className="post-card__body">{post.body}</p>
    </article>
  )
}

export { PostArticle }
