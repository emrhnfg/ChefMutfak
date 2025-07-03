import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { 
        type: String, 
        default: "Hazırlanıyor",
        enum: ["Hazırlanıyor", "Yolda", "Teslim Edildi", "İptal Edildi"]
    },
    date: { type: Date, default: Date.now }, // () kaldırıldı
    payment: { type: Boolean, default: false }
}, { timestamps: true }); // createdAt ve updatedAt otomatik eklenir

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;