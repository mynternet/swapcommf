import React, { useState, useEffect } from "react";
import {
  Jumbotron,
  Container,
  Col,
  Form,
  Button,
  Card,
  Row,
  CardColumns,
} from "react-bootstrap";
import { Animated } from "react-animated-css";

import Auth from "../utils/auth";
import {
  saveItemIds,
  getSavedItemIds,
} from "../utils/localStorage";
import { ADD_ITEM } from "../utils/mutations";
import { GET_ALL_ITEMS } from "../utils/queries";
import { useMutation, useQuery } from "@apollo/client";
import ItemCard from "../components/ItemCard";

const SearchItems = () => {
  const [searchedItems, setSearchedItems] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [savedItemIds, setSavedItemIds] = useState(
    getSavedItemIds()
  );

  const getAllItems = useQuery(GET_ALL_ITEMS, {
    onCompleted: (fundData) => {
      setSearchedItems(fundData.getAllItems);

      console.log("got fund data", fundData);
    },
  });

  useEffect(() => {
    return () => saveItemIds(savedItemIds);
  });

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

 const getFilteredResults = (allResult) => {
  const reversed = [...searchedItems].reverse();
  return reversed.filter((item) => {
    return (
      item.itemStatus === 'pending' && // Only include items with 'pending' status
      (item.itemName.toLowerCase().includes(searchInput.toLowerCase()) ||
       item.description.toLowerCase().includes(searchInput.toLowerCase()))
    );
  });
};
  return (
    <>
      <Jumbotron fluid className="text-light page-header">
        <Container>
          <h1>Browse Items!</h1>

          <Form.Group className="mb-3" controlId="formSearch">
            <Form.Control
              type="search"
              placeholder="Search"
              className="search"
              width={50}
              onChange={handleSearchChange}
            />
          </Form.Group>
        </Container>
      </Jumbotron>

      {getAllItems.loading && <h1>Loading items</h1>}
      {!getAllItems.loading && searchedItems && (
        <Container>
          <h2>{getFilteredResults(searchedItems).length} Items</h2>
          <CardColumns>
            {getFilteredResults(searchedItems).map((item) => {
              return <ItemCard item={item} />;
            })}
          </CardColumns>
        </Container>
      )}
    </>
  );
};

export default SearchItems;
