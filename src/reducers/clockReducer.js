const clockReducer = (state = 0, action) => {
  switch (action.type) {
    case "TIMEUTC":
      return (state = action.payload);
    default:
      return state;
  }
};

export default clockReducer;
