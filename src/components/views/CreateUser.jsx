import { useNavigate } from "react-router";
import { Form, Input, Button, Row, Col, notification } from "antd";


const url = "/users";

function CreateUser() {
    
    const navigate = useNavigate();
    
    
    const createUser = async (values) => {
        const userData = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: values.username,
                newPassword: values.password,
                firstname: values.firstname,
                lastname: values.lastname
            })
           
        };
        

        try {
            const response = await fetch(url, userData);
            if (response.ok) {
                //const data = await response.json();
                //console.log('User created:', data);
                notification.success({
                    message: 'User created successfully!' 
                });
                navigate("/"); 
            } else {
                notification.error({
                    message: 'Failed to create user.',
                    description: `Error code: ${response.status}` 
                });
            }
        } catch (error) {
            notification.error({
                message: "Something went wrong!",
                description: error.toString() 
            });
        }
    }
   

    return <>
     <div>
            <Button onClick={()=>navigate('/')}>Back</Button>
        </div>
        <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Col span={4}>
                <h1>Create User</h1>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{ username: "", password: "", firstname: "", lastname: "" }}
                    onFinish={createUser}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Firstname"
                        name="firstname"
                        rules={[{ required: false }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Lastname"
                        name="lastname"
                        rules={[{ required: false }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button 
                        type="primary" 
                        htmlType="submit"
                        >Create User</Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    </>
}

export default CreateUser;