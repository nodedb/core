/**
 * main.test
 */

/* Node modules */

/* Third-party modules */

/* Files */
import { expect, proxyquire } from '../../helpers/configure';
import App from '../../../src/renderer/app.vue';

describe('main tests', function () {

  beforeEach(function () {
    this.main = proxyquire('../../src/app/main', {});
  });

  it('should ', function () {

    expect(2).to.be.equal(2);

    expect(this.main).to.not.be.undefined;
    expect(App).to.be.an('object');
    expect(App.name).to.be.equal('my-project');

  });

});
