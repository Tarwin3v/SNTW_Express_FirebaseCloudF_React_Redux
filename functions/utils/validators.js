const isEmpty = (string) => {
  if (string.trim() === "") {
    return true;
  } else {
    return false;
  }
};

const isEmail = (email) => {
  const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  return false;
};

exports.validateSignupData = (data) => {
  let errors = {};
  let message = "Must not be empty";

  // EMAIL VALIDATION
  if (isEmpty(data.email)) {
    errors.email = message;
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email address";
  }

  // PASSWORD VALIDATION
  if (isEmpty(data.password)) errors.password = message;

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }

  // HANDLE VALIDATION
  if (isEmpty(data.handle)) errors.handle = message;

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLoginData = (data) => {
  let errors = {};
  let message = "Must not be empty";

  if (isEmpty(data.email)) errors.email = message;
  if (isEmpty(data.password)) errors.password = message;

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.reduceUserDetails = (data) => {
  let userDetails = {};

  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    if (data.website.trim().substring(0, 4) !== "http") {
      userDetails.website = `http://${data.website.trim()}`;
    } else userDetails.website = data.website;
  }
  if (!isEmpty(data.bio.trim())) userDetails.location = data.location;

  return userDetails;
};
