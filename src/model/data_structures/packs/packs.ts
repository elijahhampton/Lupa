import { PackType } from './types';
import moment from 'moment';

function Pack(name : string, leader : string, attachedProgram: string, invitedMembers: Array<String>, members : Array<String> = []) {
   this.uid = '0';
   this.leader = leader;
   this.name = name;
   this.date_created = moment().toDate().toTimeString();
   this.time_created = moment().toDate()
   this.members = members;
   this.invited_members = invitedMembers;
   this.attached_program = attachedProgram
   this.is_live = true;
}

export function initializeNewPack(name : string, leader : string, attachedProgram: string, invitedMembers: Array<String>) : PackType {
    return new Pack(name, leader, attachedProgram, invitedMembers);
}

export function initializeNewPackWithMembers(name : string, leader : string, attachedProgram: string, invitedMembers: Array<String>, members: Array<String>) : PackType {
    return new Pack(name, leader, attachedProgram, invitedMembers, members);
}

function PackProgram(pack_uid: String, program_uid: String, members: Array<String>) {
    this.uid = '0';
    this.pack_uid = pack_uid;
    this.program_uid = program_uid;
    this.members = members;
    this.is_live = false;
}

export function initializeNewPackProgramWithMembers(pack_uid: String, program_uid: String, members: Array<String>) {
    return new PackProgram(pack_uid, program_uid, members);
}