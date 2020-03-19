import { combineReducers } from 'redux';

import { UPDATE_CURRENT_USER_ATTRIBUTE_ACTION, UPDATE_CURRENT_USER_ACTION, UPDATE_CURRENT_USER_PACKS_ACTION, REMOVE_CURRENT_USER_PACK, ADD_CURRENT_USER_PACK } from './actionTypes';


handleUserAttributeUpdate = (state, payload) => {
  let updatedState = state.currUserData;

  switch(payload.attribute)
  {
    case 'display_name':
      updatedState.display_name = payload.value;
      break;
    default:

  }

  return updatedState;
}

const initialUserReducerState = {
  currUserData: {},
}

const initialPacksReducerState = {
  currUserPacksData: {},
}

const initialState = {}

/**
 * Redux Reducers
 * action: { type, val }
 */
const userReducer = (state = initialUserReducerState, action) => {
  const newState = {...state};

  switch (action.type)
  {
    case UPDATE_CURRENT_USER_ACTION:
      return Object.assign({}, state, {
        currUserData: action.payload.userData,
        currUserHealthData: action.payload.healthData,
     });
     case UPDATE_CURRENT_USER_ATTRIBUTE_ACTION:
      const updatedState = handleUserAttributeUpdate(state, action.payload);
      return Object.assign(state, updatedState)
      default:
      return newState;
  }
}
//packs reducer
const packReducer = (state = initialPacksReducerState, action) => {
  const newState = {...state};
  let updatedPacksData;
  switch(action.type)
  {
    case UPDATE_CURRENT_USER_PACKS_ACTION:
      return Object.assign({}, state, {
        currUserPacksData: action.payload,
      });
    case REMOVE_CURRENT_USER_PACK:
      console.log('pre')
      let data = state.currUserPacksData;
      let packsToKeep = [];
  for (let i = 0; i < data.length; i++)
  {
    let pack = data[i];
    if (pack.pack_uuid != action.payload)
    {
     packsToKeep.push(pack);
    }
  }
      return Object.assign({}, packsToKeep);
    case ADD_CURRENT_USER_PACK:
      updatedPacksData = state.currUserPacksData;
      updatedPacksData.push(action.payload);
      return Object.assign(state, updatedPacksData);
    default:
      return newState;
  }
}

//workout reducer
const workoutReducer = (state = initialState, action) => {
  const newState = {...state};

  switch(action.type)
  {
    default:
      return newState;
  }
}

//sessions reducer
const LupaReducer = combineReducers({
  Packs: packReducer,
  Workouts: workoutReducer,
  Users: userReducer
});

export default LupaReducer;