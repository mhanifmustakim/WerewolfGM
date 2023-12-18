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

    "Mercenary": {
        "winCondition": "Manipulate the village to eliminate your target through voting process.",
        "checkWinCondition": function () {
            const mercenaryInstance = Game.findPlayersByAttr({ roleName: "Mercenary", isAlive: true })[0];

            if (!mercenaryInstance) return false; // mercenary is dead

            const lastEvent = Game.log[Game.log.length - 1];
            if (lastEvent && "Citizens" in lastEvent) {
                return lastEvent["Citizens"]["voted"] == mercenaryInstance.role.chosenTarget.id;
            }

            return false;
        }
    },

    "Joker": {
        "winCondition": "Manipulate the village to eliminate you through voting process.",
        "checkWinCondition": function () {
            const jokerInstance = Game.findPlayersByAttr({ roleName: "Joker", isAlive: false })[0];

            if (!jokerInstance) return false; // joker is alive

            const lastEvent = Game.log[Game.log.length - 1];
            if (lastEvent && "Citizens" in lastEvent) {
                return lastEvent["Citizens"]["voted"] == jokerInstance.id;
            }

            return false;
        }
    }
}

export default Teams