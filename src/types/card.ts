export type CardDesign = 'clasico' | 'tattoo' | 'vet' | 'travel'

export type CardCustomColors = {
  primary: string
  secondary: string
  accent: string
  bg: string
  text: string
}

export type CardFont = 'inter' | 'playfair' | 'mono' | 'montserrat' | 'poppins' | 'raleway' | 'oswald'

export type CardAnimation = 'none' | 'fade' | 'slide-up' | 'zoom' | 'bounce' | 'glow' | 'float'

export type CardBackgroundType = 'solid' | 'gradient' | 'image'

export interface Card {
  id: string;
  slug: string;
  pinHash: string;
  nombre: string;
  tituloProfesional: string;
  empresa: string;
  telefono: string;
  email: string;
  website: string;
  fotoUrl: string;
  logoUrl?: string;
  headerBanner?: string;
  diseño?: CardDesign;
  tagline?: string;
  customColors?: CardCustomColors;
  customFont?: CardFont;
  animation?: CardAnimation;
  backgroundType?: CardBackgroundType;
  backgroundImage?: string;
  customGradient?: string;
  customCss?: string;
  customHtml?: string;
  servicios?: { name: string; price: string }[];
  horario?: string;
  direccion?: string;
  googleMapsUrl?: string;
  views?: number;
  clicks?: number;
  whatsappClicks?: number;
  instagramClicks?: number;
  phoneClicks?: number;
  ownerId?: string;
  redesSociales: {
    linkedin: string;
    instagram: string;
    twitter: string;
    whatsapp: string;
    github: string;
    tiktok: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type SocialNetwork = keyof Card['redesSociales'];
