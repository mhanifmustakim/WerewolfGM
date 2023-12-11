import Test from "./GameTests";
import View from "./View";

const roleQuantities = {
    "citizen": 4,
    "werewolf": 2,
    "lover": 2,
    "doctor": 1,
    "bodyguard": 1
};

let numPlayers = 0;
Object.values(roleQuantities).forEach((quantity) => numPlayers += quantity);

// Test.roleDistributionTest(numPlayers, roleQuantities, 1000);
// Test.cycleTest(numPlayers, roleQuantities);
Test.nSimulations(numPlayers, roleQuantities, 10000);

View.displayStart();