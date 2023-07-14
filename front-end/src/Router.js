import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CreateBlog from './pages/createBlog'
import Register from './pages/register'

function Router() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes >
          <Route path="/createBlog" element={<CreateBlog />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Router;
