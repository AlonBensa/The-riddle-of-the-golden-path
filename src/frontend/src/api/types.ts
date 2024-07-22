export interface Plane {
    icao24: string;
    callsign: string;
    origin_country: string;
    time_position: number;
    last_contact: number;
    longitude: number;
    latitude: number;
    baro_altitude: number;
    on_ground: boolean;
    velocity: number;
    true_track: number;
    vertical_rate: number;
    sensors: number[] | null;
    geo_altitude: number;
    squawk: string | null;
    spi: boolean;
    position_source: number;
}
  
export interface ClosestAircraftRequest {
    lat: number;
    lon: number;
    radius: number;
}
  
export interface ClosestAircraftResponse {
    closestPlane: Plane | null;
    minDistance: number;
}
  
export interface ClosureTimeRequest {
    distance: number;
    speed: number;
}
  
export interface ClosureTimeResponse {
    closureTime: number;
}
  
export interface EvaluateThreatRequest {
    lat: number;
    lon: number;
    speed: number;
    radius: number;
}
  
export interface VectorClosureTimeRequest {
    hostile: {
        lat: number;
        lon: number;
    };
    friendly: {
        lat: number;
        lon: number;
        velocity: number;
        heading: number;
    };
    hostileSpeed: number;
}

export interface Operation {
    lat: number;
    lon: number;
    speed: number;
    radius: number;
    closestPlane: any;
}
  
export interface SaveOperationResponse {
    message: string;
}
  
export interface FetchSavedOperationsResponse {
    operations: Operation[];
}