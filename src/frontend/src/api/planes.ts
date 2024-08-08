import axios from 'axios';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ClosestAircraftRequest,
    ClosestAircraftResponse,
    ClosureTimeRequest,
    ClosureTimeResponse,
    EvaluateThreatRequest,
    VectorClosureTimeRequest,
    EvaluateThreatResponse
} from './types';

const BASE_URL = 'http://localhost:3000/api/planes';

export function useFindClosestAircraftMutation(
    options?: UseMutationOptions<ClosestAircraftResponse, Error, ClosestAircraftRequest>
) {
    return useMutation<ClosestAircraftResponse, Error, ClosestAircraftRequest>({
        mutationFn: async (params) => (await axios.post(`${BASE_URL}/closest-aircraft`, params)).data,
        ...options,
    });
}
  
export function useCalculateClosureTimeMutation(
    options?: UseMutationOptions<ClosureTimeResponse, Error, ClosureTimeRequest>
) {
    return useMutation<ClosureTimeResponse, Error, ClosureTimeRequest>({
        mutationFn: async (params) => (await axios.post(`${BASE_URL}/closure-time`, params)).data,
        ...options,
    });
}
  
export function useEvaluateThreatMutation(
    options?: UseMutationOptions<EvaluateThreatResponse, Error, EvaluateThreatRequest>
) {
    return useMutation<EvaluateThreatResponse, Error, EvaluateThreatRequest>({
        mutationFn: async (params) => (await axios.post(`${BASE_URL}/evaluate-threats`, params)).data,
        ...options,
    });
}
  
export function useCalculateVectorClosureTimeMutation(
    options?: UseMutationOptions<ClosureTimeResponse, Error, VectorClosureTimeRequest>
) {
    return useMutation<ClosureTimeResponse, Error, VectorClosureTimeRequest>({
        mutationFn: async (params) => (await axios.post(`${BASE_URL}/vector-closure-time`, params)).data,
        ...options,
    });
}
