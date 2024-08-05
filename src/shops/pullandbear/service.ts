import puppeteer from "puppeteer";
import { sleep } from "../farfetch/controller";
import { Product } from "../../types";

const baseUrl = "https://www.pullandbear.com";

class PullAndBearService {
  async GetClothes(category: string): Promise<Product[]> {
    const products: Product[] = [];
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
      await page.goto(`${baseUrl}/itxrest/3/catalog/store/25009553/20309427/category/${category}/product?languageId=-1&appId=3&showProducts=false&showNoStock=false`, {
        waitUntil: 'networkidle2'
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

      console.log(productIds);

      await page.goto(`${baseUrl}/itxrest/3/catalog/store/25009553/20309427/productsArray?languageId=-1&appId=3&productIds=${productIds}&categoryId=${category}`, {
        waitUntil: 'networkidle2'
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
      for(let i=0;i<productData.length;i++){
        const product: Product = {
          name: productData[i].name,
          price: productData[i]?.bundleProductSummaries[0]?.detail.colors[0]?.sizes[0].price ,
          label: "",
          image: productData[i]?.bundleProductSummaries[0]?.detail.xmedia[0]?.xmediaItems[1]?.medias[0]?.extraInfo.deliveryUrl
        }
        if (product.image && product.image !== ""){
          products.push(product)
        }
      }
    } catch (err) {
      console.log('Error fetching products:', err);
    } finally {
      await browser.close();
      return products;
    }
  }
}

interface ProductIdsResponseType {
  productIds: number[];
}

interface ProductArrayResponseType {
  products: {
    name: string
    bundleProductSummaries: {
      detail: {
        xmedia: {
          xmediaItems: {
            medias: {
              extraInfo: {
                deliveryUrl: string;
              };
            }[];
          }[];
        }[];
        colors:{
          sizes:{
            price: string
          }[]
        }[]
      };
    }[];
  }[];
}

export default PullAndBearService;
