export enum UserCollectionFields {
    USER_UUID="user_uuid",
    DISPLAY_NAME="display_name",
    USERNAME="username",
    PHOTO_URL="photo_url",
    GENDER="gender",
    INTEREST="interest",
    PREFERRED_WORKOUT_TIMES="preferred_workout_times",
    FOLLOWERS="followers",
    FOLLOWING="following",
    EXPERIENCE="experience",
    SESSIONS_COMPLETED="sessions_completed",
}

export enum Days {
    Monday="Monday", 
    Tuesday="Tuesday",
    Wednesday="Wednesday",
    Thursday="Thursday",
    Friday="Friday",
    Saturday="Saturday",
    Sunday="Sunday",
}

export enum SESSION_STATUS {
    INVITED="Pending",
    Confirmed="Confirmed",
}

export enum NOTIFICATION_TYPES {
    SESSION_INVITE="SessionInvite",
}

export type LupaNotificationStructure = {
    user: "",
    date: "",
    time: "",
    type: any,
    data: {}
}

export type LupaUserStructure = {
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
};

export type LupaWorkoutStructure = {};

export type LupaPackStructure = {};

export type LupaHealthDataStructure = {
    user_uuid: "",
    health: {
        statistics: {

        }
    },
    goals: [] //array of objects
};

export type LupaSessionStructure = {
    attendeeOne: "",
    attendeeTwo: "",
    date: any,
    name: String,
    description: String,
    sessionStatus: any,
    lastSuggestedBy: {}
};

export type LupaPackEventStructure = {
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
};

export type LupaTrainerStructure = {};