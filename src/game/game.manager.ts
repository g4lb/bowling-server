import { BadRequestException, Injectable } from '@nestjs/common';
import { RollTypeEnum } from 'src/core/enum/roll-type.enum';
import { ServerUtils } from 'src/core/utils/server.utils';
import { AddPlayersDto } from 'src/player/dto/schemas/add-players.dto';
import { GetPlayerDetailsDto } from 'src/player/dto/schemas/get-player-details.dto';
import { UpdateCurrentFrameDto } from 'src/player/dto/schemas/update-current-frame.dto';
import { PlayerManager } from 'src/player/player.manager';
import { AddScoreDto } from 'src/score/dto/schemas/add-score.dto';
import { ScoreManager } from 'src/score/score.manager';
import { AddPlayerScoreDto } from './dto/add-player-score.dto';
import { GameStartDto } from './dto/game-start.dto';
import { PlayerScoreDetailsDto } from './dto/player-score-details.dto';
import { StartDto } from './dto/start.dto';
import { GameService } from './game.service';
import { GetScoreDto } from 'src/score/dto/schemas/get-score.dto';
import { AddPlayerFinalScoreDto } from './dto/add-player-final-score.dto';
import { ErrorMessageEnum } from 'src/core/enum/error-message.enum';
import ServerConsts from 'src/core/const/server-consts';

@Injectable()
export class GameManager {
  constructor(private readonly gameService: GameService,
               private readonly playerManager: PlayerManager,
               private readonly scoreManager: ScoreManager) {}

  async start(startDto: StartDto) {
    const addPlayersDto = this.buildAddPlayersDto(startDto);
    const addPlayersResult = await this.playerManager.addPlayers(addPlayersDto)
    const gameStartDto: GameStartDto = this.buildGameStartDto(addPlayersResult);
    return this.gameService.start(gameStartDto);
  }

  async addPlayerFinalScore(addPlayerFinalScoreDto: AddPlayerFinalScoreDto){
    const getPlayerDetailsDto: GetPlayerDetailsDto = {
      playerId: addPlayerFinalScoreDto.playerId
    }
    const playerDetails = await this.playerManager.getPlayerDetails(getPlayerDetailsDto)
    if (playerDetails.currentFrame !== ServerConsts.MAX_FRAME){
      throw new BadRequestException(ErrorMessageEnum.ONLY_BONUS)
    }
    const allFrames = await this.gameService.getAllPlayerFrameDetails(playerDetails.gameId, addPlayerFinalScoreDto.playerId);
    const frameScoreTillNow = await this.scoreManager.getLatestScoreTillNow(allFrames)
    const finalScore = allFrames[playerDetails.currentFrame-1].rollScore + addPlayerFinalScoreDto.roll + frameScoreTillNow
    const playerFrameDto = this.buildPlayerFrameDto(playerDetails.gameId, addPlayerFinalScoreDto.playerId, [], playerDetails.currentFrame, RollTypeEnum.REGULAR, finalScore)
    const result = await this.gameService.addPlayerFrame(playerFrameDto);
    const updateCurrentFrameDto: UpdateCurrentFrameDto = this.buildUpdateCurrentFrameDto(playerDetails, playerDetails.gameId, addPlayerFinalScoreDto.playerId);
    await this.playerManager.updateCurrentFrame(updateCurrentFrameDto);
    return result
  }

  async addPlayerScore(addPlayerScoreDto: AddPlayerScoreDto){
    const getPlayerDetailsDto: GetPlayerDetailsDto = {
      playerId: addPlayerScoreDto.playerId
    }
    const playerDetails = await this.playerManager.getPlayerDetails(getPlayerDetailsDto)
    if (playerDetails.currentFrame >= ServerConsts.MAX_FRAME){
      throw new BadRequestException(ErrorMessageEnum.MAX_FRAMES)
    }
    const rolls = addPlayerScoreDto.rolls
    const gameId = playerDetails.gameId
    const playerId = addPlayerScoreDto.playerId
    const detectedType = this.detectRollType(rolls)
    const rollScore = this.getRollScoreByType(rolls, detectedType)
    const playerFrameDto = this.buildPlayerFrameDto(gameId, playerId, rolls, playerDetails.currentFrame,detectedType, rollScore)
    await this.gameService.addPlayerFrame(playerFrameDto);
    const updateCurrentFrameDto: UpdateCurrentFrameDto = this.buildUpdateCurrentFrameDto(playerDetails, gameId, playerId);
    await this.playerManager.updateCurrentFrame(updateCurrentFrameDto);
    const result = await this.updateScore(gameId, playerId, updateCurrentFrameDto.currentFrame);
    return result
  }

