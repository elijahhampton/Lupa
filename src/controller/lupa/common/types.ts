export enum UserCollectionFields {
    USER_UUID="user_uuid",
    DISPLAY_NAME="display_name",
    USERNAME="username",
    PHOTO_URL="photo_url",
    GENDER="gender",
    INTEREST="interest",
    PREFERRED_WORKOUT_TIMES="preferred_workout_times"
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
};

export type LupaWorkoutStructure = {};

export type LupaPackStructure = {};

export type LupaHealthDataStructure = {
    user_uuid: "",
    health: {
        statistics: {

        }
    },
    goals: {}
};

export type LupaSessionStructure = {};

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