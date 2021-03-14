
export type LupaProgramInformationStructure = {
    program_name: String,
    program_description: String,
    program_duration: Number | String,
    client_videos: Array<string>,
    trainer_videos: Array<string>,
    program_price: Number,
    program_location: Object,
    program_allow_waitlist: Boolean,
    program_structure_uuid: String | Number,
    program_image: String,
    program_tags: Array<String>,
    program_owner: String,
    program_participants: Array<String>,
    completedProgram: Boolean,
    program_restrictions: Array<string>,
    type: String,
    isPublic: Boolean,
    workouts_completed: Array<string>,
    program_workout_structure: Array<ProgramWorkoutStructureEntry>,
    num_programs_completed: Number,
    program_started: false,
    num_exercises: Number,
    required_equipment: Array<string>,
    program_type: string,
    program_participant_category: ProgramParticipantCategory
}

export type ProgramWorkoutStructureEntry = {
    Monday: Array<Object>,
    Tuesday: Array<Object>,
    Wednesday:  Array<Object>,
    Thursday:  Array<Object>,
    Friday:  Array<Object>,
    Saturday:  Array<Object>,
    Sunday:  Array<Object>
}

export type PurchaseMetaData = {
    num_purchases: Number,
    purchase_list: Array<String>,
    date_purchased: Date,
    gross_pay: Number,
    net_pay: Number,
}

export type ProgramMetaData = {
    num_interactions: Number,
    shares: Number,
    views: Number,
}

export enum ProgramParticipantCategory {
    INDIVIDUAL='individual',
    PACK='pack'
}

export enum PROGRAM_TYPE {
    NORMAL='normal',
    PLUS='plus'
}

