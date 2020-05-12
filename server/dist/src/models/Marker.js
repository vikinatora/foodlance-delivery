"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const markerSchema = new mongoose_1.Schema({
    lat: {
        type: mongoose_1.Schema.Types.Number,
        required: true,
    },
    lng: {
        type: mongoose_1.Schema.Types.Number,
        required: true,
    },
    active: {
        type: mongoose_1.Schema.Types.Boolean,
        required: true,
        default: true
    },
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Orders",
        required: true,
    },
});
const Marker = mongoose_1.model("Marker", markerSchema);
exports.default = Marker;
//# sourceMappingURL=Marker.js.map