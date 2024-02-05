const response = (res, status, result = '') => {
  let msg = '';

  switch (status) {
    case 200:
      msg = 'Ok';
      break;
    case 201:
      msg = 'Created';
      break;
    case 400:
      msg = 'Bad Request';
      break;
    case 401:
      msg = 'Unauthorized';
      break;
    case 404:
      msg = 'Not Found';
      break;
    case 500:
      msg = 'Internal Server Error';
      break;
    default:
      msg = '';
  }

  const isObject = (data) => {
    return !!data && data.constructor === Object;
  };

  const results = {
    status: status,
    msg: msg,
    result: isObject(result) ? [result] : result,
  };

  res.status(status).json(results);
};

export { response };
