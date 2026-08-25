let motionData = {
    gyroscope: {
        alpha: 0,
        beta: 0,
        gamma: 0
    },
    accelerometer: {
        x: 0,
        y: 0,
        z: 0
    }
};

let motionListenerAdded = false;

export async function initMotionSensors() {
    if (motionListenerAdded) return;

    if (
        typeof DeviceMotionEvent !== "undefined" &&
        typeof DeviceMotionEvent.requestPermission === "function"
    ) {
        const permission = await DeviceMotionEvent.requestPermission();

        if (permission !== "granted") return;
    }

    window.addEventListener("devicemotion", event => {
        const rotation = event.rotationRate;
        const acceleration = event.accelerationIncludingGravity;

        motionData = {
            gyroscope: {
                alpha: rotation?.alpha ?? 0,
                beta: rotation?.beta ?? 0,
                gamma: rotation?.gamma ?? 0
            },
            accelerometer: {
                x: acceleration?.x ?? 0,
                y: acceleration?.y ?? 0,
                z: acceleration?.z ?? 0
            }
        };
    });

    motionListenerAdded = true;
}

export function getControllerData() {
    const gamepads = navigator.getGamepads();
    const controllerData = [];

    for (const gamepad of gamepads) {
        if (!gamepad) continue;

        controllerData.push({
            id: gamepad.id,

            buttons: gamepad.buttons.map(button => ({
                pressed: button.pressed,
                touched: button.touched,
                value: button.value
            })),

            axes: [...gamepad.axes],

            gyroscope: motionData.gyroscope,
            accelerometer: motionData.accelerometer
        });
    }

    return controllerData;
}