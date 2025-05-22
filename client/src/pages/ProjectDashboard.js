import { Card, Flex } from 'antd';
import ProjectsTasksTable from 'components/charts/ProjectsTasksTable';
import ProjectStatusBarChart from 'components/charts/ProjectStatusBarChart';

const ProjectDashboard = () => {
  return (
    <Flex vertical gap="large">
      <Card><ProjectStatusBarChart /></Card>
      <Card><ProjectsTasksTable /></Card>
    </Flex>
  );
};

export default ProjectDashboard;