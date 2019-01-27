import _ from "lodash";
const availableCharacters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

export const generateRoomCode = (codeLength) => {
    let roomCode = '';
    let i;
    for(i = 0; i < codeLength; i++) {
        const nextChar = availableCharacters[_.random(0, availableCharacters.length - 1, false)];
        roomCode = roomCode + nextChar;
    }

    return roomCode;
}
