const rsInteractiveMap = {
  map: SVG('rs-interactive-map').size(1000, 600),
  circle: SVG.get('circle-1'),
  tips: [],
  offTimeout: null,
  hoverBubble(el, hidden) {
    el.style({
      cursor: 'pointer',
      opacity: 0.50,
    })
    .animate(150, '<>', 0)
    .style({
      opacity: 1,
    })
    .transform({ scale: 0.01 })
    .transform({ scale: 1.5 });
    hidden.tip.show()
      .animate(150, '<>', 0)
      .style({
        opacity: 1,
      });
    setTimeout(() => {
      hidden.title.show();
      hidden.tipText.show();
    }, 10);
  },
  offHoverBubble(el, hidden) {
    el.style({
      cursor: 'default',
      opacity: 1,
    })
    .animate(150, '<>', 0)
    .style({
      opacity: 0.50,
    })
    .transform({ scale: 1 })
    .transform({ scale: 1 });
    this.offTimeout = setTimeout(() => {
      hidden.tip.hide();
      hidden.title.hide();
      hidden.tipText.hide();
    }, 300);
  },
  hoverTip() {
    clearTimeout(this.offTimeout);
  },
  offHoverTip(hidden) {
    this.offTimeout = setTimeout(() => {
      hidden.tip.hide();
      hidden.title.hide();
      hidden.tipText.hide();
    }, 300);
  },
  attachHovers(el, h) {
    el.mouseover(() => {
      this.hoverTip();
    })
    .mouseout(() => {
      this.offHoverTip(h);
    });
  },
  redrawSVG(elements) {
    for (let i = 0; i < elements.length; i += 1) {
      let el = elements[i];
      if (el.parentNode.tagName === 'a') {
        el = el.parentNode;
      }
      this.map.node.appendChild(el);
    }
  },
  init(config) {
    for (let i = 0; i < config.markers.length; i += 1) {
      const m = config.markers[i];
      // setup bubble tips on x/y axis above bubble
      let tip = this.map.link('');
      tip = tip.rect(m.tip.width, m.tip.height)
                     .hide()
                     .style({
                       fill: config.tipColor,
                       opacity: 0,
                     })
                     .stroke({ width: 0 })
                     .radius(3)
                     // (1/2 the tip - 1/2 the circle) for centering
                     .move((m.bubble.x - ((m.tip.width - (m.tip.width / 2)) -
                          (m.bubble.diameter - (m.bubble.diameter / 2)))), m.bubble.y -
                          (m.tip.height + 20));
      tip.linkTo((link) => {
        link.to('http://www.rackspace.com/').target('_blank');
      });
      this.tips.push(tip.node);
      // create text for bubble
      // header
      const title = this.map.text((add) => {
        add.tspan(m.tip.title).newLine().fill('#c40022');
      })
      .hide()
      .move((tip.x()) + 10, tip.y() + 5);
      // tip body text
      const tipText = this.map.text((add) => {
        for (let x = 0; x < m.tip.text.length; x += 1) {
          add.tspan(m.tip.text[x]).newLine();
        }
      })
      .hide()
      .font({
        family: 'Helvetica',
        size: 12,
      })
      .move((tip.x()) + 10, tip.y() + 40);

      // add items that need to be layered to top of svg
      this.tips.push(title.node, tipText.node);
      // create lines if option is enabled (in cases where circles may overlap)
      if (m.line) {
        // api reference for polyline http://svgjs.com/elements/#svg-polyline
        // x,y x,y x,y
        const line = this.map.polyline(m.line.plots)
                        .stroke({
                          color: m.line.color,
                          width: m.line.width,
                          linecap: 'round',
                        })
                        .style({
                          opacity: 0.8,
                        })
                        .fill('none');
        line.move(m.line.x, m.line.y);
      }
      // setup bubble
      const bubble = this.map.circle(m.bubble.diameter)
                        .style({
                          opacity: 0.5,
                        })
                        .move(m.bubble.x, m.bubble.y);
      let bg = '';
      if (m.bubble.type === 'Office') {
        bg = config.officeColor;
      } else if (m.bubble.type === 'Data Center') {
        bg = config.dcColor;
      }
      bubble.style({ fill: bg });
      const hidden = {
        tip,
        title,
        tipText,
      };
      bubble.mouseover(() => {
        this.hoverBubble(bubble, hidden);
      })
      .mouseout(() => {
        this.offHoverBubble(bubble, hidden);
      });
      this.attachHovers(tip, hidden);
      this.attachHovers(title, hidden);
      this.attachHovers(tipText, hidden);
    } // end of marker loop
    this.redrawSVG(this.tips);
  },
};
