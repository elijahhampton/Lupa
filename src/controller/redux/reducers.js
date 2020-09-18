import { combineReducers } from 'redux';

import { ADD_WORKOUT_TO_PROGRAM_ACTION, ADD_CURRENT_USER_SERVICE_ACTION, UPDATE_CURRENT_USER_SERVICES_ACTION, UPDATE_CURRENT_USER_ATTRIBUTE_ACTION, UPDATE_CURRENT_USER_ACTION, UPDATE_CURRENT_USER_PACKS_ACTION, REMOVE_CURRENT_USER_PACK, ADD_CURRENT_USER_PACK, UPDATE_CURRENT_USER_PROGRAMS_ACTION, UPDATE_LUPA_WORKOUTS_ACTION } from './actionTypes';


handleUserAttributeUpdate = (state, payload) => {
  let updatedState = state.currUserData;

  switch(payload.attribute)
  {
    case 'isTrainer':
      updatedState.isTrainer = payload.value;
    case 'photo_url':
      updatedState.display_name = payload.value;
      break;
    case 'display_name':
      updatedState.display_name = payload.value;
      break;
    case 'homegym':
      updatedState.homegym = payload.value;
      break;
    case 'location':
      updatedState.location = payload.value;
      break;
    case 'bio':
      updatedState.bio = payload.value;
      break;
    default:
  }

  return updatedState;
}

handleProgramAttributeUpdate = (state, payload) => {
  let programToUpdate;
  let updatedState = state.currUserProgramsData;

  switch(payload.attribute)
  {
    case 'program_participants':
      for (let i = 0; i < updatedState.length; i++)
      {
        try {
        if (updatedState[i].program_structure_uuid == payload.program_structure_uuid)
        {
          if (payload.optionalOperation == "add")
          {
            updatedState[i].program_participants.push(payload.value);
            break;
          }
        }
      } catch(error) {
          continue;
        }
      }
      break;
      default:
        return state;
  }

  return updatedState;

}

const initialUserReducerState = {
  currUserData: {},
}

const initialPacksReducerState = {
  currUserPacksData: {},
}

const initialProgramsReducerState = {
  currUserProgramsData: {},
  currUserWorkoutsData: {}
}

const initialAppWorkoutsReducerState = {
  applicationWorkouts: {},
}

const initialState = {}

const formReducer = (state = initialState, action) => {
  switch(action.type) {
     case 'FORM_INPUT_UPDATE':
       const updatedValues = {
         ...state.inputValues,
         [action.input]: action.value
       }
       const updatedValidities = {
         ...state.inputValidities,
         [action.input]: action.isValid
       }
       let updateFormIsValid = true;
       for (const key in updatedValidities) {
        updateFormIsValid = updateFormIsValid && updatedValidities[key];
       }
       return {
      formIsValid: updateFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    }
    default:
      return state
  }
}

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
      return Object.assign({}, {currUserPacksData: packsToKeep});
    case ADD_CURRENT_USER_PACK:
      updatedPacksData = state.currUserPacksData;
      updatedPacksData.push(action.payload);
      return Object.assign(state, updatedPacksData);
    default:
      return newState;
  }
}

const programsReducer = (state = initialProgramsReducerState, action) => {
  const newState = {...state};

  switch(action.type)
  {
    case UPDATE_CURRENT_USER_PROGRAMS_ACTION:
      return Object.assign({}, state, {currUserProgramsData: action.payload});
    case 'UPDATE_CURRENT_USER_PROGRAM_ATTRIBUTE':
      const updatedState = handleProgramAttributeUpdate(state, action.payload);
      return Object.assign(state, updatedState)
    case 'ADD_CURRENT_USER_WORKOUT':
      let updatedWorkoutsData = state.currUserWorkoutsData;
      if (!updatedWorkoutsData.length)
      {
        updatedWorkoutsData = [action.payload];
      }
      else
      {
        updatedWorkoutsData.push(action.payload);
      }

      return Object.assign({}, state, { currUserWorkoutsData: updatedWorkoutsData });
    case 'DELETE_CURRENT_USER_WORKOUT':
      let workouts = state.currUserWorkoutsData;
      let workoutsToKeep = [];
      for (let i = 0; i < workouts.length; i++)
  {
    let workout = workouts[i];
    if (workout.program_structure_uuid != action.payload)
    {
     workoutsToKeep.push(workout);
    }
  }
      return Object.assign({},  {currUserWorkoutsData: workoutsToKeep} );
    case "ADD_CURRENT_USER_PROGRAM":
      let updatedProgramsData = state.currUserProgramsData;
      if (!updatedProgramsData.length)
      {
        updatedProgramsData = [action.payload];
      }
      else
      {
        updatedProgramsData.push(action.payload);
      }

      return Object.assign({}, state, { currUserProgramsData: updatedProgramsData });
    case "DELETE_CURRENT_USER_PROGRAM":
      let programs = state.currUserProgramsData;
      let programsToKeep = [];
      for (let i = 0; i < programs.length; i++)
  {
    let program = programs[i];
    if (program.program_structure_uuid != action.payload)
    {
     programsToKeep.push(program);
    }
  }
      return Object.assign({},  {currUserProgramsData: programsToKeep} );
    default:
      return newState;
  }
}

//workout reducer
const workoutsReducer = (state = initialAppWorkoutsReducerState, action) => {
  const newState = {...state};

  switch(action.type)
  {
    case UPDATE_LUPA_WORKOUTS_ACTION:
      return Object.assign({}, state, {
        applicationWorkouts: action.payload
      });
    default:
      return newState;
  }
}

const LupaReducer = combineReducers({
  Packs: packReducer,
  Programs: programsReducer,
  Users: userReducer,
  Application_Workouts: workoutsReducer,
  FormReducer: formReducer,
});

export default LupaReducer;