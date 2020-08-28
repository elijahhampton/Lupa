
type LupaVlog = {
    vlog_text: String,
    vlog_media: {
        uri: String,
        media_type: String,
    },
    vlog_owner: String,
}

var lupa_vlog_structure : LupaVlog = {
    vlog_text: '',
    vlog_media: {
        uri: '',
        media_type: '',
    },
    vlog_owner: '',
}

export const getLupaVlogStructure = (text, uri, mediaType, owner) => {
    lupa_vlog_structure.vlog_text = text;
    lupa_vlog_structure.vlog_media.uri = uri;
    lupa_vlog_structure.vlog_media.media_type = mediaType;
    lupa_vlog_structure.vlog_owner = owner;
    return lupa_vlog_structure;
}