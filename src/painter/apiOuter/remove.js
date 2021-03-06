/** ********** *
 *
 * Remove a sprite (async)
 * - In develop mode, fps will throw warnings in low performance.
 *
 * ********** **/

import utils from 'utils/utils.js';

module.exports = function ($sprite, del) {
    utils.execFuncs($sprite.hooks.beforeRemove, $sprite, $sprite.$tickedTimes++);

    $sprite.style.visible = false;
    $sprite.removing = true;

    setTimeout(() => {
        if ($sprite.$parent) {
            $sprite.$parent.children = $sprite.$parent.children.filter(function (c) {
                return c.removing !== true;
            });
        } else {
            this.children = this.children.filter(function (c) {
                return c.removing !== true;
            });
        }

        $sprite.$canvas = undefined;
        $sprite.$parent = undefined;
        $sprite.$tickedTimes = undefined;
        $sprite.$cache = undefined;
        $sprite.$rendered = false;
        if (process.env.NODE_ENV !== 'production') {
            $sprite.$perf = undefined;
        }

        utils.execFuncs($sprite.hooks.removed, $sprite, $sprite.$tickedTimes);
    });

    if (del) {
        this.children.splice(this.children.indexOf($sprite), 1);
    }
};
