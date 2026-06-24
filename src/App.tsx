import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Settings, 
  Menu, 
  Bell, 
  User,
  Calendar,
  ClipboardList,
  FileText,
  List,
  UploadCloud
} from 'lucide-react';
import DataList from './pages/DataList';
import DataForm from './pages/DataForm';
import AdminSettings from './pages/AdminSettings';
import ImportData from './pages/ImportData';
import './index.css';

// A helper component to display the dynamic top navbar title
function TopNavbar({ isCollapsed, onToggle }: { isCollapsed: boolean, onToggle: () => void }) {
  const location = useLocation();
  
  let title = "หน้าหลัก";
  let subtitle = "";
  
  if (location.pathname === '/customers') {
    title = "รายการลูกค้า";
    subtitle = "Customer List";
  } else if (location.pathname === '/add') {
    title = "รับข้อมูลลูกค้าใหม่";
    subtitle = "Customer Intake";
  } else if (location.pathname === '/settings') {
    title = "ตั้งค่าระบบ";
    subtitle = "Admin Settings";
  } else if (location.pathname === '/import') {
    title = "นำเข้าข้อมูล";
    subtitle = "Import Data";
  }

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: isCollapsed ? '100px' : '260px',
      right: 0,
      height: '70px',
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      zIndex: 40,
      transition: 'left 0.3s ease-in-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={onToggle} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}>
          <Menu size={24} color="#64748b" />
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {title} 
          {subtitle && <span style={{ fontSize: '0.875rem', fontWeight: 400, color: '#64748b' }}>/ {subtitle}</span>}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={20} color="#64748b" />
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', fontSize: '0.65rem', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            3
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <User size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', lineHeight: 1.2 }}>Admin</span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const sidebarNavStyle = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    flexDirection: isSidebarCollapsed ? 'column' as const : 'row' as const,
    gap: isSidebarCollapsed ? '0.25rem' : '1rem',
    padding: isSidebarCollapsed ? '0.75rem' : '0.875rem 1.5rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    color: isActive ? '#ffffff' : '#94a3b8',
    background: isActive ? '#2563eb' : 'transparent',
    fontSize: isSidebarCollapsed ? '0.75rem' : '0.875rem',
    fontWeight: 500,
    transition: 'all 0.2s',
    textAlign: isSidebarCollapsed ? 'center' as const : 'left' as const,
  });

  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
        
        {/* Fixed Dark Blue Sidebar */}
        <aside style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: isSidebarCollapsed ? '100px' : '260px',
          background: '#0f172a', // Dark blue/slate
          borderRight: '1px solid #1e293b',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease-in-out'
        }}>
          {/* Logo Area */}
          <div style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid #1e293b', marginBottom: '1rem', minHeight: '90px' }}>
            {isSidebarCollapsed ? (
              <h2 style={{ color: '#ffffff', margin: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                G<span style={{ color: '#3b82f6' }}>F</span>
              </h2>
            ) : (
              <>
                <h2 style={{ color: '#ffffff', margin: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                  GOOD<span style={{ color: '#3b82f6' }}>FILM</span>
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.65rem', margin: '0.25rem 0 0 0', textAlign: 'center' }}>
                  Authorized Distributor<br/>3M Window Film
                </p>
              </>
            )}
          </div>
          
          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 0.5rem', overflowY: 'auto' }}>
            <NavLink to="/add" style={({isActive}) => sidebarNavStyle(isActive)}>
              <UserPlus size={24} />
              <span>รับข้อมูลลูกค้า</span>
            </NavLink>
            <NavLink to="/customers" style={({isActive}) => sidebarNavStyle(isActive)}>
              <List size={24} />
              <span>รายการลูกค้า</span>
            </NavLink>
            <NavLink to="/" style={({isActive}) => sidebarNavStyle(isActive)}>
              <Calendar size={24} />
              <span>นัดหมาย</span>
            </NavLink>
            <NavLink to="/" style={({isActive}) => sidebarNavStyle(isActive)}>
              <ClipboardList size={24} />
              <span>ติดตามงาน</span>
            </NavLink>
            <NavLink to="/" style={({isActive}) => sidebarNavStyle(isActive)}>
              <Users size={24} />
              <span>ลูกค้า</span>
            </NavLink>
            <NavLink to="/" style={({isActive}) => sidebarNavStyle(isActive)}>
              <FileText size={24} />
              <span>รายงาน</span>
            </NavLink>
            <div style={{ flex: 1, minHeight: '2rem' }}></div>
            <NavLink to="/import" style={({isActive}) => sidebarNavStyle(isActive)}>
              <UploadCloud size={24} />
              <span>นำเข้าข้อมูล</span>
            </NavLink>
            <NavLink to="/settings" style={({isActive}) => sidebarNavStyle(isActive)}>
              <Settings size={24} />
              <span>ตั้งค่า</span>
            </NavLink>
          </nav>
        </aside>

        {/* Dynamic Top Navbar */}
        <TopNavbar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

        {/* Main Content Area */}
        <main style={{ 
          flex: 1, 
          marginLeft: isSidebarCollapsed ? '100px' : '260px', 
          paddingTop: '70px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          transition: 'margin-left 0.3s ease-in-out'
        }}>
          <Routes>
            <Route path="/" element={<Navigate to="/add" replace />} />
            <Route path="/customers" element={<DataList />} />
            <Route path="/add" element={<DataForm />} />
            <Route path="/settings" element={<AdminSettings />} />
            <Route path="/import" element={<ImportData />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
