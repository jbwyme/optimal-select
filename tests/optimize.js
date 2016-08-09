import jsdom from 'jsdom';
import { expect } from 'chai';
import { optimizePart } from '../src/optimize.js';

var fixtures = `
  <div id="container">
      <div class="favfeed_item child">
          <span class="class1 class2"></span>
          <div>
              <a class="class1 class2"></a>
          </div>
      </div>
  </div>
`
var document;

describe('test optimize.js', function() {
  beforeEach(function() {
    document = jsdom.jsdom(fixtures);
    global.document = document;
  });

  describe('optimizePart', function() {
    it('should handle direct descendants with multiple classes', function() {
      const prePart = '#container .child';
      const current = '> .class2.class1';
      const postPart = '';
      const element = document.querySelector('#container .child > .class1');
      const result = optimizePart(prePart, current, postPart, element);
      expect(result, '');
    });
  });
});

