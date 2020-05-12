"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const Order_1 = __importDefault(require("../../models/Order"));
const Marker_1 = __importDefault(require("../../models/Marker"));
const Product_1 = __importDefault(require("../../models/Product"));
const router = express_1.Router();
router.post("/create", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order, markerPosition } = req.body;
        const orderModel = yield Order_1.default.create({ senderId: req.userId, totalPrice: order.totalPrice });
        let products = [];
        order.products.forEach((product) => __awaiter(void 0, void 0, void 0, function* () {
            products.push({
                name: product.Name,
                price: product.Price,
                quantity: product.Quantity,
                orderId: orderModel._id,
            });
        }));
        let productsModels = yield Product_1.default.create(products);
        const markerModel = yield Marker_1.default.create({
            lat: markerPosition.lat,
            lng: markerPosition.lng,
            orderId: orderModel._id
        });
        res.send({ message: "Successfully created new order" });
    }
    catch (error) {
        console.error(error.message);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
exports.default = router;
//# sourceMappingURL=order.js.map