import { Router, Request, Response } from 'express';
import farfetchmen from '../../../products/farfetch/men/all.json';
import farfetchwomen from '../../../products/farfetch/women/all.json';
import bershkamen from '../../../products/bershka/men/all.json';
import bershkawomen from '../../../products/bershka/women/all.json';
import pabmen from '../../../products/pab/men/all.json';
import pabwomen from '../../../products/pab/women/all.json';

const shopRouter = Router();

// All shops&their clothes
const shopData: { [key: string]: { men: any, women: any } } = {
    farfetch: { men: farfetchmen, women: farfetchwomen },
    bershka: { men: bershkamen, women: bershkawomen },
    pab: { men: pabmen, women: pabwomen }
};

// Get shop's clothes.
//
// Example of request:
// - /magaz?name=bershka
//
// Example of response:
// - {
//      men: [
//              {name, price, label, image}
//           ],
//      women: [
//              {name, price, label, image}
//           ]
//    }
shopRouter.get('/', (req: Request, res: Response) => {
    const { name, gender } = req.query;

    if (!name || typeof name !== 'string') {
        return res.status(400).send({ message: "Invalid query parameter" });
    }

    const data = shopData[name.toLowerCase()];

    if (!data) {
        return res.status(404).send({ message: "Shop not found" });
    }

    if (gender){
        if (gender === "men"){
            res.status(200).send(data.men)
            return 
        }else if (gender === "women"){
            res.status(200).send(data.women)
            return 
        }
    }

    res.status(200).send(data);
});

// Get list of available shops
// Example of request:
// - /magaz/list (the only possible way:/)
//
// Example of response:
// - {
//      shops: [string]
//   }
shopRouter.get('/list', (req: Request, res: Response) => {
    const availableShops = Object.keys(shopData);
    res.status(200).send({ shops: availableShops });
});

export default shopRouter;
