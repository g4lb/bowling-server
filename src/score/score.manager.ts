import { Injectable } from '@nestjs/common';
import { AddScoreDto } from './dto/schemas/add-score.dto';
import { GetScoreTillNowDto } from './dto/schemas/get-score-till-now.dto';
import { GetScoreDto } from './dto/schemas/get-score.dto';
import { ScoreService } from './score.service';

@Injectable()
export class ScoreManager {

    constructor(private readonly scoreService: ScoreService) {}

    async addScore(addScoreDto: AddScoreDto) {
      return this.scoreService.addScore(addScoreDto)
    }

    async getScore(getScoreDto: GetScoreDto) {
      const result = await this.scoreService.getScore(getScoreDto)
      return result.score
    }

    async getLatestScoreTillNow(allFrames) {
      const frameIds = []
      const allFramesInsteadTheCurrent = allFrames.slice(0, allFrames.length-1);
      allFramesInsteadTheCurrent.forEach(frame =>{
        frameIds.push(frame.frameId)
      })
      const getScoreTillNowDto: GetScoreTillNowDto = {
        frameIds: frameIds
      }
      const result = await this.scoreService.getScoreTillNow(getScoreTillNowDto)
      if(result.length > 0){
        return result[result.length-1].score
      }
      else{
        return 0
      } 
    }

    async getScoreTillNow(allFrames) {
      const frameIds = []
      const allFramesInsteadTheCurrent = allFrames.slice(0, allFrames.length-1);
      allFramesInsteadTheCurrent.forEach(frame =>{
        frameIds.push(frame.frameId)
      })
      const getScoreTillNowDto: GetScoreTillNowDto = {
        frameIds: frameIds
      }
      let frameIdsTotalScore = 0
      const result = await this.scoreService.getScoreTillNow(getScoreTillNowDto)
      result.forEach(frame => {
        frameIdsTotalScore += frame.score
      })
      return frameIdsTotalScore
    }

}
