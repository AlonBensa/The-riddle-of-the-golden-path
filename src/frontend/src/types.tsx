export interface Plane {
    latitude: number;
    longitude: number;
    heading: number;
    callsign: string;
    altitude: number;
    speed: number;
}

export interface DroneDeparture {
    latitude: number;
    longitude: number;
    radius: number;
    speed: number;
}

export enum NavbarOptions {
    ChangePlanesAmount,
    AddCoordinates,
    RetrievePastOperations,
}