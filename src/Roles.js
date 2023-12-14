import Game from './Game';
import { createRole, actionAttack, actionRescue } from './RolesUtils'


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
            name: "Lovers",
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
    }
}

export default Roles