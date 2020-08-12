export default function LOG(file, message) {
    console.log('LOG in ', file, ': ', message);
}

export function LOG_ERROR(file, message, error) {
    console.log('Error occured in ', file, ': ', message);
    console.error(error);
}

export function LOG_WARN(file, warningMessage) {
    console.warn(warningMessage);
}