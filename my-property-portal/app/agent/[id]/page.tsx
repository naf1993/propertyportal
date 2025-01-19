import { Property } from '../../types';
import RoleProtectedHome from '../../components/RoleProtectedHome'; // Client Component
import axiosInstance from '../../lib/axios';
import { API_URL } from '@/app/apiUrl';

const fetchAgentProperties = async (agentId: string): Promise<Property[]> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/api/properties/agent/${agentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
};

interface PageProps {
  params: {
    agentId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { agentId } = params;

  // Fetch properties by agent
  const properties = await fetchAgentProperties(agentId);

  return (
    <>
      <RoleProtectedHome properties={properties} />
    </>
  );
}