  async updateScore(gameId: string, playerId: string, currentFrameIndex: number){
    const allFrames = await this.gameService.getAllPlayerFrameDetails(gameId, playerId);
      if(allFrames.length === 1){
          await this.handleFirstRoll(allFrames, currentFrameIndex);
      }
      else{
        const oneFrameBefore = allFrames[currentFrameIndex - 2];
        const currentFrame = allFrames[currentFrameIndex - 1];
        if(oneFrameBefore.rollType === RollTypeEnum.SPARE){
            if(currentFrame.rollType === RollTypeEnum.SPARE){
              const score = oneFrameBefore.rollScore + currentFrame.rolls.$each[0]
              const frameScoreTillNow = await this.scoreManager.getLatestScoreTillNow(allFrames)
              const totalScore = frameScoreTillNow + score
              const addScoreDto: AddScoreDto = {
                frameId: oneFrameBefore.frameId,
                score: totalScore
              };
              await this.scoreManager.addScore(addScoreDto);
            }
            if(currentFrame.rollType === RollTypeEnum.REGULAR){
              const score = oneFrameBefore.rollScore + currentFrame.rolls.$each[0]
              const frameScoreTillNow = await this.scoreManager.getScoreTillNow(allFrames)
              const totalScore = frameScoreTillNow + score
              const addScoreDto: AddScoreDto = {
                frameId: oneFrameBefore.frameId,
                score: totalScore
              };
              await this.scoreManager.addScore(addScoreDto);
            }
            if(currentFrame.rollType === RollTypeEnum.STRIKE){
              const frameScoreTillNow = await this.scoreManager.getLatestScoreTillNow(allFrames)
              const score = frameScoreTillNow + oneFrameBefore.rollScore + currentFrame.rollScore
              const addScoreDto: AddScoreDto = {
                frameId: oneFrameBefore.frameId,
                score: score
              };
              await this.scoreManager.addScore(addScoreDto);
            }
        }
        if(oneFrameBefore.rollType === RollTypeEnum.STRIKE){
          let flag = true
          if(oneFrameBefore.frame > 0){
            if(allFrames[oneFrameBefore.frame-1].rollType === RollTypeEnum.STRIKE){
              const firstStrikeFrame = allFrames[oneFrameBefore.frame - 1];
              await this.updateStrikeFrames(allFrames, firstStrikeFrame, oneFrameBefore, currentFrame)
              const frameScoreTillNow = await this.scoreManager.getLatestScoreTillNow(allFrames)
              const score = frameScoreTillNow + currentFrame.rollScore
              const addSecScoreDto: AddScoreDto = {
                frameId: currentFrame.frameId,
                score: score
              };
              await this.scoreManager.addScore(addSecScoreDto);
              flag = !flag
            }
          }
          if(flag && currentFrame.rollType === RollTypeEnum.REGULAR || currentFrame.rollType === RollTypeEnum.SPARE){
            // add frame before
            const frameScoreTillNow = await this.scoreManager.getLatestScoreTillNow(allFrames)
            const score = frameScoreTillNow + oneFrameBefore.rollScore + currentFrame.rollScore
            const addScoreDto: AddScoreDto = {
              frameId: oneFrameBefore.frameId,
              score: score
            };
            await this.scoreManager.addScore(addScoreDto);
            // add current frame 
            const scoreBefore = currentFrame.rollScore + score
            const addSecScoreDto: AddScoreDto = {
              frameId: currentFrame.frameId,
              score: scoreBefore
            };
            await this.scoreManager.addScore(addSecScoreDto);
          }
        }
        if(currentFrame.rollType === RollTypeEnum.REGULAR && oneFrameBefore.rollType !== RollTypeEnum.STRIKE){
          const getScoreDto: GetScoreDto = {
            frameId: oneFrameBefore.frameId,
          };
          const frameScoreTillNow = await this.scoreManager.getScore(getScoreDto)
          const score = currentFrame.rollScore + frameScoreTillNow
          const addScoreDto: AddScoreDto = {
            frameId: currentFrame.frameId,
            score: score
          };
          await this.scoreManager.addScore(addScoreDto);
        }
      }
    
     return allFrames
  }

