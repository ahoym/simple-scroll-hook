describe('ScroolHook functions', function () {
  'use strict';

  var createBuffer = window.createBuffer;
  var scrollHook = window.scrollHook;
  var positions = scrollHook.positions;
  var sandbox;
  var bufferSection;
  var oneEl;
  var twoEl;
  var threeEl;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    bufferSection = createBuffer();
    document.body.appendChild(bufferSection);
  });

  afterEach(function() {
    window.pageYOffset = 0;
    document.body.removeChild(bufferSection);
    sandbox.restore();
  });

  describe('.setThrottleTime()', function () {
    it('sets the interval between scroll event callbacks', function () {
      var expectedTime = 2000;

      scrollHook.setThrottleTime(expectedTime)
      expect(scrollHook._throttleTime).to.equal(expectedTime);
    });
  });

  describe('.register()', function () {
    it('creates a scroll hook for an element and its states', function () {
      var expectedInitial = [ 'one' ];
      var expectedFinal = [ 'and-done' ];
      var elementRepresentation;

      oneEl = document.createElement('div');
      oneEl.className = 'one';
      oneEl.style.height = '500px';
      document.body.appendChild(oneEl);

      expect(positions).to.be.empty;

      scrollHook.register(oneEl, {
        initialStates: expectedInitial,
        finalStates: expectedFinal
      });

      expect(positions).to.not.be.empty;

      elementRepresentation = scrollHook.events[positions[0]];
      expect(elementRepresentation).to.exist;
      expect(elementRepresentation).to
        .contain.all.keys('HTMLel', 'initialStates', 'finalStates');
      expect(elementRepresentation.initialStates).to.equal(expectedInitial);
      expect(elementRepresentation.finalStates).to.equal(expectedFinal);
    });

    it('can chain event creations', function () {
      twoEl = document.createElement('div');
      twoEl.style.height = '500px';
      document.body.appendChild(twoEl);

      threeEl = document.createElement('div');
      threeEl.style.height = '500px';
      document.body.appendChild(threeEl);

      document.body.appendChild(twoEl);
      document.body.appendChild(threeEl);

      var commonConfig = {
        finalStates: [ 'super-done', 'super-duper-done' ]
      };

      scrollHook.register(twoEl, commonConfig)
                .register(threeEl, commonConfig);

      expect(scrollHook.events[positions[1]]);
    });
  });

  describe('.determineMin()', function () {
    it('determines the first event to track and fire', function () {
      var expected = Math.min.apply(null, positions);

      scrollHook.determineMin();

      expect(scrollHook.min).to.equal(expected);
    });
  });

  describe('.transitionStates()', function () {
    it('removes the initialStates and adds the finalStates', function () {
      var oneElRepresentation = scrollHook.events[positions[0]];

      expect(oneEl.className).to.equal('one');

      scrollHook.transitionStates(oneElRepresentation);

      expect(oneEl.className).to.equal('and-done');
    });
  });

  describe('.transitionElements()', function () {
    it('transitions the states of all valid elements', function () {
      expect(twoEl.className).to.equal('');
      expect(threeEl.className).to.equal('');

      /* Do not call the scroll simulation helper here because that will
       * automatically call this function through the listener.
       */
      window.pageYOffset = 3000;
      scrollHook.transitionElements();

      expect(twoEl.className).to.equal('super-done super-duper-done');
      expect(threeEl.className).to.equal('super-done super-duper-done');
    });
  });

  describe('.createThrottle()', function () {
    it('generates a throttling function for wheel events', function (done) {
      scrollHook.setThrottleTime(1); // Make test run faster

      var eventSpy = sandbox.spy();
      var throttleCb = scrollHook.createThrottle('foobarEvent');

      expect(throttleCb).to.be.a('function');
      window.addEventListener('foobarEvent', eventSpy);

      throttleCb();

      // Only assert well after throttle time, to ensure the throttle worked.
      setTimeout(function () {
        expect(eventSpy).to.have.been.called;

        window.removeEventListener('foobarEvent', eventSpy);
        done();
      }, 51);
    });
  });

});
