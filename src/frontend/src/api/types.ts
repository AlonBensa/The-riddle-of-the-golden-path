export interface Plane {
    icao24: string;
    callsign: string;
    origin_country: string;
    time_position: number;
    last_contact: number;
    longitude: number;
    latitude: number;
    altitude: number;
    on_ground: boolean;
    velocity: number;
    heading: number;
    vertical_rate: number;
    sensors: number[] | null;
    geo_altitude: number;
    squawk: string | null;
    spi: boolean;
    position_source: number;
}

export interface DroneDeparture {
    latitude: number;
    longitude: number;
    radius: number;
    speed: number;
}

export interface ClosestAircraftRequest {
    dronesDeparture: DroneDeparture[];
    planesAmount?: number;
}
  
export interface ClosestAircraftResponse {
    closestPlanes: (Plane | null)[];
    minDistances: (number | null)[];
    messages: (string | null)[];
}
  
export interface ClosureTimeRequest {
    distance: number;
    speed: number;
}
  
export interface ClosureTimeResponse {
    closureTime: number;
}
  
export interface EvaluateThreatRequest extends ClosestAircraftRequest {}

export interface EvaluateThreatResponse {
    closestPlanes: Plane[];
    minDistances: number[];
    messages: string[];
    closureTimes: number[];
    vectorClosureTimes: number[];
}
  
export interface VectorClosureTimeRequest {
    hostile: {
        latitude: number;
        longitude: number;
        velocity: number;
    };
    friendly: {
        latitude: number;
        longitude: number;
        velocity: number;
        heading: number;
    };
}

export interface Operation {
    latitude: number;
    longitude: number;
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

export enum NavbarOptions {
    ChangePlanesAmount,
    AddCoordinates,
    RetrievePastOperations,
    SaveCurrentThreats,
}