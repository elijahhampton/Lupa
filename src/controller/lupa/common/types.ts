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
    LOCATION="location",
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

/* LupaPackEventEnumStageEnum */
export enum PACK_EVENT_STAGE {
    UNEXPIRED='unexpired',
    EXPIRED='expired',
}

/* LupaNotificationDataStructure */
export type LupaNotificationStructure = {
    user: "",
    date: "",
    time: "",
    type: any,
    data: {}
}

/* LupaUserDataStructure */
export type LupaUserStructure = {
    user_uuid: "",
    display_name: "",
    username: "",
    email: "",
    email_verified: false,
    mobile: "",
    gender: "",
    location: {
        city: '',
        state: '',
        country: '',
    }
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


/* LupaWorkoutDataStructure */
export type LupaWorkoutStructure = {};

/* LupaPackDataStructure */
export type LupaPackStructure = {
    pack_leader: '',
    pack_title: "",
    pack_isSubscription: false,
    pack_isDefault: false,
    pack_description: "",
    pack_members: [],
    pack_invited_members: [],
    pack_image: '',
    pack_leader_notes: {},
    pack_rating: 0,
    pack_sessions_completed: 0,
    pack_time_created: '',
    pack_location: '',
};

/* LupaHealthDataStructure */
export type LupaHealthDataStructure = {
    user_uuid: "",
    health: {
        statistics: {

        }
    },
    goals: [] //array of objects
};

/* LupaSessionDataStructure */
export type LupaSessionStructure = {
    attendeeOne: "",
    attendeeTwo: "",
    date: any,
    name: String,
    description: String,
    sessionStatus: any,
    lastSuggestedBy: {}
};

/* LupaPackEventDataStructure */
export type LupaPackEventStructure = {
    pack_uuid: "",
    pack_event_title: "",
    pack_event_description: "",
    pack_event_date: "",
    attendees: [],
    pack_event_stage: PACK_EVENT_STAGE.UNEXPIRED,
    pack_event_image: '',
};

/* LupaTrainerDataStructure */
export type LupaTrainerStructure = {
    user_uuid: "",
    certifications: [],
};