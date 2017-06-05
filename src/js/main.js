var IMG_BG = "assets/img/game-background.jpg";
var STATE_ZERO = 0;
var STATE_INIT = 1;
var STATE_MOVING = 2;
var STATE_CHECK_WIN = 5;
var mainTextSyle = {
    fontFamily: "Arial",
    fontSize: 28,
    fill: 0XFFFFFF,
    fontWeight: "bold"
};
var bigTextSyle = {
    fontFamily: "Arial",
    fontSize: 40,
    fill: 0XFFFFFF,
    fontWeight: "bold"
};
var blueTextStyle = {
    fontFamily: "Arial",
    fontSize: 28,
    fill: 0X0E8E9a,
    fontWeight: "bold"
};
var SLOT_NUMBER = 15;
var TILE_HEIGHT = 252;
var TILE_WIDTH = 300;
var N_CYCLE = 1;
var TOT_TILES = 15;
var gameStatus = 0;
var finalTileY = 0;
var slotSprite = [];
var size = [1920, 1080];
var ratio = size[0] / size[1];
var stage = new PIXI.Stage(0xffffff, true);
var renderer = PIXI.autoDetectRenderer(size[0], size[1], null);
document.body.appendChild(renderer.view);
var viewWidth = (renderer.width / renderer.resolution);
var INITIAL_X = (renderer.width - 1500) / 2;


resize();
//Use Pixi's built-in `loader` object to load an image
PIXI.loader
    .add("assets/img/sprites.json")
    .add(IMG_BG)
    .load(setup);
