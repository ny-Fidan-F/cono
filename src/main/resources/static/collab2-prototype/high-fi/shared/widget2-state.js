(() => {
    const widget = document.querySelector("#widget2");
    if (!widget) return;

    const prototypeId = widget.dataset.prototypeId;
    const storageKey = `collab2.${prototypeId}.state`;
    const channel = "BroadcastChannel" in window
        ? new BroadcastChannel(`collab2.${prototypeId}`)
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
        if (!state || !Number.isFinite(state.accumulatedValue)) return;

        const value = widget.querySelector("[data-accumulated-value]");
        if (value) value.textContent = state.accumulatedValue.toFixed(1);

        const elapsed = widget.querySelector("[data-elapsed-minutes]");
        if (elapsed && Number.isFinite(state.elapsedMinutes)) {
            elapsed.textContent = state.elapsedMinutes.toFixed(1);
        }
    }

    function readStoredState() {
        try {
            const rawState = localStorage.getItem(storageKey);
            showState(rawState ? JSON.parse(rawState) : null);
        } catch (error) {
            // Keep the example values from the HTML if browser storage is unavailable.
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
            // Keep the most recent visible values.
        }
    });
    channel?.addEventListener("message", (event) => showState(event.data));
})();
