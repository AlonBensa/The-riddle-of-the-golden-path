import axios from 'axios';
import { useMutation, UseMutationOptions, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { SaveOperationResponse, SaveOperationRequest, FetchSavedOperationsResponse, PastOperation } from './types';

const BASE_URL = 'http://localhost:3000/api/database';

export function useSaveOperationMutation(
    options?: UseMutationOptions<SaveOperationResponse, Error, SaveOperationRequest>
) {
    const queryClient = useQueryClient();
  
    return useMutation<SaveOperationResponse, Error, SaveOperationRequest>({
        mutationFn: async (params) => (await axios.post(`${BASE_URL}/save-operation`, params)).data,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey:['saveOperations'] });
        },
        ...options,
    });
}
  
export function useFetchSavedOperationsMutation(
    options?: UseMutationOptions<PastOperation[], Error, void>
): UseMutationResult<PastOperation[], Error, void> {
    return useMutation<PastOperation[], Error, void>({
        mutationFn: async () => {
            const response = await axios.get(`${BASE_URL}/saved-operations`);
            return response.data;
        },
        ...options,
    });
}