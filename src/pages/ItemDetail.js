import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Jumbotron, Alert } from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import { GET_ITEM_BY_ID } from '../utils/queries';
import { ADD_CONTRIBUTION } from '../utils/mutations';
import Auth from '../utils/auth';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);

  const [contributionFormData, setContributionFormData] = useState({
    amount: 0,
    creditCardNumber: '',
    creditCardName: '',
    creditCardExpirationMonth: '',
    creditCardExpirationYear: '',
    creditCardCvv: '',
  });

  const currentUser = Auth.getProfile().data.username;

  const [addContribution] = useMutation(ADD_CONTRIBUTION);

  const { loading, data, error } = useQuery(GET_ITEM_BY_ID, {
    variables: { itemId: id },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContributionFormData({ ...contributionFormData, [name]: value });
  };

  const handleContributionSubmit = async (e) => {
    e.preventDefault();
    // ... Contribution submit logic ...
  };

  if (loading) {
    return <h1>Still loading...</h1>;
  }

  if (error) {
    console.error('Error fetching item details:', error);
    return <h2>Error loading item details.</h2>;
  }

  const itemData = data.getItemById;

  const goToSwapItems = () => {
    if (itemData.owner === currentUser) {
      setShowWarning(true);
      return;
    }
    navigate(`/swap/${id}/${itemData.owner}`);
  };

  return (
    <>
      <Jumbotron fluid className="text-light page-header">
        <Container>
          <h1>{itemData.itemName}</h1>
        </Container>
      </Jumbotron>
      <Container>
        {showWarning && (
          <Alert variant="warning" onClose={() => setShowWarning(false)} dismissible>
            You can't swap items with yourself!
          </Alert>
        )}
        <Row>
          <Col xs={4}>
            <img width={350} src={itemData.image} alt={itemData.itemName} />
            <br />
            <br />
            <Button onClick={goToSwapItems}>Go to Swap Items</Button>
          </Col>
          <Col xs={8}>
            <div className="form">
              Created by <strong>{itemData.owner}</strong> on <em>{itemData.createdAt}</em>
            </div>
            <p>{itemData.description}</p>
            {itemData.location && (
              <p><strong>Location:</strong> {itemData.location}</p>
            )}
            {/* Additional content, forms, or logic for the item details can be added here */}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ItemDetail;
