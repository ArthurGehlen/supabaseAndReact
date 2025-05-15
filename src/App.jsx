import { useState, useEffect } from 'react'
import { supabase } from './createClient'
import './App.css'

function App() {
  const [user, setUser] = useState({ name: '', message: '' })
  const [users, setUsers] = useState([])

  async function fetch_users() {
    const { data } = await supabase.from('users').select('*')
    setUsers(data)
  }

  function handle_change(e) {
    setUser(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  async function send_message(e) {
    e.preventDefault()

    if (user.name === '' || user.message === '') {
      return
    }

    await supabase.from('users').insert({ name: user.name, message: user.message })
    setUser({ name: '', message: '' })
    fetch_users()
  }

  useEffect(() => {
    fetch_users()
  }, [])

  return (
    <>
      {users.length > 0 &&
        <main>
          {users.map((user) => (
            <div className="card">
              <p className='username'>
                <strong>{user.name}</strong>
              </p>
              <p>{user.message}</p>
            </div>
          ))}
        </main>
      }

      <form onSubmit={send_message}>
        <input
          type="text"
          name="name"
          placeholder="Digite seu nome"
          value={user.name}
          onChange={handle_change}
          autoComplete="off"
          maxLength={40}
        />
        <input
          type="text"
          name="message"
          placeholder="Escreva uma mensagem (maximo de 200 caracteres)"
          value={user.message}
          onChange={handle_change}
          autoComplete="off"
          maxLength={200}
        />
        <button type="submit">Enviar mensagem</button>
      </form>
    </>
  )
}

export default App