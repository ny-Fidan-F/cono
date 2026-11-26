(() => {
    const settings = {
        durationMinutes: 15,
        sampleIntervalMinutes: 3,
        millisecondsPerSimulationMinute: 2000,
        viewerMinimum: 20,
        viewerMaximum: 180,
        baseRate: 2,
        viewerDivider: 50
    };

    window.startAccumulationSimulation = function ({ widget, render }) {
        if (!widget || typeof render !== "function") return;

        const prototypeId = widget.dataset.prototypeId;
        const storageKey = `collab2.${prototypeId}.state`;
        const channel = "BroadcastChannel" in window
            ? new BroadcastChannel(`collab2.${prototypeId}`)
            : null;

        let elapsedMinutes = 7;
        let sampleElapsedMinutes = 2;
        let sampleCount = 2;
        let accumulatedValue = 38.5;
        let viewerCount = 124;
        let lastTick = performance.now();
        let lastPublishedAt = 0;
        let clock;
        let viewerClock;

        function fitWidget() {
            const scale = Math.min(
                1,
                window.innerWidth / Number(widget.dataset.widgetWidth),
                window.innerHeight / Number(widget.dataset.widgetHeight)
            );
            widget.style.transform = `scale(${scale})`;
        }

        function randomViewers() {
            return Math.floor(Math.random() * (settings.viewerMaximum - settings.viewerMinimum + 1))
                + settings.viewerMinimum;
        }

        function addSample() {
            const increase = settings.baseRate * (1 + viewerCount / settings.viewerDivider);
            accumulatedValue = Math.round((accumulatedValue + increase) * 100) / 100;
            sampleCount += 1;
        }

        function buildState() {
            const finished = elapsedMinutes >= settings.durationMinutes;
            const visibleSampleElapsed = finished
                && sampleCount >= Math.floor(settings.durationMinutes / settings.sampleIntervalMinutes)
                ? settings.sampleIntervalMinutes
                : sampleElapsedMinutes;

            return {
                viewerCount,
                elapsedMinutes,
                sampleElapsedMinutes: visibleSampleElapsed,
                sampleCount,
                accumulatedValue,
                durationMinutes: settings.durationMinutes,
                sampleIntervalMinutes: settings.sampleIntervalMinutes,
                durationProgress: Math.min(100, elapsedMinutes / settings.durationMinutes * 100),
                sampleProgress: Math.min(100, visibleSampleElapsed / settings.sampleIntervalMinutes * 100),
                nextSampleSeconds: Math.max(0, Math.ceil(
                    (settings.sampleIntervalMinutes - visibleSampleElapsed)
                    * settings.millisecondsPerSimulationMinute / 1000
                )),
                finished
            };
        }

        function publishState(state, now, force = false) {
            if (!force && now - lastPublishedAt < 500) return;
            lastPublishedAt = now;

            try {
                localStorage.setItem(storageKey, JSON.stringify(state));
            } catch (error) {
                // The simulation still works when browser storage is unavailable.
            }
            channel?.postMessage(state);
        }

        function update(now, forcePublish = false) {
            const state = buildState();
            render(state);
            publishState(state, now, forcePublish);
        }

        function tick(now) {
            if (elapsedMinutes >= settings.durationMinutes) return;

            const deltaMinutes = (now - lastTick) / settings.millisecondsPerSimulationMinute;
            elapsedMinutes = Math.min(settings.durationMinutes, elapsedMinutes + deltaMinutes);
            sampleElapsedMinutes += deltaMinutes;
            lastTick = now;

            while (sampleCount < Math.floor(settings.durationMinutes / settings.sampleIntervalMinutes)
                && sampleElapsedMinutes + 0.0001 >= settings.sampleIntervalMinutes) {
                sampleElapsedMinutes -= settings.sampleIntervalMinutes;
                addSample();
            }

            if (elapsedMinutes >= settings.durationMinutes) {
                window.clearInterval(clock);
                window.clearInterval(viewerClock);
            }
            update(now, elapsedMinutes >= settings.durationMinutes);
        }

        fitWidget();
        window.addEventListener("resize", fitWidget);
        update(performance.now(), true);

        clock = window.setInterval(() => tick(performance.now()), 100);
        viewerClock = window.setInterval(() => {
            if (elapsedMinutes < settings.durationMinutes) {
                viewerCount = randomViewers();
                update(performance.now(), true);
            }
        }, 2500);
    };
})();
