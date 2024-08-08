import axios from 'axios';
import { useQuery, useMutation, UseMutationOptions, UseQueryResult, useQueryClient } from '@tanstack/react-query';
import { Operation, SaveOperationResponse, FetchSavedOperationsResponse } from './types';

const BASE_URL = 'http://localhost:3000/api/database';

export function useSaveOperationMutation(
    options?: UseMutationOptions<SaveOperationResponse, Error, Operation>
) {
    const queryClient = useQueryClient();
  
    return useMutation<SaveOperationResponse, Error, Operation>({
        mutationFn: async (params) => (await axios.post(`${BASE_URL}/save-operation`, params)).data,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey:['savedOperations'] });
        },
        ...options,
    });
}
  
export function useFetchSavedOperationsQuery(): UseQueryResult<Operation[], Error> {
    return useQuery<Operation[]>({
        queryKey: ['savedOperations'],
        queryFn: async () => 
            (await axios.get<FetchSavedOperationsResponse>(`${BASE_URL}/saved-operations`)).data.operations,
    });
}