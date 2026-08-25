export function getControllerData() {
    const gamepads = navigator.getGamepads();
    const controllerData = [];

    for (let i = 0; i < gamepads.length; i++) {
        const gamepad = gamepads[i];

        if (!gamepad) continue;

        controllerData.push({
            id: gamepad.id,

            buttons: gamepad.buttons.map(button => ({
                pressed: button.pressed,
                touched: button.touched,
                value: button.value
            })),

            axes: [...gamepad.axes]
        });
    }

    return controllerData;
}