import FarfetchParserController from "./shops/farfetch/controller";
import fs from 'fs/promises';
import { Product } from "./types";
import PullAndBearController from "./shops/pullandbear/controller";
import path from "path"
import PullAndBearService from "./shops/pullandbear/service";

const some = async (): Promise<void> => {
    const farfetch = new FarfetchParserController();
    const products: Product[] = await farfetch.GetClothing();

    const shuffledProducts = shuffleArray(products);

    await fs.writeFile('./products/farfetch/farfetch.json', JSON.stringify(shuffledProducts, null, 2));
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

async function combineJsonFiles(fileNames: string[], outputFileName: string) {
    try {
        let combinedData: Product[] = [];

        for (const fileName of fileNames) {
            const filePath = path.join(__dirname, `../products/farfetch/men/${fileName}.json`);
            const fileData = await fs.readFile(filePath, 'utf8');
            const jsonData = JSON.parse(fileData);
            combinedData = combinedData.concat(jsonData);
        }

        const shuffled = shuffleArray(combinedData)
        await fs.writeFile(path.join(__dirname, outputFileName), JSON.stringify(shuffled, null, 2));
        console.log(`Combined data saved to ${outputFileName}`);
    } catch (error) {
        console.error('Error combining JSON files:', error);
    }
}

const fileNames = [
    "coats-2",
            "denim-2",
            "jackets-2",
            "polo-shirts-2",
            "shirts-2",
            "shorts-2",
            "sweaters-knitwear-2",
            "trousers-2",
            "t-shirts-vests-2"
];
const outputFileName = '../products/farfetch/men/all.json';

combineJsonFiles(fileNames, outputFileName);
// some();
// another()
// const pab = new PullAndBearService()
// pab.GetClothes("1030204791")