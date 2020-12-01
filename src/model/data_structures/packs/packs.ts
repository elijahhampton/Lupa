import { PackType } from './types';
import moment from 'moment';

function Pack(name : string, leader : string, attachedProgram: string, invitedMembers: Array<String>) {
   this.uid = '0';
   this.leader = leader;
   this.name = name;
   this.date_created = moment().toDate().toTimeString();
   this.time_created = moment().toDate()
   this.members = [];
   this.invited_members = invitedMembers;
   this.attached_program = attachedProgram
   this.is_live = false;
}

export function initializeNewPack(name : string, leader : string, attachedProgram: string, invitedMembers: Array<String>) : PackType {
    return new Pack(name, leader, attachedProgram, invitedMembers);
}