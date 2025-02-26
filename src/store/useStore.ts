import { create } from 'zustand';

interface Place {
 name: string;
 description: string;
 location: { lat: number; lng: number };
 distance: number;
 estimatedTime: number;
}

interface Store {
 places: Place[];
 setPlaces: (places: Place[]) => void;
}

export const useStore = create<Store>((set) => ({
 places: [],
 setPlaces: (places) => set({ places }),
}));
