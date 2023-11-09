import Game from "./Game"

const Teams = {
    "Citizens": {
        "winCondition": "Eliminate all werewolves.",
        "checkWinCondition": function () {
            const numWerewolves = Game.findPlayersByAttr({ type: "Werewolf", isAlive: true }).length;
            return numWerewolves == 0;
        }
    },

    "Werewolves": {
        "winCondition": "Manipulate the citizens. You win when the No. Werewolves is equal to No. Humans",
        "checkWinCondition": function () {
            const numWerewolves = Game.findPlayersByAttr({ type: "Werewolf", isAlive: true }).length;
            const numHumans = Game.findPlayersByAttr({ type: "Human", isAlive: true }).length;
            return numWerewolves >= numHumans;
        }
    },
}

export default Teams