import PullAndBearService from "./service";
import { Product } from "../../types";
import fs from 'fs/promises';
import { val } from "cheerio/lib/api/attributes";
import { shuffleArray } from "../..";

const pab = new PullAndBearService()

class PullAndBearController{
    async GetClothes():Promise<Product[]>{
        const products: Product[] = []
        const forWomen: { [key: string]: string } = {
            "t-shirts": "1030204631",
            "dresses": "1030204618",
            "tops": "1030207187",
            "pants": "1030207189",
            "jeans": "1030204693",
            "yubka": "1030204678",
            "shorts": "1030204685",
            "hoodie": "1030204660",
            "kurtki": "1030471395",
            "trikotasz": "1030204669",
            "shirts": "1030204645",
            "zhileti": "1030319538",
            "kombinezoni": "1030204628",
           "blazer": "1030441307"
          };
        const forMen: {[key: string]: string} = {
            "t-shirts":"1030204791",
            "shorts":"1030204712",
            "bryuki":"1030204719",
            "jeans":"1030204731",
            "shirts":"1030204766",
            "hoodie":"1030204822",
            "kurtki":"1030559196",
            "trikotazh":"1030204756"
        }
          
          for (const key in forWomen) {
            if (Object.prototype.hasOwnProperty.call(forWomen, key)) {
              const value = forWomen[key as keyof typeof forWomen];
              const product = await pab.GetClothes(value)
              const shuffledProducts = shuffleArray(product)
              products.push(...shuffledProducts)
              await fs.writeFile(`./products/pab/women/${key}.json`, JSON.stringify(shuffledProducts, null, 2));
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
              await fs.writeFile(`./products/pab/men/${key}.json`, JSON.stringify(shuffledProducts, null, 2));
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

export default PullAndBearController