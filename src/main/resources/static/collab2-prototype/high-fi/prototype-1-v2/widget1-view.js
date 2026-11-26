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
        setText("[data-elapsed]", state.elapsedMinutes.toFixed(1));
        setText("[data-duration]", String(state.durationMinutes));
        setText("[data-duration-percent]", String(Math.round(state.durationProgress)));
        setText("[data-sample-elapsed]", state.sampleElapsedMinutes.toFixed(1));
        setText("[data-sample-interval]", String(state.sampleIntervalMinutes));
        setText("[data-next-sample]", state.finished
            ? "Fertig"
            : `Nächstes Sample in ${state.nextSampleSeconds} sek`);

        find("[data-duration-track]")?.setAttribute("aria-valuenow", state.elapsedMinutes.toFixed(1));
        find("[data-duration-track]")?.setAttribute("aria-valuetext", `${state.elapsedMinutes.toFixed(1)} von ${state.durationMinutes} Minuten`);
        find("[data-duration-fill]").style.width = `${state.durationProgress}%`;
        find("[data-sample-track]")?.setAttribute("aria-valuenow", state.sampleElapsedMinutes.toFixed(1));
        find("[data-sample-track]")?.setAttribute("aria-valuetext", `${state.sampleElapsedMinutes.toFixed(1)} von ${state.sampleIntervalMinutes} Minuten`);
        find("[data-sample-fill]").style.width = `${state.sampleProgress}%`;
    }

    window.startAccumulationSimulation({ widget, render });
})();
