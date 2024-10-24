import { DeleteOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, List, Col, Row, Space, Divider, notification, message } from "antd";
import produce from "immer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const url = "/tasks";

export default function TaskList({ accessToken }) {

    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");




    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!accessToken) {
    //         navigate("/login"); 
    //     } else {
    //         getUserTasks();  
    //     }
    // }, [accessToken]);


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
            } else {
                notification.error({
                    message: "failed to get tasks"
                })
            }
        } catch (error) {
            notification.error({
                message: "Something went wrong!",
                description: error.toString()
            });
        }
    }
    useEffect(() => {
        if (accessToken) {
            getUserTasks();
        }
    }, [accessToken])

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
                'desc': task.desc || '',
                'marked_as_done': task.marked_as_done
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
        try {
            const response = await fetch(`${url}/${taskId}`, {
                method: "DELETE",
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                notification.error({
                    message: "Failed to delete task"
                });
                return false;
            } else {
                notification.success({
                    message: "Task deleted"
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
        if (newTaskTitle.trim() === "") {
            notification.warning({
                message: "Task title cannot be empty"
            });
            return;
        }
        const newTask = {
            id: null,
            title: newTaskTitle,
            description: ""
        };
        // setTasks(produce(tasks, draft => {
        //     draft.push(newTask);
        // }));
        addUserTaskToAPI(newTask);
        setNewTaskTitle("");
    };

    const handleInputChange = (e) => {
        setNewTaskTitle(e.target.value);
    };

    //UPDATE
    const handleNameChange = (task, event) => {
        console.log(event)
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].title = event.target.value;
        });
        setTasks(newTasks);


    };
    const handleBlur = (task) => {
        const updatedTask = { ...task };
        updateUserTaskInAPI(updatedTask);
    };

    const handleCompletedChange = (task, event) => {
        console.log(event)
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].marked_as_done = event.target.checked;
        });
        setTasks(newTasks);
        const updatedTask = { ...task, marked_as_done: event.target.checked };
        updateUserTaskInAPI(updatedTask);
    };




    //DELETE
    const handleDeleteTask = async (task) => {
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
                <Row justify="end" style={{ marginRight: '1rem', marginBottom: '1rem' }}>
                    <Space>
                        {!accessToken ? (
                            <>
                                <Button onClick={() => navigate('/createuser')}>Create User</Button>
                                <Button onClick={() => navigate('/login')}>Log In</Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={() => navigate('/logout')}>Log Out</Button>
                            </>
                        )}
                    </Space>
                </Row>
            </div>

            <Row type="flex" justify="center" style={{ minHeight: '100vh', marginTop: '6rem' }}>
                <Col span={12}>
                    <h1>Task List</h1>

                    {accessToken ? (
                        <>
                            <Space direction="horizontal" style={{ marginBottom: '1rem' }}>
                                <Input
                                    value={newTaskTitle}
                                    onChange={handleInputChange}
                                    placeholder="Enter task title"
                                />
                                <Button onClick={handleAddTask}>Add Task</Button>
                            </Space>
                            <Divider />
                            <List
                                size="small"
                                bordered
                                dataSource={tasks}
                                renderItem={(task) => (
                                    <List.Item key={task.id}>
                                        <Row type="flex" justify="space-between" align="middle" style={{ width: '100%' }}>
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
                                            <Button type="text" onClick={() => handleDeleteTask(task)}>
                                                <DeleteOutlined />
                                            </Button>
                                        </Row>
                                    </List.Item>
                                )}
                            />
                        </>
                    ) : (
                        <h2>Please log in or create a user to view your tasks</h2>
                    )}
                </Col>
            </Row>
        </>
    );
}

