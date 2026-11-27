(() => {
    const widget = document.querySelector("#widget1");
    if (!widget) return;

    const setText = (selector, value) => {
        const element = widget.querySelector(selector);
        if (element) element.textContent = value;
    };

    function render(state) {
        setText("[data-run-state]", state.finished ? "Item-Dauer erreicht" : "Akkumulation läuft");
        setText("[data-viewers]", String(state.viewerCount));
        setText("[data-total]", state.accumulatedValue.toFixed(2));
        setText("[data-elapsed]", state.elapsedMinutes.toFixed(1));
        setText("[data-duration]", String(state.durationMinutes));
        setText("[data-next-sample]", state.finished
            ? "Fertig"
            : `Nächstes Sample in ${state.nextSampleSeconds} sek`);

        const tbody = widget.querySelector("[data-sample-history]");
        if (!tbody) return;

        tbody.replaceChildren(...state.sampleHistory.map((sample, index) => {
            const row = document.createElement("tr");
            if (index === state.sampleHistory.length - 1) row.className = "sample-row--latest";
            [sample.time, String(sample.viewers), `+${sample.increase.toFixed(2)}`, sample.accumulatedValue.toFixed(2)]
                .forEach((value) => {
                    const cell = document.createElement("td");
                    cell.textContent = value;
                    row.append(cell);
                });
            return row;
        }));
    }

    window.startAccumulationSimulation({ widget, render });
})();
