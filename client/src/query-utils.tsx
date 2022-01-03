import { useQuery as _useQuery, useMutation as _useMutation } from "react-query";

export function useQuery<T, R, O>(queryFn: (args: T) => Promise<R> , variables: T, opts?: O) {
    return _useQuery([variables], async () => {
        return await queryFn(variables);
    }, opts);
}