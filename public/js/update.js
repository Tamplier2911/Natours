/* eslint-disable */

// axios
import axios from 'axios';

// alert
import { showAlert } from './alerts';

export const updateData = async form => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:3000/api/v1/users/updateMe',
      data: form
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Data updated successfully!');
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updatePassword = async (
  password,
  newPassword,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:3000/api/v1/users/updateMyPassword',
      data: {
        passwordCurrent: password,
        newPassword: newPassword,
        newPasswordConfirm: passwordConfirm
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Password updated successfully!');
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
