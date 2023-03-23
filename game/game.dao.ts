import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GameModel } from './dto/schemas/game.schema';
import { GameStartDto } from './dto/game-start.dto';
import { PlayerScoreDetailsDto } from './dto/player-score-details.dto';
import DbConsts from 'src/core/const/db-consts';

@Injectable()
export class GameDao {
  constructor(
    @InjectModel(DbConsts.GAME.modelName)
    private readonly gameModel: Model<GameModel>,
  ) {}

  async start(gameStartDto: GameStartDto): Promise<any> {
    const result = await this.gameModel.insertMany(gameStartDto.players);
    return result
  }

  async getAllPlayerFrameDetails(gameId: string, playerId: string): Promise<any> {
    const result = await this.gameModel.findOne({ _id: gameId, playerId: playerId })
    .lean(DbConsts.MONGOOSE_TO_OBJECT_PROP);
    return result
  }

  async addPlayerFrame(playerScoreDetailsDto: PlayerScoreDetailsDto): Promise<any> {
    const result = await this.gameModel.findOneAndUpdate(
      {
        _id: playerScoreDetailsDto.gameId,
        playerId: playerScoreDetailsDto.playerId
      },
      {
        $push: {
          gamePlay: {
            frameId: playerScoreDetailsDto.frameId,
            frame: playerScoreDetailsDto.frame,
            rolls: playerScoreDetailsDto.rolls,
            rollType: playerScoreDetailsDto.rollType,
            rollScore: playerScoreDetailsDto.rollScore
          },
        },
      },
      { upsert: true, new: true },
    )
    .lean(DbConsts.MONGOOSE_TO_OBJECT_PROP);
    
    return result
  }

  
}
