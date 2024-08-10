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
  
function calculateVectorClosureTime(hostile, friendly) {
    const dx = friendly.longitude - hostile.longitude;
    const dy = friendly.latitude - hostile.latitude;
    const distance = Math.sqrt(dx * dx + dy * dy);
  
    const relativeSpeed = Math.sqrt(
      Math.pow(friendly.speed * Math.cos(friendly.heading) - hostile.speed, 2) +
      Math.pow(friendly.speed * Math.sin(friendly.heading), 2)
    );
  
    if (relativeSpeed <= 0) {
      throw new Error('Relative speed must be greater than zero');
    }
  
    return distance / relativeSpeed;
}
  
module.exports = {
    toRadians,
    calculateDistance,
    calculateVectorClosureTime,
};
  