/**
 * # Select
 *
 * Construct a unique CSS queryselector to access the selected DOM element(s).
 * Applies different matching and optimization strategies for efficiency.
 */

import adapt from './adapt'
import match from './match'
import optimize from './optimize'

/**
 * Choose action depending on the input (single/multi)
 * @param  {HTMLElement|Array} input   - [description]
 * @param  {Object}            options - [description]
 * @return {string}                    - [description]
 */
export default function getQuerySelector (input, options = {}) {
  if (Array.isArray(input)) {
    return getMultiSelector(input, options)
  }
  return getSingleSelector(input, options)
}

/**
 * Get a selector for the provided element
 * @param  {HTMLElement} element - [description]
 * @param  {Object}      options - [description]
 * @return {String}              - [description]
 */
export function getSingleSelector (element, options) {

  if (element.nodeType === 3) {
    return getSingleSelector(element.parentNode)
  }
  if (element.nodeType !== 1) {
    throw new Error(`Invalid input - only HTMLElements or representations of them are supported! (not "${typeof element}")`)
  }

  const globalModified = adapt(element, options)

  const selector = match(element, options)
  const optimized = optimize(selector, element, options)

  if (globalModified) {
    delete global.document
  }

  return optimized
}

/**
 * Get a selector to match multiple children from a parent
 * @param  {Array}  elements - [description]
 * @param  {Object} options  - [description]
 * @return {string}          - [description]
 */
export function getMultiSelector (elements, options) {
  const firstEl = elements[0];
  let commonClassName = firstEl.className;
  let commonTagName = firstEl.tagName;
  let candidate;

  const getParentNodes = function(el) {
    const nodes = [];
    while(el.parentNode && el.parentNode !== document.body) {
      el = el.parentNode;
      nodes.push(el);
    }
    return nodes;
  }

  const findSimilarParents = function(props1, props2) {
    const similar = [];
    let i, j;
    for (i = 0; i < props1.length; i++) {
      node1 = props1[i];
      for (j = 0; j < props2.length; j++) {
        node2 = props2[j];
        let similarNode = null;
        if (node1 === node2 || node1.id === node2.id) {
          similarNode = node1;
        } else if (node1.tagName === node2.tagName && filteredClassName(node1.className, options) === filteredClassName(node2.className, options)) {
          similarNode = document.createElement(node1.tagName);
          similarNode.className = filteredClassName(node1.className, options);
        }
        if (similarNode) {
          similar.push(similarNode);
          similar.concat(findSimilarParents(props1.slice(i), props2.slice(j)));
          return similar;
        }
      }
    }
    return similar;
  }


  let commonParentNodes = getParentNodes(firstEl);

  for (var i = 1; i < elements.length; i++) {
    const candidate = elements[i];
    commonParentNodes = (commonParentNodes, getParentNodes(candidate));

    if (candidate.className !== commonClassName) {
      let classNames = [];

      let longer, shorter
      if (candidate.className.length > commonClassName.length) {
        longer = candidate.className;
        shorter = commonClassName;
      } else {
        longer = commonClassName;
        shorter = candidate.className;
      }
      shorter.split(' ').forEach((name) => {
        if (longer.indexOf(name) > -1) {
          classNames.push(name);
        }
      });
      commonClassName = classNames.join(' ');
    }

    if (candidate.tagName !== commonTagName) {
      commonTagName = null;
    }
  }
  commonParentNodes.reverse();

  let selectors = [];
  if (commonParentNodes) {
    selectors = commonParentNodes.map(el => {
      let selector = el.tagName.toLowerCase();
      if (el.id !== '') {
        selector += '#' + el.id;
      } else if (el.className !== '') {
        selector += '.' + el.className.replace(/ /g, '.');
      }
      return selector;
    });
  }

  const targetSelectorParts = [];
  if (commonTagName) {
    targetSelectorParts.push(`${commonTagName.toLowerCase()}`);
  }
  if (commonClassName) {
    targetSelectorParts.push(`.${commonClassName.replace(/ /g, '.')}`);
  }
  selectors.push(targetSelectorParts.join(''));

  // lets attempt to make the selector shorter
  try {
    const originalCount = document.querySelectorAll(selectors.join(' ')).length;
    while(selectors.length > 1) {
      const candidateForRemoval = selectors.shift();
      const newCount = document.querySelectorAll(selectors.join(' ')).length;
      if (newCount !== originalCount) {
        selectors.unshift(candidateForRemoval);
        break;
      }
    }
  } catch (e) {
    console.log('Unable to execute generic selector, returning explicit selector', e);
    return elements.map(e => getSingleSelector(e, options)).join(', ');
  }

  if (selectors.length === 0) {
    selectors = elements.map(e => getSingleSelector(e, options));
    return selectors.join(', ');
  } else {
    return selectors.join(' ');
  }
}

// Polyfill
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes#Browser_compatibility
if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
        return true;
      }
      k++;
    }
    return false;
  };
}
