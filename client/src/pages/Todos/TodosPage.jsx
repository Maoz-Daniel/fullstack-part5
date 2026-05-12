import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { createTodo, deleteTodo, updateTodo } from '../../services/todosService.js'

function TodosPage() {
  const { user, todos: initialTodos } = useLoaderData() // get the user and the todos from the loader data
  const [todos, setTodos] = useState(initialTodos)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('id')
  const [newTitle, setNewTitle] = useState('') // the title of the new todo that is being created
  const [editingTodoId, setEditingTodoId] = useState(null) // the id of the todo that is currently being edited (null if no todo is being edited)
  const [editingTitle, setEditingTitle] = useState('') // the new title of the todo that is being edited
  const [error, setError] = useState('')

  const normalizedSearchTerm = searchTerm.trim().toLowerCase()

  const visibleTodos = [...todos] 
    .filter((todo) => { // check if the term appears in any of the todo's fields (id, title, completed state)
      if (!normalizedSearchTerm) {
        return true
      }

      const completedLabel = todo.completed ? 'completed true' : 'not completed false'
      const fullString = `${todo.id} ${todo.title} ${completedLabel}`.toLowerCase()

      return fullString.includes(normalizedSearchTerm)
    })
    .sort((leftTodo, rightTodo) => { // sort the todos based on the selected field
      if (sortBy === 'title') {
        return leftTodo.title.localeCompare(rightTodo.title) // compare the titles in a case-insensitive way
      }

      if (sortBy === 'completed') {
        return Number(leftTodo.completed) - Number(rightTodo.completed)
      }

      return Number(leftTodo.id) - Number(rightTodo.id)
    })

  async function handleAddTodo(event) {
    event.preventDefault() 

    if (!newTitle.trim()) { //if the title the user entered is empty or only contains whitespace- error
      setError('Todo title is required.')
      return
    }

    try {
      const createdTodo = await createTodo(user.id, newTitle.trim())
      setTodos((currentTodos) => [...currentTodos, createdTodo]) // add the new todo to the list of todos
      setNewTitle('') // clear the input field
      setError('') // clear any previous error
    } catch {
      setError('Todo creation failed.')
    }
  }

  function handleStartEdit(todo) { 
    setEditingTodoId(todo.id)
    setEditingTitle(todo.title)
    setError('')
  }

  function handleCancelEdit() {
    setEditingTodoId(null)
    setEditingTitle('')
  }

  async function handleSaveEdit(todoId) {
    if (!editingTitle.trim()) {
      setError('Todo title is required.')
      return
    }

    try {
      const updatedTodo = await updateTodo(todoId, { title: editingTitle.trim() }) // update the todo on the server and get the updated todo back

      setTodos((currentTodos) => 
        currentTodos.map((todo) => (todo.id === todoId ? updatedTodo : todo)),
      //update the specific todo in the list of todos with the updated todo returned from the server
      )
      setEditingTodoId(null)
      setEditingTitle('')
      setError('')
    } catch {
      setError('Todo update failed.')
    }
  }

  async function handleToggleCompleted(todo) {
    try {
      //update tho todo complete
      const updatedTodo = await updateTodo(todo.id, { completed: !todo.completed })

      //update the specific todo in the list of todos with the updated todo returned from the server
      setTodos((currentTodos) =>
        currentTodos.map((currentTodo) => (currentTodo.id === todo.id ? updatedTodo : currentTodo)),
      )
      setError('')
    } catch {
      setError('Todo update failed.')
    }
  }

  async function handleDeleteTodo(todoId) {
    try {
      await deleteTodo(todoId)
      //remove the deleted todo from the list of todos
      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId))
      setError('')
    } catch {
      setError('Todo deletion failed.')
    }
  }

  return (
    <section>
      <h1 className="panel__title">Todos</h1>
      <p className="panel__subtitle">Manage only the todos that belong to the logged-in user.</p>

      <form className="auth-form" onSubmit={handleAddTodo}>
        <label className="auth-form__field">
          <span className="auth-form__label">Add todo</span>
          <input
            className="auth-form__input"
            type="text"
            name="newTodo"
            value={newTitle}
            onChange={(event) => {
              setNewTitle(event.target.value)
              if (error) {
                setError('')
              }
            }}
          />
        </label>

        <div className="button-row">
          <button type="submit" className="button">
            Create todo
          </button>
        </div>
      </form>

      <div className="todos-toolbar">
        <label className="auth-form__field">
          <span className="auth-form__label">Search</span>
          <input
            className="auth-form__input"
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        <label className="auth-form__field">
          <span className="auth-form__label">Sort by</span>
          <select
            className="auth-form__input"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="id">Id</option>
            <option value="title">Title</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </div>

      {error ? <p className="auth-form__error">{error}</p> : null}

      <div className="todos-list">
        {visibleTodos.length === 0 ? (
          <p className="panel__subtitle">No todos match the current filters.</p>
        ) : (
          visibleTodos.map((todo) => (
            <article key={todo.id} className="todo-card">
              <div className="todo-card__header">
                <div>
                  <p className="todo-card__meta">Todo #{todo.id}</p>
                  {editingTodoId === todo.id ? (
                    <input
                      className="auth-form__input"
                      type="text"
                      value={editingTitle}
                      onChange={(event) => setEditingTitle(event.target.value)}
                    />
                  ) : (
                    <h2 className="todo-card__title">{todo.title}</h2>
                  )}
                </div>

                <button
                  type="button"
                  className={todo.completed ? 'button' : 'button button--ghost'}
                  onClick={() => handleToggleCompleted(todo)}
                >
                  {todo.completed ? 'Completed' : 'Not completed'}
                </button>
              </div>

              <dl className="details-list">
                <div className="details-list__row">
                  <dt>Id</dt>
                  <dd>{todo.id}</dd>
                </div>
                <div className="details-list__row">
                  <dt>State</dt>
                  <dd>{todo.completed ? 'Completed' : 'Not completed'}</dd>
                </div>
              </dl>

              <div className="button-row">
                {editingTodoId === todo.id ? (
                  <>
                    <button
                      type="button"
                      className="button"
                      onClick={() => handleSaveEdit(todo.id)}
                    >
                      Save
                    </button>
                    <button type="button" className="button button--ghost" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="button button--ghost"
                    onClick={() => handleStartEdit(todo)}
                  >
                    Edit title
                  </button>
                )}

                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

export { TodosPage }
