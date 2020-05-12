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
    try{
      const { order, markerPosition } = req.body;
      const orderModel: IOrder = await Order.create({ senderId: req.userId, totalPrice: order.totalPrice });
      let products: any[] = [];
      order.products.forEach(async (product: any) => {
        products.push({
          name: product.Name,
          price: product.Price,
          quantity: product.Quantity,
          orderId: orderModel._id,
        })
      });
      let productsModels: IProduct[] = await Product.create(products);
      const markerModel: IMarker = await Marker.create({
        lat: markerPosition.lat,
        lng: markerPosition.lng,
        orderId: orderModel._id
      })
      res.send({message: "Successfully created new order"});
    } catch(error){
      console.error(error.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  })

  export default router;
