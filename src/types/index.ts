export interface Product {
  id: number;
  name: string;
  desc: string;
  price: number;
  unit: string;
  image: string;
  category: string | string[];
  tag: string;
  tagClass: string;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}
