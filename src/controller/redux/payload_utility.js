 let UPDATE_CURRENT_USER_ATTRIBUTE_ACTION_PAYLOAD = {
    attribute: "",
    value: "",
    optionalData: [], //We should create optional data structures for each type of attribute
}

export function getUpdateCurrentUserAttributeActionPayload(attribute, value, optionalData=[])
{
    UPDATE_CURRENT_USER_ATTRIBUTE_ACTION_PAYLOAD.attribute = attribute;
    UPDATE_CURRENT_USER_ATTRIBUTE_ACTION_PAYLOAD.value = value;
    UPDATE_CURRENT_USER_ATTRIBUTE_ACTION_PAYLOAD.optionalData = optionalData;
    return UPDATE_CURRENT_USER_ATTRIBUTE_ACTION_PAYLOAD;
}
//Currently have no need for this, but might be useful in the future
export let UPDATE_CURRENT_USER_ACTION_PAYLOAD = {
    value: undefined,
}