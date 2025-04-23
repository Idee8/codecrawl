import { QueryClient } from '@tanstack/react-query';
import { defaultQueryFn } from './default-query-fn';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        console.log(error);
      },
    },
    queries: {
      queryFn: defaultQueryFn as any,
    },
  },
});
