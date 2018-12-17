var StarItem = require("../Script/StarItem.js");
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

        starPrefab: cc.Prefab,
        starGrid: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        var self = this;

        this.initStatus();
        this.initGrid();
        this.starGrid.on(cc.Node.EventType.TOUCH_START, function (e) {
            var pos = self.starGrid.convertToNodeSpace(e.touch.getLocation());
            self.touchStar(parseInt(pos.x / (self.starGrid.width / 10)), parseInt(pos.y / (self.starGrid.height / 10)));
        });
    },

    // 初始化状态变量
    initStatus: function () {
        // 存放状态变量的对象
        this.stVar = {};
        // 是否在选中状态
        this.stVar.selected = false;
        // 总分
        this.totalScore = 0;
    },

    calcRandomNumber() {
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
    },



    // 生成网格
    initGrid: function () {
        // 清空原来的
        if (this.gridStarUi) {
            for (var x = 0; x < 10; x++) {
                for (var y = 0; y < 10; y++) {
                    if (this.gridStarUi[x][y]) {
                        this.gridStarUi[x][y].destroy();
                    }
                }
            }
        }
        // 网格数据
        var gridData = [];
        // 网格星星ui
        var gridStarUi = [];
        for (var i = 0; i < 10; i++) {
            gridData[i] = [];
            gridStarUi[i] = [];
            for (var j = 0; j < 10; j++) {
                var star = cc.instantiate(this.starPrefab);
                var starClass = star.getComponent(StarItem);
                star.parent = this.starGrid;
                starClass.setGridXY(i, j);
                var rnd = parseInt(Math.random() * 5 + 1);
                // var rnd = this.calcRandomNumber();
                starClass.setType(rnd);
                gridData[i][j] = rnd;
                gridStarUi[i][j] = star;
            }
        }
        this.gridData = gridData;
        this.gridStarUi = gridStarUi;
    },

    // 点击了一个星星，xy为数据坐标
    touchStar: function (x, y) {
        if (this.stVar.selected) {
            if (this.connectContain(x, y)) {
                // 如果点击了已被选中的星星
                this.cleanOnce(x, y);
                this.stVar.selected = false;
            } else {
                // 如果点击了未被选中的星星
                this.setConnectStarSelect(false);
                // this.scorePreLabel.node.active = false;
                this.touchStar(x, y);
            }
        } else {
            if (this.gridData[x][y] == 0) { return; }
            // 相连的星星
            this.stVar.connectStars = [[x, y]];
            this.checkStar(x, y);
            if (this.stVar.connectStars.length >= 2) {
                this.setConnectStarSelect(true);
                // this.scorePreLabel.string = Comm.calcClearScore(this.stVar.connectStars.length);
                // this.scorePreLabel.node.stopAllActions();
                // this.scorePreLabel.node.setPosition(this.gridStarUi[x][y].position);
                // this.scorePreLabel.node.opacity = 255;
                // this.scorePreLabel.fontSize = 32;
                // this.scorePreLabel.node.active = true;
            }
        }
    },

    // 递归查找相连的星星
    checkStar: function (x, y) {
        var starType = this.gridData[x][y];
        // 要扫描的4个星星（上下左右）
        var scanStar = [[x + 1, y], [x - 1, y], [x, y - 1], [x, y + 1]];
        for (var i = scanStar.length - 1; i >= 0; i--) {
            scanStar[i]
            var scanX = scanStar[i][0];
            var scanY = scanStar[i][1];
            if (this.inGrid(scanX, scanY) && this.gridData[scanX][scanY] == starType && (!this.connectContain(scanX, scanY))) {
                this.stVar.connectStars[this.stVar.connectStars.length] = [scanX, scanY];
                this.checkStar(scanX, scanY);
            }
        }
    },

    // 是否在网格范围内
    inGrid: function (x, y) {
        return x >= 0 && x < 10 && y >= 0 && y < 10
    },

    // 选中或取消选中，相连的星星
    setConnectStarSelect: function (selected) {
        for (var i = this.stVar.connectStars.length - 1; i >= 0; i--) {
            var star = this.stVar.connectStars[i];
            this.gridStarUi[star[0]][star[1]].getComponent(StarItem).setSelected(selected);
        }
        this.stVar.selected = selected;
    },

    // 相连数组里是否有该坐标
    connectContain: function (x, y) {
        for (var i = this.stVar.connectStars.length - 1; i >= 0; i--) {
            var star = this.stVar.connectStars[i];
            if (star[0] == x && star[1] == y) {
                return true;
            }
        }
        return false;
    },

    // 做一次消除操作
    cleanOnce: function () {
        this.clearConnectStar();
        // 让星星下落
        this.fallDownStar();
        // 让星星往左靠
        this.fallLeftStar();
    },

    // 清除相连数组里的星星
    clearConnectStar: function () {
        for (var i = this.stVar.connectStars.length - 1; i >= 0; i--) {
            var star = this.stVar.connectStars[i];
            this.gridData[star[0]][star[1]] = 0;
            this.gridStarUi[star[0]][star[1]].destroy();
        }
    },

    // 让星星下落
    fallDownStar: function () {
        // 遍历每一列
        for (var x = 0; x < 10; x++) {
            // 下落的距离
            var fallDistance = 0;
            // 从下往上，遍历每一个星星
            for (var y = 0; y < 10; y++) {
                // 如果是空，则增加一个下落距离
                if (this.gridData[x][y] == 0) {
                    fallDistance++;
                }
                // 如果需要下落且当前不是空，就记录到下落数组里
                if (fallDistance > 0 && this.gridData[x][y] > 0) {
                    this.gridData[x][y - fallDistance] = this.gridData[x][y];
                    this.gridData[x][y] = 0;
                    this.gridStarUi[x][y].getComponent(StarItem).goTo(x, y - fallDistance, 0);
                    this.gridStarUi[x][y - fallDistance] = this.gridStarUi[x][y];
                    this.gridStarUi[x][y] = null;
                }
            }
        }
    },

    // 让星星左靠
    fallLeftStar: function () {
        // 左靠距离
        var fallLeftDistance = 0;
        for (var x = 0; x < 10; x++) {
            // 如果最底下的星星是空，则整列都是空，就加一个距离
            if (this.gridData[x][0] == 0) {
                fallLeftDistance++;
            }
            // 如果该列有星星，并且需要左靠
            if (this.gridData[x][0] != 0 && fallLeftDistance != 0) {
                // 执行左靠
                for (var y = 0; y < 10; y++) {
                    if (this.gridData[x][y] > 0) {
                        this.gridData[x - fallLeftDistance][y] = this.gridData[x][y];
                        this.gridData[x][y] = 0;
                        this.gridStarUi[x][y].getComponent(StarItem).goTo(x - fallLeftDistance, y, 0.1);
                        this.gridStarUi[x - fallLeftDistance][y] = this.gridStarUi[x][y];
                        this.gridStarUi[x][y] = null; this.gridStarUi[x][y] = null;
                    } else {
                        break;
                    }
                }
            }
        }
    },

});
