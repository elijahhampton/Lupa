"use strict";
exports.__esModule = true;
var PROGRAM_SECTIONS;
(function (PROGRAM_SECTIONS) {
    PROGRAM_SECTIONS["OVERVIEW"] = "overview";
    PROGRAM_SECTIONS["WARM_UP"] = "warmup";
    PROGRAM_SECTIONS["PRIMARY"] = "primary";
    PROGRAM_SECTIONS["BREAK"] = "break";
    PROGRAM_SECTIONS["SECONDARY"] = "secondary";
    PROGRAM_SECTIONS["COOLDOWN"] = "cooldown";
    PROGRAM_SECTIONS["HOMEWORK"] = "homework";
})(PROGRAM_SECTIONS = exports.PROGRAM_SECTIONS || (exports.PROGRAM_SECTIONS = {}));
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
        "break": [],
        secondary: [],
        cooldown: [],
        homework: []
    },
    program_image: "",
    program_tags: [],
    program_owner: "",
    program_participants: []
};
exports.getLupaProgramInformationStructure = function (uuid, name, description, slots, startDate, endDate, duration, time, price, locationData, type, allowWaitlist, program_image, tags, programOwner, program_participants) {
    if (uuid === void 0) { uuid = ""; }
    if (name === void 0) { name = ""; }
    if (description === void 0) { description = ""; }
    if (slots === void 0) { slots = 0; }
    if (startDate === void 0) { startDate = new Date(); }
    if (endDate === void 0) { endDate = new Date(); }
    if (duration === void 0) { duration = ""; }
    if (time === void 0) { time = ""; }
    if (price === void 0) { price = 0; }
    if (locationData === void 0) { locationData = ""; }
    if (type === void 0) { type = ""; }
    if (allowWaitlist === void 0) { allowWaitlist = false; }
    if (program_image === void 0) { program_image = ""; }
    if (programOwner === void 0) { programOwner = ""; }
    if (program_participants === void 0) { program_participants = []; }
    lupa_program_information_structure.program_structure_uuid = uuid;
    lupa_program_information_structure.program_name = name;
    lupa_program_information_structure.program_description = description;
    lupa_program_information_structure.program_slots = slots;
    lupa_program_information_structure.program_start_date = startDate;
    lupa_program_information_structure.program_end_date = endDate;
    lupa_program_information_structure.program_duration = duration;
    lupa_program_information_structure.program_time = time;
    lupa_program_information_structure.program_price = price;
    lupa_program_information_structure.program_location = locationData;
    lupa_program_information_structure.program_type = type;
    lupa_program_information_structure.program_allow_waitlist = allowWaitlist;
    lupa_program_information_structure.program_workout_data = {
        warmup: [],
        primary: [],
        "break": [],
        secondary: [],
        cooldown: [],
        homework: []
    };
    lupa_program_information_structure.program_image = program_image;
    lupa_program_information_structure.program_tags = tags;
    lupa_program_information_structure.program_owner = programOwner;
    lupa_program_information_structure.program_participants = program_participants;
    return lupa_program_information_structure;
};
