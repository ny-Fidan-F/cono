(() => {
    const widget = document.querySelector("#widget1");
    if (!widget) return;

    const durationMinutes = 15;
    const sampleIntervalMinutes = 3;
    const millisecondsPerSimulationMinute = 2000;
    const viewerMinimum = 20;
    const viewerMaximum = 180;
    const baseRate = 2;
    const viewerDivider = 50;
    const storageKey = "collab2.prototype1v2.state";
    const channel = "BroadcastChannel" in window
        ? new BroadcastChannel("collab2.prototype1v2")
        : null;

    let elapsedMinutes = 7;
    let sampleElapsedMinutes = 2;
    let sampleCount = 2;
    let accumulatedValue = 38.5;
    let viewerCount = 124;
    let lastTick = performance.now();
    let lastPublishedAt = 0;

    const find = (selector) => widget.querySelector(selector);
    const setText = (selector, value) => {
        const element = find(selector);
        if (element) element.textContent = value;
    };

    function fitWidget() {
        const scale = Math.min(
            1,
            window.innerWidth / Number(widget.dataset.widgetWidth),
            window.innerHeight / Number(widget.dataset.widgetHeight)
        );
        widget.style.transform = `scale(${scale})`;
    }

    function randomViewers() {
        return Math.floor(Math.random() * (viewerMaximum - viewerMinimum + 1)) + viewerMinimum;
    }

    function addSample() {
        const addition = baseRate * (1 + viewerCount / viewerDivider);
        accumulatedValue = Math.round((accumulatedValue + addition) * 100) / 100;
        sampleCount += 1;
    }

    function publishState(now, force = false) {
        if (!force && now - lastPublishedAt < 500) return;
        lastPublishedAt = now;

        const state = {
            viewerCount,
            elapsedMinutes,
            sampleElapsedMinutes,
            sampleCount,
            accumulatedValue,
            completed: elapsedMinutes >= durationMinutes
        };

        try {
            localStorage.setItem(storageKey, JSON.stringify(state));
        } catch (error) {
            // The Widget 1 simulation remains usable if browser storage is unavailable.
        }
        channel?.postMessage(state);
    }

    function updateDisplay() {
        const durationProgress = Math.min(100, elapsedMinutes / durationMinutes * 100);
        const finished = elapsedMinutes >= durationMinutes;
        const visibleSampleElapsed = finished && sampleCount >= Math.floor(durationMinutes / sampleIntervalMinutes)
            ? sampleIntervalMinutes
            : sampleElapsedMinutes;
        const sampleProgress = Math.min(100, visibleSampleElapsed / sampleIntervalMinutes * 100);
        const nextSampleSeconds = Math.max(0, Math.ceil((sampleIntervalMinutes - visibleSampleElapsed) * millisecondsPerSimulationMinute / 1000));

        setText("[data-current-item]", "Item A");
        setText("[data-current-order]", "1");
        setText("[data-viewers]", String(viewerCount));
        setText("[data-total]", accumulatedValue.toFixed(1));
        setText("[data-elapsed]", elapsedMinutes.toFixed(1));
        setText("[data-duration]", String(durationMinutes));
        setText("[data-duration-percent]", String(Math.round(durationProgress)));
        setText("[data-sample-elapsed]", visibleSampleElapsed.toFixed(1));
        setText("[data-sample-interval]", String(sampleIntervalMinutes));
        setText("[data-run-state]", finished ? "Item-Dauer erreicht" : "Akkumulation läuft");
        setText("[data-next-sample]", finished
            ? "Fertig"
            : `Nächstes Sample in ${nextSampleSeconds} sek`);

        const durationFill = find("[data-duration-fill]");
        durationFill.style.width = `${durationProgress}%`;
        const durationTrack = find("[data-duration-track]");
        durationTrack.setAttribute("aria-valuenow", String(elapsedMinutes.toFixed(1)));
        durationTrack.setAttribute("aria-valuetext", `${elapsedMinutes.toFixed(1)} von ${durationMinutes} Minuten`);

        const sampleFill = find("[data-sample-fill]");
        sampleFill.style.width = `${sampleProgress}%`;
        const sampleTrack = find("[data-sample-track]");
        sampleTrack.setAttribute("aria-valuenow", String(visibleSampleElapsed.toFixed(1)));
        sampleTrack.setAttribute("aria-valuetext", `${visibleSampleElapsed.toFixed(1)} von ${sampleIntervalMinutes} Minuten`);
    }

    function tick(now) {
        if (elapsedMinutes >= durationMinutes) return;

        const deltaMinutes = (now - lastTick) / millisecondsPerSimulationMinute;
        elapsedMinutes = Math.min(durationMinutes, elapsedMinutes + deltaMinutes);
        sampleElapsedMinutes += deltaMinutes;
        lastTick = now;

        while (sampleCount < Math.floor(durationMinutes / sampleIntervalMinutes)
            && sampleElapsedMinutes + 0.0001 >= sampleIntervalMinutes) {
            sampleElapsedMinutes -= sampleIntervalMinutes;
            addSample();
        }

        updateDisplay();
        publishState(now);
        if (elapsedMinutes >= durationMinutes) {
            window.clearInterval(clock);
            publishState(now, true);
        }
    }

    fitWidget();
    window.addEventListener("resize", fitWidget);
    updateDisplay();
    publishState(performance.now(), true);

    const clock = window.setInterval(() => tick(performance.now()), 100);
    window.setInterval(() => {
        if (elapsedMinutes < durationMinutes) {
            viewerCount = randomViewers();
            updateDisplay();
            publishState(performance.now(), true);
        }
    }, 2500);
})();
