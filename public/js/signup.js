/* eslint-disable */

// axios
import axios from 'axios';

// alerts
import { showAlert } from './alerts';

// address
import { address } from './address';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${address}/api/v1/users/signup`,
      data: {
        name: name,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Your account was successfully created!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
