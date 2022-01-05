import React from 'react';
import { GetCount, IncrementCount } from '../../server/stateful';
import { useRpcQuery } from './query-utils';
import { useMutation } from 'react-query';

export function Demo3() {
  const { data: count, refetch } = useRpcQuery(GetCount, {});
  const { mutate } = useMutation(IncrementCount, {
    onSuccess: () => {
      refetch();
    }
  });

  return <div>
    <h1>Demo 3</h1>
    <div>{count}</div>
    <button onClick={() => mutate({ addend: 1 })}>Add</button>
  </div>;
}
