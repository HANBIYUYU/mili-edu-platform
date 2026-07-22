import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Home from './pages/Home'
import About from './pages/About'
import Videos from './pages/Videos'
import Materials from './pages/Materials'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
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
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="videos" element={<Videos />} />
        <Route path="materials" element={<Materials />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      
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