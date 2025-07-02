import { FileTextOutlined, ProductOutlined } from '@ant-design/icons';
import { Flex, Progress, Select, Table, Tooltip } from 'antd';
import Typography from 'antd/es/typography/Typography';
import { useProjectsTasks } from 'api/analyticsApi';
import { useTeams } from 'api/teamsApi';
import { useUsers } from 'api/usersApi';
import { PRIORITY_LABELS, STATUS_LABELS } from 'constants/enums';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import './ProjectsTasksTable.css';

// Colors
const purple = '#9648c7';
const orange = '#ff7a45';

// Table columns
const projectIconColumn = {
    title: '',
    key: 'icon',
    render: () => <ProductOutlined style={{ color: purple, fontSize: 16 }} />,
    width: 50,
};
const taskIconColumn = {
    title: '',
    key: 'icon',
    render: () => <FileTextOutlined style={{ color: orange, fontSize: 16 }} />,
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
    // React Note: No need to use state, since these variables will not change over
    //     time (after they are first populated).
    //     The custom hooks use useQuery, which caches the data and does not re-fetch
    //     on every render. useQuery internally uses useState, so a re-render of 
    //     this component will be triggered when these objects populate.
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

    const {
        data: users = [],
        isLoading: usersLoading,
        error: usersError
    } = useUsers();

    // 2. Get input options
    // React Note: No need to use state, for same reason as above. These will re-run 
    //     on every re-render, but operation is not expensive.
    const teamOptions = teams.map(team => ({
        value: team.id,
        label: team.name,
    }));

    const projectOptions = projectsTasks.map(project => ({
        value: project.id,
        label: project.name,
    }));

    const userOptions = users.map(user => ({
        value: user.id,
        label: `${user.last_name}, ${user.first_name}`,
    }));

    const priorityOptions = Object.entries(PRIORITY_LABELS).map(([key, label]) => ({
        value: key,
        label: label,
    }));

    const statusOptions = Object.entries(STATUS_LABELS).map(([key, label]) => ({
        value: key,
        label: label,
    }));

    // 3. Initialize selected inputs
    // React Note: Using state since these variables will change over time, and  
    //     should trigger re-renders when updated.
    // The below inputs depend on fetched data, which may not be ready yet, so
    // initialize them as null or empty arrays for now.
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    // The below inputs do NOT depend on fetched data, so we can initialize them 
    // with actual values.
    const [selectedProjectPriorities, setSelectedProjectPriorities] = useState(priorityOptions.map(option => option.value));
    const [selectedProjectStatuses, setSelectedProjectStatuses] = useState(statusOptions.map(option => option.value));
    const [selectedTaskStatuses, setSelectedTaskStatuses] = useState(statusOptions.map(option => option.value));

    // 4. Set default input selections
    // React Note: Using useEffect since we cannot set state in the main component 
    //     logic.
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

    useEffect(() => {
        if (userOptions.length > 0 && selectedUsers.length === 0) {
            const allUserValues = userOptions.map(user => user.value);
            setSelectedUsers(allUserValues);
        }
    }, [userOptions, selectedUsers]);

    // 5. Filter data based on input selections
    // React Note: Using useMemo to avoid unnecessary recalculations of filtered 
    //     data.
    const filteredProjectsTasks = useMemo(() => {
        const result = projectsTasks
        .filter(project =>
            selectedProjects.includes(project.id) 
            && selectedProjectPriorities.includes(project.priority)
            && selectedProjectStatuses.includes(project.status)
        )
        .map(project => {
            const filteredTasks = project.tasks.filter(task => 
                task.user_team_id === selectedTeam
                && selectedUsers.includes(task.user_id)
                && selectedTaskStatuses.includes(task.status)
            );
            return {
                ...project,
                tasks: filteredTasks,
            };
        });
        return result;
    }, [projectsTasks, selectedProjects, selectedProjectPriorities, selectedProjectStatuses,
        selectedTeam, selectedUsers, selectedTaskStatuses]);

    if (projectsTasksLoading || teamsLoading || usersLoading) return <Progress type='circle' />;
    if (projectsTasksError || teamsError || usersError) return <div>Error loading data.</div>;

    return (
        <>
            {/* Title */}
            <Typography.Title level={4}>Detailed Task Info</Typography.Title>

            <Flex vertical gap="middle">
                {/* Inputs */}
                <Flex gap='small' justify='space-between' wrap='wrap'>
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

                    <div className='input-and-label-pair'>
                        <label htmlFor='user-select' className='input-label'>Users</label>
                        <Select 
                            id='user-select'
                            value={selectedUsers}
                            onChange={setSelectedUsers}
                            options={userOptions}
                            mode='multiple'
                            allowClear
                            maxTagCount={1}
                            style={{ width: 250 }}
                        />
                    </div>

                    <div className='input-and-label-pair'>
                        <label htmlFor='project-priority-select' className='input-label'>Project Priority</label>
                        <Select 
                            id='project-priority-select'
                            value={selectedProjectPriorities}
                            onChange={setSelectedProjectPriorities}
                            options={priorityOptions}
                            mode='multiple'
                            allowClear
                            maxTagCount={1}
                            style={{ width: 300 }}
                        />
                    </div>

                    <div className='input-and-label-pair'>
                        <label htmlFor='project-status-select' className='input-label'>Project Status</label>
                        <Select 
                            id='project-status-select'
                            value={selectedProjectStatuses}
                            onChange={setSelectedProjectStatuses}
                            options={statusOptions}
                            mode='multiple'
                            allowClear
                            maxTagCount={1}
                            style={{ width: 300 }}
                        />
                    </div>

                    <div className='input-and-label-pair'>
                        <label htmlFor='task-status-select' className='input-label'>Task Status</label>
                        <Select 
                            id='task-status-select'
                            value={selectedTaskStatuses}
                            onChange={setSelectedTaskStatuses}
                            options={statusOptions}
                            mode='multiple'
                            allowClear
                            maxTagCount={1}
                            style={{ width: 300 }}
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