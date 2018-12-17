import StarItem_Compontent from "./StarItem_Compontent";
import GameUtils from "./GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {

    @property({
        type: cc.Label,
        displayName: "当前关卡得分",
    })
    curLevelScore: cc.Label = null;

    @property({
        type: cc.Label,
        displayName: "消除得分",
    })
    curLevelPopScore: cc.Label = null;

    @property({
        type: cc.Label,
        displayName: "点击可以获得分数",
    })
    otherscore: cc.Label = null;
    @property({
        type: cc.Node,
        displayName: "popscore",
    })
    popscore: cc.Node = null;

    @property({
        type: cc.Node,
        displayName: "Content",
    })
    content: cc.Node = null;


    @property({
        type: cc.Prefab,
        displayName: "预制体",
    })
    starPrefab: cc.Prefab = null;

    // @property({
    //     type: cc.Node,
    //     displayName: "返回主界面",
    // })
    // returnMain: cc.Node = null;

    @property({
        type: cc.ParticleAsset,
        displayName: "粒子文件",
    })
    particle: cc.ParticleFire = null;

    @property({
        type: cc.Texture2D,
        displayName: "蓝色",
    })
    blue: cc.Texture2D = null;

    @property({
        type: cc.Texture2D,
        displayName: "黄色",
    })
    yellow: cc.Texture2D = null;

    @property({
        type: cc.Texture2D,
        displayName: "绿色",
    })
    green: cc.Texture2D = null;

    @property({
        type: cc.Texture2D,
        displayName: "红色",
    })
    red: cc.Texture2D = null;

    @property({
        type: cc.Texture2D,
        displayName: "紫色",
    })
    purple: cc.Texture2D = null;

    @property({
        type: cc.SpriteFrame,
        displayName: "蓝色",
    })
    blue_sp: cc.SpriteFrame = null;

    @property({
        type: cc.SpriteFrame,
        displayName: "黄色",
    })
    green_sp: cc.SpriteFrame = null;

    @property({
        type: cc.SpriteFrame,
        displayName: "绿色",
    })
    yellow_sp: cc.SpriteFrame = null;

    @property({
        type: cc.SpriteFrame,
        displayName: "红色",
    })
    red_sp: cc.SpriteFrame = null;

    @property({
        type: cc.SpriteFrame,
        displayName: "紫色",
    })
    purple_sp: cc.SpriteFrame = null;


    @property({
        type: cc.Node,
        displayName: "进度条",
    })
    progressB: cc.Node = null;


    @property({
        type: cc.Node,
        displayName: "粒子播放位置",
    })
    particleNode: cc.Node = null;


    //星星的类型
    starType;

    //是否过关
    isok;

    // 网格数据 类型
    gridData = [[]];
    // 网格星星ui
    gridStarUi = [[]];

    //选中状态
    selected;
    //总分数
    totalScore;
    //相连的星星
    connectStars;
    //星星的行数
    len;

    //当前关卡的分数
    curlevelNum = 0;

    //当前已经消除的分数
    curlevelPopNum = 0;

    //要消除的类型
    popType;

    onLoad() {
        this.initView();
        this.initData();
        let self = this;
        this.content.on(cc.Node.EventType.TOUCH_START, function (e) {
            let pos = self.content.convertToNodeSpace(e.touch.getLocation());
            self.touchStar(parseInt(pos.x / (self.content.width / self.len) + ""), parseInt(pos.y / (self.content.height / self.len) + ""));
        });
        // this.returnMain.on(cc.Node.EventType.TOUCH_END, () => {
        //     cc.director.loadScene("MainScene");
        // }, this);
    }

    private calcRandomNumber() {
        let num = Math.random() * 100;
        if (num <= 20) {
            return 1;
        } else if (num <= 40 && num > 20) {
            return 2;
        } else if (num <= 60 && num > 40) {
            return 3;
        } else if (num <= 80 && num > 60) {
            return 4;
        } else if (num <= 100 && num > 80) {
            return 5;
        }
        //return num%5;
    }

    //开始游戏
    private startgame(): void {

    }

    initView() {
        this.initStatus();
        this.initGrid();
        // Comm.calcTargetStr()
        // this.targetButtonClick();
        // this.updateTargetLabel();
    }

    //记录以往成绩
    private initData() {

    }

    // 初始化状态变量
    private initStatus(): void {

        // 是否在选中状态
        this.selected = false;
        // 总分
        this.totalScore = 0;

        //是否相连
        this.connectStars = [];
    }


    // 生成网格
    private initGrid(): void {

        this.len = GameUtils.gridSize;

        // 清空原来的
        // if (this.gridStarUi) {
        //     for (let x = 0; x < this.len; x++) {
        //         for (let y = 0; y < this.len; y++) {
        //             if (this.gridStarUi[x][y]) {
        //                 this.gridStarUi[x][y].destroy();
        //             }
        //         }
        //     }
        // }

        // 网格数据  星星的颜色类型
        this.gridData = [];
        // 网格星星ui  星星
        this.gridStarUi = [];
        for (let i = 0; i < this.len; i++) {
            //生成数组
            this.gridData[i] = [];
            this.gridStarUi[i] = [];
            for (let j = 0; j < this.len; j++) {
                let star = cc.instantiate(this.starPrefab);
                let starClass = star.getComponent(StarItem_Compontent);
                star.parent = this.content;
                starClass.setGridXY(i, j);
                let rnd = this.calcRandomNumber();
                starClass.setType(rnd);
                this.curlevelNum += rnd * 10;
                // starClass.setLabel(i * this.len + j);
                // star.name = i * this.len + j + "";
                this.gridData[i][j] = rnd;
                this.gridStarUi[i][j] = star;
            }
        }
        this.setCurLevelNUm();
    }

    touchStar(x, y) {
        // this.popOtherStar(x, y);
        if (this.selected) {
            // 如果点击了已被选中的星星
            if (this.connectContain(x, y)) {
                //消除星星
                this.cleanOnce(x, y);
                //检查是否还能消除
                this.checkOVer();
                //清除状态
                this.selected = false;
                //隐藏分数
                this.popscore.active = false;
            } else {
                // 如果点击了未被选中的星星
                this.setConnectStarSelect(false);
                //重新检查
                this.touchStar(x, y);
            }
        } else {
            //不存在
            if (this.gridData[x][y] == 0) { return; }
            // 相连的星星
            this.connectStars = [[x, y]];
            console.log(this.connectStars);
            console.log(this.connectStars.length);
            console.log(this.connectStars[0]);

            this.checkStar(x, y);
            if (this.connectStars.length >= 2) {
                //点击取消或选中
                this.setConnectStarSelect(true);
                //点击目标得分
                this.targetButtonClick(x, y);
            }
        }
    }

    // 选中或取消选中，相连的星星
    setConnectStarSelect(selected) {
        for (let i = this.connectStars.length - 1; i >= 0; i--) {
            let star = this.connectStars[i];
            this.gridStarUi[star[0]][star[1]].getComponent(StarItem_Compontent).setSelected(selected);
        }
        this.selected = selected;
    }


    //递归查找相连的星星
    checkStar(x, y) {
        let starType = this.gridData[x][y];
        //点击的星星的上下左右
        let scanStar = [[x + 1, y], [x - 1, y], [x, y - 1], [x, y + 1]];
        for (let i = scanStar.length - 1; i >= 0; i--) {
            scanStar[i]
            let scanX = scanStar[i][0];
            let scanY = scanStar[i][1];
            //判断是否在可消除范围内
            let isin = this.isinGrid(scanX, scanY);
            //判断相连数组里是否有该坐标
            let isconnect = this.connectContain(scanX, scanY);
            if (isin && this.gridData[scanX][scanY] == starType && !isconnect) {
                console.log(this.connectStars.length);
                this.connectStars[this.connectStars.length] = [scanX, scanY];
                this.checkStar(scanX, scanY);
            }
        }
    }

    //判断是否在网格里
    isinGrid(x, y) {
        return x >= 0 && x < this.len && y >= 0 && y < this.len;
    }

    // 相连数组里是否有该坐标
    connectContain(x, y) {
        // console.log(this.connectStars);
        for (let i = this.connectStars.length - 1; i >= 0; i--) {
            let star = this.connectStars[i];
            if (star[0] == x && star[1] == y) {
                return true;
            }
        }
        return false;
    }

    //清除星星
    cleanOnce(x, y) {
        //计算分数
        this.calcCurtNum();
        // 清除星星
        this.clearConnectStar();
        // 让星星下落
        this.fallDownStar();
        // 让星星往左靠
        this.fallLeftStar();
        //检查是否还能继续消除
        if (this.checkOVer()) {
            cc.log("不能往下消除了!!!");
            let num = this.checkCount();
            let labelno = new cc.Node();
            let lab = labelno.addComponent(cc.Label);
            lab.string = "还剩下:" + num + "个星星";
            labelno.parent = this.content;
            cc.log("还剩下===" + num);
            //清除不了的裂开粒子效果
            this.scheduleOnce(() => {
                this.startClearNoPopStareffect();
            }, 1);
            //回到主场景
            this.scheduleOnce(() => {
                // this.startClearNoPopStareffect();
                cc.director.loadScene("MainScene");
            }, 2);
        }
    }

    //清除相连数组里的星星
    clearConnectStar() {
        for (let i = this.connectStars.length - 1; i >= 0; i--) {
            let star = this.connectStars[i];
            //特效
            this.stareffect(star, star[0], star[1]);
            this.popType = this.gridData[star[0]][star[1]];
            this.gridData[star[0]][star[1]] = 0;
            this.gridStarUi[star[0]][star[1]].destroy();
        }

        //添加你很棒棒哦特效
        if (this.connectStars.length >= 5) {
            let no = new cc.Node();
            no.addComponent(cc.Label).string = "你很棒棒哦!"
            this.node.addChild(no);
            no.runAction(cc.blink(2, 10));
            this.scheduleOnce(() => {
                no.destroy();
            }, 3);
        }
    }

    stareffect(star, x, y) {
        //粒子特效
        let no = new cc.Node();
        no.position = this.gridStarUi[star[0]][star[1]].position;
        no.parent = this.content;

        //动作特效
        let no2 = new cc.Node();
        no2.position = this.gridStarUi[star[0]][star[1]].position;
        no2.parent = this.content;

        let part = no.addComponent(cc.ParticleSystem);
        let sp = no2.addComponent(cc.Sprite);

        let pos = this.curLevelPopScore.node.position;
        let movex = pos.x + this.progressB.getContentSize().width;

        no2.runAction(cc.sequence(cc.moveTo(0.7, pos), cc.callFunc(() => {
            let action = cc.sequence(cc.scaleTo(0.2, 1.2, 1.2), cc.scaleTo(0.2, 1, 1), cc.callFunc(() => {
                this.updateTargetLabel(x, y);
            }))
            this.curLevelPopScore.node.runAction(action);
        }), cc.callFunc(() => {
            no2.destroy();
        })));

        part.file = this.particle;
        part.custom = true;
        part.particleCount = 4;
        part.emissionRate = 50;
        part.angle = 270;
        part.startSize = 60;
        part.angleVar = 90;
        part.duration = 0.1;
        switch (this.gridData[star[0]][star[1]]) {
            case 1:
                part.texture = this.blue;
                sp.spriteFrame = this.blue_sp;
                break;
            case 2:
                part.texture = this.yellow;
                sp.spriteFrame = this.yellow_sp;
                break;
            case 3:
                part.texture = this.green;
                sp.spriteFrame = this.green_sp;
                break;
            case 4:
                part.texture = this.red;
                sp.spriteFrame = this.red_sp;
                break;
            case 5:
                part.texture = this.purple;
                sp.spriteFrame = this.purple_sp;
                break;
        }
        no2.setContentSize(60, 60);
        no.getComponent(cc.ParticleSystem).playOnLoad = true;
    }

    // 让星星下落
    fallDownStar() {
        // 遍历每一列
        for (let x = 0; x < this.len; x++) {
            // 下落的距离
            let fallDistance = 0;
            // 从下往上，遍历每一个星星
            for (let y = 0; y < this.len; y++) {
                // 如果是空，则增加一个下落距离
                if (this.gridData[x][y] == 0) {
                    fallDistance++;
                }
                // 如果需要下落且当前不是空，就记录到下落数组里
                if (fallDistance > 0 && this.gridData[x][y] > 0) {
                    this.gridData[x][y - fallDistance] = this.gridData[x][y];
                    this.gridData[x][y] = 0;
                    this.gridStarUi[x][y].getComponent(StarItem_Compontent).goTo(x, y - fallDistance, 0.2);
                    this.gridStarUi[x][y - fallDistance] = this.gridStarUi[x][y];
                    this.gridStarUi[x][y] = null;
                }
            }
        }
    }
    // 让星星左靠
    fallLeftStar() {
        // 左靠距离
        var fallLeftDistance = 0;
        for (var x = 0; x < this.len; x++) {
            // 如果最底下的星星是空，则整列都是空，就加一个距离
            if (this.gridData[x][0] == 0) {
                fallLeftDistance++;
                console.log("-----------------" + fallLeftDistance);
            }
            // 如果该列有星星，并且需要左靠
            if (this.gridData[x][0] != 0 && fallLeftDistance != 0) {
                // 执行左靠
                for (var y = 0; y < this.len; y++) {
                    if (this.gridData[x][y] > 0) {
                        this.gridData[x - fallLeftDistance][y] = this.gridData[x][y];
                        this.gridData[x][y] = 0;
                        this.gridStarUi[x][y].getComponent(StarItem_Compontent).goTo(x - fallLeftDistance, y, 0.3);
                        this.gridStarUi[x - fallLeftDistance][y] = this.gridStarUi[x][y];
                        this.gridStarUi[x][y] = null;
                    } else {
                        break;
                    }
                }
            }
        }
    }

    //获取星星的类型
    getStarType() {

    }

    //设置当前关卡的分数
    setCurLevelNUm() {
        this.curLevelScore.string = this.curlevelNum * GameUtils.levelpopNum + "";
    }

    // 点击目标分
    private targetButtonClick(x, y): void {
        this.popscore.active = true;
        let index = this.gridData[x][y];
        let num = this.connectStars.length;
        this.otherscore.string = index * 10 * num + "";
    }

    // 更新目标分label
    private updateTargetLabel(x, y): void {
        this.curLevelPopScore.string = this.curlevelPopNum + "";
        this.curlevelPopNum += this.popType * 10;
        this.progressB.width = this.curlevelPopNum / this.curlevelNum * 590;

    }


    //计算当前的分数是否过关
    calcCurtNum() {
        let num = GameUtils.levelpopNum;
        cc.log(this.curlevelPopNum);
        cc.log(this.curlevelNum * num);
        //判断是否过关
        if (this.curlevelPopNum >= this.curlevelNum * num && !this.isok) {
            this.isok = true;
            cc.log("是否过关");
            //  播放过关特效
            // for (let i = 0; i < 8; i++) {
            //     let partNo1 = new cc.Node();
            //     let part = partNo1.addComponent(cc.ParticleSystem);
            //     part.file = this.particle;
            //     part.texture = this.blue;
            //     part.emissionRate = 400;
            //     part.life = 1;
            //     part.duration = 1;
            //     part.angle = 360;
            //     part.angleVar = 360;
            //     part.gravity = new cc.Vec2(0, -1000);
            //     part.speed = 50;
            //     part.startSize = 10;
            //     partNo1.parent = this.particleNode;
            //     partNo1.setPosition(Math.random() * 100, Math.random() * 100);
            //     part.autoRemoveOnFinish = true;
            //     part.playOnLoad = true;
            // }
            let no = new cc.Node();
            let la = no.addComponent(cc.Label);
            la.string = "恭喜过关";
            this.node.addChild(no);
            this.scheduleOnce(() => {
                no.active = false;
            }, 3);
        }

        //弹出一个过关框
    }

    //检测是否能继续消除
    checkOVer() {
        for (let x = 0; x < this.len; x++) {
            for (var y = 0; y < this.len; y++) {
                let StarType = this.gridData[x][y];
                if (StarType == 0) {
                    break;
                }
                //要扫描的星星
                let scanStar = [[x + 1, y], [x - 1, y], [x, y - 1], [x, y + 1]];
                for (let i = 0; i < scanStar.length; i++) {
                    // 如果被扫描的4个中有相连的，就直接返回false
                    let tempx = scanStar[i][0];
                    let tempy = scanStar[i][1];
                    if (this.isinGrid(tempx, tempy) && this.gridData[tempx][tempy] == StarType) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    //检查剩下的个数
    checkCount() {
        let count = 0;
        for (let x = 0; x < this.len; x++) {
            for (var y = 0; y < this.len; y++) {
                if (this.gridData[x][y] > 0) {
                    count++;
                }
            }
        }
        return count;
    }

    //不能消除的粒子裂开效果
    startClearNoPopStareffect() {
        for (let x = 0; x < this.len; x++) {
            for (var y = 0; y < this.len; y++) {
                if (this.gridData[x][y] > 0) {
                    let no = new cc.Node();
                    no.parent = this.content;
                    no.position = this.gridStarUi[x][y].position;
                    let part = no.addComponent(cc.ParticleSystem);
                    part.file = this.particle;
                    part.custom = true;
                    part.particleCount = 4;
                    part.emissionRate = 50;
                    part.angle = 90;
                    part.startSize = 60;
                    part.angleVar = 90;
                    part.duration = 0.1;

                    switch (this.gridData[x][y]) {
                        case 1:
                            part.texture = this.blue;
                            break;
                        case 2:
                            part.texture = this.yellow;
                            break;
                        case 3:
                            part.texture = this.green;
                            break;
                        case 4:
                            part.texture = this.red;
                            break;
                        case 5:
                            part.texture = this.purple;
                            break;
                    }
                    no.getComponent(cc.ParticleSystem).playOnLoad = true;
                    this.gridData[x][y] = 0;
                    this.gridStarUi[x][y].destroy();
                }
            }
        }
    }

    /*工具使用
    *   锤子 消除一个
    *   消除一行
    *   消除一列
    *   消除九宫格
    *  @state  消除类型
    * 
    * 选中,点击道具消除
    * 点击道具然后点击消除?
    */
    popOtherStar(x, y, state: number = null) {
        let fallLeftDistance = 0;
        // if (this.gridData[x][y] > 0) {
        for (let i = 0; i < this.len; i++) {
            this.gridData[x][0] = 0;

            if (this.gridData[x][0] == 0) {
                fallLeftDistance++;
            }
            for (let j = 0; j < this.len; j++) {
                if (x == i) {
                    console.log(x, j);
                    this.gridData[x][j] = 0;
                    this.gridStarUi[x][j] = null;
                    this.fallLeftStar();

                    //开始左移
                    if (this.gridData[x][0] != 0 && fallLeftDistance != 0) {
                        // 执行左靠
                        for (var m = 0; m < this.len; m++) {
                            if (this.gridData[x][m] > 0) {
                                this.gridData[x - fallLeftDistance][m] = this.gridData[x][m];
                                this.gridData[x][m] = 0;
                                this.gridStarUi[x][m].getComponent(StarItem_Compontent).goTo(x - fallLeftDistance, m, 0.3);
                                this.gridStarUi[x - fallLeftDistance][m] = this.gridStarUi[x][m];
                                this.gridStarUi[x][m] = null;
                            } else {
                                break;
                            }
                        }
                    }
                }
            }
        }
        // }
        // switch (state) {
        //     case 1:



        //         break;
        // }
    }
}
