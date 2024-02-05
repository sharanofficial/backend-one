import jwt from 'jsonwebtoken';

const generateToken = (data: object) => {
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: data,
    },
    process.env.SECRET_KEY || '',
  );
  return token;
};

const verifyToken = (token: string) => {
  const verified = jwt.verify(token, process.env.SECRET_KEY || '');
  return verified;
};

export { verifyToken, generateToken };
