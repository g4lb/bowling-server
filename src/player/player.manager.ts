import { Injectable } from '@nestjs/common';
import { AddPlayersDto } from './dto/schemas/add-players.dto';
import { GetPlayerDetailsDto } from './dto/schemas/get-player-details.dto';
import { UpdateCurrentFrameDto } from './dto/schemas/update-current-frame.dto';
import { PlayerService } from './player.service';

@Injectable()
export class PlayerManager {

    constructor(private readonly playerService: PlayerService) {}

    async addPlayers(addPlayersDto: Array<AddPlayersDto>) {
      return this.playerService.addPlayers(addPlayersDto)
    }

    async getPlayerDetails(getPlayerDetailsDto: GetPlayerDetailsDto) {
      return this.playerService.getPlayerDetails(getPlayerDetailsDto)
    }

    async updateCurrentFrame(updateCurrentFrameDto: UpdateCurrentFrameDto) {
      return this.playerService.updateCurrentFrame(updateCurrentFrameDto)
    }

}
