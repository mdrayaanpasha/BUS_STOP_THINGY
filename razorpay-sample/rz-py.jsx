import React from 'react';

const App = () => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.id = 'razorpay-script';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert('Failed to load Razorpay SDK');
      return;
    }
const options = {
  key: 'rzp_test_1DP5mmOlF5G5ag', // official Razorpay test key
  amount: 10000, // ₹100 in paise
  currency: 'INR',
  name: 'Test Store',
  description: 'Test Payment',
  handler: function(response) {
    alert('Payment Successful. Payment ID: ' + response.razorpay_payment_id);
  },
  prefill: {
    name: 'Test User',
    email: 'test@example.com',
    contact: '9999999999',
  },
};


    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button onClick={handlePayment}>
      Pay ₹100 (Test Mode)
    </button>
  );
};

export default App;
