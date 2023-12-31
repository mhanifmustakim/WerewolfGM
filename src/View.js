import { GameTitle, AddPlayerForm, PlayersNodeList, PlayerInitialReveal, Buttons, RoleQuantitiesForm, RoleQuantitiesDisplay, NightActionForm, GameOverList } from "./ViewComponent";
import ViewControl from "./ViewControl";
import Game from "./Game";

const View = (function () {
    const mainDiv = document.querySelector("#main");

    const clear = (container) => {
        container.innerHTML = "";
        container.classList.forEach((className) => container.classList.remove(className));
    };

    const updatePlayersList = (playersList, actionBtnCallback, attr = null) => {
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
        const playersListHeader = document.createElement("h3");
        playersListHeader.textContent = "Current Players: ";
        const playersList = document.createElement("ol");
        playersList.id = "players-list";

        mainDiv.appendChild(gameTitle);
        mainDiv.appendChild(addPlayerForm);
        mainDiv.appendChild(playersListHeader);
        mainDiv.appendChild(playersList);
        updatePlayersList(playersList, Buttons.removePlayerBtn);

        const nextBtn = Buttons.transitionBtn(displaySelectMode, "Select Game Mode");
        nextBtn.id = "next-btn";
        mainDiv.appendChild(nextBtn);
    }

    const displaySelectMode = () => {
        clear(mainDiv);
        const gameTitle = GameTitle();
        const container = document.createElement("div");
        container.id = "select-game-mode";
        container.classList.add("text-center");

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
        headerTitle.classList.add("text-center");
        const headerInfo = document.createElement("p");
        headerInfo.innerHTML = `Amount unallocated: <span id="amountUnallocated"></span>`;
        headerInfo.classList.add("text-center");
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
        mainDiv.classList.add("focus-view");

        const gameTitle = GameTitle();
        const container = document.createElement("div");
        container.classList.add("text-center");
        container.classList.add("text-xl");

        const playerRoleDisplay = PlayerInitialReveal(index);

        container.appendChild(playerRoleDisplay);
        mainDiv.appendChild(gameTitle);
        mainDiv.appendChild(container);

        let nextBtn = null;
        if (index < Game.players.length - 1) {
            nextBtn = Buttons.transitionBtn(displayInitialPlayerRoles.bind(window, index + 1), "Next");
        } else {
            nextBtn = Buttons.startDayBtn();
        }

        mainDiv.appendChild(nextBtn);
    }

    const displayNightActionRoles = (index = 0) => {
        clear(mainDiv);
        const gameTitle = GameTitle();
        const container = document.createElement("div");

        const nightActionForm = NightActionForm(index);

        container.appendChild(nightActionForm);
        mainDiv.appendChild(gameTitle);
        mainDiv.appendChild(container);

        let nextBtn = null;
        if (index < Game.nightRoles.length - 1) {
            nextBtn = Buttons.transitionBtn(displayNightActionRoles.bind(window, index + 1), "Next");
        } else {
            nextBtn = Buttons.endNightBtn();
        }

        nextBtn.id = "next-btn";
        nextBtn.disabled = true;
        mainDiv.appendChild(nextBtn);

        ViewControl.checkNightActionForm(nightActionForm, index);
    }

    const displayDay = () => {
        clear(mainDiv);
        const gameTitle = GameTitle();
        const container = document.createElement("div");
        const header = document.createElement("h3");
        header.innerHTML = `Welcome to Day ${Game.dayCount}.<br>Now is the time to discuss and work together to eliminate the werewolves.`;

        const roleQuantitiesDisplay = RoleQuantitiesDisplay();

        container.appendChild(header);
        container.appendChild(roleQuantitiesDisplay);
        mainDiv.appendChild(gameTitle);
        mainDiv.appendChild(container);

        const nextBtn = Buttons.transitionBtn(displayVotingPhase, "Start Voting");
        mainDiv.appendChild(nextBtn);
    }

    const displayVotingPhase = () => {
        clear(mainDiv);
        const gameTitle = GameTitle();
        const container = document.createElement("div");
        const header = document.createElement("h3");
        header.textContent = "Point your finger towards the most suspiscious player. In 3, 2, 1!";

        const votingList = document.createElement("div");
        votingList.id = "player-list";
        updatePlayersList(votingList, Buttons.voteOutBtn, { isAlive: true });

        container.appendChild(header);
        container.appendChild(votingList);
        mainDiv.appendChild(gameTitle);
        mainDiv.appendChild(container);

        const skipBtn = Buttons.transitionBtn(displayVoteResults.bind(window, "SKIPPED"), "SKIP");
        mainDiv.appendChild(skipBtn);
    }

    const displayVoteResults = (votedOutName) => {
        clear(mainDiv);
        const gameTitle = GameTitle();
        const container = document.createElement("div");
        const results = document.createElement("h2");
        results.innerHTML = `The result of the voting phase is:<br><span id="voted-out"></span>`;

        container.appendChild(results);
        mainDiv.appendChild(gameTitle);
        mainDiv.appendChild(container);

        const votedOutSpan = container.querySelector("#voted-out");
        votedOutSpan.classList.add("text-warning");
        votedOutSpan.textContent = votedOutName;

        const nextBtn = Buttons.checkContinueToNightBtn();
        mainDiv.appendChild(nextBtn);
    }

    const displayStartingNightPhase = () => {
        clear(mainDiv);
        const gameTitle = GameTitle();
        const container = document.createElement("div");
        const header = document.createElement("h3");
        header.textContent = "The night has come. Everyone close your eyes!";

        container.appendChild(header);
        mainDiv.appendChild(gameTitle);
        mainDiv.appendChild(container);

        const startNightBtn = Buttons.transitionBtn(displayNightActionRoles.bind(window, 0), "Start Night");
        mainDiv.appendChild(startNightBtn);
    }

    const displayNightResults = (killedNames) => {
        clear(mainDiv);
        const gameTitle = GameTitle();
        const container = document.createElement("div");
        const results = document.createElement("h2");
        results.innerHTML = `During the night,<br><span id="killed"></span><br>is found dead.`;

        container.appendChild(results);
        mainDiv.appendChild(gameTitle);
        mainDiv.appendChild(container);

        const killedSpan = container.querySelector("#killed");
        killedSpan.textContent = killedNames ? killedNames : "NO ONE";

        const startDayBtn = Buttons.startDayBtn();
        mainDiv.appendChild(startDayBtn);
    }

    const displayGameOver = () => {
        clear(mainDiv);
        const winner = Game.winner
        const gameTitle = GameTitle();
        const container = document.createElement("div");
        const playersList = document.createElement("div");
        GameOverList(winner).forEach((playerNode) => playersList.appendChild(playerNode));

        const results = document.createElement("h2");
        results.innerHTML = `GAME OVER<br><span id="winning-team"></span><br>WINS`;

        container.appendChild(results);
        container.appendChild(playersList);
        mainDiv.appendChild(gameTitle);
        mainDiv.appendChild(container);

        const winningTeamSpan = container.querySelector("#winning-team");
        winningTeamSpan.textContent = "TEAM " + winner.toUpperCase();

        const restartBtn = Buttons.transitionBtn(displaySelectRoleQuantities, "PLAY AGAIN");
        mainDiv.appendChild(restartBtn);
    }

    return {
        displayStart,
        updatePlayersList,
        displaySelectMode,
        displaySelectRoleQuantities,
        displayInitialPlayerRoles,
        displayNightActionRoles,
        displayStartingNightPhase,
        displayDay,
        displayVoteResults,
        displayNightResults,
        displayGameOver
    }
})()

export default View;