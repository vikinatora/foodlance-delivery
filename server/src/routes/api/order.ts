import { Router, Response } from "express";
import Request from "../../types/Request";
import HttpStatusCodes from "http-status-codes";
import auth from "../../middleware/auth";
import Order, { IOrder } from "../../models/Order";
import Marker, { IMarker } from "../../models/Marker";
import Product, { IProduct } from "../../models/Product";
import User, { IUser } from "../../models/User";

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
          name: product.name,
          price: product.price,
          quantity: product.quantity,
        })
      });
      let productsModels: IProduct[] = await Product.create(products);
      const markerModel: IMarker = await Marker.create({
        lat: markerPosition.lat,
        lng: markerPosition.lng,
      })
      const orderModel: IOrder = await Order.create({ 
        requestor: req.userId,
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
      const completeOrder = await Order.findById(orderModel._id).populate("marker").populate("requestor").populate("products");
      completeOrder.products = productsModels;
      res.send({success: true, message: "Successfully created new order", newOrder: completeOrder});
    } catch(error){
      console.error(error.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
      res.send({success: false, message: "Couldn't create new order"});
    }
});

router.get(
  "/getAll",
  async (req: Request, res: Response) => {
    try {
      //TODO: Show inactive only if you are the requestor
      const orders = await Order.find({active: true}).populate("products").populate("marker").populate("requestor").populate("executor");        
      res.send(orders);
    } catch (error){
      console.error(error.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
})

router.post(
  "/accept",
  auth,
  async (req: Request, res: Response) => {
    try {
      const { orderId, userId } = req.body;
      const user = await User.findById(userId).populate("acceptedOrder");
      if( user.acceptedOrder && user.acceptedOrder.id) {
        res.send({success: false, message: "Cannot accept more than one order."});
        return;
      }
      await Order.findByIdAndUpdate(orderId, {
        $set: {
            executor: userId,
            inProgress: true,
          }
      });
      await User.findByIdAndUpdate(userId, {
        $set: {
          acceptedOrder: orderId
        }
      })
      res.send({success: true, message: "Successfully accepted order"});
    } catch(error) {
      console.error(error.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
      res.send({success: false, message: "Unexpected error occured while acceptiong order. Please try again."});

    }
  }
)

router.post(
  "/cancel",
  auth,
  async (req: Request, res: Response) => {
    try {
      const { orderId } = req.body;
      
      await Order.findByIdAndUpdate(orderId, {
        $set: {
            executor: null,
            active: true,
            inProgress: false,

          }
      })

      await User.findByIdAndUpdate(req.userId, {
        $set: {
          acceptedOrder: null
        }
      })
      res.send({success: true, message: "Successfully canceled order"});
    } catch(error) {
      console.error(error.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
      res.send({success: false, message: "Couldn't cancel order"});
    }
  }
)

router.post(
  "/remove",
  auth,
  async (req: Request, res: Response) => {
    try {
      const { orderId } = req.body;
      const order = await Order.findByIdAndUpdate(orderId, {
        $set: {
            executor: null,
            active: false,
            inProgress: false,
          }
      }).populate("executor")

      await User.findByIdAndUpdate(order.executor._id, {
        $set: {
          acceptedOrder: null
        }
      })
      res.send({success: true, message: "Successfully removed order"});
    } catch(error) {
      console.error(error.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
      res.send({success: false, message: "Couldn't cancel order"});
    }
  }
)

router.post(
  "/requestorComplete",
  auth,
  async (req: Request, res: Response) => {
    try {
      const { orderId } = req.body;
      let order = await Order.findByIdAndUpdate(orderId, {
        $set: {
          requestorComplete: true
        }
      });
      const user = await User.findByIdAndUpdate(req.userId, {
        $inc: {
          experience: 1 + order.tip % 10
        }
      });
      
      if (order.executorComplete) {
        order = await Order.findByIdAndUpdate(orderId, {
          $set: {
            completed: true,
            active: false,
            completedDate: new Date((new Date()).getTime())
          }
        }).populate("executor");

        const user = await User.findByIdAndUpdate(order.executor.id, {
          $push: {
            completedOrders: order
          },
          $inc: {
            tips: order.tip
          }
        });
        res.send({success: true, fullyCompleted: true, message: "Successfully completed order"});
        return;
      }
      res.send({success: true, message: "Successfully completed your side of the order."});
    } catch(error) {
      console.error(error.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
      res.send({success: false, message: "Unexpected error occured while acceptiong order. Please try again."});
    }
  }
)


router.post(
  "/executorComplete",
  auth,
  async (req: Request, res: Response) => {
    try {
      const { orderId } = req.body;
      
      let order = await Order.findByIdAndUpdate(orderId, {
        $set: {
          executorComplete: true
        }
      });
      
      const user = await User.findByIdAndUpdate(req.userId, {
        $set: {
          acceptedOrder: null
        },
        $inc: {
          experience: 1 + order.totalPrice % 10
        }
      });

      if (order.requestorComplete) {
        order = await Order.findByIdAndUpdate(orderId, {
          $set: {
            completed: true,
            active: false,
            completedDate: new Date((new Date()).getTime())
          }
        })

        const user = await User.findByIdAndUpdate(req.userId, {
          $push: {
            completedOrders: order
          },
          $inc: {
            tips: order.tip
          }
        });
        res.send({success: true, fullyCompleted: true, message: "Successfully completed order"});
        return;
      }
      res.send({success: true, message: "Successfully completed your side of the order."});
    } catch(error) {
      console.error(error.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
      res.send({success: false, message: "Unexpected error occured while acceptiong order. Please try again."});
    }
  }
)

  
export default router;
