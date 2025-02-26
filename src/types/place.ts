export interface Place {
 name: string;
 description: string;
 location: { lat: number; lng: number };
 distance: number;
 estimatedTime: number;
}
