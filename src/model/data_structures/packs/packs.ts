import { PackType } from './types';
import moment from 'moment';

function Pack(name : string, leader : string, attachedProgram: string, invitedMembers: Array<String>, members : Array<String> = []) {
   this.uid = '0';
   this.leader = leader;
   this.name = name;
   this.date_created = moment().format()
   this.time_created = moment().format()
   this.members = members;
   this.invited_members = invitedMembers;
   this.attached_program = attachedProgram
   this.is_live = true;
   this.isPublic = false;
}

export function initializeNewPack(name : string, leader : string, attachedProgram: string, invitedMembers: Array<String>) : PackType {
    return new Pack(name, leader, attachedProgram, invitedMembers);
}

export function initializeNewPackWithMembers(name : string, leader : string, attachedProgram: string, invitedMembers: Array<String>, members: Array<String>) : PackType {
    return new Pack(name, leader, attachedProgram, invitedMembers, members);
}

function PackProgram(trainer: String, pack_uid: String, program_uid: String, members: Array<String>) {
    this.trainer = trainer;
    this.uid = '0';
    this.pack_uid = pack_uid;
    this.program_uid = program_uid;
    this.members = members;
    this.is_live = false;
}

export function initializeNewPackProgramWithMembers(programOwner: String, pack_uid: String, program_uid: String, members: Array<String>) {
    return new PackProgram(programOwner, pack_uid, program_uid, members);
}