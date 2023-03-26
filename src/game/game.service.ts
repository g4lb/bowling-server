import { Injectable } from '@nestjs/common';
import { GameStartDto } from './dto/game-start.dto';
import { PlayerScoreDetailsDto } from './dto/player-score-details.dto';
import { GameDao } from './game.dao';

@Injectable()
export class GameService {
  constructor(private readonly gameDao: GameDao) {}

  async start(gameStartDto: GameStartDto) {
    return this.gameDao.start(gameStartDto);
  }

  async addPlayerFrame(playerScoreDetailsDto: PlayerScoreDetailsDto) {
    return this.gameDao.addPlayerFrame(playerScoreDetailsDto);
  }

  async getAllPlayerFrameDetails(gameId: string, playerId: string) {
    const result = await this.gameDao.getAllPlayerFrameDetails(gameId, playerId);
    return result.gamePlay
  }
}
