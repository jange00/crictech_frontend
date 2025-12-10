// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import {ToastContainer,Slide, Zoom, Bounce, Flip} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { router } from './routers/appRouter';
import ReactQueryProvider from './provider/reactQueryProvider';
import AuthProvider from './auth/AuthProvider';

const App = () => {
  // Prevent scroll restoration on page refresh
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Restore dark mode from localStorage on app load
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <ReactQueryProvider>
      <AuthProvider>
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false}
          theme='dark'
          transition={Flip}
        />
        <RouterProvider router={router} />
      </AuthProvider>
    </ReactQueryProvider>
  );
};

export default App;