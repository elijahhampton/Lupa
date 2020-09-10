
type LupaVlog = {
    vlog_uuid: String,
    vlog_text: String,
    vlog_media: {
        uri: String,
        media_type: String,
    },
    vlog_owner: String,
    vlog_longitude: String,
    vlog_latitude: String,
    vlog_state: String,
    vlog_title: String,
    vlog_city: String,
    vlog_country: String,
    time_created: String,
    date_created: String,
}

var lupa_vlog_structure : LupaVlog = {
    vlog_uuid: '',
    vlog_text: '',
    vlog_title: '',
    vlog_media: {
        uri: '',
        media_type: '',
    },
    vlog_owner: '',
    vlog_longitude: "",
    vlog_latitude: "",
    vlog_state: "",
    vlog_city: "",
    vlog_country: "",
    time_created: "",
    date_created: "",
}

export const getLupaVlogStructure = (title, text, uri, mediaType, owner, longitude, latitude, city, state, country, timeCreated, dateCreated) => {
    lupa_vlog_structure.vlog_uuid = 0;
    lupa_vlog_structure.vlog_text = text;
    lupa_vlog_structure.vlog_media.uri = uri;
    lupa_vlog_structure.vlog_media.media_type = mediaType;
    lupa_vlog_structure.vlog_owner = owner;
    lupa_vlog_structure.time_created = timeCreated;
    lupa_vlog_structure.date_created = dateCreated;
    lupa_vlog_structure.vlog_longitude = longitude;
    lupa_vlog_structure.vlog_latitude = latitude;
    lupa_vlog_structure.vlog_title = title;
    lupa_vlog_structure.vlog_state = state;
    lupa_vlog_structure.vlog_city = city;
    lupa_vlog_structure.vlog_country = country;
    return lupa_vlog_structure;
}