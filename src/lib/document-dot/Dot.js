import {CtxMode,  DotInitMode} from "./Type";
// @ts-ignore
import Easing from "./Easing";

export default class Dot {
    /**
     * 半价
     * @type {number}
     */
    radius
    /**
     * 初始化点
     * @type {{x: number, y: number}}
     */
    initDot
    /**
     * 目标点
     * @type {{x: number, y: number}}
     */
    targetDot
    currentDot
    /**
     * 延迟运动
     * @type {number}
     */
    delay
    delayCount
    /**
     * 进度
     * @type {number}
     */
    p
    pAmount= 100
    /**
     * 是否完成
     * @type {boolean}
     */
    finished
    /**
     * 完成后是否删除
     * @type {boolean}
     */
    finishedRemove
    /**
     * 序号
     * @type {number}
     */
    index= -1
    color
    /**
     * 原始图像的颜色。
     * @type {{r: number, g: number, b: number, a: number}|{}}
     */
    rgba = {r: -1, g: -1, b: -1, a: -1}
    ctxMode
    cache = false
    _refreshCache = false
    canvas
    ctx


    constructor(config) {
        this.radius = config.radius || 2;
        this.initDot = {x: 0, y: 0}
        if (config.initDot) {
            this.initDot = config.initDot
        } else {
            this.setInitDot(config.initDotMode || DotInitMode.Round, config.boundary || {
                w: window.innerWidth,
                h: window.innerHeight
            });
        }
        this.targetDot = config.targetDot || {x: 0, y: 0}
        this.delay = config.delay || 123 * Math.random();
        this.delayCount = 0;
        this.p = 0;
        this.currentDot = {x: this.initDot.x, y: this.initDot.y};
        this.finished = false;
        this.finishedRemove = false;
        config.index && (this.index = config.index)
        /**
         * 颜色
         * @type {{fill: function(Dot):string, stroke: function(Dot):string}}
         */
        this.color = config.color;

        config.rgba && (this.rgba = config.rgba)
        config.pAmount && (this.pAmount = config.pAmount)

        this.ctxMode = CtxMode.Fill;
        this.setCtxMode(config.ctxMode)
        this.cache = config.cache;

        // this.canvas = new OffscreenCanvas(this.radius * 2, this.radius * 2);
        this.canvas = new OffscreenCanvas(this.radius * 2, this.radius * 2);
        this.ctx = this.canvas.getContext('2d');

        this.ctx.fillStyle = this.color.fill(this);
        this.ctx.strokeStyle = this.color.stroke(this);
        this.refreshCache();


        // const offscreen = document.querySelector('canvas').transferControlToOffscreen();
        // const worker = new Worker('myworkerurl.js');
        // worker.postMessage({ canvas: offscreen }, [offscreen]);
    }


    setCtxMode(ctxMode) {
        if (!ctxMode) {
            return;
        }
        this.ctxMode = ctxMode;
    }

    set(config) {
        if (config.initDot) {
            this.initDot = config.initDot;
        } else if (config.initDotMode && config.boundary) {
            this.setInitDot(config.initDotMode, config.boundary);
        }
        if (config.targetDot) {
            this.setNewTargetDot(config.targetDot);
        }
        if (config.delay) {
            this.delay = config.delay;
            this.delayCount = 0;
        }
        if (config.index) {
            this.index = config.index;
        }
        if (config.p) {
            this.p = config.p;
        }
        if (config.rgba) {
            this.rgba = config.rgba;
            this._refreshCache = true;
        }
        if (config.cache) {
            this.cache = config.cache;
            this._refreshCache = true;
        }
        if (config.radius && config.radius !== this.radius) {
            this.radius = config.radius;
            this._refreshCache = true;
        }
        // 有就必须处理了，因为color是函数类型，无法在执行前预知返回内容
        if (config.color) {
            this.color = config.color;
            this.ctx.fillStyle = this.color.fill(this);
            this.ctx.strokeStyle = this.color.stroke(this);
            this._refreshCache = true;
        }
        if (config.ctxMode && config.ctxMode !== this.ctxMode) {
            this.setCtxMode(config.ctxMode);
            this._refreshCache = true;
        }
    }

    refreshCache() {
        if (!this.cache) {
            return;
        }
        this.ctx.arc(this.radius, this.radius, this.radius - 0.5, 0, Math.PI * 2);
        switch (this.ctxMode) {
            case CtxMode.Fill:
                this.ctx.fill();
                break;
            case CtxMode.FillStroke:
                this.ctx.fill();
                this.ctx.stroke();
                break;
            case CtxMode.Stroke:
                this.ctx.stroke();
                break;
        }
    }

    /**
     * 克隆
     * @return {Dot}
     */
    clone() {
        let config = {...this};
        let d = new Dot(config);
        d.delayCount = this.delayCount;
        d.p = this.p;
        d.finished = this.finished;
        d.finishedRemove = this.finishedRemove;
        d._refreshCache = this._refreshCache;
        return d;
    }

    /**
     *  重新设置目标点,并重置p,finished,delayCount
     * @param target{{x:number,y:number}}
     */
    setNewTargetDot(target) {
        Object.assign(this.initDot, this.currentDot);
        Object.assign(this.targetDot, target);
        this.p = 0;
        this.finished = false;
        this.delayCount = 0;
    }

    /**
     * 设置初始点位置
     * @param mode{'round' | 'angle'}
     * @param boundary{{w:number,h:number}}
     */
    setInitDot(mode, boundary) {
        let w = boundary.w;
        let h = boundary.h;
        //随机四个角
        switch (mode) {
            case DotInitMode.Round:
                if (Math.random() > 0.5) {
                    this.initDot = {
                        x: Math.random() > 0.5 ? w + (this.radius * 2) : -(this.radius * 2),
                        y: Math.random() * h
                    };
                } else {
                    this.initDot = {
                        x: Math.random() * w,
                        y: Math.random() > 0.5 ? h + (this.radius * 2) : -(this.radius * 2)
                    };
                }
                break;
            case DotInitMode.Angle:
                this.initDot = {
                    x: Math.random() > 0.5 ? w + (this.radius * 2) : -(this.radius * 2),
                    y: Math.random() > 0.5 ? h + (this.radius * 2) : -(this.radius * 2)
                };
                break;
            case DotInitMode.middle:
                this.initDot = {
                    x: (w - (this.radius * 2)) / 2,
                    y: (h - (this.radius * 2)) / 2
                };
                break;
            default:
                this.initDot = {
                    x: 0,
                    y: 0
                }
        }
    }

    /**
     *  移动
     */
     move(target = undefined, targetP = undefined) {
        if (this.delayCount < this.delay) {
            this.delayCount++;
            return false;
        }
        if (this.finished || this.p >= this.pAmount) {
            this.finished = true;
            return true;
        }
        target = target || this.targetDot;
        this.p += 1.5;
        if (targetP) {
            this.p = targetP;
        }
        if (this._refreshCache && this.p >= this.pAmount / 3) {
            this._refreshCache = false;
            this.refreshCache();
        }
        let p = Easing.easeInOutSine(this.p / this.pAmount);
        let x = this.initDot.x + (target.x - this.initDot.x) * p;
        let y = this.initDot.y + (target.y - this.initDot.y) * p;
        this.currentDot = {
            x, y
        }
        return false;
    }

    /**
     *  立刻移动到目标点
     *  <br> 动画速度：easeInOutSine
     * @param target{{x:number,y:number}} 目标点
     * @return{boolean} true:已经到达目标点，false: 未到达或者未开始移动
     */
     moveToTargetNow(target = undefined) {
        return this.move(target, 100)
    }
}
