import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { config } from '@/lib/wagmi'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </WagmiProvider>
  </StrictMode>,
)
