import Game from "./Game";
import ViewControl from "./ViewControl";

const createRole = ({ id, name, type, team, abilities, description }) => {
    const inputSpec = {
        min: 0,
        max: Infinity,
        step: 1
    }

    let abilityUse = Infinity;

    const setTeam = (newTeam) => {
        team = newTeam;
    }

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
        abilityUse,
        setTeam
    };
};

const actionAttack = (attackerName, victimId) => {
    Game.addAction(attackerName, { "attacked": victimId });
}

const actionRescue = (protectorName, protectedId) => {
    Game.addAction(protectorName, { "rescued": protectedId });
}

const actionReveal = (revealerName, revealedId) => {
    Game.addAction(revealerName, { "revealed": revealedId });
    const player = Game.getPlayerById(revealedId);

    if (document.querySelector("#night-action-form")) {
        // Only used when not in simulations
        ViewControl.replaceNightActionForm([`${player.name} is a ${player.role.name}.`]);
    }
}

const chooseRandom = (arr) => {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
};

export { createRole, actionAttack, actionRescue, actionReveal, chooseRandom }