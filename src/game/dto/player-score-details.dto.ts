export class PlayerScoreDetailsDto {
  frameId: object;
  playerId: string;
  gameId: string;
  rolls: Array<number>;
  frame: number;
  rollScore: number;
  rollType: string;
}