//This `setup` function will run when the image has loaded
function setup() {
    var texture = PIXI.TextureCache[IMG_BG];
    var bgSprite = new PIXI.Sprite(texture);
    bgSprite.scale.x = 800 / viewWidth;
    bgSprite.scale.y = bgSprite.scale.x;
    stage.addChild(bgSprite);

    //lowerBox rectangle
    var lowerBox = new PIXI.Graphics();
    lowerBox.beginFill(0XD1F1F7);
    lowerBox.drawRect(0, renderer.height - 150, viewWidth, 150);
    stage.addChild(lowerBox);

    id = PIXI.loader.resources["assets/img/sprites.json"].textures;
    backButton = new PIXI.Sprite(id["back-normal.png"]);
    backButton.x = 50;
    backButton.y = 50;
    stage.addChild(backButton);


    //lowerBoxInner rectangle

    var lowerBoxInner = new PIXI.Graphics();
    lowerBoxInner.beginFill(0X0E8E9a);
    lowerBoxInner.drawRect(171, renderer.height - 150, 600, 76);
    stage.addChild(lowerBoxInner);

    //lowerBoxInnerRight rectangle
    var lowerBoxInnerRight = new PIXI.Graphics();
    lowerBoxInnerRight.beginFill(0X0E8E9a);
    lowerBoxInnerRight.drawRect(771, renderer.height - 150, 615, 150);
    stage.addChild(lowerBoxInnerRight);

    logo = new PIXI.Sprite(id["game-logo.png"]);
    logo.position.set(790, 40);
    logo.scale.set(0.75, 0.75);
    stage.addChild(logo);

    payTable = new PIXI.Sprite(id["paytable-normal.png"]);
    payTable.position.set(180, renderer.height - 140);
    payTable.scale.set(0.75, 0.75);
    stage.addChild(payTable);

    sound = new PIXI.Sprite(id["sound-normal.png"]);
    sound.position.set(245, renderer.height - 140);
    sound.scale.set(0.75, 0.75);
    stage.addChild(sound);

    info = new PIXI.Sprite(id["info-normal.png"]);
    info.position.set(180, renderer.height - 65);
    info.scale.set(0.75, 0.75);
    stage.addChild(info);

    quickSpin = new PIXI.Sprite(id["quickspin-normal.png"]);
    quickSpin.position.set(245, renderer.height - 65);
    quickSpin.scale.set(0.75, 0.75);
    stage.addChild(quickSpin);

    spinNormal = new PIXI.Sprite(id["spin-normal.png"]);
    spinNormal.position.set(renderer.width - 120, renderer.height - 120);
    spinNormal.scale.set(0.75, 0.75);
    spinNormal.anchor.set(0.5, 0.5);
    spinNormal.interactive = true;
    spinNormal.buttonMode = true;
    stage.addChild(spinNormal);
    spinNormal.on('pointerdown', startAnimation);

    for (var i = 0; i < SLOT_NUMBER; i++) {
        var randNum = 0;
        randNum = Math.floor(Math.random() * 9);
        slotSprite[i] = new PIXI.TilingSprite(id["symbol" + randNum + ".png"], TILE_WIDTH, TILE_HEIGHT);
        slotId = "symbol" + randNum + ".png";
        slotSprite[i].x = INITIAL_X + (i * 300);
        slotSprite[i].y = 145;
        if (i > 4) {
            slotSprite[i].x = INITIAL_X + ((i - 5) * 300);
            slotSprite[i].y = 145 + 252;
        }
        if (i > 9) {
            slotSprite[i].x = INITIAL_X + ((i - 10) * 300);
            slotSprite[i].y = 145 + (252 * 2);
        }

        stage.addChild(slotSprite[i]);
    }
    autoPlay = new PIXI.Sprite(id["autoplay-normal.png"]);
    autoPlay.position.set(renderer.width - 490, renderer.height - 110);
    autoPlay.scale.set(0.75, 0.75);
    autoPlay.interactive = true;
    autoPlay.buttonMode = true;
    autoPlay.on('pointerdown', autoPlays);
    stage.addChild(autoPlay);

    var autoPlayText = new PIXI.Text("AUTOPLAY", mainTextSyle);
    autoPlayText.position.set(renderer.width - 450, renderer.height - 85);
    stage.addChild(autoPlayText);
    //songName
    var songNameText = new PIXI.Text("EMOTION MESSAGE GOES HERE", mainTextSyle);
    songNameText.position.set(315, renderer.height - 123);
    songNameText.width = 450;
    stage.addChild(songNameText);

    var balanceText = new PIXI.Text("BALANCE", blueTextStyle);
    balanceText.position.set(348, renderer.height - 50);
    stage.addChild(balanceText);

    var totalBetText = new PIXI.Text("TOTAL BET", mainTextSyle);
    totalBetText.position.set(800, renderer.height - 123);
    stage.addChild(totalBetText);

    totalBetDynamic = 0;
    totalBetNum = new PIXI.Text("£ 0", mainTextSyle);
    totalBetNum.position.set(800, renderer.height - 50);
    stage.addChild(totalBetNum);

    plus = new PIXI.Sprite(id["plus-normal.png"]);
    plus.position.set(983, renderer.height - 140);
    plus.scale.set(0.75, 0.75);
    plus.interactive = true;
    plus.buttonMode = true;
    plus.on('pointerdown', incrementBet);
    stage.addChild(plus);

    minus = new PIXI.Sprite(id["minus-normal.png"]);
    minus.position.set(983, renderer.height - 65);
    minus.scale.set(0.75, 0.75);
    minus.interactive = true;
    minus.buttonMode = true;
    minus.on('pointerdown', decrementBet);
    stage.addChild(minus);

    function incrementBet() {

        if (totalBetDynamic < balanceNumDynamic) {
            totalBetDynamic += 100;
        }
        // update the text with a new string
        totalBetNum.text = '£ ' + Math.floor(totalBetDynamic);
        showNumbers();
    }

    function decrementBet() {
        if (totalBetDynamic > 0) {
            totalBetDynamic -= 100;
        }
        // update the text with a new string
        totalBetNum.text = '£ ' + Math.floor(totalBetDynamic);

        showNumbers();
    }

    //totalWin
    var totalWinText = new PIXI.Text("TOTAL WIN", mainTextSyle);
    totalWinText.position.set(1113, renderer.height - 123);
    stage.addChild(totalWinText);
    var totalWinDynamic = totalBetDynamic * 2;
    //totalWinNum
    totalWinNum = new PIXI.Text("£", bigTextSyle);
    totalWinNum.position.set(1082, renderer.height - 73);
    stage.addChild(totalWinNum);


    function showNumbers() {
        renderer.render(stage);
        requestAnimationFrame(showNumbers);

    }

    //BalanceNum

    balanceNumDynamic = 1000;
    balanceNum = new PIXI.Text("£ " + balanceNumDynamic, blueTextStyle);
    balanceNum.position.set(613, renderer.height - 50);
    stage.addChild(balanceNum);
    draw();
    //Render the stage
    renderer.render(stage);
}

