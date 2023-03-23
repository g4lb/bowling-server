import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddPlayersDto } from './dto/schemas/add-players.dto';
import { PlayerModel } from './dto/schemas/player.schema';
import { GetPlayerDetailsDto } from './dto/schemas/get-player-details.dto';
import { UpdateCurrentFrameDto } from './dto/schemas/update-current-frame.dto';
import DbConsts from 'src/core/const/db-consts';

@Injectable()
export class PlayerDao {
  constructor(
    @InjectModel(DbConsts.PLAYER.modelName)
    private readonly playerModel: Model<PlayerModel>,
  ) {}

  async addPlayers(addPlayersDto: Array<AddPlayersDto>): Promise<any> {
    return this.playerModel.insertMany(addPlayersDto);
  }

  async getPlayerDetails(getPlayerDetailsDto: GetPlayerDetailsDto): Promise<any> {
    return this.playerModel.findOne({_id: getPlayerDetailsDto.playerId}).lean(DbConsts.MONGOOSE_TO_OBJECT_PROP).exec();
  }

  async updateCurrentFrame(updateCurrentFrameDto: UpdateCurrentFrameDto): Promise<any> {
    const result = await this.playerModel.findOneAndUpdate(
      {
        _id: updateCurrentFrameDto.playerId,
        gameId: updateCurrentFrameDto.gameId
      },
      {
        $set: {
          currentFrame: updateCurrentFrameDto.currentFrame
        },
      },
      { upsert: true, new: true },
    )
    .lean(DbConsts.MONGOOSE_TO_OBJECT_PROP);
    
    return result
  }

}
