import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CreateBlog from './pages/createBlog'
import Register from './pages/register'
import Login from './pages/login';
import Blogs from './pages/blogs'
import Blog from './pages/blog'

function Router() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes >
          <Route path="/createBlog" element={<CreateBlog />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Router;
