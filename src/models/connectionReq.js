const mongoose = require("mongoose");

const connectionReqSchema = mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: `{VALUE} Incorrect status type`,
        },
    }
}, {
    timestamps: true
});

// To make index to query faster.
// This is a compound index
connectionReqSchema.index({ fromUserId: 1, toUserId: 1 })

connectionReqSchema.pre("save", function (next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request for yourself!");
    }
    next();
});

module.exports = mongoose.model("ConnectionRequest", connectionReqSchema);