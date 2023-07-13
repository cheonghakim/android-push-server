module.exports = {
  passwordPattern:
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{9,16}$/,
  emailIdPattern: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*$/i,
  emailAddressPattern: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
  userIdPattern: /^[a-z0-9-._]{5,16}$/,
  namePattern: /^[가-힣]|[a-zA-Z]{2,13}$/,
  numberSign: /(?=.*)\(([0-9]{1,})\)/i,
  wholeEmailPattern:
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/im,
};
