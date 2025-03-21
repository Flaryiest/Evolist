import {
  Route,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom';
import Index from '@/pages/home/index';
import Login from '@/pages/login/login';
import Signup from '@/pages/signup/signup';
import Error from '@/pages/error/error';

import DashboardHome from '@/pages/dashboard/pages/home/home';
import Skills from '@/pages/dashboard/pages/skills/skills';
import Tasks from '@/pages/dashboard/pages/tasks/tasks';
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Error />} />

      <Route path="/dashboard">
        <Route path="" element={<DashboardHome />} />
        <Route path="/dashboard/skills" element={<Skills />} />
        <Route path="/dashboard/tasks" element={<Tasks />} />
      </Route>
    </>
  )
);

export default router;
