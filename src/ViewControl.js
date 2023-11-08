import Game from "./Game";
import Player from "./Player";
import Roles from "./Roles";
import View from "./View";
import { Buttons } from "./ViewComponent";

const ViewControl = (function () {
    const addPlayer = (e) => {
        e.preventDefault();

        const playerName = document.querySelector("#player-name").value;
        const player = Player(playerName);
        Game.addPlayer(player);
        View.updatePlayersList(Buttons.removePlayerBtn);

        document.querySelector("#player-name").value = "";
    };

    const deletePlayer = (e) => {
        const targetId = parseInt(e.target.getAttribute("data-id"));
        Game.removePlayerWithId(targetId);

        View.updatePlayersList(Buttons.removePlayerBtn);
    };

    const selectGameMode = (e) => {
        const gameMode = e.target.value ? e.target.value : e.target.parentElement.value;

        View.setGameMode(gameMode);
        View.displaySelectRoleQuantities();
    }

    const changeRoleQuantity = (e) => {
        const target = e.target;
        const changeInValue = target.value;
        const inputId = target.getAttribute("data-targetRole");

        const targetInput = document.querySelector(`input[id="${inputId}"]`);
        targetInput.value = parseInt(targetInput.value) + parseInt(changeInValue);

        updateRoleQuantities();
    }

    const getAmountUnallocated = () => {
        const roleQuantitiesForm = document.querySelector("#role-quantities-form");
        let total = 0;
        roleQuantitiesForm.querySelectorAll("input").forEach((input) => total += parseInt(input.value))

        return Game.players.length - total;
    }

    const updateRoleQuantities = () => {
        const amountUnallocated = getAmountUnallocated();
        const amountUnallocatedDisplay = document.querySelector("#amountUnallocated");
        amountUnallocatedDisplay.textContent = amountUnallocated;

        const roleQuantitiesForm = document.querySelector("#role-quantities-form");
        roleQuantitiesForm.querySelectorAll("input").forEach((input) => {
            const formGroup = input.parentElement;
            const buttons = formGroup.querySelectorAll("button");
            const inputValue = parseInt(input.value);
            const inputRole = Roles[input.id.substring(5)]();

            buttons.forEach((btn) => {
                const valueChange = parseInt(btn.value);
                btn.disabled = !(valueChange <= amountUnallocated)
                    || (valueChange > 0 && inputValue == inputRole.inputSpec.max)
                    || (valueChange < 0 && inputValue == inputRole.inputSpec.min);
            })
        })

        const startBtn = document.querySelector("#start-game-btn");
        startBtn.disabled = amountUnallocated !== 0;
    }

    const startGame = (e) => {
        e.preventDefault();
        const form = document.querySelector("#role-quantities-form");
        const roleQuantities = {};
        form.querySelectorAll("input").forEach((input) => {
            const roleIdentifier = input.id.substring(5);
            const quantity = parseInt(input.value);
            roleQuantities[roleIdentifier] = quantity;
        })

        Game.setRoleQuantities(roleQuantities);
        Game.start();
        View.displayInitialPlayerRoles();
    }

    const startDay = (e) => {
        Game.addDayCount();
        if (Game.dayCount !== 1) {
            console.log("Not First Day Start");
            // View.displayNightResolution();
        } else {
            console.log("First Day Start");
            // View.displayDay();
        }
    }

    return {
        addPlayer,
        deletePlayer,
        selectGameMode,
        changeRoleQuantity,
        updateRoleQuantities,
        startGame,
        startDay
    }
})()

export default ViewControl