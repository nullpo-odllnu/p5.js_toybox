const FPS = 30;
const ParticleState = 
{
    init : 1, 
    alive : 2,
    fadeout : 3,
}

dt = 1.0 / FPS;
particleList = [];
particleIdCounter = 0;

colorfactor = {
    hue : 0,
    hueSpeed : 0,
    hueSpeedLifetime : 0,

    rgb : 0,
}

function setup()
{
    frameRate(FPS);
    noStroke();
    createCanvas(windowWidth, windowHeight, P2D);

    background(0);

    initColorfactor();
    colorfactor.hue = random(0, 360);
}

function addParticle()
{
    let createParticleCount = int(random(1, 3));
    const spreadFactor = 60.0;

    for (i = 0; i < createParticleCount; i++)
    {
        let direction = random(0, TWO_PI);
        let dx = cos(direction);
        let dy = sin(direction);
        let length = random(-spreadFactor, spreadFactor);

        let particle = {
            id : particleIdCounter++, 
            state : ParticleState.init,

            x : mouseX + dx * length, y : mouseY + dy * length, 
            color : colorfactor.rgb, alpha : 0.0, targetAlpha : random(0.3, 0.7),
            size : random(5, 15),
            lifetime : random(3.0, 5.0),

            fadeinFactor : random(1.0, 2.0),
            fadeoutFactor : random(1.0, 2.0),
            scaleFactor : random(-5, 5),
        };
        particleList.push(particle);
    }
}

function updateParticle()
{
    let aliveIdList = []

    for (i = 0; i < particleList.length; i++)
    {
       particle = particleList[i];

       switch(particle.state)
       {
            case ParticleState.init:
                particle.alpha += particle.fadeinFactor * dt;
                if (particle.alpha > particle.targetAlpha)
                {
                    particle.state = ParticleState.alive;
                }

                aliveIdList.push(i);
               break;
            case ParticleState.alive:
                particle.size += particle.scaleFactor * dt;
                particle.lifetime -= particle.fadeoutFactor * dt;
                
                aliveIdList.push(i);

                if (particle.lifetime < 0.0)
                {
                    particle.state = ParticleState.fadeout;
                }
                break;
            case ParticleState.fadeout:
                particle.alpha -= particle.fadeoutFactor * dt;
                if (particle.alpha > 0.0)
                {
                    aliveIdList.push(i);
                }
                break;
       }
    }

    let newParticleList = []
    aliveIdList.forEach(aliveId => {
        newParticleList.push(particleList[aliveId])
    });
    particleList = newParticleList;
}

function drawParticle()
{
    noStroke();
    particleList.forEach(particle => 
    {
        fill(red(particle.color), green(particle.color), blue(particle.color), 
        particle.alpha * 255.0);
        circle(particle.x, particle.y, particle.size);
    });
}

function initColorfactor()
{
    colorfactor.hueSpeed = random(-60.0, 60.0);
    colorfactor.hueSpeedLifetime = random(3.0, 6.0);
}

function updateColorfactor()
{
    colorfactor.hue += dt * colorfactor.hueSpeed;
    if (colorfactor.hue < 0.0)
    {
        colorfactor.hue = 360.0 + colorfactor.hue;
    }
    else if (colorfactor.hue >= 360.0)
    {
        colorfactor.hue = colorfactor.hue % 360.0;
    }

    colorfactor.hueSpeedLifetime -= dt;
    if (colorfactor.hueSpeedLifetime < 0.0)
    {
        initColorfactor();
    }

    colorMode(HSB, 360, 1, 1);
    colorfactor.rgb = color(colorfactor.hue, 0.7, 0.5);
    colorMode(RGB);
}

function draw()
{
    background(0);

    updateColorfactor();
    addParticle();
    updateParticle();
    drawParticle();

    fill(255);
    text('particle : ' + particleList.length, 10, 10, 200, 30);
}

function windowResized()
{
    createCanvas(windowWidth, windowHeight, P2D);

    background(0);
}
