import { Router, Response } from "express";
import Request from "../../types/Request";
import HttpStatusCodes from "http-status-codes";
import auth from "../../middleware/auth";
import Order from "../../models/Order";

const router: Router = Router();

router.get(
  "/check",
  auth,
  async (req: Request, res: Response) => {
    try {
      const orders = await Order.find( {inProgress: true, sentNotification: false}).populate("executor");
      res.send({ success: true, orders: orders, requestorId: req.userId });
    } catch(error) {
      res.send({ success: false, error: "Unexpected error occurred" });
    }
  }
)
export default router;
