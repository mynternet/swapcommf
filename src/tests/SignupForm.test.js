// SignupForm.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import SignupForm from '../components/SignupForm';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

// Mock the Auth.login function
jest.mock('../utils/auth', () => ({
  login: jest.fn(),
}));

const mocks = [
  {
    request: {
      query: ADD_USER,
      variables: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
      },
    },
    result: {
      data: {
        addUser: {
          token: 'your-auth-token',
          user: {
            _id: 'user-id',
            username: 'testuser',
            email: 'test@example.com',
          },
        },
      },
    },
  },
];

test('registers a user', async () => {
  const { getByLabelText, getByText } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <SignupForm />
    </MockedProvider>
  );

  const usernameInput = getByLabelText('Username');
  const emailInput = getByLabelText('Email');
  const passwordInput = getByLabelText('Password');
  const submitButton = getByText('Submit');

  // Fill in the registration form
  fireEvent.change(usernameInput, { target: { value: 'testuser' } });
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

  fireEvent.click(submitButton);

  // Wait for the GraphQL mutation to complete
  await waitFor(() => {
    expect(Auth.login).toHaveBeenCalledWith('your-auth-token');
  });
});
