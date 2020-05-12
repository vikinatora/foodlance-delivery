"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    totalPrice: {
        type: mongoose_1.Schema.Types.Number,
        required: true,
    },
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    executorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        required: false,
    },
});
const Order = mongoose_1.model("Order", orderSchema);
exports.default = Order;
//# sourceMappingURL=Order.js.map