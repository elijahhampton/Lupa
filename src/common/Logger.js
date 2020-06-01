export default function LOG(file, message) {
    console.log('LOG in ', file, ': ', message);
}

export function LOG_ERROR(file, message, error) {
    console.log('LOG_ERROR in ', file, ': ', message);
    console.error(error);
}