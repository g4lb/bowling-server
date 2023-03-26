import mongoose from "mongoose";


export class ServerUtils {
  static createObjectId() {
    const objectId  = new mongoose.Types.ObjectId();
    return objectId
  }
}
