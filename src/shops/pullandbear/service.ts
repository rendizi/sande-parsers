import puppeteer, { Page } from 'puppeteer';
import { Product } from '../../types';

const baseUrl = "https://www.pullandbear.com";
const MAX_RETRIES = 3;

class PullAndBearService {
  async getProductIds(page: Page, category: string, retries: number = MAX_RETRIES): Promise<string> {
    try {
      await page.goto(`${baseUrl}/itxrest/3/catalog/store/25009553/20309427/category/${category}/product?languageId=-1&appId=3&showProducts=false&showNoStock=false`, {
        waitUntil: 'networkidle2',
      });

      const productIds = await page.evaluate(() => {
        const preElement = document.querySelector("pre");
        if (!preElement) {
          throw new Error("Data not found");
        }
        const data = preElement.innerText;
        const parsedData = JSON.parse(data);
        return parsedData.productIds.slice(0, 50).join(',');
      });

      return productIds;

    } catch (err: any) {
      if (retries > 0) {
        console.log(`Retrying... Attempts left: ${retries - 1}`);
        return this.getProductIds(page, category, retries - 1);
      } else {
        console.log('Error fetching product IDs:', err.message);
        throw err;
      }
    }
  }

  async getProducts(page: Page, category: string, productIds: string, retries: number = MAX_RETRIES): Promise<Product[]> {
    try {
      await page.goto(`${baseUrl}/itxrest/3/catalog/store/25009553/20309427/productsArray?languageId=-1&appId=3&productIds=${productIds}&categoryId=${category}`, {
        waitUntil: 'networkidle2',
      });

      const productData = await page.evaluate(() => {
        const preElement = document.querySelector("pre");
        if (!preElement) {
          throw new Error("Data not found");
        }
        const data = preElement.innerText;
        const parsedData = JSON.parse(data);
        return parsedData.products;
      });

      return (productData as any[]).map((data: any) => ({
        name: data.name,
        price: data.bundleProductSummaries[0]?.detail.colors[0]?.sizes[0].price,
        label: "",
        image: data.bundleProductSummaries[0]?.detail.xmedia[0]?.xmediaItems[1]?.medias[0]?.extraInfo.deliveryUrl,
        url: `${baseUrl}/kz/ru/${data.productUrl}`
      })).filter((product: Product) => product.image && product.image !== "");

    } catch (err: any) {
      if (retries > 0) {
        console.log(`Retrying... Attempts left: ${retries - 1}`);
        return this.getProducts(page, category, productIds, retries - 1);
      } else {
        console.log('Error fetching products:', err.message);
        throw err;
      }
    }
  }

  async GetClothes(category: string): Promise<Product[]> {
    const products: Product[] = [];
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
      const productIds = await this.getProductIds(page, category);
      const fetchedProducts = await this.getProducts(page, category, productIds);
      products.push(...fetchedProducts);
    } catch (err) {
      console.log('Error fetching products:', err);
    } finally {
      await browser.close();
      return products;
    }
  }
}

export default PullAndBearService;
