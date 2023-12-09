import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { Container, Row, Col, Card, Button, Alert, Form } from "react-bootstrap";
import { GET_ITEMS_FOR_SWAP } from "../utils/queries";
import { UPDATE_ITEM_STATUS } from "../utils/mutations";
import Auth from "../utils/auth";

const AcceptSwapItems = () => {
  const { itemToChange } = useParams();
  const navigate = useNavigate();
  const { loading, data, error } = useQuery(GET_ITEMS_FOR_SWAP, {
    variables: { itemToChange },
  });

  const [updateItemStatus] = useMutation(UPDATE_ITEM_STATUS);
  const [items, setItems] = useState([]);
  const [feedback, setFeedback] = useState(""); // New state for feedback
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!loading && data) {
      const filteredItems = data.itemsForSwap.filter(
        (item) => item.itemStatus === "OfferToSwap"
      );
      setItems(filteredItems);
    }
  }, [loading, data]);

  const handleAcceptSwap = async (
    acceptedItemId,
    requestedByUser,
    offeredItems
  ) => {
    setIsProcessing(true);
    try {
     // Get the current user's username
     const currentUser = Auth.getProfile().data.username;

     // Update the status and ownership of the "requestToSwap" item
     await updateItemStatus({
       variables: {
         itemId: itemToChange,
         status: "Accepted",
       //   newOwner: currentUser, // Update to requestByUser value
       newOwner: 'test3'
       },
     });

     // Update the status and ownership of the "OfferToSwap" items
     items
       .filter((item) => item.itemStatus === "OfferToSwap")
       .forEach(async (offeredItem) => {
         await updateItemStatus({
           variables: {
             itemId: offeredItem.id,
             status: "Swapped",
           //   newOwner: offeredItem.offerToUser, // Update to offerToUser value
           newOwner: 'test'
           },
         });
       });

     setMessage("Swap accepted successfully.");
     navigate("/created");
   } catch (error) {
     console.error("Error during swap:", error);
     setMessage("Failed to complete swap.");
   } finally {
     setIsProcessing(false);
   }
 };

  // New function to handle navigation to the home page
  const handleCancel = () => {
    navigate("/"); // Navigates to the home page
  };

  if (loading) return <h1>Loading...</h1>;
  if (error)
    return <Alert variant="danger">Error loading items: {error.message}</Alert>;

  return (
    <Container>
      {message && (
        <Alert variant={message.includes("Failed") ? "danger" : "success"}>
          {message}
        </Alert>
      )}
      <Row>
        {items.map((item) => (
          <Col key={item.id} xs={12} md={6} lg={4}>
            <Card className="mb-3">
              <Card.Img variant="top" src={item.image} alt={item.itemName} />
              <Card.Body>
                <Card.Title>{item.itemName}</Card.Title>
                <Form.Group controlId="feedback">
                  <Form.Label>Feedback</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </Form.Group>
                <div className="d-flex justify-content-between mt-3">
                  <Button
                    variant="success"
                    onClick={() =>
                      handleAcceptSwap(
                        item.id,
                        item.requestByUser,
                        items.map((itm) => itm.id)
                      )
                    }
                    disabled={isProcessing}
                  >
                    Accept Swap
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AcceptSwapItems;
