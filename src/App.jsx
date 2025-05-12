import { useState, useEffect } from 'react'
import { supabase } from './createClient'
import './App.css'

function App() {
  const [user, setUser] = useState({ name: '', age: '' })
  const [editUser, setEditUser] = useState({ id: null, name: '', age: '' })
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch_users()
  }, [])

  async function fetch_users() {
    const { data, error } = await supabase.from('users').select('*')
    if (!error) setUsers(data)
  }

  function handle_change(e) {
    setUser(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  function handle_edit_change(e) {
    setEditUser(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  async function create_user(e) {
    e.preventDefault()
    await supabase.from('users').insert({ name: user.name, age: user.age })
    setUser({ name: '', age: '' })
    fetch_users()
  }

  async function delete_user(id) {
    await supabase.from('users').delete().eq('id', id)
    fetch_users()
  }

  async function update_user(e) {
    e.preventDefault()
    await supabase.from('users').update({
      name: editUser.name,
      age: editUser.age
    }).eq('id', editUser.id)
    setEditUser({ id: null, name: '', age: '' })
    fetch_users()
  }

  function start_edit(user) {
    setEditUser(user)
  }

  return (
    <>
      <form onSubmit={create_user}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={user.name}
          onChange={handle_change}
          autoComplete="off"
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={user.age}
          onChange={handle_change}
          autoComplete="off"
        />
        <button type="submit">Add User</button>
      </form>

      {editUser.id && (
        <form onSubmit={update_user}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={editUser.name}
            onChange={handle_edit_change}
            autoComplete="off"
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={editUser.age}
            onChange={handle_edit_change}
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
              <td className='options'>
                <button className='edit' onClick={() => start_edit(u)}>Edit</button>
                <button className='delete' onClick={() => delete_user(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default App