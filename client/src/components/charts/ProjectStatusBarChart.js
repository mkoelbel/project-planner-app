import { Progress } from 'antd';
import Typography from 'antd/es/typography/Typography';
import { useTaskStatusByTeam } from 'api/analyticsApi';
import { useProjects } from 'api/projectsApi';
import { STATUSES } from 'constants/enums';
import { Bar, BarChart, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// For stacked bar chart, need a separate column for each status
const transformDataForChart = (rawData) => {
    const grouped = {};

    rawData.forEach(item => {
        const { team_name, status, task_count } = item;
        if (!grouped[team_name]) {
            grouped[team_name] = { 
                team_name, 
                not_started: 0, 
                in_progress: 0, 
                completed: 0, 
                overdue: 0, 
                paused: 0,
            };
        }
        grouped[team_name][status] = task_count;
    });

    return Object.values(grouped);
};

// Need a custom label so that we don't show label for empty bars
const renderLabel = (props) => {
    const { value, x, y, width, height } = props;
    if (!value) return null;

    return (
        <text
            x={x + width / 2}
            y={y + height / 2 + 4}
            fill="#fff"
            style={{ fontWeight: "bold" }}
        >
            {value}
        </text>
    );
};

const ProjectStatusBarChart = () => {
  const { 
    data: projects = [], 
    isLoading: projectsLoading, 
    error: projectsError 
  } = useProjects({ status: 'in_progress' });

  const { 
    data: rawData = [], 
    isLoading: tasksLoading, 
    error: tasksError 
  } = useTaskStatusByTeam();

  if (tasksLoading || projectsLoading) return <Progress type='circle' />;
  if (tasksError || projectsError) return <div>Error loading data.</div>;

  const projectNames = projects.map(project => project.name);
  const chartData = transformDataForChart(rawData);

  return (
    <>
        {/* Title */}
        <Typography.Title level={4}>Task Status</Typography.Title>

        <Typography.Text strong>
            Includes tasks for in-progress projects only: {projectNames.join(', ')}
        </Typography.Text>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={200}>
            <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 20, bottom: 20, left: 50, right: 50 }}
            >
                <XAxis type="number" hide="true" />
                <YAxis dataKey="team_name" type="category"/>
                <Tooltip />
                <Legend />
                {STATUSES.map(({key, label, color}, idx) => (
                    <Bar key={key} dataKey={key} stackId="a" fill={color} name={label}>
                        {/* Incremental label */}
                        <LabelList 
                            dataKey={key}
                            content={renderLabel}
                        />
                        {/* Cumulative label (only on last bar section) */}
                        <LabelList
                            valueAccessor={(entry) =>
                                idx === STATUSES.length - 1 ? entry.value[1] : null
                            }
                            position="right"
                            offset={15}
                            style={{ fontWeight: "bold" }}
                        />
                    </Bar>
                ))}
            </BarChart>
        </ResponsiveContainer>
    </>
  );
};

export default ProjectStatusBarChart;