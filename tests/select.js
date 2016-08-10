import jsdom from 'jsdom-global';
import { expect } from 'chai';
import { select } from '../src/index.js';
import { filteredClassName } from '../src/select.js';

jsdom();

describe('test select.js', function() {
  beforeEach(function() {
    document.body.innerHTML = '<div class="bar bam"></div><div class="foo"></div><div id="baz"></div>';
  });

  describe('filter out classes when generating CSS selector', function() {
    beforeEach(function() {
      this.divOneClass = document.getElementsByClassName('foo')[0];
      this.divMultipleClasses = document.getElementsByClassName('bar')[0];
    });

    it('should not filter out any classes by default', function() {
      var selector = select(this.divOneClass);
      expect(selector).to.equal('.foo');
    });

    it('should exclude using className when all of the elements classes should be ignored', function() {
      var selector = select(this.divOneClass, {
        ignore: {
          class: function(_class) {
            return _class === 'foo';
          }
        }
      });
      expect(selector).to.equal('body > div:nth-child(2)');
    });

    it('should exclude individual classes according to the ignore object', function() {
      var selector = select(this.divMultipleClasses, {
        ignore: {
          class: function(_class) {
            return _class === 'bar';
          }
        }
      });
      expect(selector).to.equal('.bam');
    });
  });

  describe('filter out ids when generating CSS selector', function() {
    beforeEach(function() {
      this.div = document.getElementById('baz');
    });

    it('should not filter out any ids by default', function() {
      var selector = select(this.div);
      expect(selector).to.equal('#baz');
    });

    it('should filter out any ids when passed the correct ignore params', function() {
      var selector = select(this.div, {
        ignore: {
          id: function(id) {
            return id === 'baz';
          }
        }
      });
      expect(selector).to.equal('body > div:nth-child(3)');
    });
  });

  describe('CSS selector formatting', function() {
    it('should properly escape the CSS selector', function() {
      var div = document.createElement('div');
      div.setAttribute('class', 'C($navlink) Td(n):h D(b)');
      document.body.appendChild(div);
      var selector = select(div);
      expect(selector).to.equal('.C\\(\\$navlink\\).Td\\(n\\)\\3Ah.D\\(b\\)');
    });
  });
});

