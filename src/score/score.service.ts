import { Injectable } from '@nestjs/common';
import { AddScoreDto } from './dto/schemas/add-score.dto';
import { GetScoreTillNowDto } from './dto/schemas/get-score-till-now.dto';
import { GetScoreDto } from './dto/schemas/get-score.dto';
import { ScoreDao } from './score.dao';

@Injectable()
export class ScoreService {

    constructor(private readonly scoreDao: ScoreDao) {}

    async addScore(addScoreDto: AddScoreDto) {
      return this.scoreDao.addScore(addScoreDto);
    }

    async getScoreTillNow(getScoreTillNowDto: GetScoreTillNowDto ) {
      return this.scoreDao.getScoreTillNow(getScoreTillNowDto);
    }

    async getScore(getScoreDto: GetScoreDto) {
      return this.scoreDao.getScore(getScoreDto);
    }
}
