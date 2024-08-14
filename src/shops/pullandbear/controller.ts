import puppeteer, { Browser, Page } from 'puppeteer';
import PullAndBearService from './service';
import { MagazResponse, Product } from '../../types';
import fs from 'fs/promises';
import { shuffleArray } from '../..';

class PullAndBearController {
  private browser!: Browser;
  private page!: Page;
  private service: PullAndBearService;

  constructor() {
    this.service = new PullAndBearService();
  }

  async initBrowser(): Promise<void> {
    this.browser = await puppeteer.launch({ headless: false });
    this.page = await this.browser.newPage();
  }

  async closeBrowser(): Promise<void> {
    await this.browser.close();
  }

  async getClothes() {
    await this.initBrowser();

    let products: MagazResponse[] = [];
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
    const forMen: { [key: string]: string } = {
      "t-shirts": "1030204791",
      "shorts": "1030204712",
      "bryuki": "1030204719",
      "jeans": "1030204731",
      "shirts": "1030204766",
      "hoodie": "1030204822",
      "kurtki": "1030559196",
      "trikotazh": "1030204756"
    };

    try {
      const dataResponse: MagazResponse[] = [];
      
      for (const key in forWomen) {
        if (Object.prototype.hasOwnProperty.call(forWomen, key)) {
          const value = forWomen[key as keyof typeof forWomen];
          const productIds = await this.service.getProductIds(this.page, value);
          const productsFromCategory = await this.service.getProducts(this.page, value, productIds);
          const shuffledProducts = shuffleArray(productsFromCategory);
          const dataResponseElement: MagazResponse = { type: key, clothes: shuffledProducts };
          products.push(dataResponseElement);
          const randomDelay = Math.floor(Math.random() * (1000 - 200 + 1)) + 200;
          await sleep(randomDelay);
        }
      }
      await fs.writeFile(`./products/pab/women/all.json`, JSON.stringify(products, null, 2));

      products = [];

      for (const key in forMen) {
        if (Object.prototype.hasOwnProperty.call(forMen, key)) {
          const value = forMen[key as keyof typeof forMen];
          const productIds = await this.service.getProductIds(this.page, value);
          const productsFromCategory = await this.service.getProducts(this.page, value, productIds);
          const shuffledProducts = shuffleArray(productsFromCategory);
          const dataResponseElement: MagazResponse = { type: key, clothes: shuffledProducts };
          products.push(dataResponseElement);
          await fs.writeFile(`./products/pab/men/${key}.json`, JSON.stringify(shuffledProducts, null, 2));
          const randomDelay = Math.floor(Math.random() * (1000 - 200 + 1)) + 200;
          await sleep(randomDelay);
        }
      }
      await fs.writeFile(`./products/pab/men/all.json`, JSON.stringify(products, null, 2));

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

export default PullAndBearController;
