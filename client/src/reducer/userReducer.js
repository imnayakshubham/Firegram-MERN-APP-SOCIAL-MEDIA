export const initialState = null;

export const reducer = (state, action) => {
  switch (action.type) {
    case "USER":
      return action.payload;
    case "LOGOUT":
      return null;
    case "UPDATEPROFILEPIC":
      return {
        ...state,
        profilepic: action.payload,
      };

    default:
      return state;
  }
};
// UPDATEPROFILEPIC
