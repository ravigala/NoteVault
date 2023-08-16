import NoteContext from "./NoteContext";
import { useState } from 'react';

const NoteState = (props) => {

  const host = "http://localhost:5000";
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    // console.log("Fetching notes")
    const response = await fetch(`${host}/api/note/fetchallnotes`, {
      method: "GET",
      headers: {
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiN2JkODkzYjJhOGIwM2ZjY2UxYzk4In0sImlhdCI6MTY4OTk0NTgxNn0.V5L2FTPIa8bfTOw9aNQJJbIuYWMVubvokxtXBk2QMBI"
      },

    });
    const data = await response.json();
    // console.log(data)
    setNotes(data);
  }

  // Add a note
  const addNote = async (title, description, tag) => {
    // console.log("Adding a note...")
    const response = await fetch(`${host}/api/note/addnote`, {
      method: "POST",
      headers: {
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiN2JkODkzYjJhOGIwM2ZjY2UxYzk4In0sImlhdCI6MTY4OTk0NTgxNn0.V5L2FTPIa8bfTOw9aNQJJbIuYWMVubvokxtXBk2QMBI"
      },

      body: JSON.stringify({ title, description, tag }),
    });
    // console.log("Note added")
    const data = await response.json()
    // console.log(data)
    setNotes(notes.concat(data))
  }

  // Edit a note
  const editNote = async (id, title, description, tag) => {
    //  console.log("Editing the note...")
    const response = await fetch(`${host}/api/note/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiN2JkODkzYjJhOGIwM2ZjY2UxYzk4In0sImlhdCI6MTY4OTk0NTgxNn0.V5L2FTPIa8bfTOw9aNQJJbIuYWMVubvokxtXBk2QMBI"
      },

      body: JSON.stringify({ title, description, tag }),
    });
    // console.log("Note edited")
    const data = await response.json()
    // console.log(data)

    // let newNotes = JSON.parse(JSON.stringify(notes))
    // // Logic to display in client side
    // for(let i=0; i<newNotes.length; i++){
    //   if(newNotes[i]._id === id){
    //     newNotes[i].title = title;
    //     newNotes[i].description = description;
    //     newNotes[i].tag = tag;
    //     break;
    //   }
    // }
    // setNotes(newNotes);

    const newNotes = notes.map(note => {
      if (note._id === id) {
        return { ...note, title, description, tag };
      }
      return note;
    });
    // logic to edit in client
    setNotes(prev => newNotes);
  }

  // Delete a note
  const deleteNote = async (id) => {
    // console.log("Deleting note with id:" + id)
    const response = await fetch(`${host}/api/note/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiN2JkODkzYjJhOGIwM2ZjY2UxYzk4In0sImlhdCI6MTY4OTk0NTgxNn0.V5L2FTPIa8bfTOw9aNQJJbIuYWMVubvokxtXBk2QMBI"
      },

    });

    const updatedNotes = notes.filter((note) => {
      return note._id !== id
    })
    setNotes(updatedNotes);
  }

  return (
    <NoteContext.Provider value={{ notes, fetchNotes, addNote, editNote, deleteNote }}>
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState;