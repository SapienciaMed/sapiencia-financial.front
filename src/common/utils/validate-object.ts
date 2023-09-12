export function validateArray(arr) {
    return arr.every(validateObject);
}
function validateObject(obj) {
    return Object.values(obj).every(value => value != "" && value != null);
}