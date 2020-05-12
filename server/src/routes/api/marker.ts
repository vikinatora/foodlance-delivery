import { Router, Response } from "express";
import Request from "../../types/Request";
import HttpStatusCodes from "http-status-codes";
import Marker, { IMarker } from "../../models/Marker";

const router: Router = Router();

router.get(
  "/getAll",
  async (req: Request, res: Response) => {
    try {
      const markers = await Marker.find({active: true});
      res.send(markers);
    } catch (error){
      console.error(error.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  })

  export default router;
