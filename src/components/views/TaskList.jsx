import { DeleteOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, List, Col, Row, Space, Divider, notification, message } from "antd";
import produce from "immer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const url = "/tasks";

export default function TaskList({accessToken}) {
    
    const [tasks, setTasks] = useState([
        // {id: 1, name: "Task 1", completed: false},
        // {id: 2, name: "Task 2", completed: true},
    ]);

    

    const navigate = useNavigate();

    //console.log(accessToken);

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
    const addUserTaskToAPI = async (title,description) => {
        const userTasks = {
            method: 'POST',
            headers: { 
                'Content-type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
             },
             body: JSON.stringify({
                'title' : title,
                'desc' : description
             })
        }
        try {
            const response = await fetch(url, userTasks);

            if (response.ok) {
                const data = await response.json();
                setTasks(prevtasks=>[...prevtasks,data]);
                console.log("Tasks added", data)
            }else {
                notification.error({
                    message:"failed to add tasks"
                })
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

    const handleAddTask = () => {
        const newTask = {
            id: Math.random(),
            title: "", 
            marked_as_done: false
        };
        
        setTasks(produce(tasks, draft => {
            draft.push(newTask);
        }));
    };

    const handleSubmitTask = (task) => {
        if (task.title.trim()) {
            addUserTaskToAPI(task.title, "");
        } else {
            notification.error({ message: "Task title cannot be empty" });
        }
    };

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
                                onBlur={() => handleSubmitTask(task)}
                                />
                                {task.isNew ? (
                                        <Button type="primary" onClick={() => handleSaveTask(task)}>
                                            Save
                                        </Button>
                                    ) : null}
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