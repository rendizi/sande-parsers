export interface Product{
    name: string 
    price: string 
    label: string 
    image: string 
    url: string 
}

export interface MagazResponse{
    type: string 
    clothes: Product[]
}