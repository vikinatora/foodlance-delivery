"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    quantity: {
        type: mongoose_1.Schema.Types.Number,
        required: true,
    },
    price: {
        type: mongoose_1.Schema.Types.Number,
        required: true,
    },
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Orders",
        required: true,
    },
});
const Product = mongoose_1.model("Product", productSchema);
exports.default = Product;
//# sourceMappingURL=Product.js.map