import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CreateBlog from './pages/createBlog'
import Register from './pages/register'
import Login from './pages/login';
import Blogs from './pages/blogs';
import Blog from './pages/blog';
import Profile from './pages/profile'

import { socket } from './socket';

function Router() {
  const [isConnected, setConnection] = useState(false);
  useEffect(() => {

    const establishConnection = () => {
      socket.emit('connection');
    }

    socket.on('connected', () => {
      setConnection(true);
    });

    const heartbeat = setInterval(() => {
      console.log('is it working??');
      socket.emit('online');
    }, 3000);


    establishConnection();

    return () => {
      console.log('well maybe yeah')
      socket.off('connected');
      window.removeEventListener('beforeunload', () => {
        console.log('here');
        socket.close();
      })

      clearInterval(heartbeat);
    }
  }, []);
  return (
    <div className="App">
      {isConnected &&
        <BrowserRouter>
          <Routes >
            <Route path="/createBlog" element={<CreateBlog />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </BrowserRouter>}
    </div>
  );
}

export default Router;
