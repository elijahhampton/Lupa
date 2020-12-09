export type PackType = {
    uid: string,
    name: string,
    date_created: Date,
    time_created: Date,
    members: Array<String>,
    leader: string,
    attached_program: string,
    is_live: boolean,
    invited_members: Array<String>
}

export type PackProgramType = {
    uid: string,
    program_uid: string,
    members: Array<string>,
    pack_uid: string,
    is_live: boolean,
}