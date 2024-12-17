export class GeoUtils {
  static checkProximity(lat1: number, lon1: number, lat2: number, lon2: number): boolean {
    const distance = Math.sqrt((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2);
    return distance < 0.01;
  }
}
