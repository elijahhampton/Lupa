import  {createStore, applyMiddleware} from 'redux';
import LupaReducer from './reducers';
import LupaController from '../../controller/lupa/LupaController'
import thunk from 'redux-thunk';
const LupaStore = createStore(LupaReducer, applyMiddleware(thunk));

LupaStore.subscribe(() => {
    
});

export function getCurrentStoreState() {
    return LupaStore.getState();
}

export default LupaStore;

