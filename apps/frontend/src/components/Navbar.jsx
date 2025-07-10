import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav style={{
      padding: '1rem 2rem',
      background: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backdropFilter: 'blur(8px)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)'
    }}>
      {/* Logo */}
      <div style={{ 
        fontSize: '1.75rem',
        fontWeight: '700',
        color: '#1f2937',
        letterSpacing: '-0.025em'
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          CMS Blog
        </Link>
      </div>
      
      {/* Navigation Links */}
      <div style={{ 
        display: 'flex', 
        gap: '2rem',
        alignItems: 'center'
      }}>
        {['/', '/posts', '/categories', '/about', '/contact'].map((path, i) => {
          const labels = ['Home', 'Posts', 'Categories', 'About', 'Contact'];
          return (
            <Link
              key={path}
              to={path}
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}
            >
              {labels[i]}
            </Link>
          );
        })}

        {/* Divider */}
        <div style={{
          width: '1px',
          height: '24px',
          background: '#e5e7eb',
          margin: '0 0.5rem'
        }}></div>

        {/* Auth Buttons */}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            style={{
              color: '#ef4444',
              background: 'transparent',
              border: '1px solid #fecaca',
              cursor: 'pointer',
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            style={{
              color: '#ffffff',
              textDecoration: 'none',
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              background: '#3b82f6',
              fontSize: '0.875rem',
              fontWeight: '500',
              display: 'inline-block'
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;