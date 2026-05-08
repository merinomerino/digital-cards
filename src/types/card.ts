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
