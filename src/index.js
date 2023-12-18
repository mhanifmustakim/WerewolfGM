import Test from "./GameTests";
import View from "./View";
import "./style.css";

const roleQuantities = {
    "citizen": 0,
    "werewolf": 1,
    "lover": 0,
    "doctor": 0,
    "bodyguard": 0,
    "assassin": 1,
    "psycho": 0,
    "seer": 0,
    "shaman": 0,
    "mercenary": 0,
    "joker": 0,
    "swordsman": 1
};

let numPlayers = 0;
Object.values(roleQuantities).forEach((quantity) => numPlayers += quantity);

// Test.roleDistributionTest(numPlayers, roleQuantities, 1000);
// Test.cycleTest(numPlayers, roleQuantities);
// Test.nSimulations(numPlayers, roleQuantities, 1000);

View.displayStart();