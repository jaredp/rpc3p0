import { useQuery as _useQuery } from "react-query";
export { useMutation } from 'react-query';

export function useQuery<T, R, O>(queryFn: (args: T) => Promise<R> , variables: T, opts?: O) {
    return _useQuery([variables], async () => {
        return await queryFn(variables);
    }, opts);
}
