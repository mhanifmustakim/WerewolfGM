import Game from "./Game";
import Player from "./Player";
import Roles from "./Roles";
import View from "./View";
import { Buttons, NightActionForm } from "./ViewComponent";

const ViewControl = (function () {
    let gameMode = null;
    const setGameMode = (newGameMode) => gameMode = newGameMode;

    const addPlayer = (e) => {
        e.preventDefault();

        const playerName = document.querySelector("#player-name").value;
        const player = Player(playerName);
        const playerList = document.querySelector("#players-list");
        Game.addPlayer(player);
        View.updatePlayersList(playerList, Buttons.removePlayerBtn);

        document.querySelector("#player-name").value = "";
        if (Game.players.length >= 3) document.querySelector("#next-btn").disabled = false;
    };

    const deletePlayer = (e) => {
        const playerList = document.querySelector("#players-list");
        const targetId = parseInt(e.target.getAttribute("data-id"));
        Game.removePlayerWithId(targetId);

        View.updatePlayersList(playerList, Buttons.removePlayerBtn);
        if (Game.players.length < 3) document.querySelector("#next-btn").disabled = true;
    };

    const selectGameMode = (e) => {
        const newGameMode = e.target.value ? e.target.value : e.target.parentElement.value;

        setGameMode(newGameMode);
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
        if (Game.isGameOver) {
            View.displayGameOver();
        } else {
            View.displayDay();
        }
    }

    const voteOutPlayer = (e) => {
        const targetId = parseInt(e.target.getAttribute("data-id"));
        const player = Game.getPlayerById(targetId);
        Game.voteOut(targetId);
        View.displayVoteResults(player.name);
    }


    const startNight = (e) => {
        if (Game.isGameOver) {
            View.displayGameOver();
        } else {
            Game.startNight();
            View.displayStartingNightPhase();
        }
    }

    const endNight = (e) => {
        const killedPlayersNames = Game.endNight().map((player) => player.name);
        View.displayNightResults(killedPlayersNames.join(", "));
    }

    const handleNightAction = (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = Object.fromEntries(new FormData(e.target));
        let canContinue = false;
        Object.entries(formData).forEach(([inputName, value]) => {
            inputName = inputName.split("-");
            const roleIdentifier = inputName[0];
            const abilityName = inputName[1];
            const role = Roles[roleIdentifier]();
            const playerInstanceOfRole = Game.findPlayersByAttr({ roleName: role.name })[0]
            canContinue = playerInstanceOfRole.role[abilityName](value);
        });

        form.querySelectorAll("input").forEach((input) => input.disabled = true);
        e.submitter.disabled = true;
        const nextBtn = document.querySelector("#next-btn");
        nextBtn.disabled = !canContinue;

        if (form.querySelectorAll("input").length == 0) {
            // Handle case where there is no eligible target
            nextBtn.disabled = false;
        }
    }

    const checkNightActionForm = (NightActionForm, nightRoleIndex) => {
        const roleIdentifier = Game.nightRoles[nightRoleIndex];
        const role = Roles[roleIdentifier]();
        const playerWithRole = Game.findPlayersByAttr({ roleName: role.name })[0]; // Assumes there is only one player of this role
        // console.log(playerWithRole.role.abilityUse);
        if (playerWithRole.role.abilityUse <= 0 || !playerWithRole.isAlive) {
            NightActionForm.querySelectorAll("input").forEach((input) => input.disabled = true);
            NightActionForm.querySelector("button").disabled = true;
            document.querySelector("#next-btn").disabled = false;
        }

        if (playerWithRole.role.abilityUse < Infinity) {
            document.querySelector("#next-btn").disabled = false;
        }
    }

    const replaceNightActionForm = (texts) => {
        const nightActionFormContainer = document.querySelector("#night-action-form");
        nightActionFormContainer.innerHTML = "";
        nightActionFormContainer.classList.add("text-xl");
        nightActionFormContainer.classList.add("text-center");

        texts.forEach((text) => {
            const element = document.createElement("h4");
            element.textContent = text;
            nightActionFormContainer.appendChild(element);
        })
    }

    return {
        addPlayer,
        deletePlayer,
        selectGameMode,
        changeRoleQuantity,
        updateRoleQuantities,
        startGame,
        startDay,
        startNight,
        endNight,
        voteOutPlayer,
        setGameMode,
        handleNightAction,
        checkNightActionForm,
        replaceNightActionForm
    }
})()

export default ViewControl