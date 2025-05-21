import { Progress } from 'antd';
import { useTaskStatusByTeam } from 'api/analyticsApi';
import { Bar, BarChart, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const STATUSES = [
  { key: "not_started", label: "Not Started", color: "#bfbfbf" },
  { key: "in_progress", label: "In Progress", color: "#4096ff" },
  { key: "completed", label: "Completed", color: "#60cc52" },
  { key: "overdue", label: "Overdue", color: "#ff4d4f" },
  { key: "paused", label: "Paused", color: "#faad14" },
];

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
    console.log('Grouped Data:', grouped);
    return Object.values(grouped);
};

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
  const { data: rawData, isLoading, error } = useTaskStatusByTeam();
  const chartData = transformDataForChart(rawData);

  if (isLoading) return <Progress type='circle' />;
  if (error) return <div>Error loading data.</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 20, bottom: 20, left: 50, right: 50 }}
        >
            <XAxis type="number" />
            <YAxis dataKey="team_name" type="category" />
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
  );
};

export default ProjectStatusBarChart;