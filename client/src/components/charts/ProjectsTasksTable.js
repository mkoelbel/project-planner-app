import { Progress, Table } from 'antd';
import Typography from 'antd/es/typography/Typography';
import { useProjectsTasks } from 'api/analyticsApi';

const projectColumns = [
    { title: 'Project Name', dataIndex: 'name', key: 'projectName' },
    { title: 'Project Description', dataIndex: 'description', key: 'projectDescription' },
    { title: 'Project Priority', dataIndex: 'priority', key: 'projectPriority' },
    { title: 'Project Status', dataIndex: 'status', key: 'projectStatus' },
    { title: 'Project Deadline', dataIndex: 'deadline', key: 'projectDeadline' },
];

const taskColumns = [
    { title: 'Task Name', dataIndex: 'name', key: 'taskName' },
    { title: 'Task Description', dataIndex: 'description', key: 'taskDescription' },
    { title: 'Assigned To', dataIndex: 'user_email', key: 'taskUserEmail' },
    { title: 'Task Status', dataIndex: 'status', key: 'taskStatus' },
    { title: 'Task Deadline', dataIndex: 'deadline', key: 'taskDeadline' },
];

const selectedTeamId = 1; // Replace with the actual selected team ID

const filterProjectsTasksByTeam = (projectsTasks, teamId) => {
    return projectsTasks
    .map(project => {
        const filteredTasks = project.tasks.filter(task => task.user_team_id === teamId);
        return {
            ...project,
            tasks: filteredTasks,
        };
    })
    .filter(project => project.tasks.length > 0);
};

const ProjectsTasksTable = () => {
  const { data, isLoading, error } = useProjectsTasks();

  if (isLoading) return <Progress type='circle' />;
  if (error) return <div>Error loading data.</div>;

  const individualTeamProjectsTasks = filterProjectsTasksByTeam(data, selectedTeamId);

  return (
    <>
        {/* Title */}
        <Typography.Title level={4}>Detailed Task Info</Typography.Title>

        {/* Table */}
        <Table 
            columns={projectColumns}
            dataSource={individualTeamProjectsTasks}
            rowKey='id'
            expandable={{
                expandedRowRender: project => (
                    <Table
                        columns={taskColumns}
                        dataSource={project.tasks}
                        rowKey='id'
                        pagination={false}
                        // showHeader={false} 
                    />
                ),
            }}
        />
    </>
  );
};

export default ProjectsTasksTable;