export enum PROGRAM_SECTIONS {
    OVERVIEW="overview",
    WARM_UP="warmup",
    PRIMARY="primary",
    BREAK="break",
    SECONDARY="secondary",
    COOLDOWN="cooldown",
    HOMEWORK="homework"
}

var lupa_program_information_structure = {
    program_uuid: "",
    program_name: "",
    program_description: "",
    program_slots: 0,
    program_start_date: new Date(),
    program_end_date: new Date(),
    program_duration: "",
    program_time: "",
    program_price: 0,
    program_location: {
        name: "",
        address: "",
        location: {
            lng: "",
            lat: ""
        }
    },
    program_type: "",
    program_allow_waitlist: false,
    program_structure_uuid: "",
    program_workout_data: {
        warmup: [],
        primary: [],
        break: [],
        secondary: [],
        cooldown: [],
        homework: []
    },
    program_image: "",
    program_tags: [],
}

export const getLupaProgramInformationStructure = (
    uuid="", 
    name="", 
    description="", 
    slots=0, 
    startDate=new Date(), 
    endDate=new Date(), 
    duration="", 
    time="", 
    price=0, 
    locationData="", 
    type="", 
    allowWaitlist=false, 
    program_image="",
    tags: [],
    ) => {
        
    lupa_program_information_structure.program_structure_uuid = uuid;
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
    lupa_program_information_structure.program_workout_data =  {
        warmup: [],
        primary: [],
        break: [],
        secondary: [],
        cooldown: [],
        homework: [],
};
lupa_program_information_structure.program_image = program_image;
lupa_program_information_structure.program_tags = tags;

    return lupa_program_information_structure;
}