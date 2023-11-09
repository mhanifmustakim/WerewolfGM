import Game from "./Game";
import Roles from "./Roles";
import ViewControl from "./ViewControl";

const GameTitle = () => {
    const titleContainer = document.createElement("div");

    const mainTitle = document.createElement("h1");
    mainTitle.textContent = "The Werewolf Game";

    titleContainer.appendChild(mainTitle);
    return titleContainer;
}

const AddPlayerForm = () => {
    const form = document.createElement("form");

    const input = document.createElement("input");
    input.id = "player-name";
    input.name = "player-name";
    input.required = true;
    input.autocomplete = "off";
    input.placeholder = "Enter player name";

    const label = document.createElement("label");
    label.textContent = "New Player Name: ";
    label.htmlFor = "player-name";

    const addPlayerBtn = document.createElement("button");
    addPlayerBtn.textContent = "Add Player";
    addPlayerBtn.type = "submit";

    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(addPlayerBtn);

    form.addEventListener("submit", ViewControl.addPlayer);
    return form;
}

const RoleQuantitiesForm = () => {
    const form = document.createElement("form");
    form.id = "role-quantities-form";

    // Handle deletion of players
    let total = Game.players.length;
    Object.values(Game.roleQuantities).forEach((value) => total -= value);
    if (total < 0) Game.setRoleQuantities(null);

    Object.keys(Roles).forEach((roleIdentifier) => {
        const formGroup = document.createElement("div");
        const role = Roles[roleIdentifier]();
        let quantity = 0;

        if (role.inputSpec.min !== 0) quantity = role.inputSpec.min;
        if (Game.roleQuantities !== null) quantity = Game.roleQuantities[roleIdentifier];

        const inputId = `role-${roleIdentifier}`;
        const roleLabel = document.createElement("label");
        roleLabel.textContent = role.name;
        roleLabel.htmlFor = inputId;

        const separator = document.createElement("div");
        separator.textContent = " : ";

        const roleInput = document.createElement("input");
        roleInput.id = inputId;
        roleInput.name = inputId;
        roleInput.type = "number";
        roleInput.value = quantity;
        roleInput.disabled = true;

        const increaseBtn = Buttons.changeRoleQuantityBtn(inputId, `+${role.inputSpec.step}`);
        const decreaseBtn = Buttons.changeRoleQuantityBtn(inputId, `-${role.inputSpec.step}`);

        formGroup.appendChild(roleLabel);
        formGroup.appendChild(separator);
        formGroup.appendChild(roleInput);
        formGroup.appendChild(increaseBtn);
        formGroup.appendChild(decreaseBtn);
        formGroup.classList.add("role-input-group");

        form.appendChild(formGroup);
    });

    return form
}

const PlayerInitialReveal = (index) => {
    const container = document.createElement("div");
    const beforeScreen = document.createElement("h3");
    const afterScreen = document.createElement("div");
    const player = Game.players[index];

    beforeScreen.textContent = `Hand Over Device to ${player.name}: (Click Me!)`;

    const afterScreenHeader = document.createElement("h2");
    afterScreenHeader.textContent = `You are a ${player.role.name}`;
    afterScreen.appendChild(afterScreenHeader);

    if ("onInitialReveal" in player.role) {
        const bonusInfo = player.role.onInitialReveal();
        const element = document.createElement("h3");
        element.innerHTML = bonusInfo.join("<br>");
        afterScreen.appendChild(element);
    }

    const description = document.createElement("p");
    description.innerHTML = player.role.description.join("<br>");
    afterScreen.appendChild(description);

    beforeScreen.addEventListener("click", (e) => {
        let confirmation = confirm(`Confirming identity of: ${player.name}`);
        if (confirmation) {
            beforeScreen.replaceWith(afterScreen);
        }
    })

    container.appendChild(beforeScreen);
    return container;
}

const NightActionForm = (index) => {
    const container = document.createElement("div");
    const roleIdentifier = Game.nightRoles[index];
    const role = Roles[roleIdentifier]();

    Object.entries(role.abilities).forEach(([abilityName, targetAttr]) => {
        const form = document.createElement("form");
        const actionButton = Buttons.actionBtn(abilityName);
        const possibleTargets = Game.findPlayersByAttr(targetAttr);
        possibleTargets.forEach((player) => {
            const formGroup = document.createElement("div");
            const inputId = abilityName + "-" + player.id;
            const inputName = roleIdentifier + "-" + abilityName;
            const label = document.createElement("label");
            label.textContent = player.name;
            label.htmlFor = inputId;
            const input = document.createElement("input");
            input.required = true;
            input.type = "radio";
            input.id = inputId;
            input.name = inputName;
            input.value = player.id;

            formGroup.appendChild(input);
            formGroup.appendChild(label);
            form.appendChild(formGroup);
        });

        form.addEventListener("submit", ViewControl.handleNightAction);
        form.appendChild(actionButton);

        const confirmation = document.createElement("h2");
        confirmation.textContent = `Players with role of ${role.name}, Open Your Eyes. (Click Me!)`;
        confirmation.addEventListener("click", (e) => {
            if (confirm("Start night action of role: " + role.name)) confirmation.replaceWith(form);
        })

        container.appendChild(confirmation);
    })

    return container
}


