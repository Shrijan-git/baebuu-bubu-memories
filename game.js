const WORLD_WIDTH = 1600;
const WORLD_HEIGHT = 1200;
const PLAYER_SPEED = 190;
const SAVE_KEY = "baebuu-bubu-memory-quest-save";

const memories = [
    {
        id: "first_ride",
        title: "First Ride & Proposal",
        text: "This was where the beautiful journey truly began.",
        image: "assets/memories/ride.jpg",
        clue: "Begin at the bicycle path where everything started.",
        foundClue: "The next piece waits where the long road meets the bus stop.",
        x: 1360,
        y: 725,
        radius: 62,
        hint: "A soft bell rings near the old bicycle path."
    },
    {
        id: "first_trip",
        title: "First Long Trip",
        text: "The first long trip became one of the favorite chapters.",
        image: "assets/memories/trip.jpg",
        clue: "The next piece waits where the long road meets the bus stop.",
        foundClue: "Find the game corner, but look behind the trees.",
        x: 1295,
        y: 220,
        radius: 58,
        hint: "A travel ticket flutters beside the bus stop."
    },
    {
        id: "daruth_game",
        title: "Daruth Game",
        text: "One of the funniest memories is hidden in the playful corner.",
        image: "assets/memories/daruth.jpg",
        clue: "Find the game corner, but look behind the trees.",
        foundClue: "A quiet hug is hidden where the flowers make a circle.",
        x: 350,
        y: 250,
        radius: 52,
        hint: "Tiny button sounds come from behind the trees."
    },
    {
        id: "long_hug",
        title: "Long Hug",
        text: "Some moments do not need words. This was one of them.",
        image: "assets/memories/hug.jpg",
        clue: "A quiet hug is hidden where the flowers make a circle.",
        foundClue: "The final piece waits near moonlit water.",
        x: 415,
        y: 935,
        radius: 50,
        hint: "The flower circle feels warmer here."
    },
    {
        id: "first_kiss",
        title: "First Kiss",
        text: "A memory that will never be forgotten.",
        image: "assets/memories/kiss.jpg",
        clue: "The final piece waits near moonlit water.",
        foundClue: "All memories are safe in the journal.",
        x: 880,
        y: 245,
        radius: 46,
        hint: "Moonlight sparkles over the water."
    }
];

const state = {
    started: false,
    pausedForMemory: false,
    found: new Set(),
    activeMemoryIndex: 0,
    nearMemory: null,
    mobile: { left: false, right: false, up: false, down: false }
};

let player;
let cursors;
let wasd;
let interactKey;
let hintText;
let sparkle;
let sceneRef;
let music;
let musicBtn;

const config = {
    type: Phaser.AUTO,
    parent: "game",
    backgroundColor: "#6bb7d6",
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: 960,
        height: 640
    },
    physics: {
        default: "arcade",
        arcade: { debug: false }
    },
    scene: { create, update }
};

new Phaser.Game(config);

function create() {
    sceneRef = this;
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    drawWorld(this);
    createMemoryProps(this);
    createPlayer(this);
    createHud(this);
    setupInput(this);
    loadSavedProgress();

    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.startFollow(player, true, 0.12, 0.12);

    updateJournal();
}

function update() {
    if (!state.started || state.pausedForMemory) {
        player.body.setVelocity(0);
        return;
    }

    movePlayer();
    updatePlayerFacing();
    updateNearbyMemory();
    animateSparkle();
}

