import ErrorMessages from "../constants/errors";
import statusMessage from "./status";
import { Firebase, FirebaseRef } from "../lib/firebase";

/**
 * Set an Error Message
 */
export function setError(message) {
  return dispatch =>
    new Promise(resolve =>
      resolve(
        dispatch({
          type: "HISTORIES_ERROR",
          data: message
        })
      )
    );
}

/**
 * Get Recipes
 */
export function getHistories() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = Firebase.auth().currentUser.uid;
  if (!UID) return false;

  const arr = [];

  return dispatch =>
    new Promise(resolve =>
      FirebaseRef.child(`history/meteran/${UID}`).on("value", snapshot => {
        snapshots = snapshot.val();
        if (snapshots != null) {
          if(snapshots.histories == null){
            arr.push({
              ...snapshots
            });
          }
        }
        return resolve(
          dispatch({
            type: "HISTORIES_REPLACE",
            data: arr
          })
        );
      })
    ).catch(e => console.log(e));
}

export function getLastHistory() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = Firebase.auth().currentUser.uid;
  if (!UID) return false;

  const current_month = new Date().getMonth() + 1;
  const current_year = new Date().getFullYear();

  const last_month = (current_month - 1);
  const last_year = current_year;

  if(last_month == 0){
    const last_month = 12;
    const last_year = current_year - 1;
    return dispatch =>
      new Promise(resolve =>
        FirebaseRef.child(
          `history/meteran/${UID}/${last_year}/${last_month}`
        ).on("value", snapshot => {
          const arr = [];

          snapshots = snapshot.val();
          if (snapshots) {
              return resolve(
                dispatch({
                  type: "LAST_HISTORIES",
                  data: snapshots,
                  id: snapshots.key
                })
              );
          }else{
            return resolve(
              dispatch({
                type: "LAST_HISTORIES",
                data: [],
                id: null
              })
            );
          }

        })
      ).catch(e => console.log(e));

  }else{
    return dispatch =>
      new Promise(resolve =>
        FirebaseRef.child(
          `history/meteran/${UID}/${last_year}/${last_month}`
        ).on("value", snapshot => {
          const arr = [];

          snapshots = snapshot.val();
          if (snapshots) {
              return resolve(
                dispatch({
                  type: "LAST_HISTORIES",
                  data: snapshots,
                  id: snapshots.key
                })
              );
          }else{
            return resolve(
              dispatch({
                type: "LAST_HISTORIES",
                data: [],
                id: null
              })
            );
          }

        })
      ).catch(e => console.log(e));

  }


}

export function getCurrentHistory() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = Firebase.auth().currentUser.uid;
  if (!UID) return false;

  const current_month = new Date().getMonth() + 1;
  const current_year = new Date().getFullYear();

  return dispatch =>
    new Promise(resolve =>
      FirebaseRef.child(
        `history/meteran/${UID}/${current_year}/${current_month}`
      ).on("value", snapshot => {
        const arr = [];

        snapshots = snapshot.val();
        if (snapshots) {
            if (
              snapshots.tahun == new Date().getFullYear() &&
              snapshots.bulan == new Date().getMonth() + 1
            ) {
              return resolve(
                dispatch({
                  type: "CURRENT_HISTORIES",
                  data: snapshots,
                  id: snapshots.key
                })
              );
            }
        }

      })
    ).catch(e => console.log(e));
}
