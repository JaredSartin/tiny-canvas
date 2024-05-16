# tiny-canvas
A slim set of helpers for drawing and animating on a web canvas

Example use with Anime.js
``` JavaScript
// Setup the 
canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const tinyCanvas = new TinyCanvas(canvas);

// Prefer using a reference to the image to avoid loading it multiple times
const imageRef = new Image();
imageRef.src = '/particle.png';
const particles = [];
const length = 10;
for (let i = 0; i <= length; i += 1) {
  const x = tinyCanvas.width / 2;
  const y = -100 + (i * 20) + tinyCanvas.height / 2;
  const n = 15;
  // eslint-disable-next-line no-plusplus
  for (let j = 0; j < n; j++) {
    const sprite = new Sprite(imageRef);
    sprite.scale = anime.random(1, 4) / 10;
    sprite.anchor(0.5, 0.5);
    sprite.x = x + anime.random(-15, 15);
    sprite.y = y + anime.random(-15, 15);
    sprite.opacity = 0;
    particles.push(sprite);
    tinyCanvas.addDrawable(sprite);
  }
}

anime({
  loop: true,
  easing: 'linear',
  opacity: [
    { value: 1, duration: 50, delay: anime.stagger(2) },
    { value: 0, duration() { return anime.random(500, 1500); } },
  ],
  scale: { value: 0.05, duration: 500, delay: anime.stagger(2) },
  targets: particles,
  x: {
    value(sprite) {
      return sprite.x + anime.random(-120, 120);
    },
    duration: 1500,
    delay: anime.stagger(2),
  },
  y: {
    value(sprite) {
      return sprite.y + anime.random(-120, 120);
    },
    duration: 1500,
    delay: anime.stagger(2),
  },
});
```
