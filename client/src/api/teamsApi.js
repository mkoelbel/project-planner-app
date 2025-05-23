import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchTeams = async () => {
  const { data } = await axios.get('/api/teams');
  return data;
};
export const useTeams = () => {
    return useQuery({
        queryKey: ['teams'],
        queryFn: fetchTeams,
    });
};