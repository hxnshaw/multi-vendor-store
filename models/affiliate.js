const mongoose = require("mongoose");

const affiliateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "affiliateMarketer",
  },
  commissionRate: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Affiliate", affiliateSchema);
