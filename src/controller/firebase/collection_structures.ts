import { 
    LupaPackStructure, 
    LupaSessionStructure,
    LupaPackEventStructure,
    LupaTrainerStructure, 
    LupaHealthDataStructure, 
    LupaWorkoutStructure,
    LupaUserStructure } from '../lupa/common/types';

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
}

var lupa_trainer : LupaTrainerStructure = {
    user_uuid: "",
    rating: 0,
    recommended_workouts: [],
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
    session_uuid: "",
    inviter: "",
    invitees: [],
}

var lupa_user_health_data : LupaHealthDataStructure = {
    user_uuid: "",
}

var lupa_workout : LupaWorkoutStructure = {
    workout_uuid: "",
}

var lupa_user : LupaUserStructure = {
    user_uuid: "",
    username: "",
    password: "",
    email: "",
    email_verified: false,
    mobile: "",
    gender: "",
    location: "",
    isTrainer: false,
    first_name: "",
    last_name: "",
    packs: [],
    photo_url: "",
    time_created: "",
}

const getLupaUserStructure = (user_uuid, username="", password, email, email_verified=false, mobile="", gender="", location="",
    isTrainer=false, first_name="", last_name="", packs=[], photo_url="", time_created=new Date().getTime()) => {
    
    lupa_user.user_uuid = user_uuid;
    lupa_user = email;
    lupa_user.password = password;

    return lupa_user;
}

const getLupaHealthDataStructure = () => {
    
}

export {
    lupa_user,
    lupa_user_health_data,
    lupa_session,
    lupa_workout,
    lupa_pack,
    lupa_pack_event,
    lupa_trainer,
    getLupaUserStructure,
};