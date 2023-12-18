import Game from "./Game";
import Player from "./Player";
import Roles from "./Roles";
import Teams from "./Teams";

const Test = (function () {
    const generatePlayers = (n) => {
        for (let i = 0; i < n; i++) {
            const player = Player(`Player ${i}`);
            Game.addPlayer(player);
        };
    };

    const chooseRandom = (arr) => {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    };

    // Tests the role distribution of the algorithm based on index of player
    const roleDistributionTest = (numPlayers, roleQuantities, numExperiments) => {
        Game.reset();
        const roles = Array.from(new Set(Object.keys(roleQuantities))).map((roleName) => Roles[roleName]().name);

        generatePlayers(numPlayers);

        // Set up object to track amount of times a player got a role
        const counts = {}
        Game.players.forEach((player) => {
            counts[player.name] = {};
            roles.forEach((roleName) => {
                counts[player.name][roleName] = 0;
            })
        })

        // Start experiment
        Game.setRoleQuantities(roleQuantities);
        for (let i = 0; i < numExperiments; i++) {
            Game.start();

            Game.players.forEach((player) => counts[player.name][player.roleName] += 1);
        }

        // Give out statistics
        Game.players.forEach((player) => {
            roles.forEach((roleName) => {
                counts[player.name][roleName] /= numExperiments;
            })
        })

        console.log(counts);
    }

    const cycleTest = (numPlayers, roleQuantities, noVoteAtFirstDay = true) => {
        Game.reset();

        generatePlayers(numPlayers);
        Game.setRoleQuantities(roleQuantities);
        Game.start();

        const rolesWithNightActions = Array.from(new Set(Object.keys(roleQuantities)))
            .filter((roleName) => Roles[roleName]().abilities !== null)
            .sort();

        while (!Game.isGameOver) {
            // Start Day cycle
            if (noVoteAtFirstDay) {
                noVoteAtFirstDay = false;
            } else {
                const voteCandidates = Game.findPlayersByAttr({ isAlive: true });
                const playerVotedOut = chooseRandom(voteCandidates);
                // console.log(`${playerVotedOut.name} has been voted out.`);
                Game.voteOut(playerVotedOut.id);
            }

            if (Game.isGameOver) break

            // Start Night cycle
            Game.startNight();
            rolesWithNightActions.forEach((roleName) => {
                const role = Roles[roleName]();

                if (Game.findPlayersByAttr({ roleName: role.name, isAlive: true }).length > 0) {
                    Object.entries(role.abilities).forEach(([ability, targetAttr]) => {
                        const targetCandidates = Game.findPlayersByAttr(targetAttr);
                        if (targetCandidates.length > 0) {
                            const randomTarget = chooseRandom(targetCandidates);
                            role[ability](randomTarget.id);
                        }

                        // console.log(`${role.name}: ${ability} ${randomTarget.name}`);
                    })
                }
            })

            Game.endNight();
        }

        return Game.winner

    }

    const nSimulations = (numPlayers, roleQuantities, numExperiments) => {
        const teams = Array.from(Object.keys(Teams));

        const counts = {};
        teams.forEach((team) => counts[team] = 0);

        for (let i = 0; i < numExperiments; i++) {
            const winner = cycleTest(numPlayers, roleQuantities);
            counts[winner] += 1;
        }

        teams.forEach((team) => counts[team] /= numExperiments);
        console.log(counts);
    }

    return {
        roleDistributionTest,
        cycleTest,
        nSimulations
    }
})()

export default Test