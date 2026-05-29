export interface Location {
  lat: number;
  lng: number;
}

export type PriceLevel = 1 | 2 | 3;

export interface FilterState {
  radius: number;
  priceLevels: PriceLevel[];
  cuisines: string[];
  minRating: number;
  minReviews: number;
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  priceLevel: number | null;
  address: string;
  location: Location;
  types: string[];
  primaryType: string;
  isOpenNow: boolean | null;
  photoReference: string | null;
  googleMapsUri: string;
  websiteUri: string | null;
  editorialSummary: string | null;
}

export interface PlacesApiResponse {
  places: PlacesApiPlace[];
}

export interface PlacesApiPlace {
  id: string;
  displayName: { text: string; languageCode: string };
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  formattedAddress?: string;
  location: { latitude: number; longitude: number };
  types?: string[];
  primaryTypeDisplayName?: { text: string; languageCode: string };
  currentOpeningHours?: { openNow: boolean };
  regularOpeningHours?: { openNow: boolean };
  photos?: Array<{ name: string }>;
  googleMapsUri?: string;
  websiteUri?: string;
  editorialSummary?: { text: string };
}
