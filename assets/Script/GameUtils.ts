const { ccclass, property } = cc._decorator;

@ccclass
export default class GameUtils {


    //生成星星行列
    public static gridSize = 10;

    //星星的宽高
    public static gridwh = 72;

    //关卡消除系数
    public static levelpopNum = 0.6;

    //用户等级
    public static userLevel = 1;

    //货币
    public static money = 0;

    private expArr: Array<number> = [100, 200, 300, 400, 500, 600, 700, 800, 900];

    // 读取所有关卡的分数
    public static readLevelScores() {

    }

    //保存所有关卡的分数
    public static saveLevelScores() {

    }

    // 计算消除得分
    public static calcClearScore() {

    }

    // 计算剩余星星所能得的分
    public static calcLastScore() {

    }

    // 显示一个tip
    public static poptips() {

    }

    //显示确认框
    public static showconfirm() {

    }
}
