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
    speed: number;
    heading: number;
    vertical_rate: number;
    sensors: number[] | null;
    geo_altitude: number;
    squawk: string | null;
    spi: boolean;
    position_source: number;
}

export interface DroneDeparture {
    uuid: string;
    latitude: number;
    longitude: number;
    radius: number;
    speed: number;
}

export interface ClosestAircraftRequest {
    droneDeparture: DroneDeparture;
    planesAmount?: number;
}
  
export interface ClosestAircraftResponse {
    closestPlane: Plane | null;
    minDistance: number | null;
    messages: string | null;
}
  
export interface ClosureTimeRequest {
    hostile: {
        latitude: number;
        longitude: number;
        speed: number;
    };
    friendly: {
        latitude: number;
        longitude: number;
        speed: number;
    };
}
  
export interface ClosureTimeResponse {
    closureTime: number;
}
  
export interface EvaluateThreatRequest extends ClosestAircraftRequest {}

export interface EvaluateThreatResponse {
    closestPlane: Plane;
    minDistance: number;
    message: string;
    closureTime: number;
    vectorClosureTime: number;
    droneDepartureUuid: string;
}
  
export interface VectorClosureTimeRequest {
    hostile: {
        latitude: number;
        longitude: number;
        speed: number;
    };
    friendly: {
        latitude: number;
        longitude: number;
        speed: number;
        heading: number;
    };
}

export interface SaveOperationRequest {
    uuid: string;
    latitude: number;
    longitude: number;
    speed: number;
    radius: number;
    closestPlane: Plane;
}

export interface SaveOperationResponse {
    message: string;
}

export interface PastOperation {
    date: string;
    droneDeparture: DroneDeparture;
    plane: Plane;
}

export enum NavbarOptions {
    ChangePlanesAmount,
    AddCoordinates,
    RetrievePastOperations,
    SaveCurrentThreats,
}