import { Firebase, FirebaseRef } from '../lib/firebase';

/**
  * Set an Error Message
  */
export function setError(message) {
  return dispatch => new Promise(resolve => resolve(dispatch({
    type: 'BERITAS_REPLACE',
    data: message,
  })));
}

/**
  * Get News
  */

export function getBeritas() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  // Ensure token is up to date
  return dispatch => new Promise((resolve) => {
    const ref = FirebaseRef.child('news/posts');
    beritas = []
    return ref.on('value', (snapshot) => {
      return dispatch({
        type: 'BERITAS_REPLACE',
        data: Object.values(snapshot.val()),
        key: Object.keys(snapshot.val()),
      });
    });
  });
}
