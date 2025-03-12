import { useEffect, useState } from "react";

export default function Todo(){

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [editId, setEditId] = useState(-1);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const apiUrl = "http://localhost:8000";

    const handleSubmit = () =>{
        setError("");
        if(title.trim() !== '' && description.trim() !== ''){

            fetch(apiUrl+"/todos",{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({title,description})
            })
            .then((res)=>{
                if(res.ok){
                    setTodos([...todos, {title,description}]);
                    setMessage("Item added Successfully!");
                    setTimeout(()=>{
                        setMessage("");
                    },3000)
                    setTitle("");
                    setDescription("");
                }
                else{
                    setError("Unable to create ToDo item");
                }
                
            })
            .catch((error)=>{
                console.log("Error", error);
                setError("Something went wrong. Please try again");
            });

        }
        else{
            setError("Title and Description cannot be empty!");
        }
    }

    useEffect(()=>{
        getItems()
    },[]);

    const getItems = () =>{
        fetch(apiUrl+"/todos")
        .then((res)=>{
            return res.json();
        })
        .then((res)=>{
            setTodos(res)
        })
    }


    // Holding the edit items

    const handleEdit = (item) =>{

        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);       
    }
    

    // Updating the items


    const handleUpdate = () =>{
        setError("");
        if(editTitle.trim() !== '' && editDescription.trim() !== ''){

            fetch(apiUrl+"/todos/"+editId,{
                method:"PUT",
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({title: editTitle,description: editDescription})
            })
            .then((res)=>{
                if(res.ok){

                    // update the item

                    const updatedTodos = todos.map((item) => {
                        if(item._id === editId){
                            item.title = editTitle;
                            item.description = editDescription
                        }
                        return item;
                    })

                    setTodos(updatedTodos);
                    setMessage("Item Updated Successfully!");
                    setTimeout(()=>{
                        setMessage("");
                    },3000)
                    setTitle("");
                    setDescription("");
                    setEditId(-1);
                }
                else{
                    setError("Unable to update ToDo item");
                }
                
            })
            .catch((error)=>{
                console.log("Error", error);
                setError("Something went wrong. Please try again");
            });

        }
        else{
            setError("Title and Description cannot be empty!");
        }
    }


    const handleEditCancel = ()=>{
        setEditId(-1);
    }

    const handleDelete = (id) =>{
        if(window.confirm('Are you sure want to delete?')){
            fetch(apiUrl+"/todos/"+id, {
                method:"DELETE"
            })
            .then(()=>{
               const updatedTodos = todos.filter((item)=> item._id !== id);
               setTodos(updatedTodos);
            })
        }
    }

    

    return(
        <>
            <div className="row p-3 bg-success text-light text-center">
                <h1>TaskNest</h1>
            </div>

            <div className="row">
                <h3>Add Item</h3>
                {message && <p className="text-success">{message}</p> }
                <div className="form-group d-flex gap-2">
                    <input placeholder="Title"
                           className="form-control"
                           value = {title} 
                           onChange={(e)=>setTitle(e.target.value)}
                           type="text"/>
                    <input placeholder="Description" 
                           className="form-control"
                           value = {description} 
                           onChange={(e)=>setDescription(e.target.value)}
                           type="text"/>
                    <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
                </div>
                {error && <p className="text-danger">{error}</p>}
            </div>

            <div className="row my-3">
                <h3>Tasks</h3>

                <div className="col-md-6">

                <ul className="list-group">

                    {
                        todos.map((item)=>
                        
                        <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                            <div className="d-flex flex-column me-2"> 
                                {
                                    (editId === -1 || editId !== item._id) ?

                                    // Item details if the edit button is not clicked

                                    <>
                                    <span className="fw-bold">{item.title}</span>
                                    <span>{item.description}</span>
                                    </> :

                                    // Input boxes for the update items

                                    <>
                                    <div className="form-group d-flex gap-2">
                                        <input placeholder="Title"
                                               className="form-control"
                                               value = {editTitle} 
                                               onChange={(e)=>setEditTitle(e.target.value)}
                                               type="text"/>
                                        <input placeholder="Description" 
                                            className="form-control"
                                            value = {editDescription} 
                                            onChange={(e)=>setEditDescription(e.target.value)}
                                            type="text"/>
                                    </div>
                                    </>
                                }  
                                
                            </div> 
                            <div className="d-flex gap-2">

                                {
                                    (editId === -1 || editId !== item._id) ? 
                                    <button className="btn btn-warning" onClick={()=>handleEdit(item)}>Edit</button> :
                                    <button className="btn btn-warning" onClick={handleUpdate}>Update</button>
                                }

                                {
                                
                                    (editId === -1 || editId !== item._id) ?
                                    <button className="btn btn-danger" onClick={()=>handleDelete(item._id)}>Delete</button>:
                                    <button className="btn btn-dark" onClick={handleEditCancel}>Cancel</button>
                                }   
                            </div>
                        </li>
                        
                        )
                    }

                    
                </ul>

                </div>
            </div>

        </>
    );
}