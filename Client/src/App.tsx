import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Scanner from './pages/Scanner';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/signup" element={<SignUp />} /> */}
            <Route path="/scanner" element={<PrivateRoute element={<Scanner />} />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          </Routes>
          <Toaster position="top-center" />
        </div>
      </Router>
    </Provider>
  );
}

export default App;