import { PackType } from './types';
import moment from 'moment';

function Pack(name : string, leader : string) {
   this.uid = '0';
   this.leader = leader;
   this.name = name;
   this.date_created = moment().toDate().toTimeString();
   this.time_created = moment().toDate()
   this.members = [];
}

export function initializeNewPack(name : string, leader : string) : PackType {
    return new Pack(name, leader);
}