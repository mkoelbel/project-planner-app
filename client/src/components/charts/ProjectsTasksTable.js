import { Progress, Table, Tooltip } from 'antd';
import Typography from 'antd/es/typography/Typography';
import { useProjectsTasks } from 'api/analyticsApi';
import { PRIORITY_LABELS, STATUS_LABELS } from 'constants/enums';
import dayjs from 'dayjs';
import './ProjectsTasksTable.css';

const projectColumns = [
    { 
        title: 'Project Name',
        dataIndex: 'name',
        key: 'projectName',
        render: (name, record) => <Tooltip title={record.description}>{name}</Tooltip>,
    },
    { 
        title: 'Project Priority',
        dataIndex: 'priority',
        key: 'projectPriority',
        render: (priority) => PRIORITY_LABELS[priority],

    },
    { 
        title: 'Project Status',
        dataIndex: 'status',
        key: 'projectStatus',
        render: (status) => STATUS_LABELS[status],

    },
    { 
        title: 'Project Deadline',
        dataIndex: 'deadline',
        key: 'projectDeadline',
        render: (date) => <div style={{ whiteSpace: "nowrap" }}>{dayjs(date).format('YYYY-MM-DD')}</div>,
    },
];

const taskColumns = [
    { 
        title: 'Task Name',
        dataIndex: 'name',
        key: 'taskName',
        render: (name, record) => <Tooltip title={record.description}>{name}</Tooltip>,
    },
    { 
        title: 'Assigned To',
        key: 'taskUserFullName',
        render: (_, record) => `${record.user_last_name}, ${record.user_first_name}`,
    },
    { 
        title: 'Task Status',
        dataIndex: 'status',
        key: 'taskStatus',
        render: (status) => STATUS_LABELS[status],
    },
    { 
        title: 'Task Deadline',
        dataIndex: 'deadline',
        key: 'taskDeadline',
        render: (date) => <div style={{ whiteSpace: "nowrap" }}>{dayjs(date).format('YYYY-MM-DD')}</div>,
    },
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
            rowHoverable={false}
            expandable={{
                expandedRowRender: project => (
                    <Table
                        columns={taskColumns}
                        dataSource={project.tasks}
                        rowKey='id'
                        rowHoverable={false}
                        pagination={false}
                    />
                ),
            }}
        />
    </>
  );
};

export default ProjectsTasksTable;