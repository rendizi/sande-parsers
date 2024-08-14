import puppeteer, { Browser, Page } from "puppeteer";
import BershkaService from "./service";
import { MagazResponse, Product } from "../../types";
import fs from 'fs/promises';
import { shuffleArray } from "../..";

class BershkaController {
  private browser!: Browser;
  private page!: Page;
  private service: BershkaService;

  constructor() {
    this.service = new BershkaService();
  }

  async initBrowser(): Promise<void> {
    this.browser = await puppeteer.launch({ headless: false });
    this.page = await this.browser.newPage();
  }

  async closeBrowser(): Promise<void> {
    await this.browser.close();
  }

  async getClothes(){
    await this.initBrowser();

    let products: MagazResponse[] = [];
    const forWomen: { [key: string]: string } = {
      "dresses": "1010193213",
      "jeans": "1010276029",
      "bryuki": "1010193216",
      "shorts": "1010194517",
      "yubki": "1010280023",
      "tshirts": "1010193217",
      "tops": "1010193220",
      "shirts": "1010193221",
      "kurtki": "1010193212",
      "hoodie": "1010726850",
      "trikotazh": "1010582169"
    };
    const forMen: { [key: string]: string } = {
      "tshirts": "1010193239",
      "shirts": "1010193240",
      "pants": "1010193241",
      "jeans": "1010193238",
      "hoodie": "1010193244",
      "outwear": "1010193546",
      "knitwear": "1010630253",
      "shorts": "1010193242"
    };

    try {
      const dataResponse: MagazResponse[] = []
      for (const key in forWomen) {
        if (Object.prototype.hasOwnProperty.call(forWomen, key)) {
          const value = forWomen[key as keyof typeof forWomen];
          const productIds = await this.service.getProductIds(this.page, value);
          const productsFromCategory = await this.service.getProducts(this.page, value, productIds);
          const shuffledProducts = shuffleArray(productsFromCategory);
          const dataResponseElement: MagazResponse = {type: key, clothes: shuffledProducts}
          products.push(dataResponseElement);
          const randomDelay = Math.floor(Math.random() * (1000 - 200 + 1)) + 200;
          await sleep(randomDelay);
        }
      }
      await fs.writeFile('./products/bershka/women/all.json', JSON.stringify(products, null, 2))
      products = []

      for (const key in forMen) {
        if (Object.prototype.hasOwnProperty.call(forMen, key)) {
          const value = forMen[key as keyof typeof forMen];
          const productIds = await this.service.getProductIds(this.page, value);
          const productsFromCategory = await this.service.getProducts(this.page, value, productIds);
          const shuffledProducts = shuffleArray(productsFromCategory);
          const dataResponseElement: MagazResponse = {type: key, clothes: shuffledProducts}
          products.push(dataResponseElement);
          const randomDelay = Math.floor(Math.random() * (1000 - 200 + 1)) + 200;
          await sleep(randomDelay);
        }
      }
      await fs.writeFile('./products/bershka/men/all.json', JSON.stringify(products, null, 2))

      
    } catch (err) {
      console.log('Error fetching products:', err);
    } finally {
      await this.closeBrowser();
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default BershkaController;
