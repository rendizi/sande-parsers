import axiosInstance from "../../axiosInstance";
import cheerio, { CheerioAPI } from "cheerio";
import { Product } from "../../types";

const baseUrl = "https://www.pullandbear.com/kz";

class PullAndBearService {
  async GetClothes(gender: string, type: string): Promise<Product[]> {
    const products: Product[] = [];
    try {
      const resp = await axiosInstance.get(`${baseUrl}/${gender}/одежда/${type}`);
      const html = resp.data;
      const $: CheerioAPI = cheerio.load(html);

      $('.c-tile--product').each((_, element) => {
        const name = $(element).find('.name span').text().trim();
        const price = $(element).find('.product-price--price').text().trim();
        const label = $(element).find('.color-container .title-color').map((_, colorElement) => $(colorElement).text().trim()).get().join(', ');
        const image = $(element).find('.carousel-item.is-current img').attr('src');

        const product: Product = {
          name,
          price,
          label,
          image : ""
        };

        products.push(product);
      });

    } catch (err) {
      console.log('Error fetching products:', err);
    }
    return products;
  }
}

export default PullAndBearService;
