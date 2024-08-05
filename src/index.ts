import FarfetchParserController from "./shops/farfetch/controller";
import fs from 'fs/promises';
import { Product } from "./types";
import PullAndBearController from "./shops/pullandbear/controller";

const some = async (): Promise<void> => {
    const farfetch = new FarfetchParserController();
    const products: Product[] = await farfetch.GetClothing();

    const shuffledProducts = shuffleArray(products);

    await fs.writeFile('./farfetch.json', JSON.stringify(shuffledProducts, null, 2));
    console.log('Shuffled products have been saved to ./farfetch.json');
};

const another = async() :Promise<void> => {
    const pab = new PullAndBearController()
    const products: Product[] = await pab.GetClothes()
    const shuffledProducts = shuffleArray(products);

    await fs.writeFile('./pab.json', JSON.stringify(shuffledProducts, null, 2));
    console.log('Shuffled products have been saved to ./pab.json');}

export const shuffleArray = (array: Product[]): Product[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};


some();

