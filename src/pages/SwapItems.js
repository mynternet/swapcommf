import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { GET_ME, GET_ITEM_BY_ID } from "../utils/queries";
import {
  UPDATE_ITEM_STATUS,
  CREATE_SWAP_TRANSACTION,
} from "../utils/mutations";
import Auth from "../utils/auth";

const SwapItems = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading: loadingMe, data: dataMe } = useQuery(GET_ME);
  const { loading: loadingItem, data: dataItem } = useQuery(GET_ITEM_BY_ID, {
    variables: { itemId: id },
    skip: !id,
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [updateItemStatus] = useMutation(UPDATE_ITEM_STATUS);
  // const [createSwapTransaction] = useMutation(CREATE_SWAP_TRANSACTION);
  const [message, setMessage] = useState(null);
  const currentUser = Auth.getProfile().data.username;
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (dataMe && dataItem) {
      const specificItem = dataItem.getItemById;
      const userItems = dataMe.me.createdItems || [];
      const combinedItems = specificItem
        ? [
            specificItem,
            ...userItems.filter((item) => item.id !== specificItem.id),
          ]
        : userItems;
      setItems(combinedItems);
    }
  }, [dataMe, dataItem]);

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSwapItems = async () => {
    if (selectedItems.length === 0) {
      setMessage("No items selected for swap");
      return;
    }

    try {
      // const swapTransactionPromises = selectedItems.map((selectedItemId) =>
      //   createSwapTransaction({
      //     variables: {
      //       itemOffered: selectedItemId,
      //       itemRequested: id,
      //       // Include user IDs
      //       offeredByUser: dataMe.me._id,
      //       requestedByUser: dataItem.getItemById.owner,
      //     },
      //   })
      // );

      const updateOfferedItemsPromises = selectedItems.map((itemId) =>
        updateItemStatus({
          variables: {
            itemId,
            status: "OfferToSwap",
            offerToUser: dataItem.getItemById.owner,
            itemToChange: id,
          },
        })
      );

      const updateRequestedItemPromise = updateItemStatus({
        variables: {
          itemId: id,
          status: "requestToSwap",
          requestByUser: currentUser,
        },
      });

      await Promise.all([
        // ...swapTransactionPromises,
        ...updateOfferedItemsPromises,
        updateRequestedItemPromise,
      ]);

      setMessage("Swap request sent");
    } catch (error) {
      console.error("Error in handling swap items:", error);
      setMessage(`Failed to send swap request: ${error.message}`);
    }
  };

  if (loadingMe || loadingItem) return <h1>Loading...</h1>;

  return (
    <Container>
      {message && (
        <Alert variant={message.includes("failed") ? "danger" : "success"}>
          {message}
        </Alert>
      )}
      <Row>
        <Col md={4}>
          {items[0] && (
            <Card className="mb-3">
              <Card.Img
                variant="top"
                src={items[0].image}
                alt={items[0].itemName}
              />
              <Card.Body>
                <Card.Title>{items[0].itemName}</Card.Title>
              </Card.Body>
            </Card>
          )}
        </Col>
        <Col md={8}>
          <Row>
            {items.slice(1).map((item) => (
              <Col key={item.id} xs={12} md={6} lg={4} className="mb-3">
                <Card className="user-item">
                  <Card.Img
                    variant="top"
                    src={item.image}
                    alt={item.itemName}
                  />
                  <Card.Body>
                    <Card.Title>{item.itemName}</Card.Title>
                    <Form.Check
                      type="checkbox"
                      label="Select for swap"
                      onChange={() => handleCheckboxChange(item.id)}
                      checked={selectedItems.includes(item.id)}
                    />
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Button onClick={handleSwapItems} disabled={selectedItems.length === 0}>
        Swap Items
      </Button>
    </Container>
  );
};

export default SwapItems;
