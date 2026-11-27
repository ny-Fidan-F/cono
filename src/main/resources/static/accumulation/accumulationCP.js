let backend;
let storage;

function storageChanged() {
    const items = storage.data.items;
    $("#status").text("Status: " + storage.data.run.status);

    $("#items").empty();

    items.forEach((item) => {
        const row = $("<tr>");
        const nameInput = $("<input>").addClass("name").val(item.name);
        nameInput.on("change", () => {
            item.name = nameInput.val();
            backend.pushStorage();
        });
        row.append($("<td>").append(nameInput));

        const durationInput = $("<input>").val(item.durationMin);
        durationInput.on("change", () => {
            item.durationMin = Number(durationInput.val());
            backend.pushStorage();
        });
        row.append($("<td>").append(durationInput));

        const sampleInput = $("<input>").val(item.sampleEveryMin);
        sampleInput.on("change", () => {
            item.sampleEveryMin = Number(sampleInput.val());
            backend.pushStorage();
        });
        row.append($("<td>").append(sampleInput));

        const startAmountInput = $("<input>").val(item.startAmount);
        startAmountInput.on("change", () => {
            item.startAmount = Number(startAmountInput.val());
            backend.pushStorage();
        });
        row.append($("<td>").append(startAmountInput));

        const baseRateInput = $("<input>").val(item.baseRate);
        baseRateInput.on("change", () => {
            item.baseRate = Number(baseRateInput.val());
            backend.pushStorage();
        });
        row.append($("<td>").append(baseRateInput));

        const viewerDivisorInput = $("<input>").val(item.viewerDivisor);
        viewerDivisorInput.on("change", () => {
            item.viewerDivisor = Number(viewerDivisorInput.val());
            backend.pushStorage();
        });
        row.append($("<td>").append(viewerDivisorInput));

        const del = $("<button>").addClass("delete").text("✕");
        del.on("click", () => {
            if (!confirm("Item \"" + item.name + "\" wirklich löschen?")) return;
            storage.data.items = storage.data.items.filter((i) => i.id !== item.id);
            backend.pushStorage();
        });
        row.append($("<td>").append(del));

        $("#items").append(row);
    });
}

function addItem() {
    storage.data.items.push({
        id: "item-" + Date.now(),
        name: "Neues Item",
        icon: "",
        durationMin: 60,
        sampleEveryMin: 5,
        startAmount: 0,
        baseRate: 1,
        viewerDivisor: 0.5
    });
    backend.pushStorage();
}

function start() {
    const run = storage.data.run;
    if (run.status === "stopped") {
        run.status = "running";
        run.itemStartedAt = Date.now();
        run.pausedTotalMs = 0;
    } else if (run.status === "paused") {
        run.pausedTotalMs += Date.now() - run.pausedAt;
        run.pausedAt = null;
        run.status = "running";
    }
    backend.pushStorage();
}

function pause() {
    const run = storage.data.run;
    if (run.status === "running") {
        run.status = "paused";
        run.pausedAt = Date.now();
    }
    backend.pushStorage();
}

function reset() {
    if (!confirm("Alles zurücksetzen?")) return;
    storage.data.run = {
        status: "stopped",
        currentIndex: 0,
        itemStartedAt: null,
        pausedAt: null,
        pausedTotalMs: 0,
        samplesDone: 0,
        amounts: {},
        lastViewerCount: 0
    };
    backend.pushStorage();
}

$(() => {
    storage = new AccumulationStorage(storageChanged);
    backend = new Backend(undefined, storage);
    $("#addItem").click(addItem);
    $("#start").click(start);
    $("#pause").click(pause);
    $("#reset").click(reset);
});
