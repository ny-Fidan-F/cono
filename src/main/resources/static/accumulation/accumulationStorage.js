class AccumulationStorage extends Storage {
    constructor(onDataChanged) {
        super("0ae70ab0-e1cf-415d-95de-16e74e9d6991",
                {
                    items: [
                        {
                            id: "item-1",
                            name: "ISK",
                            icon: "",
                            durationMin: 60,
                            sampleEveryMin: 5,
                            startAmount: 0,
                            baseRate: 1,
                            viewerDivisor: 0.5
                        }
                    ],

                    run: {
                        status: "stopped",
                        currentIndex: 0,
                        itemStartedAt: null,
                        pausedAt: null,
                        pausedTotalMs: 0,
                        samplesDone: 0,
                        amounts: {},
                        lastViewerCount: 0
                    },

                    simulation: {
                        enabled: true,
                        viewerCount: 100
                    }
                },
                onDataChanged);
    }
}
