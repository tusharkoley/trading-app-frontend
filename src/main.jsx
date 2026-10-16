import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import { queryClient, restoreMarketCache } from './data/marketCache'
import { preloadHomeData } from './data/useSnp500StocksData'

// Bound storage startup time so unavailable IndexedDB cannot hold up rendering.
async function startApp() {
  await Promise.race([restoreMarketCache(), new Promise(resolve => setTimeout(resolve, 500))])
  void preloadHomeData(queryClient)

  createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )

}

void startApp()
