import axiosInstance from "../../axiosInstance";
import cheerio, { CheerioAPI } from "cheerio";
import { Product } from "../../types";

const baseUrl = "https://www.pullandbear.com/kz";

class PullAndBearService {
  async GetClothes(category: string): Promise<Product[]> {
    const products: Product[] = [];
    try {
      const resp = await axiosInstance.get<ProductIdsResponseType>(`${baseUrl}/itxrest/3/catalog/store/25009553/20309427/category/${category}/product?languageId=-1&appId=3&showProducts=false&showNoStock=false`)
      const productIds = resp.data.productIds.slice(0, 50).join(',');
      console.log(productIds)
      const anotherResp = await axiosInstance.get<ProductArrayResponseType>(`${baseUrl}/itxrest/3/catalog/store/25009553/20309427/productsArray?languageId=-1&appId=3&productIds=${productIds}&categoryId=${category}`)
      console.log(anotherResp.data.products[0].bundleProductSummaries[0].detail.xmedia[0].xmediaItems[1].medias[0].extraInfo.deliveryUrl)
    } catch (err) {
      console.log('Error fetching products:', err);
    }
    return products;
  }
}

interface ProductIdsResponseType{
  productIds: number[]
}

interface ProductArrayResponseType{
  products: {
    bundleProductSummaries: {
      detail: {
        xmedia:{
          xmediaItems:{
            medias:{
              extraInfo:{
                deliveryUrl: string
              }
            }[]
          }[]
        }[]
      }
    }[]
  }[]
}

export default PullAndBearService;
