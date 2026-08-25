import { updateStatus } from "./controller_status.js"
updateStatus();
import { getControllerData } from './get_controller_data.js';
getControllerData();


const Live_Delta = document.getElementById("Live_Delta");

// Store all button elements in the same order as the Gamepad API
const buttonElements = [
    document.getElementById("B_A"),      // 0
    document.getElementById("B_B"),      // 1
    document.getElementById("B_X"),      // 2
    document.getElementById("B_Y"),      // 3
    document.getElementById("LB"),       // 4
    document.getElementById("RB"),       // 5
    document.getElementById("LT"),       // 6
    document.getElementById("RT"),       // 7
    document.getElementById("Menu1"),    // 8
    document.getElementById("Menu2"),    // 9
    document.getElementById("ML"),       // 10 
    document.getElementById("MR"),       // 11 
    document.getElementById("Dpad_Up"),  // 12
    document.getElementById("Dpad_Down"),// 13
    document.getElementById("Dpad_Left"),// 14
    document.getElementById("Dpad_Right"),//15
    document.getElementById("Home")      //16
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

        leftStick?.classList.remove("Active");
        rightStick?.classList.remove("Active");

        requestAnimationFrame(updateGamepads);
        return;
    }

    const c = controllerData[0];

    updateStickPosition(c);

    // Activate joystick visuals when their stick buttons are pressed
    leftStick?.classList.toggle("Active", c.buttons[10]?.pressed ?? false);
    rightStick?.classList.toggle("Active", c.buttons[11]?.pressed ?? false);

    // Update button highlights
    c.buttons.forEach((btn, index) => {
        const el = buttonElements[index];
        if (el) {
            el.classList.toggle("Active", btn.pressed);
        }
    });

    const pressedButtons = c.buttons
        .map((btn, index) => btn.pressed ? index : null)
        .filter(index => index !== null);

    Live_Delta.innerHTML = `
    <p><strong>Controller:</strong> ${c.id}</p>

    <p><strong>Axes:</strong>
        ${c.axes.map(v => v.toFixed(2)).join(", ")}
    </p>

    <p><strong>Pressed Buttons:</strong>
        ${pressedButtons.length ? pressedButtons.join(", ") : "None"}
    </p>
`;

    requestAnimationFrame(updateGamepads);
}

// Start both loops
requestAnimationFrame(logLiveControllers);
requestAnimationFrame(updateGamepads);

const vibrateBtn = document.getElementById("test_vibration");

vibrateBtn.addEventListener("click", async () => {
    const gamepad = [...navigator.getGamepads()].find(gp => gp);

    if (!gamepad) {
        alert("No controller connected.");
        return;
    }

    if (!gamepad.vibrationActuator) {
        alert("This controller/browser doesn't support vibration.");
        return;
    }

    try {
        await gamepad.vibrationActuator.playEffect("dual-rumble", {
            startDelay: 0,
            duration: 500,
            weakMagnitude: 1.0,
            strongMagnitude: 1.0
        });

        console.log("Vibration triggered!");
    } catch (err) {
        console.error(err);
    }
});


function processAxis(value, deadzone = 0.08) {
    // Remove tiny drift
    if (Math.abs(value) < deadzone) return 0;

    // Normalize remaining range back to -1..1
    const sign = Math.sign(value);

    return sign * ((Math.abs(value) - deadzone) / (1 - deadzone));
}
function lerp(current, target, amount) {
    return current + (target - current) * amount;
}

let lx = 0;
let ly = 0;
let rx = 0;
let ry = 0;

const leftStick = document.getElementById("L_JoyStick");
const rightStick = document.getElementById("R_JoyStick");

const MAX_RADIUS = 95;

function moveStick(stick, x, y) {
    const ring = stick.parentElement;

    const maxRadius =
        (Math.min(ring.clientWidth, ring.clientHeight) -
            stick.offsetWidth) / 2;

    const distance = Math.hypot(x, y);

    if (distance > 1) {
        x /= distance;
        y /= distance;
    }

    stick.style.transform =
        `translate(-50%, -50%) translate(${x * maxRadius}px, ${y * maxRadius}px)`;
}

function updateStickPosition(c) {
    const leftX = processAxis(c.axes[0] ?? 0);
    const leftY = processAxis(c.axes[1] ?? 0);
    const rightX = processAxis(c.axes[2] ?? 0);
    const rightY = processAxis(c.axes[3] ?? 0);

    lx = lerp(lx, leftX, 0.25);
    ly = lerp(ly, leftY, 0.25);
    rx = lerp(rx, rightX, 0.25);
    ry = lerp(ry, rightY, 0.25);

    moveStick(leftStick, lx, ly);
    moveStick(rightStick, rx, ry);
}

// Start both loops
requestAnimationFrame(logLiveControllers);
requestAnimationFrame(updateGamepads);