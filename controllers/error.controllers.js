exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ msg: err.msg });
    }
    next(err);
};
  
exports.handleServerErrors = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({ msg: "Unable to reach server" });
    next(err);
};