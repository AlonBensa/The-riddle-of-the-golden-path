function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
  
function calculateDistance(latitude1, longitude1, latitude2, longitude2) {
    const earthRadiusKm = 6371; // Radius of the Earth in kilometers
    const deltaLatitudeRadians = toRadians(latitude2 - latitude1);
    const deltaLongitudeRadians = toRadians(longitude2 - longitude1);

    const haversineNumerator = Math.sin(deltaLatitudeRadians / 2) * Math.sin(deltaLatitudeRadians / 2) +
        Math.cos(toRadians(latitude1)) * Math.cos(toRadians(latitude2)) *
        Math.sin(deltaLongitudeRadians / 2) * Math.sin(deltaLongitudeRadians / 2);

    const centralAngle = 2 * Math.atan2(Math.sqrt(haversineNumerator), Math.sqrt(1 - haversineNumerator));
    return earthRadiusKm * centralAngle * 1000;
}
  
module.exports = {
    toRadians,
    calculateDistance,
};
  