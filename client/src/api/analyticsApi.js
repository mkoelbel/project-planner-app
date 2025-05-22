import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchTaskStatusByTeam = async (status) => {
  const { data } = await axios.get('/api/analytics/task-status-by-team');
  return data;
};

export const useTaskStatusByTeam = () => {
    return useQuery({
        queryKey: ['taskStatusByTeam'],
        queryFn: fetchTaskStatusByTeam,
    });
};