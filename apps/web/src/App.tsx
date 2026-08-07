import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import AdminLayout from './components/AdminLayout'
import AdminLogin from './pages/Admin/Login'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminVideos from './pages/Admin/Videos'
import AdminMaterials from './pages/Admin/Materials'
import AdminGallery from './pages/Admin/Gallery'
import AdminContacts from './pages/Admin/Contacts'

function App() {
  return (
    <Routes>
      {/* 前台：长滚动单页 */}
      <Route path="/" element={<Home />} />

      {/* 旧路由重定向到首页锚点 */}
      <Route path="/about" element={<Navigate to="/#about" replace />} />
      <Route path="/videos" element={<Navigate to="/#videos" replace />} />
      <Route path="/materials" element={<Navigate to="/#materials" replace />} />
      <Route path="/gallery" element={<Navigate to="/#gallery" replace />} />
      <Route path="/contact" element={<Navigate to="/#contact" replace />} />

      {/* 管理后台保持不变 */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="login" element={<AdminLogin />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="videos" element={<AdminVideos />} />
        <Route path="materials" element={<AdminMaterials />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="contacts" element={<AdminContacts />} />
      </Route>
    </Routes>
  )
}

export default App
