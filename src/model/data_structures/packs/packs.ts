import { Pack } from './types';

function Pack(name : string, leader : string) {
   this.name = name;
   this.date_creatd = new Date();
   this.time_creatd = new Date().getTime();
   this.members = [];
}

export function initializeNewPack(name : string, leader : string) : Pack {
    return new Pack(name, leader);
}