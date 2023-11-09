import Game from './Game';
import { createRole, attack, rescue } from './RolesUtils'


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
        self.attack = (id) => attack(self.name, id);
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
        self.heal = (id) => rescue(self.name, id);

        return self
    }
}

export default Roles