import { STRIPE_VERIFICATION_STATUS } from '../../modules/payments/stripe';
import { 
    LupaUserStructure, 
} from '../lupa/common/types';


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
    clients: [],
    certification: "",
    homegym: {},
    chats: [],
    tokens: {},
    notifications: [],
    programs: [],
    hourly_payment_rate: 15,
    vlogs: [],
    waitlisted_programs: [],
    scheduler_times: {},
    workouts: {},
    program_data: [],
    pack_programs: [],
    has_completed_onboarding: false,
    last_workout_completed: {
        dateCompleted: "",
        workoutUUID: "",
    },
    stripe_metadata: {
        stripe_id: "",
        card_last_four: "",
        card_source: "",
        card_added_to_stripe: false,
        account_id: "",
        connected_account_verification_status: Number(STRIPE_VERIFICATION_STATUS.UNREGISTERED),
        has_submitted_for_verification: false,
    },
    isGuest: true,
    client_metadata: {
        physicalActivityStatus: "Non Active",
        hoursMovingPerDay: 0,
        experience_level: 'Beginner',
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
        training_styles: [],
        hasExperienceInSmallGroupSettings: false,
        smallGroupExperienceYears: 0,
        isInHomeTrainer: false,
        exercise_space: {city: '', state: '', country: '', longitude: '', latitude: '',},
        personal_equipment_list: [],
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
};