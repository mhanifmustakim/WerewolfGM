import Game from './Game';
import { createRole, actionAttack, actionRescue, actionReveal, chooseRandom } from './RolesUtils'
import ViewControl from './ViewControl';

const Roles = {
    citizen: function () {
        const self = createRole({
            id: "citizen",
            name: "Citizen",
            type: "Human",
            team: "Citizens",
            abilities: null,
            description: ["You are a normal citizen with no special abilities."],
        })

        return self
    },

    werewolf: function () {
        const self = createRole({
            id: "werewolf",
            name: "Werewolf",
            type: "Werewolf",
            team: "Werewolves",
            abilities: { "attack": { isAlive: true, type: "Human" } },
            description: ["The werewolves choose one player to attack every night."],
        });

        self.inputSpec.min = 1;
        self.attack = (id) => {
            actionAttack(self.name, id)
            return true
        };
        self.onInitialReveal = () => {
            const werewolfNames = Game.findPlayersByAttr({ type: "Werewolf" }).map((player) => player.name);
            return ["The werewolves are", werewolfNames.join(", ")];
        }

        return self
    },

    doctor: function () {
        const self = createRole({
            id: "doctor",
            name: "Doctor",
            type: "Human",
            team: "Citizens",
            abilities: { "heal": { isAlive: true, excludeRole: "Doctor" } },
            description: ["The doctor chooses one player to heal every night (not himself). ", "If that player is attacked, that player lives."],
        });

        self.inputSpec.max = 1;
        self.heal = (id) => {
            actionRescue(self.name, id);
            return true;
        };

        return self
    },

    lover: function () {
        const self = createRole({
            id: "lover",
            name: "Lover",
            type: "Human",
            team: "Citizens",
            abilities: null,
            description: ["You truly love each other.", "If one is killed at night, the other one dies out of sorrow."]
        });

        self.inputSpec.max = 2;
        self.inputSpec.step = 2;

        self.onInitialReveal = () => {
            const loverNames = Game.findPlayersByAttr({ roleName: self.name }).map((player) => player.name);
            return ["The lovers are", loverNames.join(" & ")];
        }

        self.onKilledAtNight = () => {
            const lovers = Game.findPlayersByAttr({ roleName: self.name, isAlive: true });
            return {
                kill: lovers.map((loverPlayer) => loverPlayer.id)
            }
        }

        return self
    },

    bodyguard: function () {
        const self = createRole({
            id: "bodyguard",
            name: "Bodyguard",
            type: "Human",
            team: "Citizens",
            abilities: { "guard": { isAlive: true, excludeRole: "Bodyguard" } },
            description: ["You are a strong bodyguard.", "You can choose one player to protect every night.", "You can only survive one attack per game", "(You automatically protect yourself every night)"]
        });

        self.abilityUse = 1;
        self.inputSpec.max = 1;
        self.guard = (id) => {
            actionRescue(self.name, id);
            return true;
        };

        self.onKilledAtNight = () => {
            const playerId = Game.findPlayersByAttr({ roleName: self.name })[0].id;
            if (self.abilityUse > 0) {
                self.abilityUse -= 1;
                return { save: [playerId] }
            }

            return { kill: [playerId] }
        }

        return self
    },

    assassin: function () {
        const self = createRole({
            id: "assassin",
            name: "Assassin",
            type: "Human",
            team: "Citizens",
            abilities: { "kill": { isAlive: true, excludeRole: "Assassin" } },
            description: ["At night, you can choose one player to assassinate throughout the game."]
        });

        self.abilityUse = 1;
        self.inputSpec.max = 1;

        self.kill = (id) => {
            self.abilityUse -= 1;
            actionAttack(self.name, id);
            return true;
        }

        return self
    },

    psycho: function () {
        const self = createRole({
            id: "psycho",
            name: "Psycho",
            type: "Human",
            team: "Werewolves",
            abilities: null,
            description: ["You are a maniac. You want the werewolves to win.", "You have no special abilities"]
        });

        return self
    },

    seer: function () {
        const self = createRole({
            id: "seer",
            name: "Seer",
            type: "Human",
            team: "Citizens",
            abilities: { "reveal": { isAlive: true, excludeRole: "Seer" } },
            description: ["Every night, you can choose one person to have their role revealed to you."]
        })

        self.inputSpec.max = 1;
        self.reveal = (id) => {
            actionReveal(self.name, id);
            return true
        }

        return self
    },

    shaman: function () {
        const self = createRole({
            id: "shaman",
            name: "Shaman",
            type: "Human",
            team: "Citizens",
            abilities: { "reveal": { isAlive: false, excludeRole: "Shaman" } },
            description: ["Every night, you can choose one dead person to have their role revealed to you."]
        })

        self.inputSpec.max = 1;
        self.reveal = (id) => {
            actionReveal(self.name, id);
            return true
        }

        return self
    },

    mercenary: function () {
        const self = createRole({
            id: "mercenary",
            name: "Mercenary",
            type: "Human",
            team: "Mercenary",
            abilities: null,
            description: ["You have been hired to eliminate a player through voting."]
        })

        self.inputSpec.max = 1;
        self.chosenTarget = null;

        self.onAssignedToPlayer = () => {
            const targetCandidates = Game.findPlayersByAttr({ type: "Human", excludeRole: [self.name, "Joker"] });
            self.chosenTarget = targetCandidates[Math.floor(Math.random() * targetCandidates.length)];
        }

        self.onNightEnd = () => {
            if (!Game.getPlayerById(self.chosenTarget.id).isAlive) {
                self.setTeam("Citizens");
            }
        }

        self.onInitialReveal = () => {
            return [`Your target is ${self.chosenTarget.name}`];
        }

        self.onDisplayGameOverList = () => {
            return `(target: ${self.chosenTarget.name})`
        }

        return self
    },

    joker: function () {
        const self = createRole({
            id: "joker",
            name: "Joker",
            type: "Human",
            team: "Joker",
            abilities: null,
            description: ["HAHAHA. Making people vote you out is a WIN!"]
        })

        self.inputSpec.max = 1;

        return self
    },

    swordsman: function () {
        const self = createRole({
            id: "swordsman",
            name: "Swordsman",
            type: "Human",
            team: "Citizens",
            abilities: null,
            description: ["You are a skilled swordsman.", "If you die, you have a 75% chance of bringing 1 of the killers down with you."]
        })

        self.inputSpec.max = 1;

        self.onKilledAtNight = () => {
            const swordsmanInstance = Game.findPlayersByAttr({ roleName: "Swordsman" })[0];
            const roleThatKilled = Object.entries(Game.log[Game.log.length - 1])
                .filter(([roleName, action]) => "attacked" in action && action["attacked"] == swordsmanInstance.id)
                .map(([roleName, action]) => roleName);

            const targetCandidates = Game.findPlayersByAttr({ roleName: chooseRandom(roleThatKilled), isAlive: true });
            const result = { "kill": [swordsmanInstance.id] }
            if (targetCandidates.length == 0) return result

            const chosenTarget = chooseRandom(targetCandidates);
            if (Math.random() <= 0.75) {
                result["kill"].push(chosenTarget.id);
            }

            return result;
        }

        return self
    },

    detective: function () {
        const self = createRole({
            id: "detective",
            name: "Detective",
            type: "Human",
            team: "Citizens",
            abilities: { "choose as player 1": { isAlive: true, excludeRole: "Detective" }, "choose as player 2": { isAlive: true, excludeRole: "Detective" } },
            description: ["Every night you can choose two people.", "You will know if they are from the same/different team."]
        })

        self.inputSpec.max = 1;
        self.currentPlayerSelection = [];

        self["choose as player 1"] = (id) => self.reveal(id);
        self["choose as player 2"] = (id) => self.reveal(id);

        self.reveal = (id) => {
            if (self.currentPlayerSelection.length == 0) {
                self.currentPlayerSelection.push(Game.getPlayerById(id));
                return
            }

            if (self.currentPlayerSelection.length == 1) {
                self.currentPlayerSelection.push(Game.getPlayerById(id));
                if (document.querySelector("#night-action-form")) {
                    // Only used when not in simulations
                    const player1 = self.currentPlayerSelection[0];
                    const player2 = self.currentPlayerSelection[1];
                    let result = null;

                    if (player1.role.team == player2.role.team) {
                        result = "are from the same team";
                    } else {
                        result = "are from different teams";
                    }

                    ViewControl.replaceNightActionForm([`${player1.name} and ${player2.name}`, result]);
                }
                self.currentPlayerSelection = [];
                return true
            }
        }

        return self
    }
}

export default Roles