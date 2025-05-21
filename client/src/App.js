import {
  PlusCircleOutlined,
  ProjectOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Typography } from 'antd';
import ProjectDashboard from 'pages/ProjectDashboard';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';

const { Sider, Header, Content } = Layout; 

const App = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Sidebar */}
      <Sider collapsible>
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
      </Sider>

      <Layout>
        {/* Header */}
        <Header>
          <Typography.Title level={2}>XYZ Company Project Planner</Typography.Title>
        </Header>

        {/* Main Layout */}
        <Content>
          <Routes>
            <Route path="/project-dashboard" element={<ProjectDashboard />}></Route>
            <Route path="/project-management" element={<div>Tasks Page (Coming Soon)</div>} />
            <Route path="/user-management" element={<div>Teams Page (Coming Soon)</div>} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
