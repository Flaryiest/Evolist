import {
  Route,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom';
import Index from '@/pages/home/index';
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Index />} />
    </>
  )
);

export default router;
