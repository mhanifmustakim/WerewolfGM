import Roles from "./Roles";

const Player = function (name) {
    const id = Player.getId();
    let isAlive = true;
    let role = null;
    let roleName = null;
    let type = null;

    const setRole = (roleIdentifier) => {
        role = Roles[roleIdentifier]()
        roleName = role.name;
        type = role.type;
    }

    const die = () => {
        isAlive = false;
    }

    const reset = () => {
        isAlive = true;
        role = null;
        roleName = null;
        type = null;
    }

    return {
        get name() {
            return name;
        },
        get id() {
            return id;
        },
        get role() {
            return role;
        },
        get isAlive() {
            return isAlive;
        },
        get roleName() {
            return roleName;
        },
        get type() {
            return type;
        },
        setRole,
        die,
        reset
    }
}

Player.nextId = 1;
Player.getId = function () {
    const current = Player.nextId;
    Player.nextId += 1;
    return current;
};

export default Player