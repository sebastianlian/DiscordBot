const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  roleId: {
      type: String,
      required: true,
      unique: true,
  },
  lastMessageDate: {
      type: Date,
  },
});

const roleDB = mongoose.model("RoleTimeDB", roleSchema);

module.exports = {
  roleDB
}