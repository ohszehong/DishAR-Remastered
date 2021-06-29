export const inputRegexValidation = {
  usernameRegex: new RegExp("^[a-zA-Z0-9]{5,}$"),
  passwordRegex: new RegExp(
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
  ),
  firstNameRegex: new RegExp("^[a-zA-Z]{0,}$"),
  lastNameRegex: new RegExp("^[a-zA-Z]{1,}$"),
  emailRegex: new RegExp(
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  ),
  contactNoRegex: new RegExp("^(01)[0-46-9]*[0-9]{7,8}$"),
};
