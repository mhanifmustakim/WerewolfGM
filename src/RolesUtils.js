import Game from "./Game";

const createRole = ({ id, name, type, team, abilities, description }) => {
    const inputSpec = {
        min: 0,
        max: Infinity,
        step: 1
    }

    let abilityUse = Infinity;

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
        get inputSpec() {
            return inputSpec;
        },
        abilityUse
    };
};

const actionAttack = (attackerName, victimId) => {
    Game.addAction(attackerName, { "attacked": victimId })
}

const actionRescue = (protectorName, protectedId) => {
    Game.addAction(protectorName, { "rescued": protectedId })
}

export { createRole, actionAttack, actionRescue }