import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import { useState } from 'react';

import TaskList from './components/views/TaskList';
import Login from './components/views/Login';
import Logout from './components/views/Logout';
import CreateUser from './components/views/CreateUser';
import 'antd/dist/antd.css';
import './App.css';




function App() {
  const [accessToken,setAccessToken] = useState(localStorage.getItem('token'));
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskList accessToken={accessToken}/>} />
        <Route path="/login" element={<Login setAccessToken={setAccessToken} />} />
        <Route path="/logout" element={<Logout setAccessToken={setAccessToken} />} />
        <Route path="/createuser" element={<CreateUser />} />
      </Routes>
    </Router>
  );
}

export default App;
