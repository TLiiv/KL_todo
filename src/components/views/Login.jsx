import { Form, Input, Button, Row, Col, notification } from "antd";
import { useNavigate } from "react-router";


const url = "/users/get-token";

export default function Login({setAccessToken}) {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: values.username,
                    password: values.password,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Success:', data);
                notification.success({
                    message: 'Logged in'
                });
                if (data.access_token) {
                    //console.log('Access Token:', data.access_token);
                    localStorage.setItem('token', data.access_token);
                    setAccessToken(data.access_token);
                    navigate("/");
                } else {
                    console.error('Access token not found in the response');
                }
            } else {
                console.error('Login failed:', errorData);
                notification.error({
                    message: 'Wrong username or password',
                    description: errorData.message || 'Login failed. Please try again.',
                });
            }
        } catch (error) {
            console.error('Error during login:', error);
            notification.error({
                message: 'Network or server error occurred',
                description: 'Please check your connection or try again later.',
            });
        }
    };


    return (
        <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Col span={4}>
                <h1>Login</h1>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{ username: "", password: "" }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
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
                        <Button type="primary" htmlType="submit">Login</Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    )
}