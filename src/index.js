import planck from 'planck-js/dist/planck-with-testbed';

planck.testbed('Car', function(testbed) {
  
  testbed.speed = 1.3;
  testbed.hz = 50;

  var pl = planck, Vec2 = pl.Vec2;
  var world = new pl.World({
    gravity : Vec2(0, -20)
  });

  // wheel spring settings
  var HZ = 4.0;
  var ZETA = 0.7;
  var SPEED = 100.0;
  var wheelSize = 0.8;

  // level code
  var ground = world.createBody();
  var x = 0;

  var groundFD = {
    density : 0.0,
    friction : 0.6
  };

  var spawnArea = function() {
    ground.createFixture(pl.Edge(Vec2(-20.0, 0.0), Vec2(20.0, 0.0)), groundFD);
    x += 20;
  };

  var jump = function() {
    var hs = [ 0.25, 1.0, 4.0, 0.0, 0.0, -1.0, -2.0, -2.0, -1.25, 0.0 ];

    var y1 = 0.0, dx = 5.0;

    for (var i = 0; i < 10; ++i) {
      var y2 = hs[i];
      ground.createFixture(pl.Edge(Vec2(x, y1), Vec2(x + dx, y2)), groundFD);
      y1 = y2;
      x += dx;
    }
  };

  var hills = function() {
    var hs = [ 0.0, 0.25, 2.0, 5.0, 1.0, 0.0, 0.0, 1.0, 2.0, 0.0 ];
    var y1 = 0.0, dx = 5.0;

    for (var i = 0; i < hs.length; ++i) {
      var y2 = hs[i];
      ground.createFixture(pl.Edge(Vec2(x, y1), Vec2(x + dx, y2)), groundFD);
      y1 = y2;
      x += dx;
    }
  };

  var sloap = function() {
    var hs = [ 0.0, 1.0, 1.0, 0.0 ];
    var y1 = 0.0, dx = 20.0;

    for (var i = 0; i < hs.length; ++i) {
      var y2 = hs[i];
      ground.createFixture(pl.Edge(Vec2(x, y1), Vec2(x + dx, y2)), groundFD);
      y1 = y2;
      x += dx;
    }
  };

  var flatGround = function () {
    ground.createFixture(pl.Edge(Vec2(x, 0.0), Vec2(x + 40.0, 0.0)), groundFD);
    x += 40.0;

    ground.createFixture(pl.Edge(Vec2(x, 0.0), Vec2(x + 10.0, 5.0)), groundFD);
    x += 10.0;

    ground.createFixture(pl.Edge(Vec2(x, 5.0), Vec2(x + 40.0, 2.0)), groundFD);
    x += 40.0;

    ground.createFixture(pl.Edge(Vec2(x, 2.0), Vec2(x + 20, 0.0)), groundFD);
    x += 20;
  };

  // Teeter
  var teeterSection = function () {
    ground.createFixture(pl.Edge(Vec2(x, 0.0), Vec2(x + 40.0, 0.0)), groundFD);

    var teeter = world.createDynamicBody(Vec2(x + 20, 1.0));
    teeter.createFixture(pl.Box(10.0, 0.25), 1.0);
    world.createJoint(pl.RevoluteJoint({
      lowerAngle : -8.0 * Math.PI / 180.0,
      upperAngle : 8.0 * Math.PI / 180.0,
      enableLimit : true
    }, ground, teeter, teeter.getPosition()));
  
    teeter.applyAngularImpulse(100.0, true);

    x += 40;
  };

  // Bridge
  var bridge = function () {
    var bridgeFD = {};
    bridgeFD.density = 1.0;
    bridgeFD.friction = 0.6;
  
    var prevBody = ground;

    ground.createFixture(pl.Edge(Vec2(x, 0.0), Vec2(x + 10.0, 0.0)), groundFD);
    x += 11;
    
    for (var i = 0; i < 20; ++i) {
      var bridgeBlock = world.createDynamicBody(Vec2(x + 2.0 * i, -0.125));
      bridgeBlock.createFixture(pl.Box(1.0, 0.125), bridgeFD);

      world.createJoint(pl.RevoluteJoint({}, prevBody, bridgeBlock, Vec2(x + 2.0 * i, -0.125)));

      prevBody = bridgeBlock;
      
    }

    world.createJoint(pl.RevoluteJoint({}, prevBody, ground, Vec2(x + 2.0 * i, 0.0)));
    x += 39;

    ground.createFixture(pl.Edge(Vec2(x, -0.5), Vec2(x + 10.0, 0.0)), groundFD);
    x += 10;
  };


  // Boxes
  var box = pl.Box(0.5, 0.5);

  var boxHeight = [ 0.5, 1.5, 2.5, 3.5, 4.5];

  var boxes = function () {
    for (var i = 0; i < boxHeight.length; ++i) {
      world.createDynamicBody(Vec2(270, boxHeight[i]))
        .createFixture(box, 0.5);
    }
  };

  // create the level here
  // the numbers represent the order of the level ite, 4, 1, 2 ];

  var level0 = [ 0, 1 ];
  var level1 = [ 1, 3 ];

  var refernceLevelData = {
    0: spawnArea,
    1: hills,
    2: flatGround,
    3: jump,
    4: teeterSection,
    5: bridge
  };
  level0.forEach(step => refernceLevelData[step]());

  // Car
  var car = world.createDynamicBody(Vec2(0.0, 1.0));
  car.createFixture(pl.Polygon([
    Vec2(-1.5, -0.5),
    Vec2(1.5, -0.5),
    Vec2(1.5, 0.0),
    Vec2(0.0, 0.9),
    Vec2(-1.15, 0.9),
    Vec2(-1.5, 0.2)
  ]), 1.0);

  var car1 = world.createDynamicBody(Vec2(-5.0, 1.0));
  car1.createFixture(pl.Polygon([
    Vec2(-1.5, -0.5),
    Vec2(1.5, -0.5),
    Vec2(1.5, 0.75),
    Vec2(1.0, 1.5),
    Vec2(0.0, 1.5),
    Vec2(-1.5, 0.0)
  ]), 1.0);

  var wheelFD = {};
  wheelFD.density = 1.0;
  wheelFD.friction = 0.9;

  // attach back wheel to body
  var wheelBack = world.createDynamicBody(Vec2(-1.0, 0.35));
  wheelBack.createFixture(pl.Circle(wheelSize), wheelFD);

  // attach front wheel to body
  var wheelFront = world.createDynamicBody(Vec2(1.0, 0.4));
  wheelFront.createFixture(pl.Circle(wheelSize), wheelFD);

  // front wheel
  var springBack = world.createJoint(pl.WheelJoint({
    motorSpeed : 0.0,
    maxMotorTorque : 40.0,
    enableMotor : true,
    frequencyHz : HZ,
    dampingRatio : ZETA
  }, car, wheelBack, wheelBack.getPosition(), Vec2(0.0, 1.0)));

  // back wheel
  var springFront = world.createJoint(pl.WheelJoint({
    motorSpeed : 0.0,
    maxMotorTorque : 20.0,
    enableMotor : false,
    frequencyHz : HZ,
    dampingRatio : ZETA
  }, car, wheelFront, wheelFront.getPosition(), Vec2(0.0, 1.0)));


  var carPosition = car.getPosition();
  var carAngle = car.getAngle();

  // wheel spring controls
  testbed.keydown = function() {
    if (testbed.activeKeys.down) {
      HZ = Math.max(0.0, HZ - 1.0);
      springBack.setSpringFrequencyHz(HZ);
      springFront.setSpringFrequencyHz(HZ);
      console.log("Wheel Spring is: " + HZ);
      // car.angle = 0.0 * Math.PI / 180.0 // flip car - doesn't work
      console.log("Car's speed:", car.c_velocity);

    } else if (testbed.activeKeys.up) {
      HZ += 1.0;
      springBack.setSpringFrequencyHz(HZ);
      springFront.setSpringFrequencyHz(HZ);
      console.log("Wheel Spring is: " + HZ);
      console.log("Car's speed:", car.c_velocity);
      console.log("Car Angle: " + car.getAngle());
      console.log("Car X position: " + carPosition.x);
      console.log("Level length is: " + x);
      // car.setAngle = 0.0; // flip car??

    }
  };

  // forwards and back controls
  testbed.step = function() {
    if (testbed.activeKeys.right && testbed.activeKeys.left) {
      springBack.setMotorSpeed(0);
      springBack.enableMotor(true);

    } else if (testbed.activeKeys.right) {
      springBack.setMotorSpeed(-SPEED);
      springBack.enableMotor(true);

    } else if (testbed.activeKeys.left) {
      springBack.setMotorSpeed(+SPEED);
      springBack.enableMotor(true);

    } else {
      springBack.setMotorSpeed(0);
      springBack.enableMotor(false);
    }

    // camera control
    if (carPosition.x > testbed.x + 10) {
      testbed.x = carPosition.x - 10;

    } else if (carPosition.x < testbed.x - 10) {
      testbed.x = carPosition.x + 10;

    } else if (carPosition.x > x - 80){
      level1.forEach(step => refernceLevelData[step]());
    };
  };



  testbed.info('←/→: Accelerate car, ↑/↓: Change spring frequency');

  // debug menu
  // gravity
  // position
  // spring freq - done
  // velocity - done
  // accelertation - done
  console.log("The levels lenght is: " + x);


  return world;
});
