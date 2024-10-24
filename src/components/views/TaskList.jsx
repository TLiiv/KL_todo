import { DeleteOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, List, Col, Row, Space, Divider, notification, message } from "antd";
import produce from "immer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const url = "/tasks";

export default function TaskList({accessToken}) {
    
    const [tasks, setTasks] = useState([]);
    

    

    const navigate = useNavigate();

    //console.log(accessToken);


    //REST section

    //GET tasks from api
    const getUserTasks = async () => {
        const userTasks = {
            method: 'GET',
            headers: { 
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
             }
        }
        try {
            const response = await fetch(url, userTasks);

            if (response.ok) {
                const data = await response.json();
                setTasks(data);
                console.log("Tasks fetched", data)
            }else {
                notification.error({
                    message:"failed to get tasks"
                })
            }
        } catch (error) {
            notification.error({
                message: "Something went wrong!",
                description: error.toString() 
            });
        }
    }
    useEffect(()=>{
        if(accessToken){
            getUserTasks();
        }
    },[accessToken])

    //Add task to API
    const addUserTaskToAPI = async (task) => {
        const userTasks = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                'title': task.title || '',
                'desc': task.desc || ''
            })
        }
        try {
            const response = await fetch(url, userTasks);

            if (response.ok) {
                const data = await response.json();
                setTasks(prevTasks => [...prevTasks, data]);
                
            } else {
                notification.error({
                    message: "Failed to add task"
                });
                
            }
        } catch (error) {
            notification.error({
                message: "Something went wrong!",
                description: error.toString()
            });
          
        }
    }
    // Update task in API
    const updateUserTaskInAPI = async (task) => {
        const userTasks = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                'title': task.title,
                'desc': task.desc || ''
            })
        }
        try {
            const response = await fetch(`${url}/${task.id}`, userTasks);

            if (!response.ok) {
                notification.error({
                    message: "Failed to update task"
                });
            }
        } catch (error) {
            notification.error({
                message: "Something went wrong!",
                description: error.toString()
            });
        }
    }

    //Delete Tasks from API
    const deleteTaskFromAPI = async (taskId) => {
        try {const response = await fetch(`${url}/${taskId}`, {
            method:"DELETE",
            headers:{
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if(!response.ok){
            notification.error({
                message: "Failed to delete task"
            });
            return false;
        }else{
            notification.success({
                message :"Task deleted"
            })
            return true;
        }
    } catch (error) {
        notification.error({
            message: "Something went wrong!",
            description: error.toString()
        });
        return false;
        }
        
    }

    //CRUD section
 
    //Create
    const handleAddTask = () => {
        const newTask = {
            id: null, 
            title: "",
            description: ""
        };
        setTasks(produce(tasks, draft => {
            draft.push(newTask);
        }));
    };

    const handleSubmit = (task) => {
        
    }

    //UPDATE
    const handleNameChange = (task, event) => {
        console.log(event)
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].title = event.target.value;
        });
        setTasks(newTasks);
    };
    const handleCompletedChange = (task, event) => {
        console.log(event)
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].marked_as_done = event.target.checked;
        });
        setTasks(newTasks);
    };

  
 

    //DELETE
    const handleDeleteTask = async(task) => {
        setTasks(produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft.splice(index, 1);
        }));
        const success = await deleteTaskFromAPI(task.id);
        if (!success) {
            setTasks(produce(tasks, draft => {
                draft.push(task);
            }));
        }
    };

    return (
        <>
        <div>
            <Button onClick={()=>navigate('/createuser')}>Create User</Button>
        </div>
        <div>
            {!accessToken ? (
            <Button onClick={()=>navigate('/login')}>Log In</Button>
            ):(
            <Button onClick={()=>navigate('/logout')}>Log Out</Button>
            )
            }
            
        </div>
        <Row type="flex" justify="center" style={{minHeight: '100vh', marginTop: '6rem'}}>
            <Col span={12}>
                <h1>Task List</h1>
                
                <Button onClick={handleAddTask}>Add Task</Button>
                <Divider />
                <List
                    size="small"
                    bordered
                    dataSource={tasks}
                    renderItem={(task) => <List.Item key={task.id}>
                        <Row type="flex" justify="space-between" align="middle" style={{width: '100%'}}>
                            <Space>
                                <Checkbox 
                                checked={task.marked_as_done} 
                                onChange={(e) => handleCompletedChange(task, e)} 
                                />
                                <Input 
                                value={task.title} 
                                onChange={(event) => handleNameChange(task, event)} 
                                onBlur={() => handleBlur(task)} 
                                />
                                
                            </Space>
                            <Button type="text" onClick={() => handleDeleteTask(task)}><DeleteOutlined /></Button>
                        </Row>
                    </List.Item>}
                />
            </Col>
        </Row>
    </>
    )
}

