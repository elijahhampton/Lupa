"use strict";
exports.__esModule = true;
var types_1 = require("../lupa/common/types");
var lupa_trainer_service = {
    service_name: "",
    service_description: "",
    service_icon: "",
    service_icon_type: "",
    service_colors: []
};
exports.getLupaTrainerService = function (name, description, icon, icon_type, colors) {
    lupa_trainer_service.service_name = name;
    lupa_trainer_service.service_description = description;
    lupa_trainer_service.service_icon = icon;
    lupa_trainer_service.service_icon_type = icon_type;
    lupa_trainer_service.service_colors = colors;
    return lupa_trainer_service;
};
var lupa_pack_event = {
    pack_uuid: "",
    pack_event_title: "",
    pack_event_description: "",
    pack_event_date: "",
    attendees: [],
    pack_event_stage: '',
    pack_event_image: ''
};
exports.lupa_pack_event = lupa_pack_event;
exports.getLupaPackEventStructure = function (title, description, date, time, image) {
    lupa_pack_event.pack_event_title = title;
    lupa_pack_event.pack_event_description = description;
    lupa_pack_event.pack_event_date = date;
    lupa_pack_event.pack_event_image = image;
    lupa_pack_event.pack_event_stage = 'Active';
    lupa_pack_event.pack_event_time = time;
    return lupa_pack_event;
};
var lupa_trainer = {
    user_uuid: "",
    certifications: []
};
exports.lupa_trainer = lupa_trainer;
var lupa_pack = {
    pack_leader: '',
    pack_title: "",
    pack_description: "",
    pack_isSubscription: false,
    pack_isDefault: false,
    pack_type: "",
    pack_members: [],
    pack_invited_members: [],
    pack_image: '',
    pack_leader_notes: {},
    pack_rating: 0,
    pack_sessions_completed: 0,
    pack_time_created: '',
    pack_location: '',
    pack_requests: []
};
exports.lupa_pack = lupa_pack;
exports.getLupaPackStructure = function (packLeader, title, description, location, image, members, invitedMembers, rating, sessionsCompleted, timeCreated, isSubscription, isDefault, type) {
    lupa_pack.pack_leader = packLeader;
    lupa_pack.pack_title = title;
    lupa_pack.pack_description = description;
    lupa_pack.pack_location = location;
    lupa_pack.pack_image = image;
    lupa_pack.pack_members = members;
    lupa_pack.pack_invited_members = invitedMembers;
    lupa_pack.pack_rating = rating;
    lupa_pack.pack_sessions_completed = sessionsCompleted;
    lupa_pack.pack_time_created = timeCreated;
    lupa_pack.pack_isSubscription = isSubscription;
    lupa_pack.pack_isDefault = isDefault;
    lupa_pack.pack_type = type;
    lupa_pack.pack_requests = [];
    return lupa_pack;
};
var lupa_session = {
    attendeeOne: "",
    attendeeOneData: Object,
    attendeeTwo: "",
    attendeeTwoData: Object,
    requesterUUID: "",
    date: "",
    time_periods: [],
    name: "",
    description: "",
    sessionStatus: "",
    sessionMode: "",
    removed: false,
    time_created: {
        date: "",
        time: ""
    },
    locationData: {},
    participants: []
};
exports.lupa_session = lupa_session;
exports.getLupaSessionStructure = function (attendeeOne, attendeeOneData, attendeeTwo, attendeeTwoData, requesterUUID, date, time_periods, name, description, time_created, locationData) {
    lupa_session.attendeeOne = attendeeOne;
    lupa_session.attendeeOneData = attendeeOneData;
    lupa_session.attendeeTwo = attendeeTwo;
    lupa_session.attendeeTwoData = attendeeTwoData;
    lupa_session.requesterUUID = requesterUUID;
    lupa_session.date = date;
    lupa_session.time_periods = time_periods;
    lupa_session.name = name;
    lupa_session.description = description;
    lupa_session.time_created = time_created;
    lupa_session.sessionStatus = types_1.SESSION_STATUS.INVITED;
    lupa_session.sessionMode = "Active";
    lupa_session.removed = false;
    lupa_session.locationData = locationData;
    lupa_session.participants = [
        attendeeOne,
        attendeeTwo,
    ];
    return lupa_session;
};
var lupa_user_health_data = {
    user_uuid: "",
    health: {
        statistics: {}
    },
    goals: [
        {
            goal_uuid: "",
            pathways: []
        }
    ]
};
exports.lupa_user_health_data = lupa_user_health_data;
exports.getLupaHealthDataStructure = function (user_uuid, health, goals) {
    lupa_user_health_data.user_uuid = user_uuid;
    return lupa_user_health_data;
};
var lupa_workout = {
    workout_uuid: ""
};
exports.lupa_workout = lupa_workout;
var lupa_user = {
    assessments: [],
    user_uuid: "",
    display_name: "",
    username: "",
    email: "",
    age: "",
    email_verified: false,
    mobile: "",
    gender: "",
    location: { city: '', state: '', country: '', longitude: '', latitude: '' },
    isTrainer: false,
    packs: [],
    photo_url: "",
    time_created: "",
    preferred_workout_times: {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    },
    interest: [],
    rating: 0,
    experience: {},
    followers: [],
    following: [],
    sessionsCompleted: 0,
    bio: "",
    recommended_workouts: [],
    certification: "",
    homegym: {},
    chats: [],
    session_reviews: [],
    trainer_tier: 0,
    tokens: {},
    waitlistedPrograms: [],
    notifications: [],
    programs: []
};
exports.lupa_user = lupa_user;
exports.getLupaUserStructure = function (user_uuid, _a, username, email, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, time_created, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z) {
    var _0 = _a.display_name, display_name = _0 === void 0 ? "" : _0;
    var _1 = _b.email_verified, email_verified = _1 === void 0 ? false : _1;
    var _2 = _c.mobile, mobile = _2 === void 0 ? "" : _2;
    var _3 = _d.age, age = _3 === void 0 ? "" : _3;
    var _4 = _e.gender, gender = _4 === void 0 ? "" : _4;
    var _5 = _f.location, location = _5 === void 0 ? "" : _5;
    var _6 = _g.isTrainer, isTrainer = _6 === void 0 ? false : _6;
    var _7 = _h.first_name, first_name = _7 === void 0 ? "" : _7;
    var _8 = _j.last_name, last_name = _8 === void 0 ? "" : _8;
    var _9 = _k.packs, packs = _9 === void 0 ? [] : _9;
    var _10 = _l.photo_url, photo_url = _10 === void 0 ? "" : _10;
    var _11 = _m.preferred_workout_times, preferred_workout_times = _11 === void 0 ? {} : _11;
    var _12 = _o.interest, interest = _12 === void 0 ? [] : _12;
    var _13 = _p.rating, rating = _13 === void 0 ? 0 : _13;
    var _14 = _q.experience, experience = _14 === void 0 ? {} : _14;
    var _15 = _r.followers, followers = _15 === void 0 ? [] : _15;
    var _16 = _s.following, following = _16 === void 0 ? [] : _16;
    var sessionsCompleted = _t.sessionsCompleted;
    var _17 = _u.bio, bio = _17 === void 0 ? "" : _17;
    var _18 = _v.recommended_workouts, recommended_workouts = _18 === void 0 ? [] : _18;
    var _19 = _w.certification, certification = _19 === void 0 ? "" : _19;
    var _20 = _x.assessments, assessments = _20 === void 0 ? [] : _20;
    var _21 = _y.tokens, tokens = _21 === void 0 ? {} : _21;
    var _22 = _z.services, services = _22 === void 0 ? [] : _22;
    lupa_user.user_uuid = user_uuid;
    lupa_user.username = username;
    lupa_user.age = age;
    lupa_user.email = email;
    lupa_user.time_created = time_created;
    lupa_user.isTrainer = false;
    return lupa_user;
};
var lupa_assessment = {
    assessment_acronym: '',
    data: [],
    complete: false
};
exports.lupa_assessment = lupa_assessment;
exports.getLupaAssessmentStructure = function (name, data) {
    lupa_assessment.assessment_acronym = name;
    lupa_assessment.data = data;
    return lupa_assessment;
};
