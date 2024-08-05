import axiosInstance from "../../axiosInstance";
import cheerio, { CheerioAPI } from 'cheerio';
import { Product } from "../../types";
import { sleep } from "./controller";

const baseUrl = "https://www.farfetch.com"

class FarfetchParserService {
    async GetClothes(type: string, gender: string): Promise<Product[]> {
        const products: Product[] = [];
            for (let i = 1; i < 5; i++) {
                let retry = true;
                while (retry) {
                    retry = false;
                    try {
                        const resp = await axiosInstance.get<string>(`${baseUrl}/kz/shopping/${gender}/${type}/items.aspx?page=${i}`);
                        const html = resp.data;
                        const $: CheerioAPI = cheerio.load(html);
                        
                        $('[data-component="ProductCardLink"]').each((index, element) => {
                            const product: Product = {
                                image: $(element).find('[data-component="ProductCardImagePrimary"]').attr('src') || '',
                                label: $(element).find('[data-component="ProductCardBrandName"]').text().trim(),
                                name: $(element).find('[data-component="ProductCardDescription"]').text().trim(),
                                price: $(element).find('[data-component="Price"]').text().trim() || $(element).find('[data-component="PriceFinal"]').text().trim(),
                            };
                            if (product.image) {
                                products.push(product);
                            }
                        });
                        console.log(products);

                        const randomDelay = Math.floor(Math.random() * (90000 - 60000 + 1)) + 60000;
                        await sleep(randomDelay);
                    } catch (err: any) {
                        console.log(err)
                    }
                }
            }
        
        return products;
    }
}

export default FarfetchParserService;
