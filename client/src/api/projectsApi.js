import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchProjects = async (status) => {
  const url = status ? `/api/projects?status=${status}` : '/api/projects';
  const { data } = await axios.get(url);
  return data;
};

export const useProjects = ({ status } = {}) => {
    return useQuery({
        queryKey: ['projects', status],
        queryFn: () => fetchProjects(status),
    });
};