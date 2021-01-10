import { LupaProgramInformationStructure, ProgramWorkoutStructureEntry} from "./common/types";

var lupa_program_information_structure : LupaProgramInformationStructure = {
    program_name: "",
    program_description: "",
    program_slots: 0,
    program_start_date: new Date(),
    program_end_date: new Date(),
    program_duration: 0,
    program_time: "",
    program_price: 0,
    program_location: {
        name: "",
        address: "",
        location: {
            lng: 0,
            lat: 0
        }
    },
    program_type: "",
    program_allow_waitlist: false,
    program_structure_uuid: "0",
    program_workout_data: {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    },
    program_workout_structure: [], //we use this
    program_workout_days: [],
    program_image: "",
    program_tags: [],
    program_owner: "",
    program_participants: [],
    program_automated_message: "",
    completedProgram: false,
    program_metadata: {
        num_interactions: 0,
        views: 0,
        shares: 0,
    },
    program_purchase_metadata: {
        num_purchases: 0,
        purchase_list: [],
        date_purchased: new Date(), //remove
        gross_pay: 0,
        net_pay: 0,
    },
    type: 'PROGRAM',
    isPublic: false,
    num_programs_completed: 0,
    program_started: false,
    num_exercises: 0,
    required_equipment: [],
}

function initializeNewProgram(uuid: String | Number, programOwner: String, programParticipants: Array<String>, duration: Number, workoutDays: Array<String>) : LupaProgramInformationStructure {
    lupa_program_information_structure.program_structure_uuid = uuid;
    lupa_program_information_structure.program_duration = duration;
    lupa_program_information_structure.program_workout_days = workoutDays;
    lupa_program_information_structure.program_participants = programParticipants;
    lupa_program_information_structure.program_owner = programOwner;

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
    lupa_program_information_structure.program_slots = slots;
    lupa_program_information_structure.program_start_date = startDate;
    lupa_program_information_structure.program_end_date  = endDate;
    lupa_program_information_structure.program_duration = duration;
    lupa_program_information_structure.program_time = time;
    lupa_program_information_structure.program_price = price;
    lupa_program_information_structure.program_location = locationData;
    lupa_program_information_structure.program_type = type;
    lupa_program_information_structure.program_allow_waitlist = allowWaitlist;
    lupa_program_information_structure.program_image = program_image;
    lupa_program_information_structure.program_tags = tags;
    lupa_program_information_structure.program_owner = programOwner;
    lupa_program_information_structure.program_participants = program_participants;
    lupa_program_information_structure.program_automated_message = programAutomatedMessage;
    lupa_program_information_structure.program_workout_data = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    }
    lupa_program_information_structure.program_workout_days = []
    lupa_program_information_structure.completedProgram = completedProgram
    lupa_program_information_structure.program_purchase_metadata = {
        num_purchases: 0,
        purchase_list: [],
        date_purchased: new Date(), //remove
        gross_pay: 0,
        net_pay: 0,
    }
    lupa_program_information_structure.program_metadata = {
        num_interactions: 0,
        views: 0,
        shares: 0,
    }

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