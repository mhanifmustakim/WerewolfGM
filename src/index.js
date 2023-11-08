import Test from "./GameTests";

let numPlayers = 10;

const roleQuantities = {
    "citizen": 6,
    "werewolf": 3,
    "doctor": 1
};

// Test.roleDistributionTest(numPlayers, roleQuantities, 1000);
// Test.cycleTest(numPlayers, roleQuantities);
Test.nSimulations(numPlayers, roleQuantities, 1000);