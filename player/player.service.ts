import { Injectable } from '@nestjs/common';
import { AddPlayersDto } from './dto/schemas/add-players.dto';
import { GetPlayerDetailsDto } from './dto/schemas/get-player-details.dto';
import { UpdateCurrentFrameDto } from './dto/schemas/update-current-frame.dto';
import { PlayerDao } from './player.dao';

@Injectable()
export class PlayerService {

    constructor(private readonly playerDao: PlayerDao) {}

    async addPlayers(addPlayersDto: Array<AddPlayersDto>) {
      const addPlayersResult = await this.playerDao.addPlayers(addPlayersDto)
      return addPlayersResult
    }

    async getPlayerDetails(getPlayerDetailsDto: GetPlayerDetailsDto) {
        const getPlayerDetailsResult = await this.playerDao.getPlayerDetails(getPlayerDetailsDto)
        return getPlayerDetailsResult
    }

    async updateCurrentFrame(updateCurrentFrameDto: UpdateCurrentFrameDto) {
        const updateCurrentFrameResult = await this.playerDao.updateCurrentFrame(updateCurrentFrameDto)
        return updateCurrentFrameResult
    }
    
}



