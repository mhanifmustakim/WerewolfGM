import Test from "./GameTests";
import View from "./View";

const roleQuantities = {
    "citizen": 0,
    "werewolf": 1,
    "lover": 2,
    "doctor": 1,
    "bodyguard": 1,
    "assassin": 1,
    "psycho": 1
};

let numPlayers = 0;
Object.values(roleQuantities).forEach((quantity) => numPlayers += quantity);

// Test.roleDistributionTest(numPlayers, roleQuantities, 1000);
// Test.cycleTest(numPlayers, roleQuantities);
Test.nSimulations(numPlayers, roleQuantities, 1000);

View.displayStart();