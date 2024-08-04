import PullAndBearService from "./service";
import { Product } from "../../types";

const pab = new PullAndBearService()

class PullAndBearController{
    async GetClothes():Promise<Product[]>{
        const products: Product[] = []
        const forMen = ["футболки-и-майки-n6323", "шорты-n6308","брюки-n6363",
            "джинсы-n6347","рубашки-n6313","толстовки-и-худи-n6382","куртки-n6335",
        "трикотаж-n6372"]
        const forWomen = ["платья-n6646","топы-n6644","футболки-n6541","брюки-n6600",
            "джинсы-n6581","юбки-n6571","шорты-n6629","костюмы-n7305","комбинезоны-n6599",
            "толстовки-и-худи-n6636","куртки-и-жакеты-n6555","трикотаж-n6618","блузы-и-рубашки-n6525",
            "жилеты-n7146"
        ]
        const men = "для-мужчин"
        const women = "для-женщин"

        for (let i = 0;i<forMen.length;i++){
            const temp = await pab.GetClothes(men, forMen[i])
            if (temp){
                products.push(...temp)
            }
            const randomDelay = Math.floor(Math.random() * (5000 - 500 + 1)) + 500;
            console.log(temp)
            await sleep(randomDelay);
        }
        for (let i = 0;i<forWomen.length;i++){
            const temp = await pab.GetClothes(women, forWomen[i])
            if (temp){
                products.push(...temp)
            }
            const randomDelay = Math.floor(Math.random() * (5000 - 500 + 1)) + 500;
            console.log(temp)
            await sleep(randomDelay);
        }

        return products
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default PullAndBearController