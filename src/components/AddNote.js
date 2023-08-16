import React , {useContext, useState} from 'react'
import noteContext from '../context/notes/NoteContext';

function AddNote(props) {

    const context = useContext(noteContext);
    const {addNote} = context;

    const[note, setNote] = useState({title:"", description:"", tag:""})

    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({title:"", description:"", tag:""})
        props.showAlert("Note added successfully", "success")
    }

    const onChange = (e) => {
        setNote({...note, [e.target.name] : e.target.value})
    }

    return (
        <div>
            <div className='container my-3'>
                <h2 className='my-3'>Add a Note</h2>

                <form className='my-3'>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" name="title" id="title" value={note.title} onChange={onChange} required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" name="description" id="description" value={note.description} onChange={onChange} required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input type="text" className="form-control" name="tag" id="tag" value={note.tag} onChange={onChange}/>
                    </div>
                    <button type="submit" disabled={note.title.length < 3 || note.description.length < 5} onClick={handleClick} className="btn btn-primary">Add Note</button>
                </form>
            </div>
        </div>
    )
}

export default AddNote
