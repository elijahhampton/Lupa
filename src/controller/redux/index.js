import  {createStore, applyMiddleware} from 'redux';
import LupaReducer from './reducers';
import thunk from 'redux-thunk';
import { verifyAuth } from '../lupa/auth/auth';

export default function configureStore(persistedState) {
    const store = createStore(LupaReducer, applyMiddleware(thunk));
    store.dispatch(verifyAuth());
    return store;
  }