  async updateStrikeFrames(allFrames, firstStrikeFrame, oneFrameBefore, currentFrame){
    const firstFrame = firstStrikeFrame
    const secFrame = oneFrameBefore

    // Updating score for the first frame
    const firstFrameScore = firstFrame.rollScore + secFrame.rolls.$each[0] + currentFrame.rolls.$each[0]
    let currectScoreToAdd = 0
    if(firstFrame.frame !== 0){
      const getFirstScoreDto: GetScoreDto = {
        frameId: allFrames[firstFrame.frame-1].frameId
      }
      const frameScoreTillNow = await this.scoreManager.getScore(getFirstScoreDto)
      currectScoreToAdd += frameScoreTillNow
    }
    const score = firstFrameScore + currectScoreToAdd
    const addScoreDto: AddScoreDto = {
      frameId: firstFrame.frameId,
      score: score
    };
    await this.scoreManager.addScore(addScoreDto);

    // Adding second frame
    const secFrameScore = oneFrameBefore.rollScore + currentFrame.rollScore + score
    const addSecScoreDto: AddScoreDto = {
      frameId: secFrame.frameId,
      score: secFrameScore
    };
    await this.scoreManager.addScore(addSecScoreDto);
  }


  private async handleFirstRoll(allFrames: any, currentFrameIndex: number) {
    const latestFrame = allFrames[currentFrameIndex - 1];
    if (latestFrame.rollType === RollTypeEnum.REGULAR) {
      let totalRegularSum = 0;
      allFrames.forEach(frame => {
        totalRegularSum += frame.rollScore;
      });
      const addScoreDto: AddScoreDto = {
        frameId: latestFrame.frameId,
        score: totalRegularSum
      };
      return this.scoreManager.addScore(addScoreDto);
    }
  }

  buildPlayerFrameDto(gameId, playerId, rolls, frame, rollType, rollScore) {
    const playerScoreDetailsDto: PlayerScoreDetailsDto = {
      frameId: ServerUtils.createObjectId(),
      gameId: gameId,
      playerId: playerId,
      rolls: rolls,
      frame: frame,
      rollType: rollType,
      rollScore: rollScore
    }
    return playerScoreDetailsDto
  }

  detectRollType(rolls: Array<number>){
    const rollsSize = rolls.length
    let detectedType = RollTypeEnum.REGULAR
    if (rollsSize > 1){
      const firstRoll = rolls[0]
      const secRoll = rolls[1]
      const scoreForRoll = firstRoll + secRoll
      if (scoreForRoll === 10) { 
        detectedType = RollTypeEnum.SPARE
      }
    } else{
      detectedType = RollTypeEnum.STRIKE
    }
    return detectedType
  }

  getRollScoreByType(rolls: Array<number>, rollType: RollTypeEnum){
    switch(rollType) { 
      case RollTypeEnum.REGULAR: { 
         return rolls[0] + rolls[1] 
      } 
      case RollTypeEnum.SPARE: { 
        return rolls[0] + rolls[1] 
      } 
      case RollTypeEnum.STRIKE: { 
        return rolls[0]
     } 
   } 
  }



  buildUpdateCurrentFrameDto(playerDetails: any, gameId: any, playerId: any) {
    const newCurrentFrame = playerDetails.currentFrame + 1;
    const updateCurrentFrameDto: UpdateCurrentFrameDto = {
      gameId: gameId,
      playerId: playerId,
      currentFrame: newCurrentFrame
    };
    return updateCurrentFrameDto;
  }

  buildGameStartDto(addPlayersResult: any) {
    const playersArray = [];
    addPlayersResult.forEach(player => {
      playersArray.push({
        gameId: player.gameId,
        playerId: player._id,
        gamePlay: {}
      }
        );
    });
    const gameStartDto: GameStartDto = {
      players: playersArray
    };
    return gameStartDto;
  }
  
  buildAddPlayersDto(startDto: StartDto) {
    const addPlayersDto = new Array<AddPlayersDto>();
    const gameId = ServerUtils.createObjectId()
    startDto.players.forEach(player => {
      addPlayersDto.push({ name: player, gameId: gameId });
    });
    return addPlayersDto;
  }
}



