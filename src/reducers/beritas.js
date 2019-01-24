import DEFAULT_BERITA from '../store/beritas';

export const initialState = DEFAULT_BERITA;

export default function recipeReducer(state = initialState, action) {
  switch (action.type) {
    case 'BERITAS_REPLACE': {
      let beritas = [];

      // Pick out the props I need
      if (action.data) {
        beritas.push(
          action.data[action.key],
        );
      }
      return {
        beritas,
      }
    }
    default:
      return state;
  }
}
