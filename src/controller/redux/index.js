import  {createStore} from 'redux';
import LupaReducer from './reducers';
const LupaStore = createStore(LupaReducer);

LupaStore.subscribe(() => {
    
});

export function getCurrentStoreState() {
    return LupaStore.getState();
}


export default LupaStore;

