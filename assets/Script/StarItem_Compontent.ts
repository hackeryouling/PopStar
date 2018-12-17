import GameUtils from "./GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StarItem_Compontent extends cc.Component {



    @property({
        type: cc.SpriteFrame,
        displayName: "蓝色",
    })
    blue: cc.SpriteFrame = null;

    @property({
        type: cc.SpriteFrame,
        displayName: "黄色",
    })
    yellow: cc.SpriteFrame = null;

    @property({
        type: cc.SpriteFrame,
        displayName: "绿色",
    })
    green: cc.SpriteFrame = null;

    @property({
        type: cc.SpriteFrame,
        displayName: "红色",
    })
    red: cc.SpriteFrame = null;

    @property({
        type: cc.SpriteFrame,
        displayName: "紫色",
    })
    purple: cc.SpriteFrame = null;

    private type: number;

    gridX;
    gridY;

    len;
    gridlen;

    onLoad() {
        this.initAnim();
        var self = this;
        this.node.setScale(1);
        this.len = GameUtils.gridSize / 2;
        this.gridlen = GameUtils.gridwh;
    }

    //做一个动画
    private initAnim(): void {
        let nodeX = this.node.getPositionX();
        let nodeY = this.node.getPositionY();
        let action1 = cc.scaleTo(0.3, 1.2);
        let action2 = cc.scaleTo(0.3, 1);
        this.node.runAction(cc.sequence(action1, action2));
    }

    setSelected(selected) {
        if (!selected) {
            this.node.stopAllActions();
            this.node.setScale(1);
        } else {
            this.node.runAction(
                cc.repeatForever(cc.sequence(
                    cc.scaleTo(0.5, 0.9),
                    cc.scaleTo(0.5, 1)
                )));
        }
    }


    setGridXY(x, y) {
        // this.gridX = x;
        // this.gridY = y;
        // // this.node.setPosition(x * 60 + this.node.x / 2, y * 60 + this.node.y / 2);
        // this.node.setPosition((x - 6) * 60 + 60 / 2, (y - 6) * 60 + 60 / 2);

        this.gridX = x;
        this.gridY = y;
        this.node.setPosition((x - this.len) * this.gridlen + this.gridlen / 2, (y - this.len) * this.gridlen + this.gridlen / 2);
    }

    public setType(col: number): void {
        let spf: cc.SpriteFrame;
        switch (col) {
            case 1:
                spf = this.blue;
                break;
            case 2:
                spf = this.yellow;
                break;
            case 3:
                spf = this.green;
                break;
            case 4:
                spf = this.red;
                break;
            case 5:
                spf = this.purple;
                break;
        }
        this.getComponent(cc.Sprite).spriteFrame = spf;
        this.type = col;
    }

    public setLabel(index: number) {
        // let no: cc.Node = new cc.Node();
        // no.addComponent(cc.Label).string = String(index);
        // no.setPosition(0, 0);
        // no.opacity = 255;
        // no.parent = this.node;
    }

    public getType() {
        return this.type;
    }

    goTo(x, y, delay) {
        this.gridX = x;
        this.gridY = y;
        this.node.runAction(cc.sequence(
            cc.delayTime(delay),
            cc.moveTo(0.1, cc.p((x - this.len) * this.gridlen + this.gridlen / 2, (y - this.len) * this.gridlen + this.gridlen / 2))
        ));
    }
}
