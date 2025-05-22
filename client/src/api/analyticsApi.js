import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchTaskStatusByTeam = async () => {
  const { data } = await axios.get('/api/analytics/task-status-by-team');
  return data;
};
export const useTaskStatusByTeam = () => {
    return useQuery({
        queryKey: ['taskStatusByTeam'],
        queryFn: fetchTaskStatusByTeam,
    });
};

const fetchProjectsTasks = async () => {
  const { data } = await axios.get('/api/analytics/projects-tasks');
  return data;
};
export const useProjectsTasks = () => {
    return useQuery({
        queryKey: ['projectsTasks'],
        queryFn: fetchProjectsTasks,
    });
};