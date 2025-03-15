import {
  Route,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom';
import Index from '@/pages/home/index';
import Login from '@/pages/login/login';
import Signup from '@/pages/signup/signup';
import Error from '@/pages/error/error';
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Error />} />
    </>
  )
);

export default router;
