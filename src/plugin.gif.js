/** ********** *
 *
 * Load gif and change to an active canvas object
 * - The canvas is in animating.
 * - 84kb larger.
 *
 * ********** **/

import gifler from 'lib/gifler.js';

const Cache = {};
const ProcessingFlag = 'processing';

let _ec;

const gif2canvas = function (url, callback) {
    let flag = JSON.stringify({
        url: url,
        // width: _width,
        // height: _height,
    });

    if (Cache[flag] && Cache[flag] !== ProcessingFlag) {
        callback(Cache[flag]);
        return;
    }
    if (Cache[flag] === ProcessingFlag) {
        // 防止并发初始化gif2canvas
        setTimeout(function () {
            gif2canvas(url, callback);
        }, 100);
        return;
    }

    Cache[flag] = ProcessingFlag;

    _ec.imgLoader(url, function (img) {
        let temp = document.createElement('canvas');
        temp.width = img.width;
        temp.height = img.height;

        // Here can modify the image
        // window.gifler(img.src).frames(temp, function (ctx, frame) {
        //     ctx.canvas.width  = img.width;
        //     ctx.canvas.height = img.height;
        //     // ctx.globalCompositeOperation = 'source-over';
        //     // ctx.fillRect(0, 0, 1100, 1100);
        //     ctx.translate(ctx.canvas.width, 0);
        //     ctx.scale(-1, 1);
        //     ctx.drawImage(frame.buffer, frame.x, frame.y, frame.width, frame.height);

        //     // Composite a color
        //     // let hue = (frames * 10) % 360;
        //     // ctx.globalCompositeOperation = 'source-atop';
        //     // ctx.fillStyle = 'hsla(' + hue + ', 100%, 50%, 0.5)';
        // }).done(function () {
        window.gifler(img.src).animate(temp).done(function () {
            Cache[flag] = temp;
            callback(temp);
        });
    });
};

if (window && window.Easycanvas) {
    _ec = window.Easycanvas;
    _ec.gif2canvas = gif2canvas;
}

module.exports = function (ec) {
    _ec = ec;
    ec.gif2canvas = gif2canvas;
};
