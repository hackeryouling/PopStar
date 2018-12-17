import { HttpManager } from './HttpManager';
const { ccclass, property } = cc._decorator;

@ccclass
export default class MainScene extends cc.Component {

    @property({
        type: cc.Node,
        displayName: "经典消除",
    })
    pop1: cc.Node = null;

    onLoad() {

        // this.init();
        this.pop1.on(cc.Node.EventType.TOUCH_END, this.startGame, this);
    }

    private init() {
        HttpManager.init("http://192.168.0.210/popstar/saveScore", "text", "POST", (res: string) => {
            cc.log("成功");
            cc.log(res);
        },
            () => {
                cc.log("失败");
            }
        );

        HttpManager.addParam("userId", "11122");
        HttpManager.addParam("level", "23");
        HttpManager.addParam("score", "1803");

        HttpManager.send();
    }

    private startGame(e): void {
        this.pop1.runAction(cc.sequence(cc.blink(0.6, 6), cc.callFunc(() => {
            cc.director.loadScene("GameScene", () => {
                cc.log("GameScene场景加载完成");
            });
        })));
    }
}
