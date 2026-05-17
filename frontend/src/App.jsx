import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ContentDetail from './pages/ContentDetail';
import Favorites from './pages/Favorites';
import ContentManager from './pages/ContentManager';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Parent (Layout public avec Navbar) */}
        <Route path="/" element={<Layout />}>
          
          {/* Routes Publiques */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Routes Protégées (nécessitent d'être connecté) */}
          <Route element={<ProtectedRoute />}>
            <Route index element={<Home />} />
            <Route path="content/:id" element={<ContentDetail />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="manage" element={<ContentManager />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Route 404 (Catch-all) */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;