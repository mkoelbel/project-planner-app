import { FileTextOutlined, ProductOutlined } from '@ant-design/icons';
import { Flex, Progress, Select, Table, Tooltip } from 'antd';
import Typography from 'antd/es/typography/Typography';
import { useProjectsTasks } from 'api/analyticsApi';
import { useTeams } from 'api/teamsApi';
import { PRIORITY_LABELS, STATUS_LABELS } from 'constants/enums';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import './ProjectsTasksTable.css';

// Table columns
const projectIconColumn = {
    title: '',
    key: 'icon',
    render: () => <ProductOutlined style={{ color: '#9648c7', fontSize: 16 }} />,
    width: 50,
};
const taskIconColumn = {
    title: '',
    key: 'icon',
    render: () => <FileTextOutlined style={{ color: '#ff7a45', fontSize: 16 }} />,
    width: 50,
};
const SharedColumns = [
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

const projectColumns = [projectIconColumn, ...SharedColumns];
const taskColumns = [taskIconColumn, ...SharedColumns];

const ProjectsTasksTable = () => {
    // 1. Fetch data
    const { 
        data: projectsTasks = [], 
        isLoading: projectsTasksLoading, 
        error: projectsTasksError 
    } = useProjectsTasks();

    const { 
        data: teams = [], 
        isLoading: teamsLoading, 
        error: teamsError 
    } = useTeams();

    // 2. Get input options    
    const teamOptions = useMemo(() => 
        teams.map(team => ({
            value: team.id,
            label: team.name,
        })), [teams]
    );

    const projectOptions = useMemo(() =>
        projectsTasks.map(project => ({
            value: project.id,
            label: project.name,
        })), [projectsTasks]
    );

    // 3. Initialize selected inputs
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedProjects, setSelectedProjects] = useState([]);

    // 4. Set default input selections
    useEffect(() => {
        if (teamOptions.length > 0 && !selectedTeam) {
            setSelectedTeam(teamOptions[0].value);
        }
    }, [teamOptions, selectedTeam]);
    
    useEffect(() => {
    if (projectsTasks.length > 0 && selectedProjects.length === 0) {
        const allProjectIds = projectsTasks.map(project => project.id);
        setSelectedProjects(allProjectIds);
    }
    }, [projectsTasks, selectedProjects]);

    // 5. Filter data based on input selections
    const filteredProjectsTasks = useMemo(() => {
        return projectsTasks
        .filter(project => selectedProjects.includes(project.id))
        .map(project => {
            const filteredTasks = project.tasks.filter(task => task.user_team_id === selectedTeam);
            return {
                ...project,
                tasks: filteredTasks,
            };
        });
    }, [projectsTasks, selectedTeam, selectedProjects]);

    if (projectsTasksLoading || teamsLoading) return <Progress type='circle' />;
    if (projectsTasksError || teamsError) return <div>Error loading data.</div>;

    return (
        <>
            {/* Title */}
            <Typography.Title level={4}>Detailed Task Info</Typography.Title>

            <Flex vertical gap="middle">
                {/* Inputs */}
                <Flex gap='small'>
                    <div className='input-and-label-pair'>
                        <label htmlFor='team-select' className='input-label'>Team</label>
                        <Select 
                            id='team-select'
                            value={selectedTeam}
                            onChange={setSelectedTeam}
                            options={teamOptions}
                            allowClear
                            style={{ width: 250 }}
                        />
                    </div>

                    <div className='input-and-label-pair'>
                        <label htmlFor='project-select' className='input-label'>Projects</label>
                        <Select 
                            id='project-select'
                            value={selectedProjects}
                            onChange={setSelectedProjects}
                            options={projectOptions}
                            mode='multiple'
                            allowClear
                            maxTagCount={1}
                            style={{ width: 400 }}
                        />
                    </div>
                </Flex>

                {/* Table */}
                <Table 
                    columns={projectColumns}
                    dataSource={filteredProjectsTasks}
                    rowKey='id'
                    rowHoverable={false}
                    rowClassName={() => 'parent-row'}
                    expandable={{
                        expandedRowRender: project => (
                            <div className='child-table'>
                                <Table
                                    columns={taskColumns}
                                    dataSource={project.tasks}
                                    rowKey='id'
                                    rowHoverable={false}
                                    pagination={false}
                                    showHeader={false}
                                />
                            </div>
                        ),
                        expandedRowKeys: filteredProjectsTasks.map(project => project.id),
                        expandRowByClick: true,
                    }}
                />
            </Flex>
        </>
    );
};

export default ProjectsTasksTable;