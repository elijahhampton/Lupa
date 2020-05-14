/*export type Program = {
    program_structure: {
        warmup: any,
        primary: any,
        break: any,
        secondary: any,
        cooldown: any,
        homework: any,
    }
}
*/
export type LupaProgramInformationStructure = {
    program_name: String,
    program_description: String,
    program_slots: Number,
    program_start_date: Date,
    program_end_date: Date,
    program_duration: String,
    program_time: String,
    program_price: Number,
    program_location: String,
    program_type: String,
    program_allow_waitlist: Boolean,
    program_structure_uuid: String,
    program_workout_data: Object,
    program_image: String,
    program_tags: Array<String>,
}