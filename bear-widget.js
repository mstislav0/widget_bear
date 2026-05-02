(function () {

  // ─── SVG bear (head rotation handled via JS transform) ───────────────────
  function makeBearSVG() {
    return `
    <svg id="bear-svg" viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg" width="88" height="88" style="overflow:visible">
      <defs>
        <radialGradient id="bw-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f0d9be"/>
          <stop offset="100%" stop-color="#c8a87a"/>
        </radialGradient>
        <radialGradient id="bw-belly" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stop-color="#faecd8"/>
          <stop offset="100%" stop-color="#e8c99a"/>
        </radialGradient>
        <radialGradient id="bw-face" cx="50%" cy="55%" r="50%">
          <stop offset="0%" stop-color="#faecd8"/>
          <stop offset="100%" stop-color="#e0bc94"/>
        </radialGradient>
      </defs>

      <!-- back of body — shown while climbing -->
      <g id="bear-body-back" style="opacity:0">
        <ellipse cx="44" cy="62" rx="22" ry="20" fill="#c8a87a"/>
        <!-- spine -->
        <line x1="44" y1="44" x2="44" y2="76" stroke="#b8946a" stroke-width="2.5" stroke-linecap="round"/>
        <!-- tail -->
        <circle cx="44" cy="80" r="6" fill="#d4b88a"/>
        <circle cx="44" cy="80" r="3.5" fill="#e8d0b0"/>
      </g>

      <!-- body front — belly visible -->
      <g id="bear-body">
        <ellipse cx="44" cy="62" rx="22" ry="20" fill="url(#bw-bg)"/>
        <ellipse cx="44" cy="64" rx="13" ry="12" fill="url(#bw-belly)"/>
      </g>

      <!-- arms — always visible, animate on top of both body views -->
      <g id="bear-arm-l">
        <ellipse cx="20" cy="62" rx="7" ry="5" fill="#c8a87a" transform="rotate(-20,20,62)"/>
        <circle cx="15" cy="64" r="4.5" fill="#b8946a"/>
        <circle cx="13.5" cy="60.5" r="1.5" fill="#a07850"/>
        <circle cx="16.5" cy="60.5" r="1.5" fill="#a07850"/>
        <circle cx="12"   cy="63"   r="1.5" fill="#a07850"/>
      </g>
      <ellipse id="bear-arm-r" cx="68" cy="58" rx="7" ry="5" fill="#c8a87a" transform="rotate(20,68,58)"/>
      <g id="bear-paw-r">
        <circle cx="73" cy="54" r="4.5" fill="#b8946a"/>
        <circle cx="74.5" cy="50.5" r="1.5" fill="#a07850"/>
        <circle cx="71.5" cy="50.5" r="1.5" fill="#a07850"/>
        <circle cx="76"   cy="53"   r="1.5" fill="#a07850"/>
      </g>

      <!-- feet — always visible -->
      <ellipse id="bear-foot-l" cx="35" cy="80" rx="8" ry="5" fill="#b8946a"/>
      <ellipse id="bear-foot-r" cx="53" cy="80" rx="8" ry="5" fill="#b8946a"/>

      <!-- back of head — shown while climbing (no face details) -->
      <g id="bear-head-back" style="opacity:0">
        <!-- back-of-ears: darker inner, no pink -->
        <circle cx="27" cy="30" r="10" fill="#b8946a"/>
        <circle cx="27" cy="30" r="6"  fill="#a07850"/>
        <circle cx="61" cy="30" r="10" fill="#b8946a"/>
        <circle cx="61" cy="30" r="6"  fill="#a07850"/>
        <!-- plain fur back of head -->
        <ellipse cx="44" cy="38" rx="21" ry="20" fill="#c8a87a"/>
        <!-- subtle spine line -->
        <line x1="44" y1="20" x2="44" y2="56" stroke="#b8946a" stroke-width="2.5" stroke-linecap="round"/>
      </g>

      <!-- front head group — hidden while climbing -->
      <g id="bear-head">
        <circle cx="27" cy="30" r="10" fill="#c8a87a"/>
        <circle cx="27" cy="30" r="6"  fill="#e8b89a"/>
        <circle cx="61" cy="30" r="10" fill="#c8a87a"/>
        <circle cx="61" cy="30" r="6"  fill="#e8b89a"/>
        <ellipse cx="44" cy="38" rx="21" ry="20" fill="url(#bw-face)"/>
        <ellipse cx="44" cy="44" rx="10" ry="7" fill="#e8c99a"/>
        <ellipse cx="44" cy="40.5" rx="4.5" ry="3" fill="#4a3728"/>
        <ellipse cx="43" cy="39.5" rx="1.4" ry="1" fill="#7a5a48" opacity="0.6"/>
        <g id="bear-eye-l">
          <circle cx="36.5" cy="34" r="4" fill="#2a1a10"/>
          <circle cx="38"   cy="32.5" r="1.4" fill="white"/>
        </g>
        <g id="bear-eye-r">
          <circle cx="51.5" cy="34" r="4" fill="#2a1a10"/>
          <circle cx="53"   cy="32.5" r="1.4" fill="white"/>
        </g>
        <path d="M40 45 Q44 49 48 45" fill="none" stroke="#4a3728" stroke-width="1.5" stroke-linecap="round"/>
      </g>
    </svg>`;
  }

  // ─── CSS ──────────────────────────────────────────────────────────────────
  const STYLES = `
    :host {
      position: fixed;
      z-index: 999999;
      pointer-events: none;
    }
    .bear-wrap {
      position: relative;
      width: 88px;
      height: 88px;
      pointer-events: auto;
      cursor: pointer;
      /* squash/stretch and lean driven by JS via CSS vars */
      --lean: 0deg;
      --squash-x: 1;
      --squash-y: 1;
    }

    /* whole-body squash & lean — JS writes --lean/--squash-x/--squash-y */
    #bear-svg {
      transform-origin: 44px 80px;
    }

    /* breathing */
    #bear-body { animation: breathe 3.2s ease-in-out infinite; transform-origin: 44px 70px; }

    /* feet walk */
    .walking #bear-foot-l { animation: foot-l 0.55s ease-in-out infinite; transform-origin: 35px 80px; }
    .walking #bear-foot-r { animation: foot-r 0.55s ease-in-out infinite; transform-origin: 53px 80px; }
    .walking #bear-arm-r  { animation: arm-walk 0.55s ease-in-out infinite; transform-origin: 62px 54px; }
    .walking #bear-arm-l  { animation: arm-walk-l 0.55s ease-in-out infinite; transform-origin: 20px 62px; }

    /* idle wave */
    .idle #bear-arm-r { animation: wave 2.4s ease-in-out infinite; transform-origin: 62px 54px; }

    #bear-eye-l, #bear-eye-r { animation: blink 4s step-end infinite; }

    @keyframes breathe {
      0%,100% { transform: scaleY(1);    }
      50%      { transform: scaleY(1.05); }
    }
    @keyframes foot-l {
      0%,100% { transform: rotate(0deg);   }
      50%      { transform: rotate(-26deg); }
    }
    @keyframes foot-r {
      0%,100% { transform: rotate(0deg);  }
      50%      { transform: rotate(26deg); }
    }
    @keyframes arm-walk {
      0%,100% { transform: rotate(0deg);   }
      50%      { transform: rotate(-22deg); }
    }
    @keyframes arm-walk-l {
      0%,100% { transform: rotate(0deg);  }
      50%      { transform: rotate(22deg); }
    }
    @keyframes wave {
      0%,100% { transform: rotate(0deg);   }
      25%      { transform: rotate(-32deg); }
      75%      { transform: rotate(12deg);  }
    }
    @keyframes blink {
      0%,90%,100% { transform: scaleY(1);    opacity: 1;   }
      93%,97%     { transform: scaleY(0.08); opacity: 0.7; }
    }

    /* speech bubble */
    .bubble {
      position: absolute;
      bottom: 96px;
      left: 50%;
      transform: translateX(-50%) scale(0.85);
      background: #fff;
      border: 2px solid #c8a87a;
      border-radius: 14px 14px 14px 4px;
      padding: 8px 12px;
      font-size: 13px;
      color: #4a3728;
      max-width: 180px;
      line-height: 1.4;
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
      opacity: 0;
      white-space: pre-line;
      transition: opacity 0.2s ease, transform 0.2s ease;
      pointer-events: none;
      text-align: center;
    }
    .bubble.show {
      opacity: 1;
      transform: translateX(-50%) scale(1);
    }
  `;

  // ─── shelves: bottom of viewport + any interactive elements ───────────────
  function collectShelves() {
    const shelves = [];
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // ground shelf (bottom of viewport)
    shelves.push({ x1: 0, x2: vw, y: vh - 10 });

    // scan interactive elements
    const tags = ['button','a','[role="button"]','input','select','textarea','h1','h2','nav','header','footer'];
    document.querySelectorAll(tags.join(',')).forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width < 20 || r.height < 4) return;
      if (r.bottom < 10 || r.top > vh) return;
      shelves.push({ x1: r.left, x2: r.right, y: r.top, el });
    });

    // sort top-to-bottom
    shelves.sort((a, b) => a.y - b.y);
    return shelves;
  }

  // find the shelf the bear should stand on given its center X
  function shelfUnderCursor(shelves, cursorY, bearX) {
    // pick the highest shelf that is below the cursor
    // and whose x-range contains the bear
    let best = null;
    for (const s of shelves) {
      if (s.x1 > bearX + 20 || s.x2 < bearX - 20) continue; // x out of range
      if (s.y > cursorY) { best = s; break; } // first shelf below cursor
    }
    if (!best) best = shelves[shelves.length - 1]; // fallback: ground
    return best;
  }

  // ─── main custom element ──────────────────────────────────────────────────
  class BearWidget extends HTMLElement {
    constructor() {
      super();
      this._shadow = this.attachShadow({ mode: 'open' });
      this._x = window.innerWidth / 2;
      this._y = window.innerHeight - 98;
      this._velX = 0;
      this._velY = 0;
      this._headAngle = 0;
      this._leanAngle = 0;
      this._squashX = 1;
      this._squashY = 1;
      this._landTimer = 0;

      // climbing state machine: 'ground' | 'climbing' | 'falling'
      this._state = 'ground';
      this._currentShelfY = null; // Y of the shelf bear is standing on
      this._targetShelf = null;   // next shelf to reach (one step at a time)
      this._falling = false;      // click-triggered drop

      this._mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      this._shelves = [];
      this._shelfUpdateTimer = null;
      this._bubbleTimer = null;
      this._messages = ["Hi! I'm here to help! 🐻", "Click me!", "Need anything?", "I'm watching 👀"];
      this._msgIdx = 0;
      this._facingRight = true;
      this._frame = 0;
    }

    connectedCallback() {
      const style = document.createElement('style');
      style.textContent = STYLES;

      this._wrap = document.createElement('div');
      this._wrap.className = 'bear-wrap idle';
      this._wrap.innerHTML = makeBearSVG();

      this._bubble = document.createElement('div');
      this._bubble.className = 'bubble';
      this._wrap.appendChild(this._bubble);

      this._shadow.appendChild(style);
      this._shadow.appendChild(this._wrap);

      this._svg      = this._wrap.querySelector('#bear-svg');
      this._head     = this._wrap.querySelector('#bear-head');
      this._headBack = this._wrap.querySelector('#bear-head-back');
      this._body     = this._wrap.querySelector('#bear-body');
      this._bodyBack = this._wrap.querySelector('#bear-body-back');

      this._wrap.addEventListener('click', () => this._onClick());

      // global mouse tracking
      this._onMouseMove = (e) => {
        this._mouse.x = e.clientX;
        this._mouse.y = e.clientY;
      };
      document.addEventListener('mousemove', this._onMouseMove);

      // refresh shelves on scroll/resize
      this._refreshShelves = () => {
        clearTimeout(this._shelfUpdateTimer);
        this._shelfUpdateTimer = setTimeout(() => { this._shelves = collectShelves(); }, 120);
      };
      window.addEventListener('resize', this._refreshShelves);
      window.addEventListener('scroll', this._refreshShelves, { passive: true });

      this._shelves = collectShelves();

      // place bear on ground shelf initially
      const ground = this._shelves[this._shelves.length - 1];
      this._y = ground.y - 88;
      this._currentShelfY = this._y;
      this._applyPosition();

      setTimeout(() => this._showMessage(this._messages[0]), 1000);

      this._loop();
    }

    disconnectedCallback() {
      document.removeEventListener('mousemove', this._onMouseMove);
      window.removeEventListener('resize', this._refreshShelves);
      window.removeEventListener('scroll', this._refreshShelves);
      if (this._rafId) cancelAnimationFrame(this._rafId);
    }

    _loop() {
      this._rafId = requestAnimationFrame(() => this._loop());
      this._frame++;

      const mx = this._mouse.x;
      const my = this._mouse.y;
      const bearCX = this._x + 44;

      // ── 1. refresh shelves if needed ───────────────────────────────────
      if (this._shelves.length === 0) this._shelves = collectShelves();

      // ── 2. determine which shelf cursor is pointing at ─────────────────
      const cursorShelf = shelfUnderCursor(this._shelves, my, bearCX);
      const cursorShelfY = cursorShelf.y - 88; // desired Y for bear top

      // ground shelf Y (always the bottom)
      const groundShelf = this._shelves[this._shelves.length - 1];
      const groundY = groundShelf.y - 88;

      // ── 3. FALLING state — triggered by click, bear drops to ground ───
      if (this._state === 'falling') {
        this._velY += 0.18;                   // slow gentle gravity
        this._velY = Math.min(this._velY, 2.5); // cap fall speed
        this._y += this._velY;

        // horizontal drift while falling
        this._velX *= 0.95;
        this._x += this._velX;

        // check landing on any shelf we pass through
        let landed = false;
        for (const s of [...this._shelves].reverse()) {
          const sy = s.y - 88;
          if (sy > this._y - this._velY && sy <= this._y && this._velY > 0) {
            this._y = sy;
            this._velY = 0;
            this._state = 'ground';
            this._currentShelfY = sy;
            this._landTimer = 14;
            landed = true;
            break;
          }
        }
        if (!landed && this._y >= groundY) {
          this._y = groundY;
          this._velY = 0;
          this._state = 'ground';
          this._currentShelfY = groundY;
          this._landTimer = 14;
        }

      // ── 4. CLIMBING state — slow upward crawl to next shelf ───────────
      } else if (this._state === 'climbing') {
        const ts = this._targetShelf;
        if (!ts) { this._state = 'ground'; }
        else {
          const destY = ts.y - 88;
          const goingUp = destY < this._y;

          // move toward destY at fixed climb speed
          const step = goingUp ? -1.2 : 1.0;
          this._y += step;

          // wobble X slightly while climbing
          this._x += Math.sin(this._frame * 0.18) * 0.3;

          const arrived = goingUp ? this._y <= destY : this._y >= destY;
          if (arrived) {
            this._y = destY;
            this._currentShelfY = destY;
            this._targetShelf = null;
            this._state = 'ground';
            this._landTimer = 8;
          }
        }

      // ── 5. GROUND state — walk horizontally, decide whether to climb ──
      } else {
        // walk toward cursor X on current shelf
        const currentShelf = this._nearestShelfAtY(this._currentShelfY ?? groundY);
        const shelfX1 = currentShelf ? currentShelf.x1 : 0;
        const shelfX2 = currentShelf ? currentShelf.x2 : window.innerWidth;
        const clampedTargetX = Math.max(shelfX1 - 20, Math.min(shelfX2 - 68, mx - 44));
        const dx = clampedTargetX - this._x;

        const accel = dx * 0.018;
        this._velX += accel;
        this._velX *= 0.78;
        this._velX = Math.max(-1.5, Math.min(1.5, this._velX));
        this._x += this._velX;

        // should bear go up? find the next shelf above current that cursor is above
        if (cursorShelfY < (this._currentShelfY ?? groundY) - 10) {
          // find the shelf immediately above the bear (one step at a time)
          const nextUp = this._nextShelfAbove(this._currentShelfY ?? groundY, bearCX);
          if (nextUp && nextUp.y - 88 >= cursorShelfY - 5) {
            this._targetShelf = nextUp;
            this._state = 'climbing';
          }
        }

        // should bear go down? climb down to next shelf below
        if (cursorShelfY > (this._currentShelfY ?? groundY) + 10) {
          const nextDown = this._nextShelfBelow(this._currentShelfY ?? groundY, bearCX);
          if (nextDown) {
            this._targetShelf = nextDown;
            this._state = 'climbing';
          }
        }

        // snap Y to current shelf
        const snapY = this._currentShelfY ?? groundY;
        this._y += (snapY - this._y) * 0.25;
      }

      // ── 6. squash & stretch ────────────────────────────────────────────
      if (this._landTimer > 0) {
        this._landTimer--;
        const t = this._landTimer / 14;
        const sq = t > 0.5 ? 1 - (t - 0.5) * 0.45 : 1 + (0.5 - t) * 0.14;
        this._squashX = 1 + (1 / Math.max(sq, 0.5) - 1);
        this._squashY = sq;
      } else if (this._state === 'falling') {
        const stretch = Math.min(1 + Math.abs(this._velY) * 0.02, 1.2);
        this._squashX = 1 / stretch;
        this._squashY = stretch;
      } else {
        this._squashX += (1 - this._squashX) * 0.18;
        this._squashY += (1 - this._squashY) * 0.18;
      }

      // ── 7. body lean ───────────────────────────────────────────────────
      const isMovingH = Math.abs(this._velX) > 0.25;
      const isClimbing = this._state === 'climbing';

      if (isMovingH) this._facingRight = this._velX > 0;

      if (isClimbing) {
        this._wrap.classList.add('walking');
        this._wrap.classList.remove('idle');
        this._leanAngle += (0 - this._leanAngle) * 0.1;
      } else if (isMovingH) {
        this._wrap.classList.add('walking');
        this._wrap.classList.remove('idle');
        this._leanAngle += (this._velX * 5 - this._leanAngle) * 0.12;
      } else {
        this._wrap.classList.remove('walking');
        this._wrap.classList.add('idle');
        this._leanAngle += (0 - this._leanAngle) * 0.1;
      }

      // ── 8. apply transforms ────────────────────────────────────────────
      // _climbFlip: 0 = facing viewer, 1 = back to viewer
      // We achieve "back to viewer" by flipping scaleX so the bear faces
      // into the screen (away from us). The SVG back-of-head is just the
      // reverse of the front — ears/fur still visible, face hidden.
      if (this._climbFlip === undefined) this._climbFlip = 0;
      const climbTarget = (this._state === 'climbing') ? 1 : 0;
      this._climbFlip += (climbTarget - this._climbFlip) * 0.10;

      const dirSign = this._facingRight ? 1 : -1;
      this._svg.style.transform =
        `scaleX(${dirSign * this._squashX}) scaleY(${this._squashY}) rotate(${this._leanAngle}deg)`;
      this._svg.style.transformOrigin = '44px 44px';

      // ── 9. crossfade front/back for head and body ─────────────────────
      this._head.style.opacity     = 1 - this._climbFlip;
      this._headBack.style.opacity = this._climbFlip;
      this._body.style.opacity     = 1 - this._climbFlip;
      this._bodyBack.style.opacity = this._climbFlip;

      // head rotation: cursor-tracking when front visible, neutral when back
      if (this._climbFlip < 0.5) {
        const rect = this._wrap.getBoundingClientRect();
        const rawAngle = Math.atan2(my - (rect.top + 38), mx - (rect.left + 44)) * (180 / Math.PI);
        const localAngle = rawAngle - (this._facingRight ? 0 : 180);
        const targetHeadAngle = Math.max(-48, Math.min(48, localAngle));
        this._headAngle += (targetHeadAngle - this._headAngle) * 0.10;
      } else {
        this._headAngle += (0 - this._headAngle) * 0.10;
      }
      // apply to both so they rotate in sync during the crossfade
      this._head.style.transform     = `rotate(${this._headAngle}deg)`;
      this._head.style.transformOrigin     = '44px 38px';
      this._headBack.style.transform = `rotate(${this._headAngle}deg)`;
      this._headBack.style.transformOrigin = '44px 38px';

      // ── 10. apply position ─────────────────────────────────────────────
      this._applyPosition();
    }

    // shelf directly above bearY that overlaps bearX
    _nextShelfAbove(bearY, bearX) {
      let best = null;
      for (const s of this._shelves) {
        const sy = s.y - 88;
        if (sy >= bearY - 5) continue;             // must be above
        if (s.x1 > bearX + 30 || s.x2 < bearX - 30) continue; // must overlap X
        if (!best || sy > best.y - 88) best = s;   // closest above
      }
      return best;
    }

    // shelf directly below bearY that overlaps bearX
    _nextShelfBelow(bearY, bearX) {
      let best = null;
      for (const s of this._shelves) {
        const sy = s.y - 88;
        if (sy <= bearY + 5) continue;
        if (s.x1 > bearX + 30 || s.x2 < bearX - 30) continue;
        if (!best || sy < best.y - 88) best = s;
      }
      return best;
    }

    // shelf whose Y is closest to given Y
    _nearestShelfAtY(y) {
      let best = null, bestD = Infinity;
      for (const s of this._shelves) {
        const d = Math.abs(s.y - 88 - y);
        if (d < bestD) { bestD = d; best = s; }
      }
      return best;
    }

    _applyPosition() {
      const vw = window.innerWidth;
      const safeX = Math.max(0, Math.min(vw - 88, this._x));
      this.style.left = safeX + 'px';
      this.style.top  = this._y + 'px';
    }

    _onClick() {
      this._msgIdx = (this._msgIdx + 1) % this._messages.length;

      // if climbing or on elevated shelf — drop!
      const groundY = this._shelves.length
        ? this._shelves[this._shelves.length - 1].y - 88
        : window.innerHeight - 98;

      if (this._state === 'climbing' || (this._currentShelfY !== null && this._currentShelfY < groundY - 10)) {
        this._state = 'falling';
        this._targetShelf = null;
        this._velY = 0;
        this._velX = (Math.random() - 0.5) * 3; // small sideways nudge
        this._showMessage("Waaah! 😱");
      } else {
        this._showMessage(this._messages[this._msgIdx]);
      }

      this.dispatchEvent(new CustomEvent('bear-click', { bubbles: true, detail: { index: this._msgIdx } }));
    }

    _showMessage(text) {
      this._bubble.textContent = text;
      this._bubble.classList.add('show');
      clearTimeout(this._bubbleTimer);
      this._bubbleTimer = setTimeout(() => this._bubble.classList.remove('show'), 4000);
    }

    setMessages(arr) {
      if (Array.isArray(arr) && arr.length) {
        this._messages = arr;
        this._msgIdx = 0;
      }
    }

    showMessage(text) { this._showMessage(text); }
  }

  customElements.define('bear-widget', BearWidget);
})();
