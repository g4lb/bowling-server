import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameModule } from './game/game.module';
import { PlayerModule } from './player/player.module';
import { ScoreModule } from './score/score.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/local', {
      connectionFactory: (connection) => {
        connection.plugin(require('mongoose-lean-virtuals'));
        return connection;
      },
    }),
    GameModule,
    PlayerModule,
    ScoreModule,
  ],
})
export class AppModule {}
