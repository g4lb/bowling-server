import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { game } from './dto/schemas/game.schema';
import { GameController } from './game.controller';
import { GameDao } from './game.dao';
import { GameService } from './game.service';
import { PlayerModule } from 'src/player/player.module';
import DbConsts from 'src/core/const/db-consts';
import { GameManager } from './game.manager';
import { PlayerManager } from 'src/player/player.manager';
import { ScoreModule } from 'src/score/score.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DbConsts.GAME.modelName,
        schema: game,
      },
    ]),
    PlayerModule,
    ScoreModule
  ],
  controllers: [GameController],
  providers: [GameService, GameManager, GameDao ],
})
export class GameModule {}
