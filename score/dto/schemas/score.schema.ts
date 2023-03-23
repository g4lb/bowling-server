import mongoose from 'mongoose';
import DbConsts from 'src/core/const/db-consts';
import { ScoreModelDto } from '../score.dto';

export const score = new mongoose.Schema(
  {
    frameId: { type: mongoose.Types.ObjectId, required: true },
    score: { type: Number, default: 0},
  },
  {
    timestamps: true,
    collection: DbConsts.SCORE.modelName,
  },
);

export type ScoreModel = mongoose.Document & ScoreModelDto;
