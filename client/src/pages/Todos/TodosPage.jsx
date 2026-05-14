import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx'
import { usePaginatedItems } from '../../hooks/usePaginatedItems.js'
import { createTodo, deleteTodo, getTodosBatch, updateTodo } from '../../services/todosService.js'
import { TodosList } from './components/TodosList.jsx'
import { TodosSidebar } from './components/TodosSidebar.jsx'
import { getVisibleTodos } from './helpers.js'

function TodosPage() {
  const { user, todos: initialTodos, nextPage: initialNextPage } = useLoaderData() // get the user and the todos from the loader data
  const { items: todos, setItems: setTodos, nextPage, isLoadingMore, loadMore } =
    usePaginatedItems(initialTodos, initialNextPage)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('id')
  const [newTitle, setNewTitle] = useState('') // the title of the new todo that is being created
  const [editingTodoId, setEditingTodoId] = useState(null) // the id of the todo that is currently being edited (null if no todo is being edited)
  const [editingTitle, setEditingTitle] = useState('') // the new title of the todo that is being edited
  const [error, setError] = useState('')
  const [pendingDeleteTodo, setPendingDeleteTodo] = useState(null)

  const visibleTodos = getVisibleTodos(todos, searchTerm, sortBy)

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

  async function handleLoadMoreTodos() {
    try {
      await loadMore((page) => getTodosBatch(user.id, page))
      setError('')
    } catch {
      setError('Todo loading failed.')
    }
  }

  async function handleConfirmDeleteTodo() {
    if (!pendingDeleteTodo) {
      return
    }

    await handleDeleteTodo(pendingDeleteTodo.id)
    setPendingDeleteTodo(null)
  }

  return (
    <section>
      <h1 className="panel__title">Todos</h1>
      <p className="panel__subtitle">Manage only the todos that belong to the logged-in user.</p>

      <div className="todos-layout">
        <TodosSidebar
          newTitle={newTitle}
          onNewTitleChange={(value) => {
            setNewTitle(value)
            if (error) {
              setError('')
            }
          }}
          onAddTodo={handleAddTodo}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          error={error}
        />

        <TodosList
          visibleTodos={visibleTodos}
          editingTodoId={editingTodoId}
          editingTitle={editingTitle}
          onEditingTitleChange={setEditingTitle}
          onToggleCompleted={handleToggleCompleted}
          onStartEdit={handleStartEdit}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onDelete={setPendingDeleteTodo}
        />

        {nextPage ? (
          <div className="button-row">
            <button type="button" className="button" onClick={handleLoadMoreTodos} disabled={isLoadingMore}>
              {isLoadingMore ? 'Loading...' : 'Load more'}
            </button>
          </div>
        ) : null}
      </div>

      <ConfirmDialog
        open={pendingDeleteTodo !== null}
        title="Delete this todo?"
        message={
          pendingDeleteTodo
            ? `Todo #${pendingDeleteTodo.id} will be removed from your list.`
            : 'This todo will be removed from your list.'
        }
        confirmLabel="Delete todo"
        onConfirm={handleConfirmDeleteTodo}
        onCancel={() => setPendingDeleteTodo(null)}
      />
    </section>
  )
}

export { TodosPage }
