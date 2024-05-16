/* eslint-disable no-underscore-dangle, max-classes-per-file */
/** Sprite class for use with TinyCanvas */
class Sprite {
  /**
   * Create new Sprite for TinyCanvas
   * @param imageRef - Image reference or URL
   */
  constructor(imageRef) {
    this._imageInstance = null;
    this.ready = false;
    if (imageRef instanceof Image) {
      this._imageInstance = imageRef;
    } else {
      this._imageInstance = new Image();
      this._imageInstance.src = imageRef;
    }
    this._imageInstance.addEventListener('load', () => {
      this.ready = true;
      this._spriteWidth = this._imageInstance.width;
      this._spriteHeight = this._imageInstance.height;
      this._setCachedValues();
    });
    this.x = 0;
    this.y = 0;
    this.stretchX = 1;
    this.stretchY = 1;
    this.rotation = 0;
    this.opacity = 1;
    this.blend = 'source-over';
    this._scaleX = 1;
    this._scaleY = 1;
    this._scaledW = null;
    this._scaledH = null;
    this._anchorPosX = 0;
    this._anchorPosY = 0;
    this._anchorX = null;
    this._anchorY = null;
  }
  /**
   * Set anchor point for sprite in percentage
   * @param {number} x - (0.0-1.0) pct of width or width/height (if y not given) to place anchor
   * @param {number} [y] - (0.0-1.0) pct of height to place anchor
   * @example sprite.anchor(0.5, 0.5) // Center anchor
   * @example sprite.anchor(0.5) // Center anchor (same as above)
   */
  anchor(x, y) {
    // eslint-disable-next-line no-param-reassign
    if (y === undefined) { y = x; }
    if (!Number.isNaN(x)) { this._anchorPosX = x; }
    if (!Number.isNaN(y)) { this._anchorPosY = y; }
    this._setCachedValues();
  }
  /**
   * Translate sprite by x, y
   * @param {number} dx
   * @param {number} dy
   */
  translate(dx, dy) {
    if (!Number.isNaN(dx)) { this.x += dx; }
    if (!Number.isNaN(dy)) { this.y += dy; }
  }
  set scaleX(scale) {
    this._scaleX = scale;
    this._setCachedValues();
  }
  get scaleX() {
    return this._scaleX;
  }
  set scaleY(scale) {
    this._scaleY = scale;
    this._setCachedValues();
  }
  get scaleY() {
    return this._scaleY;
  }
  set scale(uScale) {
    this._scaleX = uScale;
    this._scaleY = uScale;
    this._setCachedValues();
  }
  get scale() {
    return this._scaleX;
  }
  /**
   * Rotate sprite by given degrees
   * @param {number} dDeg - Degrees to rotate from current rotation
   */
  rotate(dDeg) {
    this.rotation += dDeg;
  }
  /**
   * Draw sprite on canvas - called by TinyCanvas
   * @param {canvas} ctx - Canvas context
   */
  draw(ctx) {
    if (!this.ready) { return; }
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.transform(this.stretchX, 0, 0, this.stretchY, 0, 0);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.translate(-this._anchorX, -this._anchorY);
    ctx.globalAlpha = this.opacity;
    ctx.globalCompositeOperation = this.blend;
    ctx.drawImage(this._imageInstance,
      0, 0,
      this._spriteWidth, this._spriteHeight,
      0, 0,
      this._scaleW, this._scaleH);
    ctx.restore();
  }
  _setCachedValues() {
    this._scaleW = this._spriteWidth * this._scaleX;
    this._scaleH = this._spriteHeight * this._scaleY;
    this._anchorX = this._scaleW * this._anchorPosX;
    this._anchorY = this._scaleH * this._anchorPosY;
  }
}
/** Canvas wrapper with sprite support */
class TinyCanvas {
  /**
   * Create new TinyCanvas instance
   * @param {string|HTMLCanvasElement} canvas - Canvas element or selector
   */
  constructor(canvas) {
    if (typeof canvas === 'string') {
      this._canvas = document.querySelector(canvas);
    } else {
      this._canvas = canvas;
    }
    this._ctx = this._canvas.getContext('2d');
    this._drawables = [];
    this._tickFunctions = [];
    this._tickIterFunctions = [];
    this._currTime = performance.now();
    const draw = () => {
      const curr = performance.now();
      const dt = curr - this._currTime;
      this._currTime = curr;
      this._clearCanvas();
      this._tick(dt);
      this._iterateDraw();
      window.requestAnimationFrame(draw);
    };
    draw();
  }
  /**
   * Add drawable to canvas
   * @param {Sprite} drawable - Sprite to draw on the canvas
   */
  addDrawable(drawable) {
    this._drawables.push(drawable);
  }
  // TODO: REMOVEDRAWABLE
  get width() {
    return this._canvas.width;
  }
  get height() {
    return this._canvas.height;
  }
  // Takes function that accepts dt
  addTickFunction(func) {
    this._tickFunctions.push(func);
  }
  // Takes function that accepts dt, sprite
  addTickIterFunction(func) {
    this._tickIterFunctions.push(func);
  }
  // TODO: REMOVEFUNC
  _tick(dt) {
    let len;
    len = this._tickFunctions.length;
    // eslint-disable-next-line no-plusplus
    while (len--) {
      this._tickFunctions[len](dt);
    }
    len = this._tickIterFunctions.length;
    // eslint-disable-next-line no-plusplus
    while (len--) {
      let dLen = this._drawables.length;
      // eslint-disable-next-line no-plusplus
      while (dLen--) {
        this._tickIterFunctions[len](dt, this._drawables[dLen]);
      }
    }
  }
  _iterateDraw() {
    let len = this._drawables.length;
    // eslint-disable-next-line no-plusplus
    while (len--) {
      this._drawables[len].draw(this._ctx);
    }
  }
  _clearCanvas() {
    this._ctx.save();
    this._ctx.setTransform(1, 0, 0, 1, 0, 0);
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.restore();
  }
}
export {
  TinyCanvas,
  Sprite,
};
