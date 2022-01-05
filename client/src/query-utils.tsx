import { useQuery } from "react-query";

export function useRpcQuery<T, R, O>(queryFn: (args: T) => Promise<R> , variables: T, opts?: O) {
    return useQuery([variables], async () => {
        return await queryFn(variables);
    }, opts);
}
