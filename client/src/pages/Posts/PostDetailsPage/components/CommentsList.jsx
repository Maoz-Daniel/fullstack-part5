import { CommentCard } from './CommentCard.jsx'

function CommentsList({
  comments,
  userId,
  editingCommentId,
  editingCommentBody,
  onEditingCommentBodyChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}) {
  return (
    <div className="comments-list">
      {comments.length === 0 ? (
        <p className="panel__subtitle">No comments for this post yet.</p>
      ) : (
        comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            isOwner={comment.userId === userId}
            isEditing={editingCommentId === comment.id}
            editingCommentBody={editingCommentBody}
            onEditingCommentBodyChange={onEditingCommentBodyChange}
            onStartEdit={onStartEdit}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  )
}

export { CommentsList }
