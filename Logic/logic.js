import { updateStatus } from "./controller_status.js";
import { updateGamepadUI } from "./update%29dom.js";
import { toggleUI } from "./route.js";
import { getControllerData } from "./get_controller_data.js";

updateStatus();
updateGamepadUI();
toggleUI();

function updateRawData() {
    const controller = getControllerData()[0];
    const sections = document.querySelectorAll("#raw-data .raw_left > div");

    if (!controller) {
        sections.forEach(section => {
            section.querySelectorAll(":scope > div > div:last-child")
                .forEach(value => value.textContent = "-");
        });

        requestAnimationFrame(updateRawData);
        return;
    }

    const button = index => controller.buttons[index];

    const values = [
        // Axes
        `[${controller.axes[0]?.toFixed(2) ?? 0}, ${controller.axes[1]?.toFixed(2) ?? 0}]`,
        `[${controller.axes[2]?.toFixed(2) ?? 0}, ${controller.axes[3]?.toFixed(2) ?? 0}]`,

        // D-pad: left, right, up, down
        button(14)?.pressed ?? false,
        button(15)?.pressed ?? false,
        button(12)?.pressed ?? false,
        button(13)?.pressed ?? false,

        // Buttons: X, Y, A, B
        button(2)?.pressed ?? false,
        button(3)?.pressed ?? false,
        button(0)?.pressed ?? false,
        button(1)?.pressed ?? false,

        // Menu buttons
        button(8)?.pressed ?? false,
        button(9)?.pressed ?? false,
        button(10)?.pressed ?? false,
        button(11)?.pressed ?? false,

        // Shoulder buttons
        button(4)?.pressed ?? false,
        button(5)?.pressed ?? false,

        // Triggers
        button(6)?.value ?? 0,
        button(7)?.value ?? 0
    ];

    let valueIndex = 0;

    sections.forEach(section => {
        section.querySelectorAll(":scope > div > div:last-child")
            .forEach(valueElement => {
                valueElement.textContent = values[valueIndex++];
            });
    });

    requestAnimationFrame(updateRawData);
}

updateRawData();
