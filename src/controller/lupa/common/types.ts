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
    HOME_GYM="exercise_location",
    CHATS="chats",
    TOKENS="tokens",
    PROGRAMS="programs",
    WORKOUT_LOG="workout_log",
    BOOKMARKED_PROGRAMS="bookmarked_programs",
    HOURLY_PAYMENT_RATE="hourly_payment_rate"
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

export type LupaTrainerService = {
    service_name: String,
    service_description: String,
    service_icon: String,
    service_icon_type: String,
    service_colors: Array<String>,
}

/* LupaUserDataStructure */
export type LupaUserStructure = {
    user_uuid: String | Number,
    display_name: String,
    username: String,
    age: any,
    email: String,
    email_verified: false,
    gender: String,
    location : {
        city: String,
        state: String,
        country: String,
        longitude: String,
        latitude: String,
    },
    waitlisted_programs: Array<String>,
    isTrainer: Boolean,
    packs: Array<LupaPackStructure>,
    photo_url: String,
    time_created: Date,
    interest: Array<String>,
    rating: Number,
    followers: Array<String>,
    following: Array<String>,
    sessionsCompleted: Number,
    bio: String,
    bookings: Array<String>,
    certification: String,
    clients: Array<String>,
    homegym: Object,
    chats: any,
    tokens: Object,
    notifications: Array<Object>,
    programs: Array<String>,
    communities: Array<string>,
    pack_programs: Array<String>,
    hourly_payment_rate: Number,
    vlogs: Array<String>,
    scheduler_times: Object,
    workouts: Object,
    program_data: Array<Object>
    last_workout_completed: Object,
    stripe_metadata: Object,
    isGuest: Boolean,
    has_completed_onboarding: Boolean,
    client_metadata: {
        physicalActivityStatus: String,
        hoursMovingPerDay: Number,
        hasElevatedHeartRateDuringPhysicalActivity: Boolean,
        currentlyExercises: Boolean,
        daysPerWeekExercises: Number,
        experience_level: String,
        averageExerciseTime: Number,
        hasNegativeExperienceWithExercise: Boolean,
        dislikedActivities: Array<String>,
        hasSeenFitnessProfessionalBefore: Boolean,
        hasNegativeExperienceWithProfessional: Boolean,
        shortAndLongTermGoalResponse: String,
        fitnessInjuriesResponse: String,
    },
    trainer_metadata: {
        hasOwnExerciseSpace: Boolean,
        belongsToTrainerGym: Boolean,
        hasExperienceInSmallGroupSettings: Boolean,
        smallGroupExperienceYears: Number,
        isInHomeTrainer: Boolean,
        training_styles: Array<String>,
        exercise_space: Object,
        personal_equipment_list: Array<String>,
        trainer_tier: Number,
        trainer_interest: Array<String>
    },
    completed_exercises: Array<Object>
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
    pack_visibility: String,
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