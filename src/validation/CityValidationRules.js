export default function validateCities(dto) {
    return [
        ...validateCity(dto), ...validateRecommendation(dto)];
}

export function validateCity(dto) {
    let errorsFields = [];
    if (!dto.city || (dto.city.length < 1 || dto.city.length > 50)) {
        errorsFields.push("city");
    }
    return errorsFields;
}

export function validateRecommendation(dto) {
    let errorsFields = [];
    if (!dto.recommendation || (dto.recommendation.length < 1 || dto.recommendation.length > 50)) {
        errorsFields.push("recommendation");
    }
    return errorsFields;
}

