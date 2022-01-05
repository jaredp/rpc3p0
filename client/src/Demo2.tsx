import React from 'react';
import { AddressRecipient } from '../../server/AddressRecipient';
import { useRpcQuery } from './query-utils';

export function Demo2() {
  const { isLoading, data: recipient } = useRpcQuery(AddressRecipient, {
    firstName: "Jared",
    lastName: "Pochtar"
  });

  if (isLoading) {
    return <>"Loading..."</>;
  }

  return <div>
    <h1>Demo 2</h1>
    <p>{recipient?.firstLine}</p>
    <p>{recipient?.body}</p>
  </div>;
}
