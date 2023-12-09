// pages/SwapHistory.js or components/SwapHistory.js
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SWAP_HISTORY } from '../utils/queries';
import { Container, Table } from 'react-bootstrap';
import Auth from '../utils/auth';

const SwapHistory = () => {
  const { loading, data } = useQuery(GET_SWAP_HISTORY, {
    variables: { userId: Auth.getProfile().data._id },
  });
  const [swaps, setSwaps] = useState([]);

  useEffect(() => {
    if (data) {
      setSwaps(data.swapHistory);
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <h1>My Swap History</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Swapped With</th>
          </tr>
        </thead>
        <tbody>
          {swaps.map((swap) => (
            <tr key={swap.itemId}>
              <td>{swap.itemName}</td>
              <td>{swap.offerToUser}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default SwapHistory;
