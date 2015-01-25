'use strict';

/**
 * if you want to using `to5Runtime`
 * @see https://6to5.org/optional-runtime.html
 */
require('6to5/runtime'); // Using the "require" to avoid call "to5Runtime.interopRequire()"

/**
 * if using a feature that requires a browser-polyfill
 *
 * @see https://6to5.org/polyfill.html
 */
import polyfill from '6to5/browser-polyfill';

/**
 * Talkie.js
 */
import Bacon   from 'baconjs';

import util    from './util';
import params  from './params';

import Slides  from './slides';
import Control from './control';
import Ratio   from './ratio';
import Scale   from './scale';

document.addEventListener('DOMContentLoaded', function() {

  function rangeIs(min, max) {
    return function(z) {
      return Math.min(max, Math.max(z, min));
    };
  }

  function toInvisible(el) {
    el.removeAttribute('visible');
  }

  function toVisible(el) {
    el.setAttribute('visible', 1);
  }

  /**
   * Init slide sections
   */
  let slides  = Slides();

  /**
   * Paging control
   */
  let control = Control();

  let initialPage = params.page || 1;
  let correctPage = util.compose(rangeIs(1, slides.length), util.add);

  let both = control.next.merge(control.prev);
  let current = both.scan(initialPage, correctPage);

  Bacon.combineAsArray(current, slides)
    .onValue(function(data) {
      let [current, all] = data;
      all.forEach(toInvisible);
      toVisible(all[current - 1 /* fix page to index */]);
    });

  /**
   * Scaling
   */
  let ratio = Ratio();
  let scale = Scale();

  ratio.onValue(scale);
  Bacon.once(ratio).onValue(scale);
});
