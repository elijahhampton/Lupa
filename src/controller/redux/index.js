import  {createStore, applyMiddleware, getState} from 'redux';
import LupaReducer from './reducers';
import thunk from 'redux-thunk';
import { verifyAuth } from '../lupa/auth/auth';

export const LupaStore = configureStore();

function configureStore() {
    const store = createStore(LupaReducer, applyMiddleware(thunk));
    return store;
}

export function getLupaStoreState() {
  return LupaStore.getState();
}