import { Body, Controller, Get, Post } from '@nestjs/common';
import { JoiValidationPipe } from 'src/core/validation/joi-validation.pipe';
import { AddPlayerFinalScoreDto } from './dto/add-player-final-score.dto';
import { AddPlayerScoreDto } from './dto/add-player-score.dto';
import { StartDto } from './dto/start.dto';
import { GameValidations } from './dto/validations/game.validations';
import { GameManager } from './game.manager';
import { AddPlayerFinalScoreRequest } from './request/add-player-final-score.requset';
import { AddPlayerScoreRequest } from './request/add-player-score.requset';
import { StartRequest } from './request/start.requset';

@Controller('game')
export class GameController {
  constructor(private readonly gameManager: GameManager) {}

  @Post('start')
  start(@Body(new JoiValidationPipe(GameValidations.startValidator())) startRequest: StartRequest) {
    const startDto: StartDto = {
      players: startRequest.players,
    };
    return this.gameManager.start(startDto);
  }

  @Post('addPlayerScore')
  addPlayerScore(@Body(new JoiValidationPipe(GameValidations.addPlayerScoreValidator())) addPlayerScoreRequest: AddPlayerScoreRequest) {
    const addPlayerScoreDto: AddPlayerScoreDto = {
      playerId: addPlayerScoreRequest.playerId,
      rolls: addPlayerScoreRequest.rolls,
    };
    return this.gameManager.addPlayerScore(addPlayerScoreDto);
  }

  @Post('addPlayerFinalScore')
  addPlayerFinalScore(@Body(new JoiValidationPipe(GameValidations.addPlayerFinalScoreValidator())) addPlayerFinalScoreRequest: AddPlayerFinalScoreRequest) {
    const addPlayerFinalScoreDto: AddPlayerFinalScoreDto = {
      playerId: addPlayerFinalScoreRequest.playerId,
      roll: addPlayerFinalScoreRequest.roll,
    };
    return this.gameManager.addPlayerFinalScore(addPlayerFinalScoreDto);
  }
}
