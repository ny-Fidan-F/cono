(() => {
    const widget = document.querySelector("#widget2");
    if (!widget) return;

    const storageKey = "collab2.prototype1v2.state";
    const channel = "BroadcastChannel" in window
        ? new BroadcastChannel("collab2.prototype1v2")
        : null;

    function fitWidget() {
        const scale = Math.min(
            1,
            window.innerWidth / Number(widget.dataset.widgetWidth),
            window.innerHeight / Number(widget.dataset.widgetHeight)
        );
        widget.style.transform = `scale(${scale})`;
    }

    function showState(state) {
        if (!state) return;
        if (Number.isFinite(state.accumulatedValue)) {
            widget.querySelector("[data-overview-value='0']").textContent = state.accumulatedValue.toFixed(1);
        }
        if (Number.isFinite(state.elapsedMinutes)) {
            widget.querySelector("[data-overview-elapsed]").textContent = state.elapsedMinutes.toFixed(1);
        }
    }

    function readStoredState() {
        try {
            const rawState = localStorage.getItem(storageKey);
            showState(rawState ? JSON.parse(rawState) : null);
        } catch (error) {
            // Keep the Figma example values if browser storage is unavailable.
        }
    }

    fitWidget();
    readStoredState();
    window.addEventListener("resize", fitWidget);
    window.addEventListener("storage", (event) => {
        if (event.key !== storageKey || !event.newValue) return;
        try {
            showState(JSON.parse(event.newValue));
        } catch (error) {
            // Ignore an incomplete storage update and keep the latest visible values.
        }
    });
    channel?.addEventListener("message", (event) => showState(event.data));
})();
