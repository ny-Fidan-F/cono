(() => {
    const widget = document.querySelector("#widget1");
    if (!widget) return;

    const find = (selector) => widget.querySelector(selector);
    const setText = (selector, value) => {
        const element = find(selector);
        if (element) element.textContent = value;
    };

    function render(state) {
        setText("[data-current-item]", "Item A");
        setText("[data-current-order]", "1");
        setText("[data-run-state]", state.finished ? "Item-Dauer erreicht" : "Akkumulation läuft");
        setText("[data-viewers]", String(state.viewerCount));
        setText("[data-total]", state.accumulatedValue.toFixed(1));
        setText("[data-duration-percent]", `${Math.round(state.durationProgress)}%`);
        setText("[data-elapsed]", state.elapsedMinutes.toFixed(1));
        setText("[data-duration]", String(state.durationMinutes));
        setText("[data-sample-elapsed]", state.sampleElapsedMinutes.toFixed(1));
        setText("[data-sample-interval]", String(state.sampleIntervalMinutes));
        setText("[data-next-sample]", state.finished
            ? "Fertig"
            : `Nächstes Sample in ${state.nextSampleSeconds} sek`);

        const durationRing = find("[data-duration-ring]");
        durationRing?.style.setProperty("--progress", `${state.durationProgress}%`);
        durationRing?.setAttribute("aria-valuenow", state.elapsedMinutes.toFixed(1));
        durationRing?.setAttribute("aria-valuetext", `${state.elapsedMinutes.toFixed(1)} von ${state.durationMinutes} Minuten`);

        const sampleTrack = find("[data-sample-track]");
        sampleTrack?.setAttribute("aria-valuenow", state.sampleElapsedMinutes.toFixed(1));
        sampleTrack?.setAttribute("aria-valuetext", `${state.sampleElapsedMinutes.toFixed(1)} von ${state.sampleIntervalMinutes} Minuten`);
        const sampleFill = find("[data-sample-fill]");
        if (sampleFill) sampleFill.style.width = `${state.sampleProgress}%`;
    }

    window.startAccumulationSimulation({ widget, render });
})();
