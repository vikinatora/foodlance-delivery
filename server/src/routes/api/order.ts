import { Router, Response } from "express";
import Request from "../../types/Request";
import HttpStatusCodes from "http-status-codes";
import auth from "../../middleware/auth";
import Order, { IOrder } from "../../models/Order";
import Marker, { IMarker } from "../../models/Marker";
import Product, { IProduct } from "../../models/Product";

const router: Router = Router();

router.post(
  "/create",
  auth,
  async (req: Request, res: Response) => {
    try {
      const { order, markerPosition } = req.body;
      let products: any[] = [];
      order.products.forEach((product: any) => {
        products.push({
          name: product.Name,
          price: product.Price,
          quantity: product.Quantity,
        })
      });
      let productsModels: IProduct[] = await Product.create(products);
      const markerModel: IMarker = await Marker.create({
        lat: markerPosition.lat,
        lng: markerPosition.lng,
      })
      const orderModel: IOrder = await Order.create({ 
        sender: req.userId,
        totalPrice: order.totalPrice,
        tip: order.tip,
        tipPercentage: order.tipPercentage,
        marker: markerModel._id
      });
      productsModels.forEach(async (product) => {
        await Order.findByIdAndUpdate(orderModel._id, {
          $push: {
            products: product
          }
        })
      });
      res.send({message: "Successfully created new order", newMarker: markerModel});
    } catch(error){
      console.error(error.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  });

  router.get(
    "/getAll",
    async (req: Request, res: Response) => {
      try {
        const orders = await Order.find({active: true}).populate("products").populate("marker").populate("sender");        
        res.send(orders);
      } catch (error){
        console.error(error.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
      }
    })
  
  export default router;
