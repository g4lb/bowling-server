import { PlayerModelDto } from './player.dto';
import mongoose from 'mongoose';
import DbConsts from 'src/core/const/db-consts';

export const player = new mongoose.Schema(
  {
    gameId: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    currentFrame: { type: Number, default: 0, required: true },
  },
  {
    timestamps: true,
    collection: DbConsts.PLAYER.modelName,
  },
);

export type PlayerModel = mongoose.Document & PlayerModelDto;
