
import GameUtils from "./GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameController extends cc.Component {

    //等级
    @property(cc.Label)
    level: cc.Label = null;

    // 货币
    @property(cc.Label)
    money: cc.Label = null;

    //进度条
    @property(cc.Node)
    progressBar: cc.Node = null;

    onLoad() {
        //加载用户信息
        //这部分保存在本地

        //   cc.sys.localStorage.put();
        this.level.string = GameUtils.userLevel + "";
        this.money.string = GameUtils.money + "";
        this.progressBar.width = GameUtils.userLevel / 10 * 120;

    }
    // update (dt) {},
}
