let backend;
let storage;

function storageChanged() {
    const items = storage.data.items;

    $("#items").empty();

    items.forEach((item) => {
        const row = $("<tr>");
        row.append($("<td>").text(item.name));
        row.append($("<td>").text(item.durationMin));
        row.append($("<td>").text(item.sampleEveryMin));
        row.append($("<td>").text(item.startAmount));
        row.append($("<td>").text(item.baseRate));
        row.append($("<td>").text(item.viewerDivisor));
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

$(() => {
    storage = new AccumulationStorage(storageChanged);
    backend = new Backend(undefined, storage);
    $("#addItem").click(addItem);
});
