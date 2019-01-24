import HISTORIES from "../store/histories";

export const initialState = HISTORIES;

export default function recipeReducer(state = initialState, action) {
  switch (action.type) {

    case "LAST_HISTORIES": {
      // // Pick out the props I need
      //
      if (action.data && typeof action.data === "object") {
        return action.data;
      }

    }

    default:
      return state;
  }
}
