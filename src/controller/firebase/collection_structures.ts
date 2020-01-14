import { 
    LupaPackStructure, 
    LupaSessionStructure,
    LupaPackEventStructure,
    LupaTrainerStructure, 
    LupaHealthDataStructure, 
    LupaWorkoutStructure,
    LupaUserStructure, 
    LupaNotificationStructure,
    Days,
    SESSION_STAGE,
    SESSION_STATUS,
    NOTIFICATION_TYPES
} from '../lupa/common/types';

var lupa_notification : LupaNotificationStructure = {
    user: "",
    date: "",
    time: "",
    type: NOTIFICATION_TYPES,
    data: "",
}

export var getLupaNotificationStructure = (user, date, time, type, data) => {
    lupa_notification.user = user;
    lupa_notification.date = date;
    lupa_notification.time = time;
    lupa_notification.type = NOTIFICATION_TYPES.SESSION_INVITE;
    lupa_notification.data = data;

    return lupa_notification;
}

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
    date: "",
    name: "",
    description: "",
    sessionStatus: "",
    lastSuggestedBy: {},
}

export const getLupaSessionStructure = (attendeeOne, attendeeTwo, date, name, description) => {
    lupa_session.attendeeOne = attendeeOne;
    lupa_session.attendeeTwo = attendeeTwo;
    lupa_session.date = date;
    lupa_session.name = name;
    lupa_session.description = description;
    lupa_session.sessionStatus = SESSION_STATUS.INVITED;
    lupa_session.lastSuggestedBy = {
        attendeeOne: date,
        attendeeTwo: "",
    }
    return lupa_session;
}

var lupa_user_health_data : LupaHealthDataStructure = {
    user_uuid: "",
    health: {
        statistics: {

        }
    },
    goals: []

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
    rating: 0,
    experience: {},
    followers: [],
    following: [],
    sessionsCompleted: 0
}

export const getLupaUserStructure = (user_uuid, display_name="", username="", email, email_verified=false, mobile="", gender="", location="", isTrainer=false, first_name="", last_name="", packs=[], photo_url="", time_created, preferred_workout_times={}, interest=[], rating=0, experience, followers, following, sessionsCompleted) => {
    
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
    lupa_notification,
};