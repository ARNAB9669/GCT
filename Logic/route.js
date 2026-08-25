const ACTIVE_SECTION_KEY = "gct-active-section";

export function toggleUI() {
    const guiSection = document.getElementById("gui");
    const rawDataSection = document.getElementById("raw-data");
    const guiToggle = document.getElementById("GUI_toggle");
    const rawDataToggle = document.getElementById("RAW_DATA_toggle");

    if (!guiSection || !rawDataSection || !guiToggle || !rawDataToggle) {
        console.error("UI route elements were not found.");
        return;
    }

    function showSection(section) {
        const isGui = section === "gui";

        guiSection.hidden = !isGui;
        rawDataSection.hidden = isGui;

        guiToggle.classList.toggle("nav_active", isGui);
        rawDataToggle.classList.toggle("nav_active", !isGui);

        sessionStorage.setItem(
            ACTIVE_SECTION_KEY,
            isGui ? "gui" : "raw-data"
        );
    }

    const savedSection = sessionStorage.getItem(ACTIVE_SECTION_KEY);
    showSection(savedSection === "raw-data" ? "raw-data" : "gui");

    guiToggle.addEventListener("click", () => showSection("gui"));
    rawDataToggle.addEventListener("click", () => showSection("raw-data"));
}