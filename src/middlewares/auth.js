const auth = (req, res, next) => {
  const token = "xyz";
  const isAuthorized = token === "xyz";
  console.log("Calling the authorization");
  if (!isAuthorized) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};
const userAuth = (req, res, next) => {
  const token = "xyz";
  const isAuthorized = token === "xyz";
  console.log("Calling the user authorization");
  if (!isAuthorized) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};
module.exports = {
  auth,
  userAuth
};