function drawWorld(scene) {
    scene.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, 0x78bf63);
    drawPath(scene, 120, 685, 1320, 78);
    drawPath(scene, 700, 115, 78, 940);
    drawPath(scene, 190, 335, 450, 70);
    drawPath(scene, 1030, 335, 420, 70);

    scene.add.rectangle(865, 245, 285, 210, 0x5aa6c8).setStrokeStyle(6, 0x386d8c);
    scene.add.rectangle(865, 245, 210, 140, 0x76cde6, 0.65);
    scene.add.rectangle(1285, 192, 230, 110, 0xd74f37).setStrokeStyle(6, 0x722b28);
    scene.add.rectangle(1285, 130, 260, 34, 0xf4bd4f).setStrokeStyle(5, 0x722b28);
    scene.add.text(1190, 180, "BUS STOP", titleText("#fffaf0", 22));

    scene.add.rectangle(325, 235, 260, 180, 0xe9d08e).setStrokeStyle(6, 0x704c30);
    scene.add.rectangle(325, 235, 190, 115, 0xfff5cb);
    scene.add.text(252, 212, "GAME ROOM", titleText("#704c30", 22));

    scene.add.rectangle(1360, 735, 180, 128, 0xb7d7a8).setStrokeStyle(6, 0x3f7d49);
    scene.add.circle(1360, 735, 42, 0x3e5364).setStrokeStyle(8, 0xf7f1dc);
    scene.add.rectangle(1360, 727, 108, 12, 0xf7f1dc);
    scene.add.rectangle(1360, 763, 88, 10, 0xf7f1dc);

    scene.add.circle(415, 935, 135, 0x8fd66e).setStrokeStyle(6, 0xf4bd4f);
    for (let i = 0; i < 16; i += 1) {
        const angle = (Math.PI * 2 * i) / 16;
        scene.add.circle(415 + Math.cos(angle) * 112, 935 + Math.sin(angle) * 88, 12, 0xffd4df);
    }

    addForest(scene);
    addRocks(scene);
    addSign(scene, 1010, 650, "Find clues. Search close.");
    addSign(scene, 190, 760, "Some memories hide behind scenery.");
}

function titleText(color, size) {
    return { fontFamily: "Arial", fontSize: `${size}px`, color, fontStyle: "bold" };
}

function drawPath(scene, x, y, width, height) {
    scene.add.rectangle(x + width / 2, y + height / 2, width, height, 0xc99b62);
    scene.add.rectangle(x + width / 2, y + height / 2, width, height, 0xdfb678, 0.45);
}

function addForest(scene) {
    const trees = [
        [120, 125], [215, 120], [315, 120], [415, 125], [520, 150],
        [105, 315], [190, 278], [465, 300], [555, 285], [1380, 430],
        [1480, 505], [1270, 520], [1440, 650], [1180, 860], [1300, 1000],
        [1040, 1040], [760, 1015], [600, 1080], [225, 1040], [120, 930]
    ];

    trees.forEach(([x, y]) => {
        scene.add.rectangle(x, y + 34, 28, 58, 0x7a4a2b);
        scene.add.circle(x, y, 52, 0x2f8f4e);
        scene.add.circle(x - 24, y + 18, 34, 0x3ca85d);
        scene.add.circle(x + 26, y + 18, 34, 0x277a42);
    });
}

function addRocks(scene) {
    [[985, 440], [1070, 475], [970, 890], [1450, 875], [715, 450], [515, 815]].forEach(([x, y]) => {
        scene.add.ellipse(x, y, 58, 38, 0x81909b).setStrokeStyle(4, 0x4a5660);
    });
}

function addSign(scene, x, y, text) {
    scene.add.rectangle(x, y, 16, 64, 0x704c30);
    scene.add.rectangle(x, y - 38, 190, 54, 0xfff5cb).setStrokeStyle(4, 0x704c30);
    scene.add.text(x - 78, y - 51, text, {
        fontFamily: "Arial",
        fontSize: "15px",
        color: "#704c30",
        fontStyle: "bold",
        wordWrap: { width: 156 }
    });
}

function createMemoryProps(scene) {
    memories.forEach((memory, index) => {
        const marker = scene.add.container(memory.x, memory.y);
        marker.add(scene.add.circle(0, 0, 12, 0xffffff, 0.18));
        marker.add(scene.add.star(0, 0, 5, 6, 18, 0xf7d35d, index === 0 ? 0.45 : 0.08));
    });

    sparkle = scene.add.star(0, 0, 6, 6, 24, 0xfff5a8, 0.95);
    sparkle.setVisible(false);
}

