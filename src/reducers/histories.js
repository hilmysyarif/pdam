import HISTORIES from "../store/histories";

export const initialState = HISTORIES;

export default function recipeReducer(state = initialState, action) {
  switch (action.type) {
    case "HISTORIES_REPLACE": {
      let histories = [];
      let current_year = new Date().getFullYear();

      // Pick out the props I need
      if (action.data) {
        action.data.map(item => {
          item[current_year].map(item2 => {
            histories.push({
              bulan: item2.bulan,
              foto_meteran: item2.foto_meteran,
              id_pelanggan: item2.id_pelanggan,
              jumlah_meteran: item2.jumlah_meteran,
              tahun: item2.tahun,
              uid: item2.uid,
              total_bayar: item2.total_bayar
            });
          });
        });
      }
      return {
        histories
      };
    }
    case "CURRENT_HISTORIES": {

      // // Pick out the props I need
      //
      if (action.data) {
        return action.data;
      }else{
        return [];
      }
    }
    default:
      return state;
  }
}
