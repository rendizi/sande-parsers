import FarfetchParserService from "./service";
import { Product } from "../../types";
import { shuffleArray } from "../..";
import fs from 'fs/promises';
import { setRandomUserAgent } from "../../axiosInstance";

const farfetch = new FarfetchParserService()

class FarfetchParserController{
    async GetClothing(): Promise<Product[]> {
        setRandomUserAgent()
        const womenClothing = await this.GetWomenClothing();
        const menClothing = await this.GetMenClothing();
        return [...womenClothing, ...menClothing];
    }
    
    async GetMenClothing():Promise<Product[]>{
        const menClothes = ["coats-2","denim-2","jackets-2","polo-shirts-2","shirts-2","shorts-2","suits-2","sweaters-knitwear-2","trousers-2","t-shirts-vests-2"]
        const gender = "men"
        const products:Product[] = []

        for(let i=0; i<menClothes.length; i++){
            const temp = await farfetch.GetClothes(menClothes[i], gender)
            if (temp){
                products.push(...temp)
            }
            const randomDelay = Math.floor(Math.random() * (90000 - 60000 + 1)) + 60000;
            if (temp.length !== 0){
                const shuffledProducts = shuffleArray(temp);
                await fs.writeFile(`./${menClothes[i]}.json`, JSON.stringify(shuffledProducts, null, 2));
            }
            await sleep(randomDelay);
            setRandomUserAgent()
        }
        console.log("Men",products.length)
        return products
    }
    async GetWomenClothing(): Promise<Product[]> {
        const womenClothes = ["skirts-1", "tops-1", "trousers-1", "knitwear-1", "jackets-1", "dresses-1", "denim-1", "coats-1"];
        const gender = "women";
        const products: Product[] = [];
        
        for (let i = 0; i < womenClothes.length; i++) {
            const temp = await farfetch.GetClothes(womenClothes[i], gender);
            if (temp) {
                products.push(...temp);
            }
            
            const randomDelay = Math.floor(Math.random() * (90000 - 60000 + 1)) + 60000;
            if (temp.length !== 0){
                const shuffledProducts = shuffleArray(temp);
                await fs.writeFile(`./${womenClothes[i]}.json`, JSON.stringify(shuffledProducts, null, 2));
            }
            await sleep(randomDelay);
            setRandomUserAgent()
        }
        console.log("Women",products.length)
        return products; 
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default FarfetchParserController