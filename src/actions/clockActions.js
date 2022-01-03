const clockAction = (value) => {
  return {
    type: "TIMEUTC",
    payload: value,
  };
};

export default clockAction;
