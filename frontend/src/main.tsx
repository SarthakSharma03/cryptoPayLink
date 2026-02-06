import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import { WalletProvider } from './components/wallet/WalletProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <WalletProvider>
   <AuthProvider>
           <UserProvider>
               <App/>
           </UserProvider>
         </AuthProvider>
</WalletProvider>
  </StrictMode>
)
