export const successResponse = (
  res,
  data,
  message = "Success",
  status = 200
) => {
  return res.status(status).json({
    status: "success",
    message,
    data,
  });
};

export const errorResponse = (res, message = "Error", status = 500) => {
  return res.status(status).json({
    status: "error",
    message,
  });
};
