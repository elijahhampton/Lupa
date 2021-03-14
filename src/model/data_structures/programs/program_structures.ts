import { LupaProgramInformationStructure, ProgramWorkoutStructureEntry, PROGRAM_TYPE, ProgramParticipantCategory} from "./common/types";

var lupa_program_information_structure : LupaProgramInformationStructure = {
    program_name: "",
    program_description: "",
    program_duration: 0,
    program_price: 0,
    program_structure_uuid: "0",
    program_workout_structure: [], //we use this
    program_image: "",
    program_tags: [],
    program_owner: "",
    program_participants: [],
    completedProgram: false,
    client_videos: [],
    trainer_videos: [],
    type: 'PROGRAM',
    isPublic: false,
    workouts_completed: [],
    num_programs_completed: 0,
    program_started: false,
    num_exercises: 0,
    required_equipment: [],
    program_type: 'normal',
    program_restrictions: [], //temporary
    program_participant_category: 'individual'
}

function initializeNewProgram(uuid: String | Number, programOwner: String, programParticipants: Array<String>, programType, duration: Number, programStructure) : LupaProgramInformationStructure {
    lupa_program_information_structure.program_structure_uuid = uuid;
    lupa_program_information_structure.program_duration = duration;
    lupa_program_information_structure.program_workout_structure = programStructure;
    lupa_program_information_structure.program_participants = programParticipants;
    lupa_program_information_structure.program_owner = programOwner;
    lupa_program_information_structure.program_type = programType;

    return lupa_program_information_structure;
}

export const getLupaProgramInformationStructure = (
    uuid="0",
    name="", 
    description="", 
    slots=0, 
    startDate=new Date(), 
    endDate=new Date(), 
    duration="", 
    time="", 
    price=0, 
    locationData = {
        name: "",
        address: "",
        location: {
            lat: 0,
            long: 0,
        }
    },
    type="", 
    allowWaitlist=false, 
    program_image="",
    tags: [],
    programOwner = "",
    program_participants=[],
    programAutomatedMessage="",
    completedProgram=false,
    ) => {
        
    lupa_program_information_structure.program_structure_uuid = "0"
    lupa_program_information_structure.program_name = name;
    lupa_program_information_structure.program_description = description;
    lupa_program_information_structure.program_duration = duration;
    lupa_program_information_structure.program_price = price;
    lupa_program_information_structure.program_location = locationData;
    lupa_program_information_structure.program_type = type;
    lupa_program_information_structure.program_allow_waitlist = allowWaitlist;
    lupa_program_information_structure.program_image = program_image;
    lupa_program_information_structure.program_tags = tags;
    lupa_program_information_structure.program_owner = programOwner;
    lupa_program_information_structure.program_participants = program_participants;
    lupa_program_information_structure.completedProgram = completedProgram

    return lupa_program_information_structure;
}

var lupa_program_workout_structure_entry : ProgramWorkoutStructureEntry = {
    Monday: [],
    Tuesday: [],
    Wednesday:  [],
    Thursday:  [],
    Friday:  [],
    Saturday:  [],
    Sunday:  []
}

export const getProgramWorkoutStructureEntry = () => {
    return lupa_program_workout_structure_entry;
}

export default initializeNewProgram;