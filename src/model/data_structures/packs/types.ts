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