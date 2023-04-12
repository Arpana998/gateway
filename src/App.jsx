import { Route, Routes, Navigate } from 'react-router-dom';
import AuthContext from './components/store/auth-context';
import { useContext } from 'react';
import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <Layout>
      <Routes>
        <Route path='/' element={<HomePage />} />
        {!authCtx.isLoggedIn && <Route path='/auth' element={<AuthPage />} />}
        {authCtx.isLoggedIn && <Route path='/profile' element={<UserProfile />} />}
        <Route path='*'
          element={<Navigate replace to='/'/>}
          />
      </Routes>
    </Layout>
  );
}
{/* <Route path="/somePath" element={<Navigate replace to="/" />} /> */}

export default App;
