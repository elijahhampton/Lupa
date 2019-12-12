import { 
    LupaPackStructure, 
    LupaSessionStructure,
    LupaPackEventStructure,
    LupaTrainerStructure, 
    LupaHealthDataStructure, 
    LupaWorkoutStructure,
    LupaUserStructure } from '../lupa/common/types';

import {
    Days,
    SESSION_STAGE,
    SESSION_STATUS
} from '../lupa/common/types';

var lupa_pack_event : LupaPackEventStructure = {
    event_uuid: "",
    pack_uuid: "",
    event_data: {
        time: "",
        date: "",
        description: "",
        location: {
            lat: "",
            long: "",
        }
    },
    attendees: [],
}

var lupa_trainer : LupaTrainerStructure = {
    user_uuid: "",
    rating: 0,
    recommended_workouts: [],
    experience: [],
    certifications: [],
}

var lupa_pack : LupaPackStructure = {
    pack_uuid: "",
    pack_name: "",
    events: [],
    isGlobal: false, //Invite only
    isPremium: false,
    isDefault: false,
    members: [],
}

var lupa_session : LupaSessionStructure = {
    attendeeOne: "",
    attendeeTwo: "",
    stage: Enumerator,
    time: "",
    location: {
        longitude: "",
        latitude: "",
    },
    name: "",
    description: "",
    sessionStatus: "",
}

export const getLupaSessionStructure = (attendeeOne, attendeeTwo, time, day, location, name, description) => {
    lupa_session.attendeeOne = attendeeOne;
    lupa_session.attendeeTwo = attendeeTwo;
    lupa_session.stage = SESSION_STAGE.INVITED,
    lupa_session.day = day;
    lupa_session.time = time;
    lupa_session.location = location;
    lupa_session.name = name;
    lupa_session.description = description;
    lupa_session.sessionStatus = SESSION_STATUS.NEW;
}

var lupa_user_health_data : LupaHealthDataStructure = {
    user_uuid: "",
    health: {
        statistics: {

        }
    },
    goals: {}

}

export const getLupaHealthDataStructure = (user_uuid, health: {}, goals: []) => {
    lupa_user_health_data.user_uuid = user_uuid;
    return lupa_user_health_data;
}

var lupa_workout : LupaWorkoutStructure = {
    workout_uuid: "",
}

var lupa_user : LupaUserStructure = {
    user_uuid: "",
    display_name: "",
    username: "",
    email: "",
    email_verified: false,
    mobile: "",
    gender: "",
    location: "",
    isTrainer: false,
    packs: [],
    photo_url: "",
    time_created: "",
    preferred_workout_times: {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
    },
    interest: [],
}

export const getLupaUserStructure = (user_uuid, display_name="", username="", email, email_verified=false, mobile="", gender="", location="", isTrainer=false, first_name="", last_name="", packs=[], photo_url="", time_created, preferred_workout_times={}, interest=[]) => {
    
    lupa_user.user_uuid = user_uuid;
    lupa_user.email = email;
    lupa_user.time_created = time_created;
    return lupa_user;
}

export {
    lupa_user,
    lupa_user_health_data,
    lupa_session,
    lupa_workout,
    lupa_pack,
    lupa_pack_event,
    lupa_trainer,
};