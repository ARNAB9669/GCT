export function getControllerData() {
    const gamepads = navigator.getGamepads();
    const controllerData = [];

    for (let i = 0; i < gamepads.length; i++) {
        const gamepad = gamepads[i];
        if (gamepad) {
            const buttons = gamepad.buttons.map(button => button.value);
            const axes = gamepad.axes;
            controllerData.push({ buttons, axes });
        }
    }

    return controllerData;
}