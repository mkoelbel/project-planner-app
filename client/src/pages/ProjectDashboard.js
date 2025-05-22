import { Flex } from 'antd';
import ProjectsTasksTable from 'components/charts/ProjectsTasksTable';
import ProjectStatusBarChart from 'components/charts/ProjectStatusBarChart';

const ProjectDashboard = () => {
  return (
    <Flex vertical gap="large">
      <div><ProjectStatusBarChart /></div>
      <div><ProjectsTasksTable /></div>
    </Flex>
  );
};

export default ProjectDashboard;