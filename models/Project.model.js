const { Schema, model } = require("mongoose");

const projectSchema = new Schema(
  {
    photographer: {
      type: Schema.Types.ObjectId, 
      ref: "Photographer"
    },
    consumer: {
      type: Schema.Types.ObjectId, 
      ref: "Consumer"
    },
    price: {
      type: Number
    },
    date:{ 
      type: String
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = model("Project", projectSchema);