//double task üks stateist ja üks api-st, refreshiga kaob ära
// import { DeleteOutlined } from "@ant-design/icons";
// import { Input, Button, Checkbox, List, Col, Row, Space, Divider, notification, message } from "antd";
// import produce from "immer";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router";

// const url = "/tasks";

// export default function TaskList({accessToken}) {
    
//     const [tasks, setTasks] = useState([
//         // {id: 1, name: "Task 1", completed: false},
//         // {id: 2, name: "Task 2", completed: true},
//     ]);
//     const [isAddingTask,setIsAddingTask] = useState(false);

    

//     const navigate = useNavigate();

//     //console.log(accessToken);

//     //GET tasks from api
//     const getUserTasks = async () => {
//         const userTasks = {
//             method: 'GET',
//             headers: { 
//                 'Content-type': 'application/json',
//                 'Authorization': `Bearer ${accessToken}`
//              }
//         }
//         try {
//             const response = await fetch(url, userTasks);

//             if (response.ok) {
//                 const data = await response.json();
//                 setTasks(data);
//                 console.log("Tasks fetched", data)
//             }else {
//                 notification.error({
//                     message:"failed to get tasks"
//                 })
//             }
//         } catch (error) {
//             notification.error({
//                 message: "Something went wrong!",
//                 description: error.toString() 
//             });
//         }
//     }
//     useEffect(()=>{
//         if(accessToken){
//             getUserTasks();
//         }
//     },[accessToken])

//     //Add task to API
//     const addUserTaskToAPI = async (task) => {
//         const userTasks = {
//             method: 'POST',
//             headers: {
//                 'Content-type': 'application/json',
//                 'Authorization': `Bearer ${accessToken}`
//             },
//             body: JSON.stringify({
//                 'title': task.title || '',
//                 'desc': task.desc || ''
//             })
//         }
//         try {
//             const response = await fetch(url, userTasks);

//             if (response.ok) {
//                 const data = await response.json();
//                 setTasks(prevTasks => [...prevTasks, data]);
//                 setIsAddingTask(false);
//             } else {
//                 notification.error({
//                     message: "Failed to add task"
//                 });
//                 setIsAddingTask(false);
//             }
//         } catch (error) {
//             notification.error({
//                 message: "Something went wrong!",
//                 description: error.toString()
//             });
//             setIsAddingTask(false);
//         }
//     }
//     // Update task in API
//     const updateUserTaskInAPI = async (task) => {
//         const userTasks = {
//             method: 'PUT',
//             headers: {
//                 'Content-type': 'application/json',
//                 'Authorization': `Bearer ${accessToken}`
//             },
//             body: JSON.stringify({
//                 'title': task.title,
//                 'desc': task.desc || ''
//             })
//         }
//         try {
//             const response = await fetch(`${url}/${task.id}`, userTasks);

//             if (!response.ok) {
//                 notification.error({
//                     message: "Failed to update task"
//                 });
//             }
//         } catch (error) {
//             notification.error({
//                 message: "Something went wrong!",
//                 description: error.toString()
//             });
//         }
//     }

