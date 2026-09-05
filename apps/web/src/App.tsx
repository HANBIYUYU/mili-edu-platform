import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import AboutPage from './pages/About'
import VideosPage from './pages/Videos'
import VideoDetailPage from './pages/VideoDetail'
import MaterialsPage from './pages/Materials'
import GalleryPage from './pages/Gallery'
import VoicesPage from './pages/Voices'
import AdminLayout from './components/AdminLayout'
import AdminLogin from './pages/Admin/Login'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminVideos from './pages/Admin/Videos'
import AdminMaterials from './pages/Admin/Materials'
import AdminGallery from './pages/Admin/Gallery'
import AdminVoices from './pages/Admin/Voices'
import AdminMoments from './pages/Admin/Moments'
import AdminContacts from './pages/Admin/Contacts'
import AdminMedia from './pages/Admin/MediaLibrary'

function App() {
  return (
    <Routes>
      {/* 前台：长滚动单页 */}
      <Route path="/" element={<Home />} />

      {/* 独立详情页 */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/videos" element={<VideosPage />} />
      <Route path="/videos/:id" element={<VideoDetailPage />} />
      <Route path="/materials" element={<MaterialsPage />} />
      <Route path="/voices" element={<VoicesPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/contact" element={<Navigate to="/#contact" replace />} />

      {/* 管理后台保持不变 */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="login" element={<AdminLogin />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="videos" element={<AdminVideos />} />
        <Route path="materials" element={<AdminMaterials />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="voices" element={<AdminVoices />} />
        <Route path="moments" element={<AdminMoments />} />
        <Route path="contacts" element={<AdminContacts />} />
        <Route path="media" element={<AdminMedia />} />
      </Route>
    </Routes>
  )
}

export default App
