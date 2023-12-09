import { gql } from "@apollo/client";

export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
      password
      createdItems {
        owner
        description
        image
        itemName
        itemStatus
        requestByUser
        id
        contributions {
          contributorUsername
          contributedAmount
          contributedAt
        }
        createdAt
      }
    }
  }
`;

export const GET_ALL_ITEMS = gql`
  query GetAllItems {
    getAllItems {
      id
      owner
      description
      image
      itemName
      itemStatus
      location
      contributions {
        contributorUsername
        contributedAmount
        contributedAt
      }
      createdAt
    }
  }
`;

export const GET_ITEM_BY_ID = gql`
  query GetItemById($itemId: String!) {
    getItemById(itemId: $itemId) {
      id
      owner
      description
      image
      itemName
      itemStatus
      location  
      contributions {
        contributorUsername
        contributedAmount
        contributedAt
      }
      createdAt
    }
  }
`;

export const GET_ITEMS_FOR_SWAP = gql`
  query GetItemsForSwap($itemToChange: String!) {
    itemsForSwap(itemToChange: $itemToChange) {
      id
      itemName
      owner
      image
      description
      image
      itemName
      itemStatus
      requestByUser
      offerToUser
      itemToChange
      contributions {
        contributorUsername
        contributedAmount
        contributedAt
      }
      createdAt
    }
  }
`;

export const GET_SWAP_HISTORY = gql`
  query SwapHistory($userId: ID!) {
    swapHistory(userId: $userId) {
      itemId
      itemName
      offerToUser
      requestByUser
    }
  }
`;


