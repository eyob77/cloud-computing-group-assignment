import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import { ClerkProvider } from "@clerk/clerk-react";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

import {BrowserRouter} from 'react-router-dom';
import { AuthProvider } from './context/authContext.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ClerkProvider publishableKey={clerkPubKey}>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </ClerkProvider>
    </StrictMode>,
)
