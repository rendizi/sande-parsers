import { Page } from 'puppeteer';
import { MagazResponse, Product } from "../../types";
import { sleep } from "./controller";
import cheerio from 'cheerio';

const baseUrl = "https://www.farfetch.com";

class FarfetchParserService {
    async GetClothes(page: Page, type: string, gender: string): Promise<MagazResponse> {
        const products: Product[] = [];

        for (let i = 1; i < 3; i++) {
            let retry = true;
            while (retry) {
                retry = false;
                try {
                    const response = await page.goto(`${baseUrl}/kz/shopping/${gender}/${type}/items.aspx?page=${i}`, {
                        waitUntil: 'networkidle2',
                    });

                    if (response && response.status() === 429) {
                        console.log('Received 429 status, retrying after delay...');
                        retry = true;
                        await sleep(60000); 
                        continue;
                    }
                    
                    const html = await page.content();
                    const $ = cheerio.load(html);
                    
                    $('[data-component="ProductCardLink"]').each((index, element) => {
                        const href = $(element).attr('href'); 
                        const product: Product = {
                            image: $(element).find('[data-component="ProductCardImagePrimary"]').attr('src') || '',
                            label: $(element).find('[data-component="ProductCardBrandName"]').text().trim(),
                            name: $(element).find('[data-component="ProductCardDescription"]').text().trim(),
                            price: $(element).find('[data-component="Price"]').text().trim() || $(element).find('[data-component="PriceFinal"]').text().trim(),
                            url: href ? `${baseUrl}${href}` : baseUrl,
                        };
                        if (product.image) {
                            products.push(product);
                        }
                    });

                    console.log(products);

                    const randomDelay = Math.floor(Math.random() * (1000 - 200 + 1)) + 200;
                    await sleep(randomDelay);
                } catch (err: any) {
                    console.log(err);
                    retry = true;
                }
            }
        }
        const result: MagazResponse = {type: type, clothes: products}
        
        return result;
    }
}

export default FarfetchParserService;
