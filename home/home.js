/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */
/* eslint-disable no-return-assign */
const SPEED_OF_ANIMATION = 0.5;
const GRID_SIZE = 25;

/**
 * Key:
 *  ^b = backspace
 *    deletes character two behind `^`
 *    keeps character one behind `^`
 *    deletes `^b` from string
 */

let TEXT = 'njbce^brmga^bn';

document.addEventListener('DOMContentLoaded', () => {
  const animations = document.getElementById('animations');
  const textElem = document.getElementById('title');
  animations.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
  animations.style.gridTemplateRows = `repeat(${GRID_SIZE}, 1fr)`;
  // animations.innerHTML = '';
  let animationsArray = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => {
      const a = document.createElement('div');
      a.classList.add('animation');
      animations.appendChild(a);
      return a;
    })
  );
  let x = 0;
  let y = 0;
  function showAnimation(mode) {
    if (mode === 'ORDERED') {
      if (x !== 0) {
        animationsArray[y][x - 1].style.animation = 'fade ease 10s';
      }
      x += 1;
      if (y === GRID_SIZE) {
        y = 0;
        animations.innerHTML = '';
        animationsArray = Array.from({ length: GRID_SIZE }, () =>
          Array.from({ length: GRID_SIZE }, () => {
            const a = document.createElement('div');
            a.classList.add('animation');
            animations.appendChild(a);
            return a;
          })
        );
      }
      if (x === GRID_SIZE + 1) {
        x = 0;
        y += 1;
      }
    } else if (mode === 'RANDOM') {
      x = Math.floor(Math.random() * GRID_SIZE);
      y = Math.floor(Math.random() * GRID_SIZE);
      animationsArray[y][x].style.animation = 'fade ease 10s';
    }
  }

  const textInterval = setInterval(showText, SPEED_OF_ANIMATION * 1000);
  setInterval(blink, (SPEED_OF_ANIMATION / 2) * 1000);

  let i = 0;
  function showText() {
    if (i !== -1) {
      textElem.innerHTML = `${TEXT.slice(0, i)}<span id="blinker">|</span>`;
    }
    i += 1;
    if (i === TEXT.length + 1) {
      // clearInterval(textInterval);
      setTimeout(() => {
        TEXT = 'njbce^brmga^bn';
        i = 0;
      }, 500);
      return;
    }
    if (TEXT[i] === '^' && TEXT[i + 1] === 'b') {
      TEXT = TEXT.replace('^b', '');
      TEXT = TEXT.replace(TEXT[i - 2], '');
      return (i -= 2);
    }
  }

  let on = true;
  function blink() {
    const blinker = document.getElementById('blinker');
    blinker.style.visibility = on ? 'unset' : 'hidden';
    on = !on;
  }

  // showAnimation();
  // showText();
  setInterval(() => {
    // showAnimation('ORDERED');
    showAnimation('RANDOM');
  }, SPEED_OF_ANIMATION * 1000);
});
