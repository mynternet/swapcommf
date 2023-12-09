// components/PaymentButton.js
import React from 'react';
import StripeForm from './StripeForm';

const PaymentButton = ({ itemId, onPaymentSuccess }) => {
  return (
    <div>
      <h3>Payment Details</h3>
      <StripeForm itemId={itemId} onPaymentSuccess={onPaymentSuccess} />
    </div>
  );
};

export default PaymentButton;
