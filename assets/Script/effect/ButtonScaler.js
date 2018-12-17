cc.Class({
    extends: cc.Component,

    properties: {
        pressedScale: 0.8,
        transDuration: 0.1
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        // var audioMng = cc.find('Menu/AudioMng') || cc.find('Game/AudioMng')
        // if (audioMng) {
        //     audioMng = audioMng.getComponent('AudioMng');
        // }
        self.initScale = this.node.scale;
        //self.button = self.getComponent(cc.Button);
        self.scaleDownAction = cc.scaleTo(self.transDuration, self.pressedScale);
        self.scaleUpAction = cc.scaleTo(self.transDuration, self.initScale);

        this.node.on('touchstart', this.onTouchDown, this);
        this.node.on('touchend', this.onTouchUp, this);
        this.node.on('touchcancel', this.onTouchUp, this);
    },
    onTouchDown: function (event) {
        this.node.stopAllActions();
        // if (audioMng) audioMng.playButton();
        this.node.runAction(this.scaleDownAction);
    },
    onTouchUp: function (event) {        
        this.node.stopAllActions();
        this.node.runAction(this.scaleUpAction);
    },
    onDestroy: function () {
        this.node.stopAllActions();
        this.node.off('touchstart', this.onTouchDown, this.node);
        this.node.off('touchend', this.onTouchUp, this.node);
        this.node.off('touchcancel', this.onTouchUp, this.node);
    }
});