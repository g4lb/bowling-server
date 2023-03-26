import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import DbConsts from 'src/core/const/db-consts';
import { player } from './dto/schemas/player.schema';
import { PlayerDao } from './player.dao';
import { PlayerManager } from './player.manager';
import { PlayerService } from './player.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DbConsts.PLAYER.modelName,
        schema: player,
      },
    ]),
  ],
  providers: [PlayerService, PlayerManager, PlayerDao],
  exports: [PlayerManager]
})
export class PlayerModule {}
