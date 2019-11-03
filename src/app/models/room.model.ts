export interface IRoom {
    id: string;
    player1: string;
    player2: string;
    playerCount: number;
    chat: Array<string>;
    players: Array<string>;
    playersWaiting: Array<string>;
    matchedPlayers: Array<string>;
}
