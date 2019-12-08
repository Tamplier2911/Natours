/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';
import { address } from './address';

const stripe = Stripe('pk_test_KaRPQReBBNZ8yMVXgK6loII400IX5k1kCa');

export const bookTour = async tourId => {
  // Get session from the server using tour ID:
  try {
    const session = await axios({
      method: 'GET',
      url: `${address}/api/v1/booking/checkout-session/${tourId}`
    });

    if (session.data.status === 'success') {
      // Create checkout form + charge credit card
      const { id } = session.data.data.session;
      await stripe.redirectToCheckout({
        sessionId: id
      });
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

/*

stripe
  .redirectToCheckout({
    // Make the id field from the Checkout Session creation API response
    // available to this file, so you can provide it as parameter here
    // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
    sessionId: '{{CHECKOUT_SESSION_ID}}'
  })
  .then(function(result) {
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `result.error.message`.
  });

*/
