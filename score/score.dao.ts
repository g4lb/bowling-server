import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddScoreDto } from './dto/schemas/add-score.dto';
import { ScoreModel } from './dto/schemas/score.schema';
import { GetScoreTillNowDto } from './dto/schemas/get-score-till-now.dto';
import { GetScoreDto } from './dto/schemas/get-score.dto';
import DbConsts from 'src/core/const/db-consts';

@Injectable()
export class ScoreDao {
    constructor(
        @InjectModel(DbConsts.SCORE.modelName)
        private readonly scoreModel: Model<ScoreModel>,
      ) {}
    
      async addScore(addScoreDto: AddScoreDto): Promise<any> {
        const result = await this.scoreModel.insertMany(addScoreDto);
        return result
      }

      async getScoreTillNow(getScoreTillNowDto: GetScoreTillNowDto): Promise<any> {
        const result = await this.scoreModel.find({ frameId: { $in: getScoreTillNowDto.frameIds } }).lean(DbConsts.MONGOOSE_TO_OBJECT_PROP);
        return result
      }

      async getScore(getScoreDto: GetScoreDto): Promise<any> {
        const result = await this.scoreModel.findOne({frameId: getScoreDto.frameId});
        return result
      }
}
