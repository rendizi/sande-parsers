import FarfetchParserController from "./shops/farfetch/controller";
import fs from 'fs/promises';
import { Product } from "./types";
import PullAndBearController from "./shops/pullandbear/controller";
import path from "path"
import PullAndBearService from "./shops/pullandbear/service";
import BershkaController from "./shops/bershka/controller";
import express, { Request, Response } from 'express';
import farfetchmen from "../products/farfetch/men/all.json"
import farfetchwomen from "../products/farfetch/women/all.json"
import pabmen from "../products/pab/men/all.json"
import pabwomen from "../products/pab/women/all.json"
import shopRouter from "./router/magaz/router";

export const app = express()

const PORT = process.env.PORT || 4000;

app.use('/magaz',shopRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
// const some = async (): Promise<void> => {
//     const farfetch = new FarfetchParserController();
//     const products: Product[] = await farfetch.GetClothing();

//     const shuffledProducts = shuffleArray(products);

//     await fs.writeFile('./products/farfetch/farfetch.json', JSON.stringify(shuffledProducts, null, 2));
//     console.log('Shuffled products have been saved to ./farfetch.json');
// };

// const another = async() :Promise<void> => {
//     const pab = new PullAndBearController()
//     const products: Product[] = await pab.GetClothes()
//     const shuffledProducts = shuffleArray(products);

//     await fs.writeFile('./pab.json', JSON.stringify(shuffledProducts, null, 2));
//     console.log('Shuffled products have been saved to ./pab.json');}

const bershkaParser = async() => {
    const bershka = new BershkaController()
    const products: Product[] = await bershka.GetClothes()
    const shuffledProducts = shuffleArray(products);

    await fs.writeFile('./bershka.json', JSON.stringify(shuffledProducts, null, 2));
    console.log('Shuffled products have been saved to ./bershka.json');}


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
            const filePath = path.join(__dirname, `../products/bershka/women/${fileName}.json`);
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
    "dresses",
            "jeans",
            "bryuki",
            "shorts",
            "yubki",
            "tshirts",
            "tops",
            "shirts",
            "kurtki",
            "hoodie",
            "trikotazh"
]

const outputFileName = '../products/bershka/women/all.json';

// combineJsonFiles(fileNames, outputFileName);
// // some();
// // another()
// const lol = async () => {
//     const pab = new PullAndBearController()
//     pab.GetClothes()
// }

// bershkaParser()

// //lol()