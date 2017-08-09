const rsInteractiveMap = {
  map: SVG('rs-interactive-map').size(1000, 600),
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
                       fill: '#ffffff',
                       opacity: 0,
                     })
                     .stroke({ color: '#c40022', width: 2 })
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
      .move((tip.x()) + 10, tip.y() + 10);
      // tip body text
      const tipText = this.map.text((add) => {
        for (let x = 0; x < m.tip.text.length; x += 1) {
          add.tspan(m.tip.text[x]).newLine();
        }
      })
      .hide()
      .font({
        family: 'Helvetica',
        size: 14,
      })
      .move((tip.x()) + 10, tip.y() + 30);

      // add items that need to be layered to top of svg
      this.tips.push(title.node, tipText.node);
      // create lines if option is enabled (in cases where circles may overlap)
      if (m.line.enabled) {
        const line = this.map.line(m.line.plots)
                        .stroke({
                          color: m.line.color,
                          width: m.line.width,
                          linecap: 'round',
                        });
        line.move(m.line.x, m.line.y);
      }
      // setup bubble
      const bubble = this.map.circle(m.bubble.diameter)
                        .style({
                          fill: m.bubble.color,
                          opacity: 0.5,
                        })
                        .move(m.bubble.x, m.bubble.y);
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


const mapConfig = {
  markers: [
    {
      bubble: {
        color: '#c40022',
        diameter: 30,
        x: 125,
        y: 295,
      },
      line: {
        enabled: true,
        color: '#c40022',
        width: 2,
        plots: '0, 50, 50, 30',
        x: 155,
        y: 285,
      },
      tip: {
        icon: '',
        type: 'Data Center',
        title: 'Lon DC',
        // array of lines
        text: [
          'I am a line!',
          'I am another line!',
        ],
        link: 'some-link',
        linkIcon: 'some-other-class',
        width: 200,
        height: 100,
      },
    },
    {
      bubble: {
        color: '#c40022',
        diameter: 35,
        x: 770,
        y: 285,
      },
      line: {
        enabled: false,
      },
      tip: {
        icon: '',
        type: 'Data Center',
        title: 'HK DC',
        // array of lines
        text: [
          'HK is Rackspaces latest',
          'Data Center, we patterned',
          'with Digital Realty Trust who',
          'lead the design and',
          'construction of the building',
          'to our requirements.',
        ],
        link: 'some-link',
        linkIcon: 'some-other-class',
        width: 250,
        height: 160,
      },
    },
    {
      bubble: {
        color: '#7c0421',
        diameter: 20,
        x: 135,
        y: 235,
      },
      line: {
        enabled: true,
        color: '#c40022',
        width: 2,
        plots: '100, 50, 50, 20',
        x: 155,
        y: 250,
      },
      tip: {
        icon: '',
        type: 'Data Center',
        title: 'Lon DC',
        // array of lines
        text: [
          'I am a line!',
        ],
        link: 'some-link',
        linkIcon: 'some-other-class',
        width: 200,
        height: 100,
      },
    },
  ],
};

rsInteractiveMap.init(mapConfig);
