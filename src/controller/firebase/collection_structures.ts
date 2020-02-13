import { 
    LupaPackStructure, 
    LupaSessionStructure,
    LupaPackEventStructure,
    LupaTrainerStructure, 
    LupaHealthDataStructure, 
    LupaWorkoutStructure,
    LupaUserStructure, 
    Days,
    SESSION_STATUS,
    PACK_EVENT_STAGE,
} from '../lupa/common/types';

var lupa_pack_event : LupaPackEventStructure = {
    pack_uuid: "",
    pack_event_title: "",
    pack_event_description: "",
    pack_event_date: "",
    attendees: [],
    pack_event_stage: PACK_EVENT_STAGE.UNEXPIRED,
    pack_event_image: '',
}

export const getLupaPackEventStructure = (title, description, date, image) => {
    lupa_pack_event.pack_event_title = title;
    lupa_pack_event.pack_event_description = description;
    lupa_pack_event.pack_event_date = date;
    lupa_pack_event.pack_event_image = image;

    return lupa_pack_event;
}

var lupa_trainer : LupaTrainerStructure = {
    user_uuid: "",
    certifications: [],
}

var lupa_pack : LupaPackStructure = {
    pack_leader: '',
    pack_title: "",
    pack_description: "",
    pack_isSubscription: false,
    pack_isDefault: false,
    pack_members: [],
    pack_invited_members: [],
    pack_image: '',
    pack_leader_notes: {},
    pack_rating: 0,
    pack_sessions_completed: 0,
    pack_time_created: '',
    pack_location: '',
}

export const getLupaPackStructure = (packLeader, title, description, location, image, members, invitedMembers, rating, sessionsCompleted, timeCreated, isSubscription, isDefault) => {
    lupa_pack.pack_leader = packLeader;
    lupa_pack.pack_title = title;
    lupa_pack.pack_description = description;
    lupa_pack.pack_location = location;
    lupa_pack.pack_image = image;
    lupa_pack.pack_members = members;
    lupa_pack.pack_invited_members = invitedMembers;
    lupa_pack.pack_rating = rating;
    lupa_pack.pack_sessions_completed = sessionsCompleted;
    lupa_pack.pack_time_created = timeCreated;
    lupa_pack.pack_isSubscription = isSubscription;
    lupa_pack.pack_isDefault = isDefault;

    return lupa_pack;
}

var lupa_session : LupaSessionStructure = {
    attendeeOne: "",
    attendeeTwo: "",
    requesterUUID: "",
    date: "",
    time_periods: [],
    name: "",
    description: "",
    sessionStatus: "",
    time_created: {
        date: "",
        time: "",
    },
}

export const getLupaSessionStructure = (attendeeOne, attendeeTwo, requesterUUID, date, time_periods, name, description, time_created) => {
    lupa_session.attendeeOne = attendeeOne;
    lupa_session.attendeeTwo = attendeeTwo;
    lupa_session.requesterUUID = requesterUUID;
    lupa_session.date = date;
    lupa_session.time_periods = time_periods;
    lupa_session.name = name;
    lupa_session.description = description;
    lupa_session.time_created = time_created;
    lupa_session.sessionStatus = SESSION_STATUS.INVITED;
    return lupa_session;
}

var lupa_user_health_data : LupaHealthDataStructure = {
    user_uuid: "",
    health: {
        statistics: {

        }
    },
    goals: [
        {
            goal_uuid: "",
            pathways: [
                
            ]
        }
    ]
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
    location: {city: '', state: '', country: ''},
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
    rating: 0,
    experience: {},
    followers: [],
    following: [],
    sessionsCompleted: 0,
    bio: "",
}

export const getLupaUserStructure = (user_uuid, display_name="", username="", email, email_verified=false, mobile="", gender="", location="", isTrainer, first_name="", last_name="", packs=[], photo_url="", time_created, preferred_workout_times={}, interest=[], rating=0, experience, followers, following, sessionsCompleted, bio) => {
    
    lupa_user.user_uuid = user_uuid;
    lupa_user.email = email;
    lupa_user.time_created = time_created;
    lupa_user.isTrainer = isTrainer;
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