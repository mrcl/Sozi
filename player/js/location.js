/*
 * Sozi - A presentation tool using the SVG standard
 *
 * Copyright (C) 2010-2012 Guillaume Savaton
 *
 * This program is dual licensed under the terms of the MIT license
 * or the GNU General Public License (GPL) version 3.
 * A copy of both licenses is provided in the doc/ folder of the
 * official release of Sozi.
 *
 * See http://sozi.baierouge.fr/wiki/en:license for details.
 *
 * @depend namespace.js
 * @depend events.js
 */

namespace(this, "sozi.location", function (exports, window) {
    "use strict";
    
    var changedFromWithin = false;
    
    /*
     * Returns the frame index given in the URL hash.
     *
     * In the URL, the frame index starts a 1.
     * This method converts it into a 0-based index.
     *
     * If the URL hash is not a positive integer, then 0 is returned.
     * It the URL hash is an integer greater than the last frame index, then
     * the last frame index is returned.
     */
    exports.getFrameIndex = function () {
        var index = window.location.hash ?
            parseInt(window.location.hash.slice(1), 10) - 1 : 0;
        if (isNaN(index) || index < 0) {
            return 0;
        } else if (index >= sozi.document.frames.length) {
            return sozi.document.frames.length - 1;
        } else {
            return index;
        }
    };

    /*
     * Event handler: hash change.
     *
     * This function is called when the URL hash is changed.
     * If the hash was changed manually in the address bar, and if it corresponds to
     * a valid frame number, then the presentation moves to that frame.
     *
     * The hashchange event can be triggered externally, by the user modifying the URL,
     * or internally, by the script modifying window.location.hash.
     */
    function onHashChange() {
        var index = exports.getFrameIndex();
        if (!changedFromWithin) {
            sozi.player.moveToFrame(index);
        }
        changedFromWithin = false;
    }
    
    /*
     * Event handler: frame change.
     *
     * This function is called when the presentation has reached a
     * new frame.
     * The URL hash is changed based on the provided frame index.
     */
    function onFrameChange(index) {
        changedFromWithin = true;
        window.location.hash = "#" + (index + 1);
    }

	/*
	 * Event handler: document load.
	 *
	 * This function registers the "framechange" handler.
	 */
    function onLoad() {
        sozi.events.listen("sozi.player.framechange", onFrameChange);
    }
    
    window.addEventListener("hashchange", onHashChange, false);
    window.addEventListener("load", onLoad, false);
});
