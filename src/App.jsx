import { useState, useEffect } from 'react'
import { supabase } from './createClient'
import './App.css'

function App() {
  const [user, setUser] = useState({ name: '', age: '' })
  const [editUser, setEditUser] = useState({ id: null, name: '', age: '' })
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    const { data, error } = await supabase.from('users').select('*')
    if (!error) setUsers(data)
  }

  function handleChange(e) {
    setUser(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  function handleEditChange(e) {
    setEditUser(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  async function createUser(e) {
    e.preventDefault()
    await supabase.from('users').insert({ name: user.name, age: user.age })
    setUser({ name: '', age: '' })
    fetchUsers()
  }

  async function deleteUser(id) {
    await supabase.from('users').delete().eq('id', id)
    fetchUsers()
  }

  async function updateUser(e) {
    e.preventDefault()
    await supabase.from('users').update({
      name: editUser.name,
      age: editUser.age
    }).eq('id', editUser.id)
    setEditUser({ id: null, name: '', age: '' })
    fetchUsers()
  }

  function startEdit(user) {
    setEditUser(user)
  }

  return (
    <>
      {/* Formulário de Criação */}
      <form onSubmit={createUser}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={user.name}
          onChange={handleChange}
          autoComplete="off"
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={user.age}
          onChange={handleChange}
          autoComplete="off"
        />
        <button type="submit">Add User</button>
      </form>

      {/* Formulário de Edição */}
      {editUser.id && (
        <form onSubmit={updateUser}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={editUser.name}
            onChange={handleEditChange}
            autoComplete="off"
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={editUser.age}
            onChange={handleEditChange}
            autoComplete="off"
          />
          <button type="submit">Save Changes</button>
        </form>
      )}
      
      <table border="1px">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.age}</td>
              <td>
                <button onClick={() => deleteUser(u.id)}>Delete</button>
                <button onClick={() => startEdit(u)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default App