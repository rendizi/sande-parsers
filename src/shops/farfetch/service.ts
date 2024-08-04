import axiosInstance from "../../axiosInstance";
import cheerio, { CheerioAPI } from 'cheerio';
import { Product } from "./types";

const baseUrl = "https://www.farfetch.com"

class FarfetchParserService{
    async GetClothes(type: string, gender: string): Promise<Product[]> {
        const products: Product[] = [];
        try {
            for (let i = 1; i < 5; i++) {
                const resp = await axiosInstance.get<string>(`${baseUrl}/kz/shopping/${gender}/${type}/items.aspx?page=${i}`);
                const html = resp.data;
                const $: CheerioAPI = cheerio.load(html);
            
                $('[data-component="ProductCardLink"]').each((index, element) => {
                    const product: Product = {
                        sex: gender,
                        image: $(element).find('[data-component="ProductCardImagePrimary"]').attr('src') || '',
                        brandName: $(element).find('[data-component="ProductCardBrandName"]').text().trim(),
                        description: $(element).find('[data-component="ProductCardDescription"]').text().trim(),
                        price: $(element).find('[data-component="Price"]').text().trim() || $(element).find('[data-component="PriceFinal"]').text().trim(),
                        sizesAvailable: $(element).find('[data-component="ProductCardSizesAvailable"]').text().trim(),
                    };
                    if (product.image) {
                        products.push(product);
                    }
                });
            }
        } catch (err) {
            
        }
        return products;
    }
}

export default FarfetchParserService