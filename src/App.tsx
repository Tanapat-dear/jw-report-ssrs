import Home from './Pages/Home'
import './App.css'
import { createBrowserRouter, RouterProvider , Navigate} from 'react-router'
import Dashboard from './Pages/Dashboard'
import Rootlayout from './Layout/Rootlayout'
import MasterTablePage from './Pages/MasterTablePage'
import ErrorPage from './Pages/ErrorPage'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true , element: <Navigate to="/home" /> },
      { path: "/home", element: <Home /> },
      { path: "reports/:process", element: <Dashboard /> },
      { path: "/mastertable", element: <MasterTablePage />}
    ],
  },
]);

function App() {


  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App
