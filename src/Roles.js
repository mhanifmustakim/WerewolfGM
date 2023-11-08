import { createRole, attack, rescue } from './RolesUtils'


const Roles = (function () {
    const citizen = function () {
        const self = createRole({
            name: "Citizen",
            type: "Human",
            team: "Citizens",
            abilities: null,
            description: ["You are a normal citizen with no special abilities."],
        })

        return self
    };

    const werewolf = function () {
        const self = createRole({
            name: "Werewolf",
            type: "Werewolf",
            team: "Werewolves",
            abilities: { "attack": { isAlive: true, type: "Human" } },
            description: ["The werewolves choose one player to attack every night."],
        });

        self.attack = (id) => attack(self.name, id);

        return self
    }

    const doctor = function () {
        const self = createRole({
            name: "Doctor",
            type: "Human",
            team: "Citizens",
            abilities: { "heal": { isAlive: true, excludeRole: "Doctor" } },
            description: ["The doctor chooses one player to heal every night (not himself). ", "If that player is attacked, the player lives."],
        });

        self.heal = (id) => rescue(self.name, id);

        return self
    }

    return {
        citizen,
        werewolf,
        doctor
    }
})()

export default Roles