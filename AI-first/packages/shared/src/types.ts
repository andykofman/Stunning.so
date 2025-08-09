export type SectionKey = 'hero' | 'about' | 'contact';

export interface Section {
  key: SectionKey;
  title: string;
  body: string;
  order: number;
}

export interface Idea {
  _id?: string;
  idea: string;
  sections: Section[];
  createdAt?: string;
  updatedAt?: string;
}


