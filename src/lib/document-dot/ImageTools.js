const ImageTools = {
  /**
   *
   let c = ImageTools.contain({width: image.image.width, height: image.image.height}, {width: image.width, height: image.height});
   ctx.drawImage(image.image, c.dx, c.dy, c.dw, c.dh)
   // targetSize长度大于宽度时，会有问题！！待修正
   * @param imageSize
   * @param targetSize
   * @returns {{dw: number, dh: number, dx: number, dy: number}}
   */
  contain(imageSize, targetSize) {
    let canvasRatio = targetSize.width / targetSize.height;
    let imgRatio = imageSize.width / imageSize.height;
    let dw, dh, dx, dy;
    if (imgRatio <= canvasRatio) {
      dh = targetSize.height
      dw = imgRatio * dh
      dx = (targetSize.width - dw) / 2
      dy = 0
    } else {
      dw = targetSize.width
      dh = dw / imgRatio
      dx = 0
      dy = (targetSize.height - dh) / 2
    }
    return {
      dw, dh, dx, dy
    }
  },

  /**
   * let c = ImageTools.cover({width: image.image.width, height: image.image.height}, { width: image.width,height: image.height});
   ctx.drawImage(image.image, c.sx, c.sy, c.sw, c.sh, 0, 0, c.w, c.h);
   * @param imageSize
   * @param targetSize
   * @returns {{sw: number, sh: number, sx: number, sy: number, w, h}}
   */
  cover(imageSize, targetSize) {
    let canvasRatio = targetSize.width / targetSize.height;
    let imgRatio = imageSize.width / imageSize.height;
    let sw, sh, sx, sy;
    if (imgRatio <= canvasRatio) {
      sw = imageSize.width
      sh = sw / canvasRatio
      sx = 0
      sy = (imageSize.height - sh) / 2
    } else {
      sh = imageSize.height
      sw = sh * canvasRatio
      sx = (imageSize.width - sw) / 2
      sy = 0
    }
    return {
      sw, sh, sx, sy,
      w: targetSize.width,
      h: targetSize.height
    }
  }
}
export default ImageTools;