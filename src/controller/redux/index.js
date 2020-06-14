import  {createStore} from 'redux';
import LupaReducer from './reducers';
import LupaController from '../../controller/lupa/LupaController'
const LupaStore = createStore(LupaReducer);

LupaStore.subscribe(() => {
    
});

export function getCurrentStoreState() {
    return LupaStore.getState();
}

export default LupaStore;

