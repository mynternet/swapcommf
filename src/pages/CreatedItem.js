import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Jumbotron, Container, CardColumns, Card, Button, Form, Alert } from "react-bootstrap";
import Auth from "../utils/auth";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import ItemCard from "../components/ItemCard";
import { ADD_ITEM, DELETE_ITEM } from "../utils/mutations";

const CreatedItem = () => {
  const [userData, setUserData] = useState({});
  const [newItemData, setNewItemData] = useState({
    itemName: "",
    imageFile: null,
    description: "",
    location: "", // Added location state
    imageError: "",
  });
  const [addItem, addItemResp] = useMutation(ADD_ITEM);
  const [deleteItem, deleteItemResp] = useMutation(DELETE_ITEM);
  const [created, setCreated] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { loading } = useQuery(GET_ME, {
    onCompleted: (dt) => {
      setUserData(dt.me);
    },
    onError: (err) => setError(err.message || 'Error fetching data')
  });

  if (!Auth.loggedIn()) {
    return <h1>Please login to save the item</h1>;
  }

  const userDataLength = Object.keys(userData).length;

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setNewItemData({ ...newItemData, [name]: value });
  };

  const handleItemCreate = async (e) => {
    e.preventDefault();
    try {
      await addItem({
        variables: {
          itemName: newItemData.itemName,
          image: newItemData.imageFile, // Assuming this is a Base64 string or URL
          description: newItemData.description,
          location: newItemData.location, // Include location
          owner: Auth.getProfile().data.username,
          itemStatus: "pending",
        },
        context: {
          headers: {
            authorization: `Bearer ${Auth.getToken()}`,
          },
        },
      });

      setNewItemData({
        itemName: "",
        imageFile: null,
        description: "",
        location: "", // Reset location state
        imageError: "",
      });
      setCreated(true);
    } catch (err) {
      console.error("Error creating item", err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10485760) {
        setNewItemData({ ...newItemData, imageError: "File size should be less than 10MB." });
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setNewItemData({
          ...newItemData,
          imageFile: reader.result,
          imageError: "",
        });
      };
      reader.onerror = (error) => {
        console.log("Error converting image to Base64:", error);
        setNewItemData({
          ...newItemData,
          imageError: "Error processing the image.",
        });
      };
    } else {
      setNewItemData({ ...newItemData, imageFile: null, imageError: "Please choose an image." });
    }
  };

  const handleItemDelete = async (itemId) => {
    try {
      await deleteItem({
        variables: {
          itemId: itemId,
        },
        refetchQueries: [{ query: GET_ME }],
      });
    } catch (err) {
      console.log("Error deleting item", err);
    }
  };

  const handleAcceptSwap = (itemId, requestByUser) => {
    navigate(`/accept-swap-items/${itemId}`, { state: { requestByUser } });
  };

  if (!userDataLength) {
    return <h2>LOADING data...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="text-light page-header">
        <Container>
          <h1>Viewing created items!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
          {[...userData.createdItems].reverse().map((item) => {
            return (
              <div key={item.id}>
                <ItemCard item={item} />
                <Button variant="danger" className="deleteBtn" onClick={() => handleItemDelete(item.id)}>
                  Delete
                </Button>
                {item.itemStatus === "requestToSwap" && (
                  <Button variant="primary" className="swapBtn" onClick={() => handleAcceptSwap(item.id, item.requestByUser)}>
                    Accept Swap
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </Container>
      <Container className="form">
        <h2>Create new item</h2>
        <Form noValidate onSubmit={handleItemCreate}>
          {created && (
            <Alert dismissible variant="success" onClose={() => setCreated(false)}>
              Created item
            </Alert>
          )}
          <Form.Group>
            <Form.Label htmlFor="itemName">Item Name:</Form.Label>
            <Form.Control
              type="text"
              id="itemName"
              name="itemName"
              onChange={handleInputChange}
              value={newItemData.itemName}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="image">Upload Image</Form.Label>
            <Form.File
              id="image"
              name="image"
              label="Choose an image"
              custom
              onChange={(e) => handleImageUpload(e)}
              accept="image/*"
              required
            />
            {newItemData.imageError && (
              <Form.Text className="text-danger">
                {newItemData.imageError}
              </Form.Text>
            )}
            {newItemData.imageFile && (
              <img src={newItemData.imageFile} alt="Selected Image" style={{ maxWidth: "100%" }} />
            )}
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="description">Description</Form.Label>
            <Form.Control
              as="textarea"
              type="text"
              placeholder="Description"
              name="description"
              onChange={handleInputChange}
              value={newItemData.description}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="location">Location:</Form.Label>
            <Form.Control
              type="text"
              id="location"
              name="location"
              placeholder="Enter item location"
              value={newItemData.location}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Button type="submit" variant="success" className="createBtn">
            Create
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default CreatedItem;
