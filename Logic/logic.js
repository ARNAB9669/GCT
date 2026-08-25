import { updateStatus } from "./controller_status.js"
updateStatus();
import { getControllerData } from './get_controller_data.js';
getControllerData();


const Live_Delta = document.getElementById("Live_Delta");

// Store all button elements in the same order as the Gamepad API
const buttonElements = [
    document.getElementById("B_A"),          // 0
    document.getElementById("B_B"),          // 1
    document.getElementById("B_X"),          // 2
    document.getElementById("B_Y"),          // 3
    document.getElementById("LB"),           // 4
    document.getElementById("RB"),           // 5
    document.getElementById("LT"),           // 6
    document.getElementById("RT"),           // 7
    document.getElementById("Menu1"),        // 8
    document.getElementById("Menu2"),        // 9
    document.getElementById("L_JoyStick"),   // 10
    document.getElementById("R_JoyStick"),   // 11
    document.getElementById("Dpad_Up"),      // 12
    document.getElementById("Dpad_Down"),    // 13
    document.getElementById("Dpad_Left"),    // 14
    document.getElementById("Dpad_Right"),   // 15
    document.getElementById("Home")          // 16 (optional)
];

// Logs controller information every frame
function logLiveControllers() {
    const data = typeof getControllerData === "function"
        ? getControllerData()
        : [];

    console.clear();

    if (data.length === 0) {
        console.log("No controller connected.");
    } else {
        data.forEach((controller, index) => {
            console.log(`Controller ${index + 1}`);
            console.log("ID:", controller.id);

            console.log(
                "Buttons:",
                controller.buttons.map((btn, i) => ({
                    button: i,
                    pressed: btn.pressed,
                    value: btn.value
                }))
            );

            console.log(
                "Axes:",
                controller.axes.map(v => Number(v.toFixed(2)))
            );
        });
    }

    requestAnimationFrame(logLiveControllers);
}

// Updates your HTML
function updateGamepads() {
    const controllerData = typeof getControllerData === "function"
        ? getControllerData()
        : [];

    if (controllerData.length === 0) {
        Live_Delta.innerHTML =
            "<p><strong>No controller detected.</strong></p>";

        buttonElements.forEach(el => {
            if (el) el.classList.remove("Active");
        });

        requestAnimationFrame(updateGamepads);
        return;
    }

    const c = controllerData[0];

    // Update button highlights
    c.buttons.forEach((btn, index) => {
        const el = buttonElements[index];
        if (el) {
            el.classList.toggle("Active", btn.pressed);
        }
    });

    // Display axes
    Live_Delta.innerHTML = `
        <p><strong>Controller:</strong> ${c.id}</p>
        <p><strong>Axes:</strong> ${c.axes
            .map(v => v.toFixed(2))
            .join(", ")}</p>
    `;

    requestAnimationFrame(updateGamepads);
}

// Start both loops
requestAnimationFrame(logLiveControllers);
requestAnimationFrame(updateGamepads);