function autoPlays() {
    if (gameStatus == 5) {
        setInterval(startAnimation, 2000);
        startAnimation();

    }

}


var win = false;

function startAnimation() {

    if (totalBetDynamic <= balanceNumDynamic && totalBetDynamic > 0) {

        if (gameStatus == STATE_INIT || gameStatus == STATE_CHECK_WIN) {
            finalTileY = 3000;
            gameStatus = STATE_MOVING;
            draw();
        }
    }
}



var INC = 105;

//functions draw
function draw() {
    totalWinNum.text = '£ ' + 0;
    if (gameStatus == STATE_ZERO) {
        gameStatus = STATE_INIT;
    } else
    if (gameStatus == STATE_INIT) {
        gameStatus = STATE_CHECK_WIN;

    } else if (gameStatus == STATE_MOVING) {
        var randWin = 0;
        randWin = Math.floor(Math.random() * 9);

        if (finalTileY > 0) {

            finalTileY = finalTileY - INC;
            for (var i = 0; i < SLOT_NUMBER; i++) {
                var randNum = 0;
                randNum = Math.floor(Math.random() * 10);
                slotSprite[i] = new PIXI.TilingSprite(id["symbol" + randNum + ".png"], TILE_WIDTH, TILE_HEIGHT);
                slotSprite[i].x = INITIAL_X + (i * 300);
                slotSprite[i].y = 145;
                if (i > 4) {
                    if (randWin > 4) {
                        slotSprite[i] = new PIXI.TilingSprite(id["symbol" + randWin + ".png"], TILE_WIDTH, TILE_HEIGHT);
                        win = true;
                    } else {
                        win = false;
                    }
                    slotSprite[i].x = INITIAL_X + ((i - 5) * 300);
                    slotSprite[i].y = 145 + 252;
                }
                if (i > 9) {
                    slotSprite[i] = new PIXI.TilingSprite(id["symbol" + randNum + ".png"], TILE_WIDTH, TILE_HEIGHT);
                    slotSprite[i].x = INITIAL_X + ((i - 10) * 300);
                    slotSprite[i].y = 145 + (252 * 2);
                }
                stage.addChild(slotSprite[i]);
            }


        }
        if (finalTileY <= 0) {
            gameStatus = STATE_CHECK_WIN;

        }

    } else if (gameStatus == STATE_CHECK_WIN) {

        if (win == true) {

            totalWinDynamic = totalBetDynamic * 2;
            totalWinNum.text = '£ ' + Math.floor(totalWinDynamic);
            balanceNumDynamic += totalWinDynamic;
            balanceNum.text = '£ ' + Math.floor(balanceNumDynamic);
            alert("Congratulations, you won!");

        }
        if (win == false) {
            totalWinDynamic = totalBetDynamic;
            balanceNumDynamic -= totalWinDynamic;
            balanceNum.text = '£ ' + Math.floor(balanceNumDynamic);

        }
        if (totalBetDynamic > balanceNumDynamic) {
            totalBetDynamic = 0;
            totalBetNum.text = '£ ' + Math.floor(totalBetDynamic);
        }


        return;
    }
    renderer.render(stage);
    requestAnimationFrame(draw);
}




function resize() {
    if (window.innerWidth / window.innerHeight >= ratio) {
        var w = window.innerHeight * ratio;
        var h = window.innerHeight;
    } else {
        var w = window.innerWidth;
        var h = window.innerWidth / ratio;
    }
    renderer.view.style.width = w + 'px';
    renderer.view.style.height = h + 'px';
}
window.onresize = function(event) {
    resize();
};
