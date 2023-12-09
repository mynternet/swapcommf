import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Animated } from "react-animated-css";

const ItemCard = ({ item }) => {
  const imageSize = {
    width: "200px", // Set your preferred width
    height: "200px", // Set your preferred height
  };

  const getUrl = (id) => `/item/${id}`;

  const [isVisible, setIsVisible] = useState(false);

  const getShortDescription = (description) =>
    description.length > 10 ? `${description.substring(0, 10)}...` : description;

  return (
    <Animated animationIn="fadeInDown" isVisible={true}>
      <Card key={item.itemId} className="item-card">
        {item.image && (
          <Card.Img
            src={item.image}
            alt={`The cover for ${item.itemName}`}
            variant="top"
            style={imageSize}
          />
        )}
        <Card.Body>
          <Card.Title>{item.itemName}</Card.Title>
          <p className="small">Poster: {item.owner}</p>
          <Card.Text>{getShortDescription(item.description)}</Card.Text>
          <Button className="btn-block more-details" href={getUrl(item.id)}>
            View more details
          </Button>
        </Card.Body>
      </Card>
    </Animated>
  );
};

export default ItemCard;
