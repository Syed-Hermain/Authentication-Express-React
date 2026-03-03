import { useState } from 'react'
import './App.css'
import { getNotes } from './api/notesApi';
import { useEffect } from 'react';
function App() {

  const [notes, setNotes] = useState([]);

  const fetchNotes = async() =>{
    const {data} = await getNotes();
    setNotes(data);
  }


  useEffect(()=>{
    fetchNotes();
  }, [])

  return (
    <>
      <h1>Hello world!</h1>

      {notes.map(note => (
        <div key={note.id}>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </div>
      ))}
    </>
  )
}

export default App