function createPlayer(scene) {
    player = scene.add.container(185, 720);
    const shadow = scene.add.ellipse(0, 34, 40, 12, 0x000000, 0.22);
    const hairBack = scene.add.ellipse(0, -37, 58, 62, 0x3d241c);
    const neck = scene.add.rectangle(0, -18, 12, 12, 0xf4c7a1);
    const armLeft = scene.add.rectangle(-24, 5, 9, 34, 0xf4c7a1).setAngle(-18);
    const armRight = scene.add.rectangle(24, 5, 9, 34, 0xf4c7a1).setAngle(18);
    const dress = scene.add.triangle(0, 16, -24, 42, 24, 42, 0, -18, 0xd83f6a).setStrokeStyle(3, 0x7c2341);
    const face = scene.add.circle(0, -38, 24, 0xf6c6a8).setStrokeStyle(3, 0x6b392d);
    const hairLeft = scene.add.circle(-20, -35, 18, 0x3d241c);
    const hairRight = scene.add.circle(20, -35, 18, 0x3d241c);
    const bang = scene.add.triangle(-7, -58, -28, -42, 8, -44, -2, -20, 0x3d241c);
    const eyeLeft = scene.add.circle(-8, -38, 3, 0x18202f);
    const eyeRight = scene.add.circle(9, -38, 3, 0x18202f);
    const smile = scene.add.arc(1, -31, 8, 0, 180, false, 0x8e3b4f, 1);
    const shoeLeft = scene.add.rectangle(-10, 44, 16, 8, 0x24324d);
    const shoeRight = scene.add.rectangle(12, 44, 16, 8, 0x24324d);

    player.add([shadow, hairBack, neck, armLeft, armRight, dress, face, hairLeft, hairRight, bang, eyeLeft, eyeRight, smile, shoeLeft, shoeRight]);
    player.setSize(42, 72);
    scene.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);
    player.body.setSize(36, 52);
    player.body.setOffset(-18, -18);
}

function createHud(scene) {
    hintText = scene.add.text(0, 0, "", {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#fffaf0",
        backgroundColor: "#18202f",
        padding: { x: 10, y: 6 }
    });
    hintText.setScrollFactor(0);
    hintText.setDepth(50);
    hintText.setVisible(false);
}

function setupInput(scene) {
    cursors = scene.input.keyboard.createCursorKeys();
    wasd = scene.input.keyboard.addKeys("W,A,S,D");
    interactKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    interactKey.on("down", collectNearbyMemory);

    document.getElementById("searchBtn").addEventListener("click", collectNearbyMemory);
    document.getElementById("journalToggle").addEventListener("click", () => document.getElementById("journalPanel").classList.add("open"));
    document.getElementById("closeJournalBtn").addEventListener("click", () => document.getElementById("journalPanel").classList.remove("open"));

    ["left", "right", "up", "down"].forEach((direction) => {
        const button = document.getElementById(direction);
        button.addEventListener("pointerdown", () => state.mobile[direction] = true);
        button.addEventListener("pointerup", () => state.mobile[direction] = false);
        button.addEventListener("pointerleave", () => state.mobile[direction] = false);
        button.addEventListener("pointercancel", () => state.mobile[direction] = false);
    });
}

function movePlayer() {
    let vx = 0;
    let vy = 0;

    if (cursors.left.isDown || wasd.A.isDown || state.mobile.left) vx -= 1;
    if (cursors.right.isDown || wasd.D.isDown || state.mobile.right) vx += 1;
    if (cursors.up.isDown || wasd.W.isDown || state.mobile.up) vy -= 1;
    if (cursors.down.isDown || wasd.S.isDown || state.mobile.down) vy += 1;

    const vector = new Phaser.Math.Vector2(vx, vy);
    if (vector.length() > 0) vector.normalize().scale(PLAYER_SPEED);
    player.body.setVelocity(vector.x, vector.y);
}

function updatePlayerFacing() {
    if (player.body.velocity.x < -10) player.setScale(-1, 1);
    if (player.body.velocity.x > 10) player.setScale(1, 1);
}

function updateNearbyMemory() {
    const memory = memories[state.activeMemoryIndex];
    if (!memory || state.found.has(memory.id)) {
        state.nearMemory = null;
        hintText.setVisible(false);
        sparkle.setVisible(false);
        return;
    }

    const distance = Phaser.Math.Distance.Between(player.x, player.y, memory.x, memory.y);
    if (distance < memory.radius) {
        state.nearMemory = memory;
        hintText.setText(`${memory.hint} Press E or Search.`);
        showHintAndSparkle(memory);
    } else if (distance < 180) {
        state.nearMemory = null;
        hintText.setText(memory.hint);
        showHintAndSparkle(memory);
    } else {
        state.nearMemory = null;
        hintText.setVisible(false);
        sparkle.setVisible(false);
    }
}

