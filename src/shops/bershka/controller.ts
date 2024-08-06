import PullAndBearService from "./service";
import { Product } from "../../types";
import fs from 'fs/promises';
import { val } from "cheerio/lib/api/attributes";
import { shuffleArray } from "../..";

const pab = new PullAndBearService()

class BershkaController{
    async GetClothes():Promise<Product[]>{
        const products: Product[] = []
        const forWomen: { [key: string]: string } = {
            "dresses": "1010193213",
            "jeans": "1010276029",
            "bryuki":"1010193216",
            "shorts":"1010194517",
            "yubki":"1010280023",
            "tshirts":"1010193217",
            "tops":"1010193220",
            "shirts":"1010193221",
            "kurtki":"1010193212",
            "hoodie":"1010726850",
            "trikotazh":"1010582169"
          };
        const forMen: {[key: string]: string} = {
            "tshirts":"1010193239",
            "shirts":"1010193240",
            "pants":"1010193241",
            "jeans":"1010193238",
            "hoodie":"1010193244",
            "outwear":"1010193546",
            "knitwear":"1010630253",
            "shorts":"1010193242"
        }
          
          for (const key in forWomen) {
            if (Object.prototype.hasOwnProperty.call(forWomen, key)) {
              const value = forWomen[key as keyof typeof forWomen];
              const product = await pab.GetClothes(value)
              const shuffledProducts = shuffleArray(product)
              products.push(...shuffledProducts)
              await fs.writeFile(`./products/bershka/women/${key}.json`, JSON.stringify(shuffledProducts, null, 2));
              const randomDelay = Math.floor(Math.random() * (1000 - 200 + 1)) + 200;
              await sleep(randomDelay)
            }
          }
        for (const key in forMen) {
            if (Object.prototype.hasOwnProperty.call(forMen, key)) {
              const value = forMen[key as keyof typeof forMen];
              const product = await pab.GetClothes(value)
              const shuffledProducts = shuffleArray(product)
              products.push(...shuffledProducts)
              await fs.writeFile(`./products/bershka/men/${key}.json`, JSON.stringify(shuffledProducts, null, 2));
              const randomDelay = Math.floor(Math.random() * (1000 - 200 + 1)) + 200;
              await sleep(randomDelay)
            }
          }
          
        return products
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default BershkaController