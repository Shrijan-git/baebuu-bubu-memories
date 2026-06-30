let player;
let cursors;
let memoriesFound = 0;
let memoryText;
let memoryShown = false;
let tripShown = false;
let daruthShown = false;
let hugShown = false;
let kissShown = false;
let mobileLeft = false;
let mobileRight = false;
let mobileUp = false;
let mobileDown = false;
let hearts = [];
function showMemory(title, text, image){

    document.getElementById(
        "memory-card"
    ).style.display = "block";

    document.querySelector(
        "#memory-card h2"
    ).innerText = title;

    document.getElementById(
        "memory-text"
    ).innerText = text;

    document.getElementById(
        "memory-image"
    ).src = image;
}

function closeMemory(){
    document.getElementById(
        "memory-card"
    ).style.display = "none";
}
const config = {
    type: Phaser.AUTO,

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },

    backgroundColor: '#87CEEB',

    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },

    scene: {
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function create() {

    // Background
    // Main grass area
this.add.rectangle(
    400,
    300,
    800,
    600,
    0x7EC850
);
for(let i=0;i<8;i++){

    this.add.text(
        50 + i*90,
        520,
        '🌳',
        {
            fontSize:'40px'
        }
    );
}
for(let i=0;i<10;i++){

    this.add.text(
        Math.random()*700,
        Math.random()*500,
        '🌸',
        {
            fontSize:'24px'
        }
    );
}


    // Title
    this.add.text(
    180,
    20,
    '🖤💙🖤 Baebuu & Bubu: Our Memories 🖤💙🖤',
    {   
        fontSize:'28px',
        color:'#000'
    }
);
    memoryText = this.add.text(
        20,
        20,
        'Memories: 0/5',
        {
            fontSize: '24px',
            color: '#000'
        }
    );
    // First Kiss memory
   

this.add.rectangle(400,100,70,70,0xffffff,0.15);

this.add.text(
    400,
    100,
    '💋',
    {fontSize:'36px'}
).setOrigin(0.5);
    // Long Hug memory


this.add.rectangle(150,500,70,70,0xffffff,0.15);

this.add.text(
    150,
    500,
    '🤗',
    {fontSize:'36px'}
).setOrigin(0.5);
    // Daruth Game memory

this.add.rectangle(150,100,70,70,0xffffff,0.15);

this.add.text(
    150,
    100,
    '🎮',
    {fontSize:'36px'}
).setOrigin(0.5);
    // Bike memory

this.add.rectangle(650,300,70,70,0xffffff,0.15);

this.add.text(
    650,
    300,
    '🚲',
    {fontSize:'36px'}
).setOrigin(0.5);
    // Long trip location
    

this.add.rectangle(650,100,70,70,0xffffff,0.15);

this.add.text(
    650,
    100,
    '🚌',
    {fontSize:'36px'}
).setOrigin(0.5);
    // Player
    player = this.add.rectangle(100, 300, 50, 50, 0xff0000);

    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();

    // Instructions
    this.add.text(
        20,
        550,
        'Move to the bike memory',
        {
            fontSize: '20px',
            color: '#000'
        }
    );
    // Create floating hearts
for(let i = 0; i < 20; i++){

    let heart = this.add.text(
        Math.random() * 800,
        Math.random() * 600,
        '💙🖤',
        {
            fontSize: '18px'
        }
    );

    hearts.push(heart);
}
    document.getElementById("left")
.onpointerdown = () => mobileLeft = true;
document.getElementById("left")
.onpointerup = () => mobileLeft = false;

document.getElementById("right")
.onpointerdown = () => mobileRight = true;
document.getElementById("right")
.onpointerup = () => mobileRight = false;

document.getElementById("up")
.onpointerdown = () => mobileUp = true;
document.getElementById("up")
.onpointerup = () => mobileUp = false;

document.getElementById("down")
.onpointerdown = () => mobileDown = true;
document.getElementById("down")
.onpointerup = () => mobileDown = false;
}

function update() {

    player.body.setVelocity(0);

    if (cursors.left.isDown) {
        player.body.setVelocityX(-200);
    }

    if (cursors.right.isDown) {
        player.body.setVelocityX(200);
    }

    if (cursors.up.isDown) {
        player.body.setVelocityY(-200);
    }

    if (cursors.down.isDown) {
        player.body.setVelocityY(200);
    }
    if (mobileLeft)
    player.body.setVelocityX(-200);

if (mobileRight)
    player.body.setVelocityX(200);

if (mobileUp)
    player.body.setVelocityY(-200);

if (mobileDown)
    player.body.setVelocityY(200);
// Animate hearts
for(let heart of hearts){

    heart.y -= 0.3;

    if(heart.y < -20){

        heart.y = 620;
        heart.x = Math.random() * 800;
    }
}
    if (!memoryShown &&
    player.x > 600 &&
    player.x < 700 &&
    player.y > 250 &&
    player.y < 350) {

    memoryShown = true;
memoriesFound++;

memoryText.setText(
    'Memories: ' + memoriesFound + '/5'
);

showMemory(
    "🖤💙🖤 First Ride & Proposal🖤💙🖤",
    "This was where our beautiful journey truly began.",
    "assets/memories/ride.jpg"
);
    }
    if (memoryShown &&
    !tripShown &&
    player.x > 600 &&
    player.x < 700 &&
    player.y > 50 &&
    player.y < 150
) {
    tripShown = true;
memoriesFound++;

memoryText.setText(
    'Memories: ' + memoriesFound + '/5'
);

showMemory(
    "🚌 First Long Trip",
    "Our first long trip together became one of our favorite memories.",
    "assets/memories/trip.jpg"
);
    }
    if (tripShown &&
    !daruthShown &&
    player.x > 100 &&
    player.x < 200 &&
    player.y > 50 &&
    player.y < 150
) {
    daruthShown = true;

    memoriesFound++;

    memoryText.setText(
        'Memories: ' + memoriesFound + '/5'
    );

    showMemory(
        "🎮 Daruth Game",
        "One of our funniest and most memorable moments together.",
        "assets/memories/daruth.jpg"
    );
}
if (daruthShown &&
    !hugShown &&
    player.x > 100 &&
    player.x < 200 &&
    player.y > 450 &&
    player.y < 550
) {
    hugShown = true;

    memoriesFound++;

    memoryText.setText(
        'Memories: ' + memoriesFound + '/5'
    );

    showMemory(
        "🤗 Long Hug",
        "Some moments don't need words. This was one of them.",
        "assets/memories/hug.jpg"
    );
}
if (hugShown &&
    !kissShown &&
    player.x > 350 &&
    player.x < 450 &&
    player.y > 50 &&
    player.y < 150
) {
    kissShown = true;

    memoriesFound++;

    memoryText.setText(
        'Memories: ' + memoriesFound + '/5'
    );

    showMemory(
        "💋 First Kiss",
        "A memory we'll never forget.",
        "assets/memories/kiss.jpg"
    );

    setTimeout(() => {
        showEnding();
    }, 3000);
}
}
function showEnding() {
    document.body.innerHTML = `
        <div style="
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            height:100vh;
            background:#111;
            color:white;
            text-align:center;
            font-family:Arial;
            padding:20px;
        ">
            <h1>🖤💙🖤 Baebuu & Bubu 🖤💙🖤</h1>
            <h2>You found all 5 memories!</h2>
            <p>
                Thank you for every ride, every trip,
                every laugh, every hug, and every kiss.
            </p>
            <p>
                Our story isn't over yet...
            </p>
            <h2>🖤💙🖤 To be continued 🖤💙🖤</h2>
        </div>
    `;
}
const music =
    document.getElementById(
        "bgMusic"
    );

const musicBtn =
    document.getElementById(
        "musicBtn"
    );

musicBtn.onclick =
function(){

    if(music.paused){

        music.play();

        musicBtn.innerHTML =
            "🔇 Stop Music";

    }else{

        music.pause();

        musicBtn.innerHTML =
            "🎵 Play Music";
    }
}
document
.getElementById("startBtn")
.onclick = function(){

    document
    .getElementById("startScreen")
    .style.display = "none";

    music.play();

};