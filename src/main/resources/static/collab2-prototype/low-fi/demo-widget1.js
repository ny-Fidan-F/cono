(() => {
    const widget = document.querySelector("[data-widget-demo]");
    if (!widget) return;

    const duration = Math.max(0.1, Number(widget.dataset.durationMinutes) || 15);
    const sampleInterval = Math.max(0.1, Number(widget.dataset.sampleIntervalMinutes) || 3);
    const baseRate = Math.max(0, Number(widget.dataset.baseRate) || 2);
    const viewerDivider = Math.max(0.1, Number(widget.dataset.viewerDivider) || 50);
    const simMsPerMinute = Math.max(100, Number(widget.dataset.simMsPerMinute) || 2000);
    const viewerMin = Math.max(0, Number(widget.dataset.viewerMin) || 20);
    const viewerMax = Math.max(viewerMin, Number(widget.dataset.viewerMax) || 180);

    let elapsed = 0;
    let sampleCount = 0;
    let total = Number(widget.dataset.initialAmount) || 0;
    let viewers = randomViewers();
    let lastTick = performance.now();
    let timer;
    let viewerTimer;

    const find = (selector) => widget.querySelector(selector);
    const show = (selector, value) => {
        const element = find(selector);
        if (element) element.textContent = value;
    };

    function randomViewers() {
        return Math.floor(Math.random() * (viewerMax - viewerMin + 1)) + viewerMin;
    }

    function addSample(sampleMinute) {
        const increment = baseRate * (1 + viewers / viewerDivider);
        total = Math.round((total + increment) * 100) / 100;
        sampleCount += 1;

        const log = find("[data-demo-log]");
        if (!log) return;

        if (sampleCount === 1) log.replaceChildren();
        const row = document.createElement("tr");
        const values = [
            `Sim-Min. ${sampleMinute.toFixed(0)}`,
            String(viewers),
            `+${increment.toFixed(2)}`,
            total.toFixed(2)
        ];
        for (const value of values) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        }
        log.appendChild(row);
    }

    function updateView() {
        const finished = elapsed >= duration;
        const timePercent = Math.min(100, (elapsed / duration) * 100);
        const sampleElapsed = finished
            ? (duration % sampleInterval || sampleInterval)
            : (elapsed % sampleInterval);
        const samplePercent = Math.min(100, (sampleElapsed / sampleInterval) * 100);

        show("[data-demo-viewers]", String(viewers));
        show("[data-demo-total]", total.toFixed(2));
        show("[data-demo-elapsed]", elapsed.toFixed(1));
        show("[data-demo-duration]", duration.toFixed(0));
        show("[data-demo-percent]", `${Math.round(timePercent)}%`);
        show("[data-demo-sample-count]", String(sampleCount));
        show("[data-demo-sample-elapsed]", sampleElapsed.toFixed(1));
        show("[data-demo-sample-interval]", sampleInterval.toFixed(0));
        show("[data-demo-status]", finished ? "Dauer erreicht · Item bleibt stehen" : "Akkumulation läuft");

        const itemProgress = find("[data-demo-item-progress]");
        if (itemProgress) {
            itemProgress.max = duration;
            itemProgress.value = elapsed;
        }

        const sampleProgress = find("[data-demo-sample-progress]");
        if (sampleProgress) {
            sampleProgress.max = sampleInterval;
            sampleProgress.value = sampleElapsed;
        }

        const ring = find("[data-demo-time-ring]");
        if (ring) {
            ring.style.setProperty("--demo-progress", `${timePercent}%`);
            ring.setAttribute("aria-label", `${Math.round(timePercent)} Prozent der Item-Dauer`);
        }

        show(
            "[data-demo-next-sample]",
            finished
                ? "Kein automatischer Item-Wechsel"
                : `Nächstes Sample in ${Math.max(0, sampleInterval - (elapsed % sampleInterval)).toFixed(1)} Sim-Min.`
        );
    }

    function tick(now) {
        if (elapsed >= duration) return;
        elapsed = Math.min(duration, elapsed + (now - lastTick) / simMsPerMinute);
        lastTick = now;

        while (sampleCount < Math.floor(duration / sampleInterval)
            && elapsed + 0.0001 >= (sampleCount + 1) * sampleInterval) {
            addSample((sampleCount + 1) * sampleInterval);
        }

        updateView();
        if (elapsed >= duration) {
            window.clearInterval(timer);
            window.clearInterval(viewerTimer);
        }
    }

    updateView();
    timer = window.setInterval(() => tick(performance.now()), 100);
    viewerTimer = window.setInterval(() => {
        if (elapsed < duration) {
            viewers = randomViewers();
            updateView();
        }
    }, 2500);
})();