//     //Delete Tasks from API
//     const deleteTaskFromAPI = async (taskId) => {
//         try {const response = await fetch(`${url}/${taskId}`, {
//             method:"DELETE",
//             headers:{
//                 'Content-type': 'application/json',
//                 'Authorization': `Bearer ${accessToken}`
//             }
//         });
//         if(!response.ok){
//             notification.error({
//                 message: "Failed to delete task"
//             });
//             return false;
//         }else{
//             notification.success({
//                 message :"Task deleted"
//             })
//             return true;
//         }
//     } catch (error) {
//         notification.error({
//             message: "Something went wrong!",
//             description: error.toString()
//         });
//         return false;
//         }
        
//     }

//     const handleNameChange = (task, event) => {
//         console.log(event)
//         const newTasks = produce(tasks, draft => {
//             const index = draft.findIndex(t => t.id === task.id);
//             draft[index].title = event.target.value;
//         });
//         setTasks(newTasks);
//     };

//     const handleBlur = (task) => {
//         if (!task.id && !isAddingTask) {
//             if (task.title.trim() !== "") { 
//                 setIsAddingTask(true);
//                 addUserTaskToAPI(task);
//             } else {
                
//                 notification.error({
//                     message: "Task title cannot be empty",
//                 });
//             }
//         } else {
//             updateUserTaskInAPI(task);
//         }
//     }

//     const handleCompletedChange = (task, event) => {
//         console.log(event)
//         const newTasks = produce(tasks, draft => {
//             const index = draft.findIndex(t => t.id === task.id);
//             draft[index].marked_as_done = event.target.checked;
//         });
//         setTasks(newTasks);
//     };

//     const handleAddTask = () => {
//         if (isAddingTask) return;
//         const newTask = {
//             id: null, 
//             title: "",
//             description: ""
//         };
//         setTasks(produce(tasks, draft => {
//             draft.push(newTask);
//         }));
//     };
 


//     const handleDeleteTask = async(task) => {
//         setTasks(produce(tasks, draft => {
//             const index = draft.findIndex(t => t.id === task.id);
//             draft.splice(index, 1);
//         }));
//         const success = await deleteTaskFromAPI(task.id);
//         if (!success) {
//             setTasks(produce(tasks, draft => {
//                 draft.push(task);
//             }));
//         }
//     };

//     return (
//         <>
//         <div>
//             <Button onClick={()=>navigate('/createuser')}>Create User</Button>
//         </div>
//         <div>
//             {!accessToken ? (
//             <Button onClick={()=>navigate('/login')}>Log In</Button>
//             ):(
//             <Button onClick={()=>navigate('/logout')}>Log Out</Button>
//             )
//             }
            
//         </div>
//         <Row type="flex" justify="center" style={{minHeight: '100vh', marginTop: '6rem'}}>
//             <Col span={12}>
//                 <h1>Task List</h1>
                
//                 <Button onClick={handleAddTask}>Add Task</Button>
//                 <Divider />
//                 <List
//                     size="small"
//                     bordered
//                     dataSource={tasks}
//                     renderItem={(task) => <List.Item key={task.id}>
//                         <Row type="flex" justify="space-between" align="middle" style={{width: '100%'}}>
//                             <Space>
//                                 <Checkbox 
//                                 checked={task.marked_as_done} 
//                                 onChange={(e) => handleCompletedChange(task, e)} 
//                                 />
//                                 <Input 
//                                 value={task.title} 
//                                 onChange={(event) => handleNameChange(task, event)} 
//                                 onBlur={() => handleBlur(task)} 
//                                 />
                                
//                             </Space>
//                             <Button type="text" onClick={() => handleDeleteTask(task)}><DeleteOutlined /></Button>
//                         </Row>
//                     </List.Item>}
//                 />
//             </Col>
//         </Row>
//     </>
//     )
// }