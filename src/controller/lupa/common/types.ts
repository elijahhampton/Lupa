export enum UserCollectionFields {
    USER_UUID="user_uuid",
    DISPLAY_NAME="display_name",
    USERNAME="username",
    PHOTO_URL="photo_url",
    GENDER="gender",
    INTEREST="interest",
    INTEREST_ARR="interest_arr",
    PREFERRED_WORKOUT_TIMES="preferred_workout_times",
    FOLLOWERS="followers",
    FOLLOWING="following",
    EXPERIENCE="experience",
    SESSIONS_COMPLETED="sessions_completed",
    LOCATION="location",
    BIO="bio",
    PACKS="packs",
    HOME_GYM="homegym",
    CHATS="chats",
    TOKENS="tokens"
}

export enum HealthDataCollectionFields {
    GOALS="goals",
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

/* Lupa Modalities */
export enum WORKOUT_MODALITY {
    CALISTHENICS="Calisthenics",
    WEIGHTLIFTING="Weightlifting",
    METABOLIC="Metabolic"
}

/* LupaNotificationDataStructure */
export type LupaNotificationStructure = {
    user: "",
    date: "",
    time: "",
    type: any,
    data: {}
}

export type LupaTrainerService = {
    service_name: String,
    service_description: String,
    service_icon: String,
    service_icon_type: String,
    service_colors: Array<String>,
}

/* LupaUserDataStructure */
export type LupaUserStructure = {
    user_uuid: "",
    display_name: "",
    username: String,
    age: any,
    email: "",
    email_verified: false,
    mobile: "",
    gender: "",
    location: {
        city: '',
        state: '',
        country: '',
        longitude: '',
        latitude: '',
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
    sessionsCompleted: 0,
    bio: String,
    recommended_workouts: Array<String>,
    certification: String,
    homegym: Object,
    chats: any,
    session_reviews: [],
    trainer_tier: Number,
    assessments: Array<LupaAssessmentStructure>,
    tokens: Object,
    waitlistedPrograms: Array<String>,
    notifications: [],
};

export type LupaAssessmentStructure = {
    assessment_acronym: String,
    data: Array<Object>,
    complete: Boolean,
};


/* LupaWorkoutDataStructure */
export type LupaWorkoutStructure = {};

/* LupaPackDataStructure */
export type LupaPackStructure = {
    pack_leader: '',
    pack_title: "",
    pack_isSubscription: false,
    pack_isDefault: false,
    pack_type: "",
    pack_description: "",
    pack_members: [],
    pack_invited_members: [],
    pack_image: '',
    pack_leader_notes: {},
    pack_rating: 0,
    pack_sessions_completed: 0,
    pack_time_created: '',
    pack_location: '',
    pack_requests: Array<String>,
};

/* LupaHealthDataStructure */
export type LupaHealthDataStructure = {
    user_uuid: "",
    health: {
        statistics: {

        }
    },
    goals: [
        {
            goal_uuid: String,
            pathways: Array<any>
        }
    ] //array of objects
};

/* LupaSessionDataStructure */
export type LupaSessionStructure = {
    attendeeOne: "",
    attendeeOneData: Object,
    attendeeTwo: "",
    attendeeTwoData: Object,
    requesterUUID: "",
    date: any,
    time_periods: any,
    name: String,
    description: String,
    sessionStatus: any,
    sessionMode: any,
    time_created: { date: any, time: any }
    removed: Boolean,
    locationData: Object,
    participants: Array<String>
};

/* LupaPackEventDataStructure */
export type LupaPackEventStructure = {
    pack_uuid: "",
    pack_event_title: "",
    pack_event_description: "",
    pack_event_date: "",
    attendees: [],
    pack_event_stage: String,
    pack_event_image: String,
    pack_event_time: String,
};

/* LupaTrainerDataStructure */
export type LupaTrainerStructure = {
    user_uuid: "",
    certifications: [],
};