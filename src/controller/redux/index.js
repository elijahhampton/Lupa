import  {createStore, applyMiddleware} from 'redux';
import LupaReducer from './reducers';
import thunk from 'redux-thunk';
const LupaStore = createStore(LupaReducer, applyMiddleware(thunk));

LupaStore.subscribe(() => {
    
});

export function getCurrentStoreState() {
    console.log(LupaStore.getState())
    return LupaStore.getState();
}

export default LupaStore;

