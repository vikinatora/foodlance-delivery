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
      const requesterOrders = await Order.find( {inProgress: true, requestorComplete: false}).populate("executor");
      const executorOrders = await Order.find( {inProgress: true, executorComplete: false}).populate("requestor");
      res.send({ success: true, requesterOrders: requesterOrders, executorOrders: executorOrders, requestorId: req.userId });
    } catch(error) {
      res.send({ success: false, error: "Unexpected error occurred" });
    }
  }
)
export default router;
