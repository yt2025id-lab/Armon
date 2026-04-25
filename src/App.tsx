import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import PoolDetail from '@/pages/PoolDetail'
import CreatePool from '@/pages/CreatePool'
import Dashboard from '@/pages/Dashboard'
import YieldOptimizer from '@/pages/YieldOptimizer'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pool/:id" element={<PoolDetail />} />
        <Route path="/create" element={<CreatePool />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/yield-optimizer" element={<YieldOptimizer />} />
      </Routes>
    </div>
  )
}

export default App