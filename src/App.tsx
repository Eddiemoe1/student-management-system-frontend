import './index.css';

import { Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout';
import {Login} from './Components/Login';
import AdminDashboard from './Pages/AdminDashboard';
import Lecturer from './Pages/Lecturer';
import {Marks} from './Pages/Marks';
import Staff from './Pages/Staff';
import {Students} from './Pages/Student';
import  {Subjects} from './Pages/Subject';
import Signup from './Components/Signup';
import Lecturers from './Pages/Lecturers';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="staff" element={<Staff />} />
        <Route path="lectures" element={<Lecturer />} />
        <Route path="marks" element={<Marks />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="lecturers" element={<Lecturers />} />
      </Route>
    </Routes>
  );
}

export default App;




