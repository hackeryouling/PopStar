cc.Class({
    extends: cc.Component,

    properties: {
        duration: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('fade-in', this.startFadeIn, this);
        this.node.on('fade-out', this.startFadeOut, this);
    },

    startFadeIn: function () {
        cc.eventManager.pauseTarget(this.node, true);
        this.node.position = cc.p(0, 0);
        this.node.setScale(2);
        this.node.opacity = 0;
        this.node.runAction(this.actionFadeIn);
    },

    startFadeOut: function () {
        cc.eventManager.pauseTarget(this.node, true);
        this.node.runAction(this.actionFadeOut);
    },

    onFadeInFinish: function () {
        cc.eventManager.resumeTarget(this.node, true);
    },

    onFadeOutFinish: function () {
        this.node.position = this.outOfWorld;
    },

    onDestroy: function(){
        this.node.stopAllActions();
        this.node.off('fade-in', this.startFadeIn, this);
        this.node.off('fade-out', this.startFadeOut, this);
    }

});
