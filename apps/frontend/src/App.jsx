import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import PostAdmin from './pages/admin/PostAdmin';
import AdminCMSLayout from './layouts/AdminLayout';

const App = () => {
  return (
    <Routes>
       <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:id" element={<PostDetail />} />
      </Route>

      <Route path="/admin" element={<AdminCMSLayout />}>
        <Route path="posts" element={<PostAdmin />} />
        
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};

export default App;
