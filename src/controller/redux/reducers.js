import { combineReducers } from 'redux';

import { ADD_WORKOUT_TO_PROGRAM_ACTION, ADD_CURRENT_USER_SERVICE_ACTION, UPDATE_CURRENT_USER_SERVICES_ACTION, UPDATE_CURRENT_USER_ATTRIBUTE_ACTION, UPDATE_CURRENT_USER_ACTION, UPDATE_CURRENT_USER_PACKS_ACTION, REMOVE_CURRENT_USER_PACK, ADD_CURRENT_USER_PACK, UPDATE_CURRENT_USER_PROGRAMS_ACTION, UPDATE_LUPA_WORKOUTS_ACTION, UPDATE_LUPA_ASSESSMENTS_ACTION } from './actionTypes';


handleUserAttributeUpdate = (state, payload) => {
  let updatedState = state.currUserData;

  switch(payload.attribute)
  {
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

const initialProgramsReducerState = {
  currUserProgramsData: {},
  currUserServicesData: {}
}

const initialAppWorkoutsReducerState = {
  applicationWorkouts: {},
}

const initialAssessmentsReducerState = {
  generalAssessments: {},
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
    case "ADD_CURRENT_USER_PROGRAM":
      let updatedProgramsData = state.currUserProgramsData;
      if (!updatedProgramsData.length)
      {
        updatedProgramsData = [action.payload];
      }
      else
      {
        updatedProgramsData.push(action.payload);
        console.log('push em')
      }
      return Object.assign({}, state, { currUserProgramsData: updatedProgramsData });
    case "DELETE_CURRENT_USER_PROGRAM":
      let programs = state.currUserProgramsData;
      let programsToKeep = [];
      for (let i = 0; i < programs.length; i++)
  {
    let program = programs[i];
    if (program.program_uuid != action.payload)
    {
     programsToKeep.push(program);
    }
  }
      return Object.assign({},  {currUserProgramsData: programsToKeep} );
    case UPDATE_CURRENT_USER_PROGRAMS_ACTION:
       console.log(Object.assign({}, state, {currUserProgramsData: action.payload}))
      return Object.assign({}, state, {currUserProgramsData: action.payload});
    case ADD_WORKOUT_TO_PROGRAM_ACTION:
      console.log('entering')
        let programID = action.payload.programUUID;
        let workout = action.payload.workoutData;
        let sectionName = action.payload.sectionName;

        let programsArr =  state.currUserProgramsData;
        let currProgram;
        for (let i = 0; i < programsArr.length; i++)
        {
          if (programsArr[i].program_structure_uuid == programID)
          {
             console.debug('Aaaaaaaaaaaaaaaaaaaa')
            console.debug(programsArr[i])
            console.debug('Aaaaaaaaaaaaaaaaaaaa')
            switch(sectionName)
            {
              case 'warm up':
                programsArr[i].program_workout_data.warmup.push(workout);
                break;
              case 'primary':
                programsArr[i].program_workout_data.primary.push(workout);
                break;
              case 'break':
                programsArr[i].program_workout_data.break.push(workout);
                break;
              case 'secondary':
                programsArr[i].program_workout_data.secondary.push(workout);
                break;
              case 'cooldown':
                programsArr[i].program_workout_data.cooldown.push(workout);
                break;
              case 'homework':
                programsArr[i].program_workout_data.homework.push(workout);
                break;
            }
          }
        }

      return Object.assign(state, {currUserProgramsData: programsArr });
      case UPDATE_CURRENT_USER_SERVICES_ACTION:
      return Object.assign({}, state, {currUserServicesData: action.payload});
      case ADD_CURRENT_USER_SERVICE_ACTION:
        const USER_SERVICE = action.payload;
        let updatedUserServiceState = state.currUserServicesData;
        updatedUserServiceState.push(USER_SERVICE);
      return Object.assign({}, state, {currUserServicesData: updatedUserServiceState})
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

//assessment reducer
const assessmentsReducer = (state = initialAssessmentsReducerState, action) => {
  const newState = {...state};

  switch (action.type)
  {
    case UPDATE_LUPA_ASSESSMENTS_ACTION:
      return Object.assign({}, state, {
        generalAssessments: action.payload
      })
    default:
      return newState;
  }
}

const LupaReducer = combineReducers({
  Packs: packReducer,
  Programs: programsReducer,
  Users: userReducer,
  Application_Workouts: workoutsReducer,
  Assessments: assessmentsReducer
});

export default LupaReducer;