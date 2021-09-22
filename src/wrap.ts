import { HeadlessState } from './state';
import { setVisible, createEl } from './util';
import { colors, files, ranks, Elements } from './types';
import { createElement as createSVG, setAttributes } from './svg';

export function renderWrap(element: HTMLElement, s: HeadlessState): Elements {
  // .cg-wrap (element passed to Chessground)
  //   cg-container
  //     cg-board
  //     svg.cg-shapes
  //       defs
  //       g
  //     svg.cg-custom-svgs
  //       g
  //     coords.ranks
  //     coords.files
  //     piece.ghost

  element.innerHTML = '';

  // ensure the cg-wrap class is set
  // so bounds calculation can use the CSS width/height values
  // add that class yourself to the element before calling chessground
  // for a slight performance improvement! (avoids recomputing style)
  element.classList.add('cg-wrap');

  for (const c of colors) element.classList.toggle('orientation-' + c, s.orientation === c);
  element.classList.toggle('manipulable', !s.viewOnly);

  const container = createEl('cg-container');
  element.appendChild(container);

  const board = createEl('cg-board');
  container.appendChild(board);

  let svg: SVGElement | undefined;
  let customSvg: SVGElement | undefined;
  if (s.drawable.visible) {
    svg = setAttributes(createSVG('svg'), {
      class: 'cg-shapes',
      viewBox: '-4 -4 8 8',
      preserveAspectRatio: 'xMidYMid slice',
    });
    svg.appendChild(createSVG('defs'));
    svg.appendChild(createSVG('g'));
    customSvg = setAttributes(createSVG('svg'), {
      class: 'cg-custom-svgs',
      viewBox: '-3.5 -3.5 8 8',
      preserveAspectRatio: 'xMidYMid slice',
    });
    customSvg.appendChild(createSVG('g'));
    container.appendChild(svg);
    container.appendChild(customSvg);
  }

  if (s.coordinates) {
    const orientClass = s.orientation === 'black' ? ' black' : '';
    container.appendChild(renderCoords(ranks, 'ranks' + orientClass));
    container.appendChild(renderCoords(files, 'files' + orientClass));
    // container.appendChild(renderCoords2(ranks, 'ranks' + orientClass, true));
    // container.appendChild(renderCoords2(files, 'files' + orientClass));
  }

  let ghost: HTMLElement | undefined;
  if (s.draggable.showGhost) {
    ghost = createEl('piece', 'ghost');
    setVisible(ghost, false);
    container.appendChild(ghost);
  }

  return {
    board,
    container,
    wrap: element,
    ghost,
    svg,
    customSvg,
  };
}

function renderCoords(elems: readonly string[], className: string): HTMLElement {
  const el = createEl('coords', className + ' coords-old');
  let f: HTMLElement;
  for (const elem of elems) {
    f = createEl('coord');
    f.textContent = elem;
    el.appendChild(f);
  }
  return el;
}

function renderCoords2(elems: readonly string[], className: string, isRanks = false): HTMLElement {
  const el = createEl('coords', className + ' coords-new');
  for (const elem of elems) {
    
    const f = createEl('coord');
  
    const coordSvg = setAttributes(createSVG('svg'), {
      class: 'coord2',
      viewBox: '0 0 10 10',
    });

    // const x = isRanks ? '25%' : '25%';
    // const y = isRanks ? '85%' : '75%';
    // const x = isRanks ? '75%' : '25%';
    // const y = isRanks ? '25%' : '75%';
    const x = isRanks ? '100%' : '0';
    const y = isRanks ? '0' : '100%';

    // transform: translate(75%, 25%)
    // transform: translate(25%, 75%)
    const gSvg = createSVG('g')


    const textSvg = setAttributes(createSVG('text'), {
      class: 'coord-text2',
      // 'font-size': '75%',
      // x: '0',
      // y: '10',
      // x,
      // y,
      x: '50%',
      y: '50%',
      'font-size': '60%',

      // 'text-anchor': isRanks ? 'end' : 'start',// START IS UNNECESSARY
      // 'dominant-baseline': isRanks ? 'hanging' : 'auto',// START IS UNNECESSARY

      'text-anchor': 'middle',
      'dominant-baseline': 'central'

      
      // 'dominant-baseline': "middle",


    });


    textSvg.textContent = elem;
    // gSvg.appendChild(textSvg)
    // coordSvg.appendChild(gSvg);
    coordSvg.appendChild(textSvg);
    f.appendChild(coordSvg);

    // f.textContent = elem;
    el.appendChild(f);
  }
  return el;
}
