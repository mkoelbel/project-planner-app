import { Progress, Table, Tooltip } from 'antd';
import Typography from 'antd/es/typography/Typography';
import { useProjectsTasks } from 'api/analyticsApi';
import { PRIORITY_LABELS, STATUS_LABELS } from 'constants/enums';
import dayjs from 'dayjs';
import './ProjectsTasksTable.css';

const columns = [
    { 
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (name, record) => <Tooltip title={record.description}>{name}</Tooltip>,
        width: 400,
    },
    { 
        title: 'Assigned To',
        key: 'userFullName',
        render: (_, record) => {
            const firstName = record.user_first_name || '';
            const lastName = record.user_last_name || '';
            const fullName = `${lastName}, ${firstName}`.trim().replace(/^,|,$/, '');
            return fullName || '';
        },
        width: 200,
    },
    { 
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
        render: (priority) => PRIORITY_LABELS[priority],
        width: 100,
        
    },
    { 
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => STATUS_LABELS[status],
        width: 200,
        
    },
    { 
        title: 'Deadline',
        dataIndex: 'deadline',
        key: 'deadline',
        render: (date) => <div style={{ whiteSpace: "nowrap" }}>{dayjs(date).format('YYYY-MM-DD')}</div>,
        width: 200,
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
            columns={columns}
            dataSource={individualTeamProjectsTasks}
            rowKey='id'
            rowHoverable={false}
            expandable={{
                expandedRowRender: project => (
                    <Table
                        columns={columns}
                        dataSource={project.tasks}
                        rowKey='id'
                        rowHoverable={false}
                        pagination={false}
                        showHeader={false}
                    />
                ),
            }}
        />
    </>
  );
};

export default ProjectsTasksTable;