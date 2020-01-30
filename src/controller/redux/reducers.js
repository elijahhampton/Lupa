import { combineReducers } from 'redux';

import { UPDATE_USER_ATTRIBUTE_ACTION, UPDATE_CURRENT_USER_ACTION, UPDATE_CURRENT_USER_PACKS_ACTION } from './actionTypes';


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
        currUserData: action.payload
     });
    default:
      return newState;
  }
}
//packs reducer
const packReducer = (state = initialPacksReducerState, action) => {
  const newState = {...state};

  switch(action.type)
  {
    case UPDATE_CURRENT_USER_PACKS_ACTION:
      return Object.assign({}, state, {
        currUserPacksData: action.payload,

      });
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