const RoleQuantitiesDisplay = () => {
    const display = document.createElement("div");
    Object.entries(Game.roleQuantities).forEach(([roleIdentifier, count]) => {
        if (count <= 0) return
        const role = Roles[roleIdentifier]();
        const container = document.createElement("div");
        const roleName = document.createElement("h5");
        roleName.textContent = role.name + " :";
        const roleCount = document.createElement("p");
        roleCount.textContent = count;

        container.appendChild(roleName);
        container.appendChild(roleCount);
        display.appendChild(container);
    })

    return display
}

const PlayersNodeList = (attr = null) => {
    const playersNodeList = [];
    const players = (attr === null) ? Game.players : Game.findPlayersByAttr(attr);

    players.forEach((player) => {
        const playerElement = document.createElement("li");
        playerElement.textContent = player.name;
        playerElement.setAttribute("data-id", player.id);
        playersNodeList.push(playerElement);
    });

    return playersNodeList
}

const GameOverList = (winner) => {
    const playerNodes = PlayersNodeList();
    playerNodes.map((node) => {
        const playerId = parseInt(node.getAttribute("data-id"))
        const player = Game.getPlayerById(playerId);
        if (player.role.team === winner) node.style.color = "red";
    })

    return playerNodes;
}

const Buttons = (function () {
    const removePlayerBtn = (id) => {
        const button = document.createElement("button");
        button.setAttribute("data-id", id);
        button.textContent = "X";
        button.addEventListener("click", ViewControl.deletePlayer, { once: true });

        return button;
    }

    const voteOutBtn = (id) => {
        const button = document.createElement("button");
        button.setAttribute("data-id", id);
        button.textContent = "Vote Out";
        button.addEventListener("click", ViewControl.voteOutPlayer, { once: true });

        return button;
    }

    const actionBtn = (abilityName) => {
        const button = document.createElement("button");
        button.type = "submit";
        button.textContent = abilityName;

        return button;
    }

    const selectModeBtn = (gameMode) => {
        const button = document.createElement("button");
        button.value = gameMode;
        // Maps gameMode to its description
        const info = {
            "handOver": {
                "header": "Hand Over Mode",
                "description": "Hand Over device to each player.",
            },
            "gameMaster": {
                "header": "Game Master Mode",
                "description": "One player acts as a Game Master.",
            },
        }

        const header = document.createElement("h4");
        header.textContent = info[gameMode]["header"];
        const desc = document.createElement("p");
        desc.textContent = info[gameMode]["description"];

        button.appendChild(header);
        button.appendChild(desc);
        button.addEventListener("click", ViewControl.selectGameMode, true);

        return button
    }

    const transitionBtn = (nextPageCallback, textContent) => {
        const button = document.createElement("button");
        button.textContent = textContent;
        button.addEventListener("click", nextPageCallback, { once: true });

        return button;
    }

    const changeRoleQuantityBtn = (inputId, changeInQuantity) => {
        const button = document.createElement("button");
        button.setAttribute("data-targetRole", inputId);
        button.value = parseInt(changeInQuantity);
        button.type = "button";
        button.textContent = changeInQuantity;
        button.addEventListener("click", ViewControl.changeRoleQuantity);

        return button;
    }

    const startGameBtn = () => {
        const button = document.createElement("button");
        button.textContent = "Start Game";
        button.addEventListener("click", ViewControl.startGame);

        return button;
    }

    const startDayBtn = () => {
        const button = document.createElement("button");
        button.textContent = "Start Day";
        button.addEventListener("click", ViewControl.startDay);

        return button;
    }

    const startNightBtn = () => {
        const button = document.createElement("button");
        button.textContent = "Start Night";
        button.addEventListener("click", ViewControl.startNight);

        return button;
    }

    const endNightBtn = () => {
        const button = document.createElement("button");
        button.textContent = "End Night";
        button.addEventListener("click", ViewControl.endNight);

        return button;
    }

    return {
        removePlayerBtn,
        transitionBtn,
        selectModeBtn,
        changeRoleQuantityBtn,
        actionBtn,
        startGameBtn,
        startDayBtn,
        voteOutBtn,
        startNightBtn,
        endNightBtn
    }
})()

export { GameTitle, AddPlayerForm, PlayersNodeList, RoleQuantitiesForm, PlayerInitialReveal, RoleQuantitiesDisplay, NightActionForm, GameOverList, Buttons }