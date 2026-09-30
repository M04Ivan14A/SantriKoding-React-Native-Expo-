// src/utils/handleErrors.jsx
export const handleErrors = (errors, setErrors) => {
  if (!errors) return;

  let formattedErrors = {};

  // Jika error berupa Array dari express-validator (misal: [{ path: 'title', msg: '...' }])
  if (Array.isArray(errors)) {
    errors.forEach((error) => {
      formattedErrors[error.path || error.param] = error.msg;
    });
  } 
  // Jika error berbentuk Objek
  else if (typeof errors === 'object') {
    Object.keys(errors).forEach((key) => {
      formattedErrors[key] = Array.isArray(errors[key]) ? errors[key][0] : errors[key];
    });
  }

  setErrors(formattedErrors);
};