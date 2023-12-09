import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation AddUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        password
        createdItems {
          id
          owner
          description
          image
          itemName
          itemStatus
          contributions {
            contributorUsername
            contributedAmount
            contributedAt
          }
          createdAt
        }
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        password
        createdItems {
          id
          owner
          description
          image
          itemName
          itemStatus
          contributions {
            contributorUsername
            contributedAmount
            contributedAt
          }
          createdAt
        }
      }
    }
  }
`;

export const ADD_ITEM = gql`
  mutation AddItem(
    $description: String!
    $image: String!
    $itemName: String!
    $owner: String!
    $itemStatus: String
    $location: String     
  ) {
    addItem(
      description: $description
      image: $image
      itemName: $itemName
      owner: $owner
      itemStatus: $itemStatus
      location: $location 
    ) {
      _id
      username
      email
      password
      createdItems {
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
  }
`;


export const DELETE_ITEM = gql`
  mutation DeleteItem($itemId: String!) {
    deleteItem(itemId: $itemId) {
      _id
      username
      email
      password
      createdItems {
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
  }
`;

export const ADD_CONTRIBUTION = gql`
  mutation AddContribution(
    $contributorUsername: String!
    $itemId: String!
    $card: CreditCard!
    $contributedAmount: Float
  ) {
    addContribution(
      contributorUsername: $contributorUsername
      itemId: $itemId
      card: $card
      contributedAmount: $contributedAmount
    ) {
      id
      owner
      description
      image
      itemName
      itemStatus
      contributions {
        contributorUsername
        contributedAmount
        contributedAt
      }
      createdAt
    }
  }
`;

export const UPDATE_ITEM_STATUS = gql`
  mutation UpdateItemStatus(
    $itemId: ID!
    $status: String!
    $owner: String
    $requestByUser: String
    $offerToUser: String
    $itemToChange: String
  ) {
    updateItemStatus(
      itemId: $itemId
      status: $status
      owner: $owner
      requestByUser: $requestByUser
      offerToUser: $offerToUser
      itemToChange: $itemToChange
    ) {
      id
      itemStatus
      owner
      requestByUser
      offerToUser
      itemToChange
    }
  }
`;

export const CREATE_SWAP_TRANSACTION = gql`
  mutation CreateSwapTransaction($itemOffered: ID!, $itemRequested: ID!, $offeredByUser: ID!, $requestedByUser: ID!) {
    createSwapTransaction(itemOffered: $itemOffered, itemRequested: $itemRequested, offeredByUser: $offeredByUser, requestedByUser: $requestedByUser) {
      id
      itemOffered {
        id
        itemName
        owner {
          username
        }
      }
      itemRequested {
        id
        itemName
        owner {
          username
        }
      }
      offeredByUser {
        id
        username
      }
      requestedByUser {
        id
        username
      }
      status
      transactionDate
    }
  }
`;


export const ACCEPT_SWAP_TRANSACTION = gql`
  mutation AcceptSwapTransaction($transactionId: ID!) {
    acceptSwapTransaction(transactionId: $transactionId) {
      id
      status
      itemOffered {
        id
        itemName
      }
      itemRequested {
        id
        itemName
      }
      offeredByUser {
        id
        username
      }
      requestedByUser {
        id
        username
      }
      transactionDate
    }
  }
`;

export const UPDATE_OWNER_ACCEPTED_TRANSACTION = gql`
  mutation UpdateOwnerAcceptedTransaction($itemId: ID!, $newOwner: String!) {
    updateOwnerAcceptedTransaction(itemId: $itemId, newOwner: $newOwner) {
      id
      owner
      itemStatus
    }
  }
`;


