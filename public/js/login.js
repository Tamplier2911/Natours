/* eslint-disable */

// axios
import axios from 'axios';

// alert
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email: email,
        password: password
      }
    });
    // console.log(res);
    if (res.data.status === 'success') {
      //   alert('Logged in successfully!');
      showAlert('success', 'Logged in successfully!');

      //   location.assign('/');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    //   alert(err.response.data.message);
    showAlert('error', err.response.data.message);
    // console.log(err.response.data);
  }
};
