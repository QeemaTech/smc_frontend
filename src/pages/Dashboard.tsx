import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/DashboardSidebar';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('adminEmail');
    if (email) {
      setAdminEmail(email);
    }
    
    if (location.pathname === '/dashboard') {
      navigate('/dashboard/home', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="relative flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <main className="relative flex-1 overflow-y-auto lg:ml-64">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
