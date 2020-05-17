import { 
    LupaPackStructure, 
    LupaSessionStructure,
    LupaPackEventStructure,
    LupaTrainerStructure, 
    LupaHealthDataStructure, 
    LupaWorkoutStructure,
    LupaUserStructure, 
    LupaAssessmentStructure,
    LupaProgramInformationStructure,
    LupaNotificationStructure,
    Days,
    SESSION_STATUS,
    PACK_EVENT_STAGE,
    LupaTrainerService,
} from '../lupa/common/types';
import { any } from 'prop-types';

var lupa_trainer_service : LupaTrainerService = {
    service_name: "",
    service_description: "",
    service_icon: "",
    service_icon_type: "",
    service_colors: [],
}

export const getLupaTrainerService = (name, description, icon, icon_type, colors) => {
    lupa_trainer_service.service_name = name;
    lupa_trainer_service.service_description = description;
    lupa_trainer_service.service_icon = icon;
    lupa_trainer_service.service_icon_type = icon_type;
    lupa_trainer_service.service_colors = colors;
    return lupa_trainer_service;
}

var lupa_pack_event : LupaPackEventStructure = {
    pack_uuid: "",
    pack_event_title: "",
    pack_event_description: "",
    pack_event_date: "",
    attendees: [],
    pack_event_stage: '',
    pack_event_image: '',
}

export const getLupaPackEventStructure = (title, description, date, time, image) => {
    lupa_pack_event.pack_event_title = title;
    lupa_pack_event.pack_event_description = description;
    lupa_pack_event.pack_event_date = date;
    lupa_pack_event.pack_event_image = image;
    lupa_pack_event.pack_event_stage = 'Active';
    lupa_pack_event.pack_event_time = time;

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
    pack_type: "",
    pack_members: [],
    pack_invited_members: [],
    pack_image: '',
    pack_leader_notes: {},
    pack_rating: 0,
    pack_sessions_completed: 0,
    pack_time_created: '',
    pack_location: '',
    pack_requests: [],
}

export const getLupaPackStructure = (packLeader, title, description, location, image, members, invitedMembers, rating, sessionsCompleted, timeCreated, isSubscription, isDefault, type) => {
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
    lupa_pack.pack_type = type;
    lupa_pack.pack_requests = [];

    return lupa_pack;
}

var lupa_session : LupaSessionStructure = {
    attendeeOne: "",
    attendeeOneData: Object,
    attendeeTwo: "",
    attendeeTwoData: Object,
    requesterUUID: "",
    date: "",
    time_periods: [],
    name: "",
    description: "",
    sessionStatus: "",
    sessionMode: "",
    removed: false,
    time_created: {
        date: "",
        time: "",
    },
    locationData: {
        
    },
    participants: [],
}

export const getLupaSessionStructure = (attendeeOne, attendeeOneData, attendeeTwo, attendeeTwoData, requesterUUID, date, time_periods, name, description, time_created, locationData) => {
    lupa_session.attendeeOne = attendeeOne;
    lupa_session.attendeeOneData = attendeeOneData;
    lupa_session.attendeeTwo = attendeeTwo;
    lupa_session.attendeeTwoData = attendeeTwoData;
    lupa_session.requesterUUID = requesterUUID;
    lupa_session.date = date;
    lupa_session.time_periods = time_periods;
    lupa_session.name = name;
    lupa_session.description = description;
    lupa_session.time_created = time_created;
    lupa_session.sessionStatus = SESSION_STATUS.INVITED;
    lupa_session.sessionMode = "Active";
    lupa_session.removed = false;
    lupa_session.locationData = locationData;
    lupa_session.participants = [
        attendeeOne,
        attendeeTwo,
    ]
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
    assessments: [],
    user_uuid: "",
    display_name: "",
    username: "",
    email: "",
    age: "",
    email_verified: false,
    mobile: "",
    gender: "",
    location: {city: '', state: '', country: '', longitude: '', latitude: '',},
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
    recommended_workouts: [],
    certification: "",
    homegym: {},
    chats: [],
    session_reviews: [],
    trainer_tier: 0,
    tokens: {},
    waitlistedPrograms: [],
    notifications: [],
    programs: [],
}

export const getLupaUserStructure = (user_uuid, display_name="", username="", email, email_verified=false, mobile="", 
    age="", gender="", location="", isTrainer=false, first_name="", last_name="", packs=[], photo_url="", 
    time_created, preferred_workout_times={}, interest=[], rating=0, experience, followers, following, 
    sessionsCompleted, bio, recommended_workouts, certification, assessments=[], tokens={}) => {
    
    lupa_user.user_uuid = user_uuid;
    lupa_user.username = username;
    lupa_user.age = age;
    lupa_user.email = email;
    lupa_user.time_created = time_created;
    lupa_user.isTrainer = false;
    return lupa_user;
}

var lupa_assessment : LupaAssessmentStructure = {
    assessment_acronym: '',
    data: [],
    complete: false,
}

export const getLupaAssessmentStructure = (name, data) => {
    lupa_assessment.assessment_acronym = name;
    lupa_assessment.data = data;
    return lupa_assessment;
}

export {
    lupa_user,
    lupa_assessment,
    lupa_user_health_data,
    lupa_session,
    lupa_workout,
    lupa_pack,
    lupa_pack_event,
    lupa_trainer,
};