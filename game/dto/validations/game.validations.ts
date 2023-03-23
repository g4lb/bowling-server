import * as Joi from 'joi';
import ServerConsts from 'src/core/const/server-consts';

export class GameValidations {
  static startValidator(): Joi.ObjectSchema<unknown> {
    return Joi.object({
      players: Joi.array().items(Joi.string()).min(ServerConsts.MIN_NUM_OF_PLAYER),
    });
  }


  static addPlayerScoreValidator(): Joi.ObjectSchema<unknown> {
    return Joi.object({
      playerId: Joi.string(),
      rolls: Joi.array().items(Joi.number().min(ServerConsts.MIN_ROLL_SCORE).max(ServerConsts.MAX_ROLL_SCORE)).min(ServerConsts.MIN_ROLL_SIZE).max(ServerConsts.MAX_ROLL_SIZE),
    });
  }

  static addPlayerFinalScoreValidator(): Joi.ObjectSchema<unknown> {
    return Joi.object({
      playerId: Joi.string(),
      roll: Joi.number().min(ServerConsts.MIN_ROLL_SCORE).max(ServerConsts.MAX_ROLL_SCORE),
    });
  }
  
}
