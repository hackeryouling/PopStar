const { ccclass, property } = cc._decorator;

/**
 * 屏蔽当前节点所有事件
 */
@ccclass
export default class MaskEventStop extends cc.Component {


    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.event, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.event, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.event, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.event, this);
    }

    event(e: cc.Event.EventTouch) {
        e.stopPropagation();
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.event, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.event, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.event, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.event, this);
    }
}
