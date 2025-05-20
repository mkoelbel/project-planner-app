import {
  PlusCircleOutlined,
  ProjectOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import ProjectDashboard from './pages/ProjectDashboard';

const AppLayout = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Sidebar */}
      <Layout.Sider collapsible>
        <Menu 
          theme="dark" 
          mode="inline" 
          defaultSelectedKeys={['project-dashboard']}
          onClick={({ key }) => navigate(`/${key}`)}
        >
          <Menu.Item key="project-dashboard" icon={<ProjectOutlined />}>Project Dashboard</Menu.Item>
          <Menu.Item key="project-management" icon={<PlusCircleOutlined />}>Project Management</Menu.Item>
          <Menu.Item key="user-management" icon={<UserOutlined />}>User Management</Menu.Item>
        </Menu>
      </Layout.Sider>

      {/* Main Layout */}
      <Layout>
        <Layout.Content>
          <Routes>
            <Route path="/project-dashboard" element={<ProjectDashboard />}></Route>
            <Route path="/project-management" element={<div>Tasks Page (Coming Soon)</div>} />
            <Route path="/user-management" element={<div>Teams Page (Coming Soon)</div>} />
          </Routes>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

const App = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App;
