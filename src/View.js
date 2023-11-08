import { GameTitle, AddPlayerForm, PlayersNodeList, PlayerInitialReveal, Buttons, RoleQuantitiesForm } from "./ViewComponent";
import ViewControl from "./ViewControl";
import Game from "./Game";

const View = (function () {
    const mainDiv = document.querySelector("#main");
    let gameMode = null;

    const clear = (container) => container.innerHTML = "";

    const setGameMode = (newGameMode) => gameMode = newGameMode;

    const updatePlayersList = (actionBtnCallback, attr = null) => {
        const playersList = document.querySelector("#players-list");
        const newPlayerElements = PlayersNodeList(attr);
        clear(playersList);

        newPlayerElements.forEach((playerElement) => {
            const actionButtonContainer = document.createElement("div");
            const playerId = playerElement.getAttribute("data-id");
            const actionButton = actionBtnCallback(playerId);
            actionButtonContainer.appendChild(actionButton);

            playerElement.appendChild(actionButtonContainer);
            playersList.appendChild(playerElement);
        });
    }

    const displayStart = () => {
        clear(mainDiv);
        const gameTitle = GameTitle();
        const addPlayerForm = AddPlayerForm();
        const playersList = document.createElement("ol");
        playersList.id = "players-list";

        mainDiv.appendChild(gameTitle);
        mainDiv.appendChild(addPlayerForm);
        mainDiv.appendChild(playersList);
        updatePlayersList(Buttons.removePlayerBtn);

        const nextBtn = Buttons.transitionBtn(displaySelectMode, "Select Game Mode");
        mainDiv.appendChild(nextBtn);
    }

    const displaySelectMode = () => {
        clear(mainDiv);
        const gameTitle = GameTitle();
        const container = document.createElement("div");
        const modeSelectionTitle = document.createElement("h3");
        const modeSelectionButtons = document.createElement("div");
        const handOverModeBtn = Buttons.selectModeBtn("handOver");
        const gameMasterModeBtn = Buttons.selectModeBtn("gameMaster");

        modeSelectionButtons.appendChild(handOverModeBtn);
        modeSelectionButtons.appendChild(gameMasterModeBtn);

        modeSelectionTitle.textContent = "Select Game Mode: ";
        container.appendChild(modeSelectionTitle);
        container.appendChild(modeSelectionButtons);

        mainDiv.appendChild(gameTitle);
        mainDiv.appendChild(container);

        const backBtn = Buttons.transitionBtn(displayStart, "Back");
        mainDiv.appendChild(backBtn);
    }

    const displaySelectRoleQuantities = () => {
        clear(mainDiv);
        const gameTitle = GameTitle();
        const container = document.createElement("div");
        const header = document.createElement("div");
        const roleQuantitiesForm = RoleQuantitiesForm();

        const headerTitle = document.createElement("h4");
        headerTitle.textContent = "Select Quantities of each Role: ";
        const headerInfo = document.createElement("p");
        headerInfo.innerHTML = `Amount unallocated: <span id="amountUnallocated"></span>`;
        header.appendChild(headerTitle);
        header.appendChild(headerInfo);

        container.appendChild(header);
        container.appendChild(roleQuantitiesForm);
        mainDiv.appendChild(gameTitle);
        mainDiv.appendChild(container);

        const transitionBtns = document.createElement("div");
        const backBtn = Buttons.transitionBtn(displaySelectMode, "Back");
        const nextBtn = Buttons.startGameBtn();
        nextBtn.id = "start-game-btn"; // To be found by ViewControl

        transitionBtns.appendChild(backBtn);
        transitionBtns.appendChild(nextBtn);

        mainDiv.appendChild(transitionBtns);
        ViewControl.updateRoleQuantities();
    }

    const displayInitialPlayerRoles = (index = 0) => {
        clear(mainDiv);
        const gameTitle = GameTitle();
        const container = document.createElement("div");

        const playerRoleDisplay = PlayerInitialReveal(index);

        container.appendChild(playerRoleDisplay);
        mainDiv.appendChild(gameTitle);
        mainDiv.appendChild(container);

        const transitionBtns = document.createElement("div");

        if (index !== 0) {
            const backBtn = Buttons.transitionBtn(displayInitialPlayerRoles.bind(window, index - 1), "Back");
            transitionBtns.appendChild(backBtn);
        }

        let nextBtn = null;
        if (index < Game.players.length - 1) {
            nextBtn = Buttons.transitionBtn(displayInitialPlayerRoles.bind(window, index + 1), "Next");
        } else {
            nextBtn = Buttons.startDayBtn();
        }
        transitionBtns.appendChild(nextBtn);

        mainDiv.appendChild(transitionBtns);
    }

    return {
        displayStart,
        updatePlayersList,
        displaySelectMode,
        setGameMode,
        displaySelectRoleQuantities,
        displayInitialPlayerRoles
    }
})()

export default View;