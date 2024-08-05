import PullAndBearService from "./service";
import { Product } from "../../types";

const pab = new PullAndBearService()

class PullAndBearController{
    async GetClothes():Promise<Product[]>{
        const products: Product[] = []
        const forWomen = {
            "t-shirts":"1030204631",
            "dresses":"1030204618",
            "tops":"1030207187",
            "pants":"1030207189",
            "jeans":"1030204693",
            "yubka":"1030204678",
            "shorts":"1030204685",
            "hoodie":"1030204660",
            "kurtki":"1030471395",
            "trikotasz":"1030204669",
            "shirts":"1030204645",
            "zhileti":"1030319538",
            "kombinezoni":"1030204628",
            "blazer":"1030441307"
        }

        return products
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default PullAndBearController