function showHintAndSparkle(memory) {
    hintText.setPosition(18, sceneRef.scale.height - 54);
    hintText.setVisible(true);
    sparkle.setPosition(memory.x, memory.y - 28);
    sparkle.setVisible(true);
}

function animateSparkle() {
    if (!sparkle.visible) return;
    sparkle.rotation += 0.04;
    sparkle.scale = 0.85 + Math.sin(sceneRef.time.now / 140) * 0.12;
}

function collectNearbyMemory() {
    if (!state.started || state.pausedForMemory || !state.nearMemory) return;

    const memory = state.nearMemory;
    state.found.add(memory.id);
    state.activeMemoryIndex += 1;
    state.pausedForMemory = true;
    player.body.setVelocity(0);
    showMemory(memory);
    saveProgress();
    updateJournal();
}

function showMemory(memory) {
    document.getElementById("memoryCard").hidden = false;
    document.getElementById("memoryStep").textContent = `Piece ${state.found.size} of ${memories.length}`;
    document.getElementById("memoryTitle").textContent = memory.title;
    document.getElementById("memoryText").textContent = memory.text;
    const image = document.getElementById("memoryImage");
    image.src = memory.image;
    image.alt = memory.title;
}

function closeMemory() {
    document.getElementById("memoryCard").hidden = true;
    state.pausedForMemory = false;

    if (state.found.size === memories.length) {
        setTimeout(showEnding, 500);
    }
}

function showEnding() {
    state.started = false;
    document.getElementById("endingScreen").hidden = false;
}

function saveProgress() {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ found: [...state.found] }));
}

function loadSavedProgress() {
    try {
        const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
        if (!saved || !Array.isArray(saved.found)) return;
        state.found = new Set(saved.found.filter((id) => memories.some((memory) => memory.id === id)));
        state.activeMemoryIndex = memories.findIndex((memory) => !state.found.has(memory.id));
        if (state.activeMemoryIndex === -1) state.activeMemoryIndex = memories.length;
    } catch (error) {
        localStorage.removeItem(SAVE_KEY);
    }
}

function clearProgress() {
    localStorage.removeItem(SAVE_KEY);
    state.found.clear();
    state.activeMemoryIndex = 0;
    state.nearMemory = null;
    state.pausedForMemory = false;
    player.setPosition(185, 720);
    updateJournal();
}

function updateJournal() {
    const memoryCount = document.getElementById("memoryCount");
    const clueText = document.getElementById("clueText");
    const journalList = document.getElementById("journalList");

    memoryCount.textContent = `${state.found.size}/${memories.length}`;
    journalList.innerHTML = "";

    memories.forEach((memory, index) => {
        const item = document.createElement("li");
        const found = state.found.has(memory.id);
        item.className = found ? "found" : "locked";
        item.textContent = found ? memory.title : `Locked piece ${index + 1}`;
        journalList.appendChild(item);
    });

    const active = memories[state.activeMemoryIndex];
    const lastFound = memories[state.activeMemoryIndex - 1];
    clueText.textContent = active ? active.clue : (lastFound ? lastFound.foundClue : "All memories are safe.");
}

function restartGame() {
    state.found.clear();
    state.activeMemoryIndex = 0;
    state.nearMemory = null;
    state.pausedForMemory = false;
    state.started = true;
    player.setPosition(185, 720);
    localStorage.removeItem(SAVE_KEY);
    document.getElementById("endingScreen").hidden = true;
    updateJournal();
}

document.getElementById("startBtn").addEventListener("click", () => {
    state.started = true;
    document.getElementById("startScreen").hidden = true;
    music.play().catch(() => {});
});

document.getElementById("newGameBtn").addEventListener("click", () => {
    clearProgress();
    state.started = true;
    document.getElementById("startScreen").hidden = true;
    music.play().catch(() => {});
});

document.getElementById("continueBtn").addEventListener("click", closeMemory);
document.getElementById("closeMemoryBtn").addEventListener("click", closeMemory);
document.getElementById("restartBtn").addEventListener("click", restartGame);

music = document.getElementById("bgMusic");
musicBtn = document.getElementById("musicBtn");
musicBtn.addEventListener("click", () => {
    if (music.paused) {
        music.play().catch(() => {});
        musicBtn.textContent = "Stop Music";
    } else {
        music.pause();
        musicBtn.textContent = "Play Music";
    }
});
