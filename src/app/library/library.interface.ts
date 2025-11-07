export interface IPublishingHouse{
  idPublishingHouse?: number;
  namePublishingHouse: string;
  totalBooks?: number;
}

export interface IAuthor {
  idAuthor?: number;
  nameAuthor: string;
  totalBooks?: number;
}

export interface IBook {
  isbn: number;
  title: string;
  pages: number;
  price: number;
  photoCover: string | null;
  photo?: File | null;
  photoName?: string | null;
  discontinued: boolean;
  authorId: number | null;
  publishingHouseId: number | null;
  nameAuthor?: string;
  namePublishingHouse?: string;
}
