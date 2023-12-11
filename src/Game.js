import Roles from "./Roles";
import Teams from "./Teams";

const Game = (function () {
    let players = [];
    let isGameOver = false;
    let dayCount = 0;
    let winner = null;
    let roleQuantities = null;
    let nightRoles = null;
    let nightActions = null;

    const reset = () => {
        players = [];
        roleQuantities = null;
        nightRoles = null;
    }

    const addPlayer = (player) => {
        players.push(player);
    };

    const addDayCount = () => dayCount += 1;

    const removePlayerWithId = (id) => {
        const index = players.findIndex((player) => player.id === id);
        players.splice(index, 1);
    }

    const getPlayerById = (id) => {
        return players.filter((player) => player.id == id)[0]
    };

    const findPlayersByAttr = (attr) => {
        const targetPlayers = [];

        players.forEach((player) => {
            let targetFlag = true;
            Object.entries(attr).forEach(([key, value]) => {
                // Exclude certain roles
                if (key == "excludeRole") {
                    if (value == player.roleName) {
                        targetFlag = false;
                    }
                } else { // Normal attribute of player
                    if (player[key] !== value) {
                        targetFlag = false;
                    }
                }
            })

            if (targetFlag) {
                targetPlayers.push(player);
            }
        })

        return targetPlayers
    };

    const voteOut = (playerId) => {
        const player = getPlayerById(playerId);
        player.die();
        checkGameOver();
    };

    const checkGameOver = () => {
        const teams = Array.from(new Set(findPlayersByAttr({ isAlive: true }).map((player) => player.role.team)));
        teams.forEach((team) => {
            if (Teams[team].checkWinCondition()) {
                winner = team;
                isGameOver = true;
                // console.log(winner + " won!");
            }
        })
    }

    // Assumes the number of players match the role quantities
    const assignRoles = () => {
        const roles = [];
        // fill roles with quantity * roleName
        Object.entries(roleQuantities).forEach(([roleName, quantity]) => {
            for (let i = 0; i < quantity; i++) roles.push(roleName);
        });

        players.forEach((player) => {
            const randomIndex = Math.floor(Math.random() * roles.length);
            const roleName = roles.splice(randomIndex, 1);
            player.setRole(roleName);
        })
    };

    const setRoleQuantities = (newRoleQuantities) => {
        roleQuantities = newRoleQuantities;
        nightRoles = Array.from(new Set(Object.keys(roleQuantities)
            .filter((roleIdentifier) => Roles[roleIdentifier]().abilities !== null)))
            .filter((roleIdentifier) => roleQuantities[roleIdentifier] > 0);
    };

    const start = () => {
        players.forEach((player) => player.reset());
        isGameOver = false;
        dayCount = 0;
        winner = null;

        assignRoles();
    };


    const startNight = () => {
        nightActions = {};
    };

    const addAction = (roleName, actions) => {
        nightActions[roleName] = actions;
    };

    const endNight = () => {
        const attacked = new Set();
        const rescued = new Set();

        // Extract attacked Ids and rescued Ids
        Object.values(nightActions).forEach((actions) => {
            Object.entries(actions).forEach(([key, targetId]) => {
                switch (key) {
                    case "attacked":
                        attacked.add(targetId);
                        break;
                    case "rescued":
                        rescued.add(targetId);
                        break;
                }
            })
        })

        const killedIds = Array.from(attacked).filter((id) => !rescued.has(id)).map((id) => parseInt(id));
        const rescuedIds = Array.from(attacked).filter((id) => rescued.has(id)).map((id) => parseInt(id));

        killedIds.forEach((id) => {
            const player = getPlayerById(id);
            if ("onKilledAtNight" in player.role) {
                const results = player.role.onKilledAtNight();
                Object.entries(results).forEach(([result, ids]) => {
                    switch (result) {
                        case "kill":
                            ids.forEach((resultId) => {
                                killedIds.push(resultId);
                                Game.getPlayerById(resultId).die();
                            })
                            break;
                        case "save":
                            ids.forEach((resultId) => {
                                const index = killedIds.indexOf(resultId);
                                killedIds.splice(index, 1);
                            })
                            break;
                    }
                })
            } else {
                player.die()
            }
        });
        // console.log(`Players killed: ${killedIds.map((id) => getPlayerById(id).name)}`);

        rescuedIds.forEach((id) => {
            Object.entries(nightActions).forEach(([role, actions]) => {
                Object.entries(actions).forEach(([key, targetId]) => {
                    if (key == "rescued" && targetId == id) {
                        Game.findPlayersByAttr({ roleName: role, isAlive: true }).forEach((player) => player.role.abilityUse -= 1)
                    }
                })
            })
        })
        checkGameOver();
        return Array.from(new Set(killedIds)).map((id) => getPlayerById(id));
    }

    return {
        get players() {
            return players;
        },
        get isGameOver() {
            return isGameOver;
        },
        get winner() {
            return winner;
        },
        get roleQuantities() {
            return roleQuantities;
        },
        get dayCount() {
            return dayCount;
        },
        get nightRoles() {
            return nightRoles
        },
        setRoleQuantities,
        addPlayer,
        removePlayerWithId,
        getPlayerById,
        findPlayersByAttr,
        addAction,
        start,
        voteOut,
        reset,
        addDayCount,
        startNight,
        endNight
    }
})()

export default Game