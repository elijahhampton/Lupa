import { 
    LupaPackStructure, 
    LupaPackEventStructure,
    LupaHealthDataStructure, 
    LupaWorkoutStructure,
    LupaUserStructure, 
    LupaTrainerService,
} from '../lupa/common/types';

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
    pack_event_time: '',
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
    pack_visibility: "Public",
}

export const getLupaPackStructure = (packLeader, title, description, location, image, members, invitedMembers, rating, sessionsCompleted, timeCreated, isSubscription, isDefault, type, packVisiblity) => {
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
    lupa_pack.pack_visibility = packVisiblity;

    return lupa_pack;
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
    user_uuid: 0,
    display_name: "",
    username: "",
    email: "",
    age: "",
    email_verified: false,
    gender: "",
    location: {city: '', state: '', country: '', longitude: '', latitude: '',},
    isTrainer: false,
    packs: [],
    photo_url: "",
    time_created: new Date(),
    interest: [],
    rating: 0,
    followers: [],
    following: [],
    sessionsCompleted: 0,
    bio: "",
    bookings: [],
    certification: "",
    homegym: {},
    chats: [],
    tokens: {},
    notifications: [],
    programs: [],
    hourly_payment_rate: 15,
    vlogs: [],
    scheduler_times: {},
    workouts: {},
    program_data: [],
    last_workout_completed: {
        dateCompleted: "",
        workoutUUID: "",
    },
    stripe_metadata: {
        stripe_id: "",
        card_last_four: "",
        card_added_to_stripe: false,
    },
    isGuest: true,
    client_metadata: {
        physicalActivityStatus: "Non Active",
        hoursMovingPerDay: 0,
        hasElevatedHeartRateDuringPhysicalActivity: false,
        currentlyExercises: false,
        daysPerWeekExercises: 0,
        averageExerciseTime: 0,
        hasNegativeExperienceWithExercise: false,
        dislikedActivities: [],
        hasSeenFitnessProfessionalBefore: false,
        hasNegativeExperienceWithProfessional: false,
        shortAndLongTermGoalResponse: "",
        fitnessInjuriesResponse: "",
    },
    trainer_metadata: {
        hasOwnExerciseSpace: false,
        belongsToTrainerGym: false,
        hasExperienceInSmallGroupSettings: false,
        smallGroupExperienceYears: 0,
        isInHomeTrainer: false,
        exercise_location: {city: '', state: '', country: '', longitude: '', latitude: '',},
        personalEquipmentList: [],
        trainer_tier: 0,
        trainer_interest: []
    },
}

export const getLupaUserStructure = (
    user_uuid: String, 
    username: String, 
    email : String,  
    age : {age: Number}, 
    time_created: Date,
    isGuest: Boolean, ) => {
    lupa_user.user_uuid = user_uuid;
    lupa_user.username = username;
    lupa_user.age = age;
    lupa_user.email = email;
    lupa_user.time_created = time_created;
    lupa_user.isTrainer = false;
    lupa_user.isGuest = false;
    return lupa_user;
}

export const getLupaUserStructurePlaceholder = () => {
    return lupa_user;
}

export {
    lupa_user,
    lupa_user_health_data,
    lupa_workout,
    lupa_pack,
    lupa_pack_event,
};