import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CreateBlog from './pages/createBlog'
import Register from './pages/register'
import Login from './pages/login';
import Blogs from './pages/blogs'

function Router() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes >
          <Route path="/createBlog" element={<CreateBlog />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blogs" element={<Blogs />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Router;
