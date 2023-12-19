import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import DrawingCanvas from './components/DrawingCanvas'
import { Toaster } from 'react-hot-toast'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  { path: '/boards/:id/:name', element: <DrawingCanvas /> },
  {
    path: '*',
    element: <Navigate to='/' />
  }
])

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position='top-center' />
    </QueryClientProvider>
  </React.StrictMode>
)

reportWebVitals()
