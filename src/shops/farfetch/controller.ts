import puppeteer, { Browser, Page } from 'puppeteer';
import FarfetchParserService from "./service";
import { MagazResponse, Product } from "../../types";
import { shuffleArray } from "../..";
import fs from 'fs/promises';

class FarfetchParserController {
    private browser!: Browser;
    private page!: Page;

    async init() {
        this.browser = await puppeteer.launch({ headless: false });
        this.page = await this.browser.newPage()
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async GetClothing(): Promise<MagazResponse[]> {
        const farfetchService = new FarfetchParserService();

        const womenClothing = await this.GetWomenClothing(farfetchService);
        const menClothing = await this.GetMenClothing(farfetchService);

        await this.page.close();

        await fs.writeFile('./products/farfetch/men/all.json', JSON.stringify(menClothing, null, 2))
        await fs.writeFile('./products/farfetch/women/all.json', JSON.stringify(womenClothing, null, 2))

        return [...womenClothing, ...menClothing];
    }

    async GetMenClothing(service: FarfetchParserService): Promise<MagazResponse[]> {
        const menClothes = [
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
        const gender = "men";
        const products: MagazResponse[] = [];

        for (let i = 0; i < menClothes.length; i++) {
            const temp = await service.GetClothes(this.page, menClothes[i], gender);
            if (temp) {
                products.push(temp);
            }

            if (temp.clothes.length !== 0) {
                const shuffledProducts = shuffleArray(temp.clothes);
                await fs.writeFile(`./products/farfetch/men/${menClothes[i]}.json`, JSON.stringify(shuffledProducts, null, 2));
            }

            const randomDelay = Math.floor(Math.random() * (1000 - 200 + 1)) + 200;
            await sleep(randomDelay);
        }

        await fs.writeFile(`./products/farfetch/men/all.json`, JSON.stringify(products, null, 2));
        console.log("Men", products.length);
        return products;
    }

    async GetWomenClothing(service: FarfetchParserService): Promise<MagazResponse[]> {
        const womenClothes = [
            "skirts-1", 
            "tops-1", 
            "trousers-1", 
            "knitwear-1", 
            "jackets-1", 
            "dresses-1", 
            "denim-1", 
            "coats-1"
        ];
        const gender = "women";
        const products: MagazResponse[] = [];

        for (let i = 0; i < womenClothes.length; i++) {
            const temp = await service.GetClothes(this.page, womenClothes[i], gender);
            if (temp) {
                products.push(temp);
            }

            if (temp.clothes.length !== 0) {
                const shuffledProducts = shuffleArray(temp.clothes);
                await fs.writeFile(`./products/farfetch/women/${womenClothes[i]}.json`, JSON.stringify(shuffledProducts, null, 2));
            }

            const randomDelay = Math.floor(Math.random() * (1000 - 200 + 1)) + 200;
            await sleep(randomDelay);
        }

        await fs.writeFile(`./products/farfetch/women/all.json`, JSON.stringify(products, null, 2));
        console.log("Women", products.length);
        return products;
    }
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default FarfetchParserController;
