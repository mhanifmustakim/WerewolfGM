import Teams from "./Teams";

const Game = (function () {
    let players = [];
    let isGameOver = false;
    let dayCount = 1;
    let winner = null;
    let roleQuantities = null;
    let nightActions = null;

    const reset = () => {
        players = [];
        isGameOver = false;
        dayCount = 1;
        winner = null;
        roleQuantities = null;
    }

    const addPlayer = (player) => {
        players.push(player);
    };

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
    };

    const start = () => {
        players.forEach((player) => player.reset());
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

        const killedIds = Array.from(attacked).filter((id) => !rescued.has(id));
        killedIds.forEach((id) => getPlayerById(id).die());
        // console.log(`Players killed: ${killedIds.map((id) => getPlayerById(id).name)}`);

        checkGameOver();
    }

    return {
        get players() {
            return players
        },
        get isGameOver() {
            return isGameOver
        },
        get winner() {
            return winner
        },
        setRoleQuantities,
        addPlayer,
        findPlayersByAttr,
        addAction,
        start,
        voteOut,
        reset,
        startNight,
        endNight
    }
})()

export default Game