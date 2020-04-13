import { Program } from "./common/types"

export enum PROGRAM_SECTIONS {
    OVERVIEW="overview",
    WARM_UP="warmup",
    PRIMARY="primary",
    BREAK="break",
    SECONDARY="secondary",
    COOLDOWN="cooldown",
    HOMEWORK="homework"
}

var lupa_program_structure : Program = {
    program_uuid: "",
    program_name: "",
    program_description: "",
    program_structure: {
        overview: "",
        warmup: [],
        primary: [],
        break: [],
        secondary: [],
        cooldown: [],
        homework: [],
}
}

const getLupaProgramStructure = (uuid="", name="", description="", overview="", warmup=[], primary=[], _break=[], secondary=[], cooldown=[], homework=[]) => {
    lupa_program_structure.program_uuid = uuid;
    lupa_program_structure.program_name = name;
    lupa_program_structure.program_description = description;
    lupa_program_structure.program_structure.overview = overview;
    lupa_program_structure.program_structure.warmup = warmup;
    lupa_program_structure.program_structure.primary = primary;
    lupa_program_structure.program_structure.break = _break;
    lupa_program_structure.program_structure.secondary = secondary;
    lupa_program_structure.program_structure.cooldown = cooldown;
    lupa_program_structure.program_structure.homework = homework;

    return lupa_program_structure;
}

export {
    getLupaProgramStructure
}