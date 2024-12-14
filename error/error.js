import "dotenv/config"

export class ErrorHandling extends Error {
  constructor(message, statuscode) {
    super(message);
    this.statuscode = statuscode;
    this.status = `${statuscode}`.startsWith("4") ? "fail" : "server error";
  }
}

export const ErrorMiddleware = (err, req, res, next) => {
  if (process.env.NODE_ENV == "development") {
  
    DevError(err, res);
  }
  else if(process.env.NODE_ENV == "production"){
    if (err.name === "TokenExpiredError") {
      err = new ErrorHandling(`Token expired. Please log in again!`, 401);
    }
    if (err.name === "JsonWebTokenError") {
      err = new ErrorHandling(`Invalid token. Please log in again!`, 401);
    }
    if (err.name === "ValidationError") { //mongoose error
      const errors = Object.values(err.errors).map((el) => el.message);
      err = new ErrorHandling(`${errors}`, 400);
    }
    if (err.name === "CastError") {// mongoose error
      err = new ErrorHandling(`Invalid ${err.path}: ${err.value}`, 400);
    }
    if (err.code === 11000) {// mongoose error
      const value = err.message.match(/dup key: { (.+?):/)[1];
      const message = `${value} aleady exist. please use another`;
      err = new ErrorHandling(message, 400);
    }
    ProdError(err, res);
  }
};

const DevError = (err, res) => {
  res.status(err.statuscode || 500).json({
    success: false,
    error: err,
    message: err.message,
    status: err.status,
    stack: err.stack,
  });
};

const ProdError = (err, res) => {
  res.status(err.statuscode || 500).json({
    success: false,
    message: err.message,
    status: err.status,
  });
};




export const GlobalError = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
