/**
 * types.ts
 * Type definitions for the findMe Address Platform Landing Page
 */

export interface AddressData {
  fullName: string;
  phone: string;
  city: 'Douala' | 'Yaoundé' | 'Bafoussam' | 'Garoua' | 'Kribi';
  neighborhood: string;
  streetName: string;
  housePlateNumber: string;
  landmark: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  addressCode: string; // Generated e.g., FM-DLA-8392B
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  quote: string;
  avatarSeed: string; // Used for customized avatars or illustrations
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface Benefit {
  id: number;
  title: string;
  description: string;
  badge: string;
}
