import Game from "./Game";

const createRole = ({ id, name, type, team, abilities, description }) => {
    return {
        get id() {
            return id;
        },
        get name() {
            return name;
        },
        get type() {
            return type;
        },
        get abilities() {
            return abilities;
        },
        get team() {
            return team;
        },
        get description() {
            return description;
        },
    };
};

const attack = (attackerName, victimId) => {
    Game.addAction(attackerName, { "attacked": victimId })
}

const rescue = (protectorName, protectedId) => {
    Game.addAction(protectorName, { "rescued": protectedId })
}

export { createRole, attack, rescue }