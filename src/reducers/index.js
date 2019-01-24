import status from './status';
import member from './member';
import locale from './locale';
import beritas from './beritas';
import histories from './histories';
import last_history from './last_history';

const rehydrated = (state = false, action) => {
  switch (action.type) {
    case 'persist/REHYDRATE':
      return true;
    default:
      return state;
  }
};

export default {
  rehydrated,
  status,
  member,
  locale,
  beritas,
  histories,
  last_history,
};
