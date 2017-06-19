var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");

//画布背景图片
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
    bgReady = true;
};
bgImage.src = "img/background.jpg"

//青蛙图片
var frogReady = false;
var frogImage = new Image();
frogImage.onload = function() {
    frogReady = true;
};
frogImage.src = "img/frog.png";

//飞虫图片
var wormReady = false;
var wormImage = new Image();
wormImage.onload = function() {
    wormReady = true;
};
wormImage.src = "img/worm.png";

//游戏中各个对象

// 青蛙
var frog = {
    speed: 4.5, //每秒移动的像素

};

//青蛙舌头
var frogTongue = {
    speed: 6.5, //每秒移动的像素
};

//飞虫
var worm = {

}

//游戏
var game = {
    score: 0,
    flag: 0
};

//处理用户按键输入
var keysDown = {
    upBar: false
};

//记录下用户的按下的按键
addEventListener("keydown", function(e) {
    keysDown[e.keyCode] = true;

}, false)

//用户抬起按键时，删除记录的按下按键
addEventListener("keyup", function(e) {
    delete keysDown[e.keyCode];
    if (e.keyCode == 38) { //如果抬起的是↑键，进行青蛙吐舌的操作
        keysDown.upBar = true;
    }


}, false)


//开始一轮新游戏
var reset = function() {

    // ctx.clearRect(0,0,780,585);
    ctx.beginPath(); //为了清除上一次青蛙的舌头绘制线段，必须加这一句

    frog.x = canvas.width / 2 - 30; //青蛙的起始坐标
    frog.y = canvas.height + 2 - 30;

    frogTongue.x = frog.x + 15; //青蛙舌头的起始坐标
    frogTongue.y = canvas.height - 30;

    worm.x = Math.random() * (canvas.width - 35); //飞虫的随机坐标
    worm.y = Math.random() * (canvas.height - 80);

    delete keysDown[37]; //删除上一次游戏可能存储的左右按键状态，避免对重新开始造成影响
    delete keysDown[39];

}

//游戏主体逻辑
var update = function() {
    //用户按的是左移动按键(←)
    if (37 in keysDown) {
        if (frog.x > 0) { //避免移动到画布最左侧以外
            frog.x -= frog.speed;
            frogTongue.x = frog.x + 15; //更新青蛙舌头的坐标

        }
    }
    //用户按的是右移动按键(→)
    if (39 in keysDown) {
        if (frog.x < canvas.width - 32) { //避免移动到画布最右侧以外
            frog.x += frog.speed;
            frogTongue.x = frog.x + 15; //更新青蛙舌头的坐标
        }
    }

    //用户按的是upBar键(↑)
    if (38 in keysDown) {
        if (frogTongue.y > 2) { //避免舌头移出画布上边界
            frogTongue.y -= frogTongue.speed;

            keysDown[37] = null; //禁止此时左右移动按键生效
            keysDown[39] = null;
        }

    }

    if (keysDown.upBar) { //当抬起↑键时
        //当青蛙舌头捕获到飞虫时，得分增加
        if ((frogTongue.x >= worm.x) && (frogTongue.x <= worm.x + 30+1) && (frogTongue.y >= worm.y) && (frogTongue.y <= worm.y + 33 + 2-1)) {//30和33是飞虫的像素宽高，2是画布上边框，1是根据实际效果的修正值
            game.score++;
            game.flag = 1; //捕虫成功标志

        } else {
            game.flag = 2; //捕虫失败标志
           
        }
    }
}

//渲染动画中的所有物体  
var render = function() {
        if (bgReady) { //加载背景图片
            ctx.drawImage(bgImage, 0, 0);
        }

        if (frogReady) { //画青蛙
            ctx.drawImage(frogImage, frog.x, frog.y);
        }

        if (wormReady) { //画飞虫
            ctx.drawImage(wormImage, worm.x, worm.y);
        }

        drowTongue(); //画青蛙舌头
        drowScore(); //画记分牌



    }
    //青蛙舌头的绘制
function drowTongue() {
    if (keysDown.upBar) { //当↑键抬起时开始吐舌
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "red";
        var initY = canvas.height + 2 - 30;
        ctx.moveTo(frogTongue.x, initY);
        ctx.lineTo(frogTongue.x, frogTongue.y );
        keysDown.upBar = false; //重置↑键状态
    }
    ctx.stroke();

}
//游戏得分的绘制
function drowScore() {
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.textAlpha=0.5;
    ctx.fillText("Score: " + game.score, 20, 20);
}

//游戏状态判断
function gameStatus() {
    if (game.flag == 1) {
        game.flag = 0; //恢复游戏状态标志
        setTimeout("reset()", 500);
    } else if (game.flag == 2) {
        game.flag = 0; //恢复游戏状态标志
        
        setTimeout(function() {
            alert("Game Over,"+"Your score is "+game.score);
            game.score = 0; //记分牌清0
            reset();
        }, 100);
    }
}

//游戏主函数
var main = function() {
    update();
    render();
    gameStatus();
    requestAnimationFrame(main); //循环调用主函数
}

//启动游戏
function startGame() {
    var w = window;
    w.requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
    reset();
    main();
}
