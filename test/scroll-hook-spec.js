describe('ScrollHook', function () {
  'use strict';

  var scrollViewBottomTo = window.scrollViewBottomTo;
  var createBuffer = window.createBuffer;
  var scrollHook = window.scrollHook;
  var bufferSection
  var testEl;

  beforeEach(function() {
    bufferSection = createBuffer();
    document.body.appendChild(bufferSection);
  })

  afterEach(function() {
    window.pageYOffset = 0;
    document.body.removeChild(testEl);
    document.body.removeChild(bufferSection);
  });


  it('transitions classes when element is scrolled into view', function () {
    var initialState = 'foo';
    var expectedFinalState = 'bar';

    testEl = document.createElement('div');
    testEl.className = initialState;
    testEl.style.height = '400px';
    document.body.appendChild(testEl);

    scrollHook.register(testEl, {
      initialStates: initialState,
      finalStates: expectedFinalState
    });

    scrollHook.start();

    // 1008 is where the element is naturally (webkit adds 8px margins).
    scrollViewBottomTo(1008);
    expect(testEl.className).to.equal(expectedFinalState);
  });


  it('can transition classes dependent on a specified position', function () {
    var initialState = 'foo';
    var expectedFinalState = 'bar';
    var expectedPosition = 1100;

    testEl = document.createElement('div');
    testEl.className = initialState;
    testEl.style.height = '400px';
    document.body.appendChild(testEl);

    scrollHook.register(testEl, {
      position: expectedPosition,     // transition class at specific position
      initialStates: initialState,
      finalStates: expectedFinalState
    });

    scrollHook.start();


    scrollViewBottomTo(1008);        // Event normally would have fired here
    expect(testEl.className).to.equal(initialState);

    scrollViewBottomTo(expectedPosition);
    expect(testEl.className).to.equal(expectedFinalState);
  });


  it('can just remove initialStates, making finalStates optional', function () {
    var initialState = 'foo';

    testEl = document.createElement('div');
    testEl.className = initialState;
    testEl.style.height = '400px';
    document.body.appendChild(testEl);

    scrollHook.register(testEl, {
      initialStates: initialState
    });

    scrollHook.start();


    scrollViewBottomTo(1008);
    expect(testEl.className).to.equal('');
  });


  it('can remove multiple initialStates', function () {
    testEl = document.createElement('div');
    testEl.classList.add('one', 'two');
    testEl.style.height = '400px';
    document.body.appendChild(testEl);

    scrollHook.register(testEl, {
      initialStates: [ 'one', 'two' ]
    });

    scrollHook.start();


    expect(testEl.className).to.equal('one two');

    scrollViewBottomTo(1008);
    expect(testEl.className).to.equal('');
  });


  it('can just add finalStates, making initialStates optional', function () {
    var expectedFinalState = 'bar';

    testEl = document.createElement('div');
    testEl.style.height = '400px';
    document.body.appendChild(testEl);

    scrollHook.register(testEl, {
      finalStates: expectedFinalState
    });

    scrollHook.start();


    scrollViewBottomTo(1008);
    expect(testEl.className).to.equal(expectedFinalState);
  });


  it('can add multiple finalStates', function () {
    testEl = document.createElement('div');
    testEl.style.height = '400px';
    document.body.appendChild(testEl);

    scrollHook.register(testEl, {
      finalStates: ['three', 'four']
    });

    scrollHook.start();


    expect(testEl.className).to.equal('');

    scrollViewBottomTo(1008);
    expect(testEl.className).to.equal('three four');
  });

  it('removes positions to listen for as they are triggered', function () {
    var expectedPosition = 1100;

    testEl = document.createElement('div');
    testEl.style.height = '400px';
    document.body.appendChild(testEl);

    scrollHook.register(testEl, {
      position: expectedPosition,
      finalStates: ['three', 'four']
    });

    scrollHook.start();


    expect(scrollHook._positions).to.contain(expectedPosition);
    expect(scrollHook._events).to.include.keys(String(expectedPosition));

    scrollViewBottomTo(1100);
    expect(testEl.className).to.equal('three four');
    expect(scrollHook._positions).to.not.contain(expectedPosition);
    expect(scrollHook._events).to.not.include.keys(String(expectedPosition));
  });
});
