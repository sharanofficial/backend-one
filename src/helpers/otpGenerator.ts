const generateOtp = () => {
  const length = 6;
  const characters = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
    const getRandomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[getRandomIndex];
  }
  return otp;
};

export { generateOtp };
