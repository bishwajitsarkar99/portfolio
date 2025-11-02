export function customCursor(inputClass, cursorClass) {
    const inputs = document.querySelectorAll(inputClass);

    inputs.forEach(input => {
        const wrapper = input.closest('.input-wrapper');
        const caret = wrapper.querySelector(cursorClass);

        if (!caret) return;

        function updateCaret() {
            // text before caret
            const text = input.value.substring(0, input.selectionStart);

            // measure width of that text
            const span = document.createElement("span");
            span.style.visibility = "hidden";
            span.style.position = "absolute";
            span.style.whiteSpace = "pre";
            span.style.font = window.getComputedStyle(input).font;
            span.textContent = text;
            document.body.appendChild(span);

            const textWidth = span.offsetWidth;
            document.body.removeChild(span);

            // input padding
            const inputStyle = window.getComputedStyle(input);
            const paddingLeft = parseInt(inputStyle.paddingLeft, 20);

            // account for scroll inside input
            const scrollOffset = input.scrollLeft;

            // final caret position
            caret.style.left = (paddingLeft + textWidth - scrollOffset) + "px";
        }

        input.addEventListener("focus", () => {
            caret.style.display = "inline-block";
            updateCaret();
        });

        input.addEventListener("blur", () => {
            caret.style.display = "none";
        });

        ["input", "click", "keyup", "keydown", "scroll"].forEach(evt => {
            input.addEventListener(evt, updateCaret);
        });
    });
}
// hoverWeave.js
export function hoverWeaveEffect(selector, intensity = 20, speed = 0.2) {
  const elements = document.querySelectorAll(selector);

  elements.forEach(el => {
    el.style.transition = `transform ${speed}s ease-out, box-shadow ${speed}s ease-out`;
    el.style.willChange = 'transform, box-shadow';
    el.style.transformOrigin = 'center center';

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const moveX = ((x - centerX) / centerX) * intensity;
      const moveY = ((y - centerY) / centerY) * intensity;

      el.style.transform = `
        translate(${moveX / 2}px, ${moveY / 2}px)
        rotateX(${moveY / 3}deg)
        rotateY(${-moveX / 3}deg)
        scale(1.1)
      `;
      el.style.boxShadow = `${-moveX / 2}px ${moveY / 2}px 30px rgba(0,0,0,0.25)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0,0) rotateX(0) rotateY(0) scale(1)';
      el.style.boxShadow = '0 0 20px rgba(0,0,0,0.1)';
    });
  });
}
// slider image
export function initImageSlider(imageSlider) {
  let currentState = 0;
  let timer = null;

  // Update image and text content
  function updateSlide() {
    const imageBody = document.querySelector(".image-body");
    const title = document.querySelector(".text-part h1");
    const body = document.querySelector(".text-part p");

    if (!imageBody) return;

    const current = imageSlider[currentState];

    imageBody.style.backgroundImage = `url(${current.url})`;
    imageBody.style.backgroundPosition = "center";
    imageBody.style.backgroundSize = "cover";
    imageBody.style.height = "100%";
    imageBody.style.borderRadius = "5px";
    imageBody.style.classList ="weave-img";

    title.textContent = current.title;
    body.textContent = current.body;

    // Highlight active bullet
    const bullets = document.querySelectorAll(".carousel-button span");
    bullets.forEach((b, i) => {
      b.classList.toggle("active", i === currentState);
    });
  }

  // Go to specific slide
  function goToNext(index) {
    currentState = index;
    updateSlide();
    resetAutoSlide();
  }

  // Automatic slide rotation
  function startAutoSlide() {
    timer = setInterval(() => {
      currentState = (currentState + 1) % imageSlider.length;
      updateSlide();
    }, 3000);
  }

  // Reset timer when user clicks manually
  function resetAutoSlide() {
    clearInterval(timer);
    startAutoSlide();
  }

  // Initialize slider
  function init() {
    const buttonContainer = document.querySelector(".carousel-button");
    imageSlider.forEach((_, i) => {
      const span = document.createElement("span");
      span.addEventListener("click", () => goToNext(i));
      buttonContainer.appendChild(span);
    });

    updateSlide();
    startAutoSlide();
  }

  document.addEventListener("DOMContentLoaded", init);
}
// mouse pointer marble
export function initMouseMarbleEffect(selector, marbleId, selectorElement) {
  document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector(selector);
    const marble = document.getElementById(marbleId);

    if (!content) {
      console.warn('No .hero-section found — pointermove will not run.');
      return;
    }
    if (!marble) {
      console.warn('No #marble-cursor found — marble will not show.');
      // continue — image effects can still work
    }

    // Use images inside hero (defensive)
    const contentElements = Array.from(content.querySelectorAll(selectorElement));
    if (contentElements.length === 0) {
      console.warn('No images found inside .hero-section. Check selector.');
    }

    let isInside = false;
    const intensity = 20; // change sensitivity

    // helper to check if an element is overlapped/blocked visually
    function elementReceivesPointer(el) {
      const style = getComputedStyle(el);
      return style.pointerEvents !== 'none' && style.visibility !== 'hidden' && style.display !== 'none';
    }

    // show/hide marble inside hero
    content.addEventListener('pointerenter', (e) => {
      isInside = true;
      if (marble){
        marble.style.opacity = '1';
      } 
    });
    
    // move marble — pointermove works where mousemove might be blocked
    content.addEventListener('pointermove', (e) => {
      if (!isInside || !marble) return;
      const rect = content.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // translate by minus half marble size to center it
      const mx = Math.round(x - (marble.offsetWidth || 20) / 2);
      const my = Math.round(y - (marble.offsetHeight || 20) / 2);
      marble.style.transform = `translate(${mx}px, ${my}px)`;
    });

    content.addEventListener('pointerleave', (e) => {
      isInside = false;
      if (marble){
        marble.style.opacity = '0';
      } 
    });

    // If you still want to support older browsers/devices that don't fire pointer events,
    // add a mousemove fallback on hero:
    content.addEventListener('mousemove', (e) => {
      if (!isInside || !marble) return;
      const rect = content.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const mx = Math.round(x - (marble.offsetWidth || 20) / 2);
      const my = Math.round(y - (marble.offsetHeight || 20) / 2);
      marble.style.transform = `translate(${mx}px, ${my}px)`;
    });

    // image hover + pointermove effect
    contentElements.forEach(el => {
      // defensive: skip images that won't receive pointer events
      if (!elementReceivesPointer(el)) {
        return;
      }

      // base styles for smoothness
      el.style.transition = 'transform 0.18s ease-out, filter 0.18s ease-out, box-shadow 0.18s ease-out';
      el.style.transformOrigin = 'center center';
      el.style.willChange = 'transform, box-shadow';

      // enlarge marble on image hover
      el.addEventListener('pointerenter', () => {
        if (marble) {
          marble.style.width = '80px';
          marble.style.height = '80px';
          marble.style.background = 'radial-gradient(circle at 30% 30%, rgba(0,0,0,0.06), rgba(181,150,255,0.4), transparent 80%)';
          marble.style.animation = 'marbleHoverPulse 1.5s ease-in-out infinite';
        }
      });

      // main pointermove for per-image parallax
      el.addEventListener('pointermove', (e) => {
        // stop if the element isn't visible or pointer capture happened elsewhere
        if (!elementReceivesPointer(el)) return;

        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // normalized -1..1
        const nx = (x - centerX) / centerX;
        const ny = (y - centerY) / centerY;

        const moveX = nx * intensity; // px translation
        const moveY = ny * intensity;

        // tilt + translation + scale
        el.style.transform = `
          perspective(600px)
          rotateX(${(-ny * 8).toFixed(2)}deg)
          rotateY(${(nx * 8).toFixed(2)}deg)
          translate(${(moveX/3).toFixed(2)}px, ${(moveY/3).toFixed(2)}px)
          scale3d(1.05)
        `;
        el.style.boxShadow = `${(-moveX/2).toFixed(0)}px ${(moveY/2).toFixed(0)}px 28px rgba(0,0,0,0.22)`;
        el.style.filter = 'brightness(1.15) saturate(1.08)';
        el.style.animation = 'marbleHoverPulse 1.5s ease-in-out infinite';
      });

      // reset on leave
      el.addEventListener('pointerleave', () => {
        if (marble) {
          marble.style.width = '20px';
          marble.style.height = '20px';
          marble.style.background = 'radial-gradient(circle at 30% 30%, oklch(0.491 0.27 292.581), oklch(0.491 0.27 292.581), transparent 70%)';
          marble.style.animation = 'none';
        }
        el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translate(0,0) scale(1)';
        el.style.boxShadow = 'none';
        el.style.filter = 'brightness(1) saturate(1)';
        el.style.animation = 'none';
      });
    });
  });
}
// =========== Button Border Animation Color ===================
export function buttonBorderAnimation(connectionPathSelector, borderSelector, activeClass) {
  document.querySelectorAll('.button-container').forEach(container => {
    const border = container.querySelector(borderSelector);
    const svg = container.querySelector('svg.connectorSVG');
    const rectEl = container.querySelector(connectionPathSelector);

    if (!rectEl || !border || !svg) return;

    // get size of border element
    const rect = border.getBoundingClientRect();
    const w = Math.max(0, Math.round(rect.width));
    const h = Math.max(0, Math.round(rect.height));

    // make SVG match element size and set viewBox so coordinates align
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('width', `${w}px`);
    svg.setAttribute('height', `${h}px`);

    // set rectangle size to fill svg
    rectEl.setAttribute('width', w);
    rectEl.setAttribute('height', h);
    rectEl.setAttribute('x', 0);
    rectEl.setAttribute('y', 0);
    rectEl.setAttribute('rx', 12);
    rectEl.setAttribute('ry', 12);

    // visible stroke when active
    if (border.classList.contains(activeClass)) {
      rectEl.style.stroke = 'rgba(0,128,255,0.8)';
      rectEl.style.strokeWidth = '2';          // <--- important, make it visible
      rectEl.style.strokeDasharray = '5 5';
      rectEl.style.strokeDashoffset = '0';
      // re-trigger animation
      rectEl.style.animation = 'none';
      void rectEl.offsetWidth; // force reflow
      rectEl.style.animation = 'dashmove 1s linear infinite';
    } else {
      // hide stroke when inactive
      rectEl.style.stroke = 'transparent';
      rectEl.style.strokeWidth = '0';
      rectEl.style.strokeDasharray = 'none';
      rectEl.style.animation = 'none';
    }
  });
}
// ========== Rectangle Solidator ==========
export function initRectangleSolidator(){
  document.addEventListener("DOMContentLoaded", () => {
    const svgLayer = document.querySelector("#connectionLayer");
    const color = "#4e73df";
  
    // current targets
    const targetIds = [ "skill", "languages", "framework", "tool", "library", "database" ];
  
    // Create connector group elements dynamically
    function createConnectorElements(index) {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("class", "connectorGroup");
      group.setAttribute("data-connector", index);
  
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.classList.add("connectorLine");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-width", "2");
  
      const startSocket = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      startSocket.classList.add("startSocket");
      startSocket.setAttribute("r", "6");
  
      const endSocket = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      endSocket.classList.add("endSocket");
      endSocket.setAttribute("points", "0,4 8,0 0,4"); // 0,-4 8,0 0,4
  
      group.appendChild(path);
      group.appendChild(startSocket);
      group.appendChild(endSocket);
      svgLayer.appendChild(group);
  
      return { group, path, startSocket, endSocket };
    }
  
    const connectors = targetIds.map((id, i) => ({
      id,
      svg: document.querySelector(`#${id} .connectorSVG`),
      ...createConnectorElements(i)
    }));
  
    function updateConnections() {
      const cube = document.querySelector("#connectorSolidator");
      if (!cube) return;
  
      const layerRect = svgLayer.getBoundingClientRect();
      const cubeRect = cube.getBoundingClientRect();
  
      const startX = cubeRect.left + cubeRect.width / 2 - layerRect.left;
      const startY = cubeRect.top + cubeRect.height / 2 - layerRect.top;
  
      connectors.forEach(({ svg, path, startSocket, endSocket, group }) => {
        // ✅ Hide or skip connector group if target doesn't exist
        if (!svg || !svg.getBoundingClientRect) {
          group.style.display = "none";
          return;
        }
  
        const targetRect = svg.getBoundingClientRect();
  
        // Skip invisible (0x0) elements
        if (targetRect.width === 0 || targetRect.height === 0) {
          group.style.display = "none";
          return;
        }
  
        group.style.display = "block"; // re-enable visible ones
  
        const targetIsRight = targetRect.left > cubeRect.right;
        const targetIsLeft = targetRect.right < cubeRect.left;
  
        let endX, endY;
  
        if (targetIsRight) {
          endX = targetRect.left - layerRect.left;
          endY = targetRect.top + targetRect.height / 2 - layerRect.top;
        } else if (targetIsLeft) {
          endX = targetRect.right - layerRect.left;
          endY = targetRect.top + targetRect.height / 2 - layerRect.top;
        } else {
          endX = targetRect.left + targetRect.width / 2 - layerRect.left;
          endY = targetRect.top + targetRect.height / 2 - layerRect.top;
        }
  
        const distanceX = Math.abs(endX - startX);
        const controlOffset = Math.max(40, distanceX * 0.3);
  
        const curve = `
          M ${startX} ${startY}
          C ${startX + controlOffset} ${startY},
          ${endX - controlOffset} ${endY},
          ${endX} ${endY}
        `;
  
        path.setAttribute("d", curve.trim());
        path.setAttribute("stroke", color);
        path.setAttribute("stroke-width", "2");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        path.setAttribute("fill", "none");
        path.style.strokeDasharray = "6";
        path.style.animation = "dashMove 1.5s linear infinite";
  
        startSocket.setAttribute("fill", color);
        startSocket.setAttribute("cx", startX);
        startSocket.setAttribute("cy", startY);
  
        const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
        endSocket.setAttribute("transform", `translate(${endX}, ${endY}) rotate(${angle})`);
        endSocket.setAttribute("fill", color);
      });
    }
  
    updateConnections();
    window.addEventListener("resize", updateConnections);
    setInterval(updateConnections, 500);
  
  });
}
// ========== Polygon Solidator ==========
export function initPolygonSolidator(){
  document.addEventListener("DOMContentLoaded", () => {
    const svgLayer = document.querySelector("#connectionPloyLayer");
    const color = "#4e73df";

    // current targets
    const targetIds = [ "php", "tailwind", "postman", "jquery", "mySql" ];

    // Create connector group elements dynamically
    function createConnectorElements(index) {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("class", "connectorGroup");
      group.setAttribute("data-connector", index);

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.classList.add("connectorPolyLine");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-width", "2");

      const startSocket = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      startSocket.classList.add("startSocket");
      startSocket.setAttribute("r", "6");

      const endSocket = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      endSocket.classList.add("endSocket");
      endSocket.setAttribute("points", "0,4 8,0 0,4"); // 0,-4 8,0 0,4

      group.appendChild(path);
      group.appendChild(startSocket);
      group.appendChild(endSocket);
      svgLayer.appendChild(group);

      return { group, path, startSocket, endSocket };
    }

    const connectors = targetIds.map((id, i) => ({
      id,
      svg: document.querySelector(`#${id} .connectorSVG`),
      ...createConnectorElements(i)
    }));

    function updateConnections() {
      const cube = document.querySelector("#polygonSolidator");
      if (!cube) return;

      const layerRect = svgLayer.getBoundingClientRect();
      const cubeRect = cube.getBoundingClientRect();

      const startX = cubeRect.left + cubeRect.width / 2 - layerRect.left;
      const startY = cubeRect.top + cubeRect.height / 2 - layerRect.top;

      connectors.forEach(({ svg, path, startSocket, endSocket, group }) => {
        // ✅ Hide or skip connector group if target doesn't exist
        if (!svg || !svg.getBoundingClientRect) {
          group.style.display = "none";
          return;
        }

        const targetRect = svg.getBoundingClientRect();

        // Skip invisible (0x0) elements
        if (targetRect.width === 0 || targetRect.height === 0) {
          group.style.display = "none";
          return;
        }

        group.style.display = "block"; // re-enable visible ones

        const targetIsRight = targetRect.left < cubeRect.right;
        const targetIsLeft = targetRect.right > cubeRect.left;

        let endX, endY;

        if (targetIsLeft) {
          endX = targetRect.left - layerRect.left;
          endY = targetRect.top + targetRect.height / 2 - layerRect.top;
        } else if (targetIsRight) {
          endX = targetRect.right - layerRect.left;
          endY = targetRect.top + targetRect.height / 2 - layerRect.top;
        } else {
          endX = targetRect.right + targetRect.width / 2 - layerRect.right;
          endY = targetRect.top + targetRect.height / 2 - layerRect.top;
        }

        const distanceX = Math.abs(endX - startX);
        const controlOffset = Math.max(40, distanceX * 0.08);

        const curve = `
          M ${startX} ${startY}
          C ${startX + controlOffset} ${startY},
          ${endX - controlOffset} ${endY},
          ${endX} ${endY}
        `;

        path.setAttribute("d", curve.trim());
        path.setAttribute("stroke", color);
        path.setAttribute("stroke-width", "2");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        path.setAttribute("fill", "none");
        path.style.strokeDasharray = "6";
        path.style.animation = "dashPolyMove 1.5s linear infinite";

        startSocket.setAttribute("fill", color);
        startSocket.setAttribute("cx", startX);
        startSocket.setAttribute("cy", startY);

        const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
        endSocket.setAttribute("transform", `translate(${endX}, ${endY}) rotate(${angle})`);
        endSocket.setAttribute("fill", color);
      });
    }

    updateConnections();
    window.addEventListener("resize", updateConnections);
    setInterval(updateConnections, 500);

  });
}
// ========== Sub Line Connector ==========
export function initSubLineConnector(){
  document.addEventListener("DOMContentLoaded", () => {
    // initi connect layer
    const svgLayer = document.querySelector("#connectionLanguageLayer");
    const svgSecondLayer = document.querySelector("#connectionFrameworkLayer");
    const svgThirdLayer = document.querySelector("#connectionToolsLayer");
    const svgFourLayer = document.querySelector("#connectionLibarayLayer");
    const svgFiveLayer = document.querySelector("#connectionDatabaseLayer");
    const color = "#4e73df";

    // Target IDs in connection order
    const targetIds = ["languages", "html", "css", "javascript", "php"];
    const targetSecondIds = ["framework", "laravel", "bootstrap", "tailwind"];
    const targetThirdIds = ["tool", "git", "gitHub", "npm", "vsCode", "postman"];
    const targetFourIds = ["library", "react", "jquery"];
    const targetFiveIds = ["database", "mySql"];

    // Helper to create a line
    function createLine(parent) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("stroke", color);
      line.setAttribute("stroke-width", "2");
      line.setAttribute("stroke-linecap", "round");
      line.setAttribute("stroke-dasharray", "6");
      line.style.animation = "dashMove 1.5s linear infinite";
      parent.appendChild(line);
      return line;
    }

    // Create lines separately for each layer
    const linesLanguage = targetIds.slice(0, -1).map(() => createLine(svgLayer));
    const linesFramework = targetSecondIds.slice(0, -1).map(() => createLine(svgSecondLayer));
    const linesTool = targetThirdIds.slice(0, -1).map(() => createLine(svgThirdLayer));
    const linesLibray = targetFourIds.slice(0, -1).map(() => createLine(svgFourLayer));
    const lineDatabase = targetFiveIds.slice(0, -1).map(() => createLine(svgFiveLayer));

    // Update positions dynamically
    function updateConnections() {
      const layerRect = svgLayer.getBoundingClientRect();
      const secondLayerRect = svgSecondLayer.getBoundingClientRect();
      const thirdLayerRect = svgThirdLayer.getBoundingClientRect();
      const fourLayerRect = svgFourLayer.getBoundingClientRect();
      const fiveLayerRect = svgFiveLayer.getBoundingClientRect();

      // Language layer connections
      for (let i = 0; i < targetIds.length - 1; i++) {
        const fromEl = document.getElementById(targetIds[i]);
        const toEl = document.getElementById(targetIds[i + 1]);
        if (!fromEl || !toEl) continue;

        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();

        const x1 = fromRect.right - layerRect.left;
        const y1 = fromRect.top + fromRect.height / 2 - layerRect.top;
        const x2 = toRect.left - layerRect.left;
        const y2 = toRect.top + toRect.height / 2 - layerRect.top;

        const line = linesLanguage[i];
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
      }
      // Framework layer connections
      for (let i = 0; i < targetSecondIds.length - 1; i++) {
        const fromEl = document.getElementById(targetSecondIds[i]);
        const toEl = document.getElementById(targetSecondIds[i + 1]);
        if (!fromEl || !toEl) continue;

        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();

        const x1 = fromRect.right - secondLayerRect.left;
        const y1 = fromRect.top + fromRect.height / 2 - secondLayerRect.top;
        const x2 = toRect.left - secondLayerRect.left;
        const y2 = toRect.top + toRect.height / 2 - secondLayerRect.top;

        const line = linesFramework[i];
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
      }
      // Tools Layer Connection
      for (let i= 0; i < targetThirdIds.length -1; i++) {
        const fromEl = document.getElementById(targetThirdIds[i]);
        const toEl = document.getElementById(targetThirdIds[i + 1]);

        if(!fromEl || !toEl) continue;

        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();
        
        const x1 = fromRect.right - thirdLayerRect.left;
        const y1 = fromRect.top + fromRect.height / 2 - thirdLayerRect.top;
        const x2 = toRect.left - thirdLayerRect.left;
        const y2 = toRect.top + toRect.height / 2 - thirdLayerRect.top;

        const line = linesTool[i];
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
      }
      // Libray Layer Connection
      for (let i = 0; i < targetFourIds.length -1; i++) {
        const fromEl = document.getElementById(targetFourIds[i]);
        const toEl = document.getElementById(targetFourIds[i + 1]);

        if(!fromEl || !toEl) continue;

        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();

        const x1 = fromRect.right - fourLayerRect.left;
        const y1 = fromRect.top + fromRect.height / 2 - fourLayerRect.top;
        const x2 = toRect.left - fourLayerRect.left;
        const y2 = toRect.top + toRect.height / 2 - fourLayerRect.top;
        
        const line = linesLibray[i];
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
      }
      // databse layer connect
      for (let i = 0; i < targetFiveIds.length - 1; i++) {
        const fromEl = document.getElementById(targetFiveIds[i]);
        const toEl = document.getElementById(targetFiveIds[i + 1]);

        if(!fromEl || !toEl) continue;

        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();

        const x1 = fromRect.right - fiveLayerRect.left;
        const y1 = fromRect.top + fromRect.height / 2 - fiveLayerRect.top;
        const x2 = toRect.left - fiveLayerRect.left;
        const y2 = toRect.top + toRect.height / 2 - fiveLayerRect.top;

        const line = lineDatabase[i];
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);

      }
    }
    updateConnections();
    window.addEventListener("resize", updateConnections);
    setInterval(updateConnections, 600); // recheck on layout shift
  });
}

