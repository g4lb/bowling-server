import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { score } from './dto/schemas/score.schema';
import { ScoreDao } from './score.dao';
import { ScoreService } from './score.service';
import DbConsts from 'src/core/const/db-consts';
import { ScoreManager } from './score.manager';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DbConsts.SCORE.modelName,
        schema: score,
      },
    ]),
  ],
  providers: [ScoreService, ScoreManager, ScoreDao],
  exports: [ScoreManager]
})
export class ScoreModule {}
