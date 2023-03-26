import mongoose from 'mongoose';
import DbConsts from 'src/core/const/db-consts';
import { RollTypeEnum } from 'src/core/enum/roll-type.enum';
import { GameModelDto } from '../game.dto';

export const game = new mongoose.Schema(
  {
    gameId: { type: mongoose.Types.ObjectId, required: true },
    playerId: { type: mongoose.Types.ObjectId, required: true },
    gamePlay: {
      frameId: { type: mongoose.Types.ObjectId, required: false },
      rollType: { type: String, enum: RollTypeEnum, required: false  },
      frame: { type: Number, required: false },
      rolls: { type: [Number], required: false, default: undefined },
      rollScore: { type: Number, required: false },
    }
  },
  {
    timestamps: true,
    collection: DbConsts.GAME.modelName,
  },
);

export type GameModel = mongoose.Document & GameModelDto;
