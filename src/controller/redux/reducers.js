import { combineReducers } from 'redux';

import { ADD_WORKOUT_TO_PROGRAM_ACTION, UPDATE_CURRENT_USER_ATTRIBUTE_ACTION, UPDATE_CURRENT_USER_ACTION, UPDATE_CURRENT_USER_PACKS_ACTION, REMOVE_CURRENT_USER_PACK, ADD_CURRENT_USER_PACK, UPDATE_CURRENT_USER_PROGRAMS_ACTION, UPDATE_LUPA_WORKOUTS_ACTION, UPDATE_LUPA_ASSESSMENTS_ACTION } from './actionTypes';


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
  currUserProgramsState: {},
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
      let updatedProgramsData = state.currUserProgramsState;
      if (!updatedProgramsData.length)
      {
        updatedProgramsData = [action.payload];
      }
      else
      {
        updatedProgramsData.push(action.payload);
      }
      return Object.assign({}, state, { currUserProgramsState: updatedProgramsData });
    case "DELETE_CURRENT_USER_PROGRAM":
      let programs = state.currUserProgramsState;
      let programsToKeep = [];
      for (let i = 0; i < programs.length; i++)
  {
    let program = programs[i];
    if (program.program_uuid != action.payload)
    {
     programsToKeep.push(program);
    }
  }
      return Object.assign({},  {currUserProgramsState: programsToKeep} );
    case UPDATE_CURRENT_USER_PROGRAMS_ACTION:
      return Object.assign({}, state, {currUserProgramsState: action.payload});
    case ADD_WORKOUT_TO_PROGRAM_ACTION:
      console.log('entering')
        let programID = action.payload.programUUID;
        console.log('program id: ' + programID)
        let workout = action.payload.workoutData;
        console.log('workout: ' + workout);
        let sectionName = action.payload.sectionName;
        console.log('section name: ' + sectionName)

        let programsArr =  state.currUserProgramsState;
        let currProgram;
        for (let i = 0; i < programsArr.length; i++)
        {
          console.log('IIIIIIIIIIIIIIIIIIIIIIIIIIIIINSIDE FOR LOOP')
          if (programsArr[i].program_uuid == programID)
          {
            console.log('TTTTTTTTTTTTTTTTTTTTHE IF STATEMENT')
            switch(sectionName)
            {
              case 'warm up':
                console.log('WARM UP!!!!!!!!!!!!!!!')
                programsArr[i].program_structure.warmup.push(workout);
                break;
              case 'primary':
                programsArr[i].program_structure.primary.push(workout);
                break;
              case 'break':
                console.log('BRRRRRRRRRREEEEEEEEAAAAAAAAAAKKKKKKKKK')
                programsArr[i].program_structure.break.push(workout);
                break;
              case 'secondary':
                programsArr[i].program_structure.secondary.push(workout);
                break;
              case 'cooldown':
                programsArr[i].program_structure.cooldown.push(workout);
                break;
              case 'homework':
                programsArr[i].program_structure.homework.push(workout);
                break;
            }
          }
        }

      return Object.assign(state, {currUserProgramsState: programsArr });
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