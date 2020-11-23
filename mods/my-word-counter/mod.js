/*
 * scroll-to-top
 * (c) 2020 dragonwocky <thedragonring.bod@gmail.com> (https://dragonwocky.me/)
 * (c) 2020 CloudHill
 * under the MIT license
 */

'use strict';

const { createElement } = require('../../pkg/helpers.js'),
  path = require('path'),
  fs = require('fs-extra');

module.exports = {
  id: 'b99deb52-6955-43d2-a53b-a31540cd19a6',
  tags: ['extension'],
  name: 'my word counter',
  desc:
    'add an box below the help button to show the number of words.',
  version: '1.0.0',
  author: 'Jahoo',
  hacks: {
    'renderer/preload.js'(store, __exports) {
      document.addEventListener('readystatechange', (event) => {
        if (document.readyState !== 'complete') return false;
        const attempt_interval = setInterval(enhance, 500);
        function enhance() {
          if (!document.querySelector('.notion-frame')) return;
          clearInterval(attempt_interval);

          let $page = document.getElementsByClassName('notion-page-content')[0];
          const DOCUMENT_OBSERVER = new MutationObserver((list, observer) => {
              if (!queue.length) requestIdleCallback(() => handle(queue));
              queue.push(...list);
            }),
            PAGE_OBSERVER = new MutationObserver(showPageWordDetails);
          DOCUMENT_OBSERVER.observe(document.body, {
            childList: true,
            subtree: true,
          });

          const $container = document.createElement('div');
          // const $container = document.querySelector('.bottom-right-buttons');
          const $help = document.querySelector('.notion-help-button');
          // const $scroll = document.querySelector('.notion-scroll-button');
          const $scroll = createElement(
            '<div class="notion-scroll-button" role="button"></div>'
          );

          $container.className = 'bottom-right-buttons';
          $help.after($container);
          $container.append($scroll);
          $container.append($help);

          // if (store().top > 0) $scroll.classList.add('hidden');

          // $scroll.addEventListener('click', () => {
          //   document.querySelector('.notion-frame > .notion-scroller').scroll({
          //     top: 0,
          //     left: 0,
          //     behavior: store().smooth ? 'smooth' : 'auto',
          //   });
          // });

          let queue = [];
          // let $scroller = document.querySelector(
          //   '.notion-frame > .notion-scroller'
          // );
          // let top = store().top || 0;

          // const observer = new MutationObserver((list, observer) => {
          //   if (!queue.length) requestAnimationFrame(() => handle(queue));
          //   queue.push(...list);
          // });
          // observer.observe(document.body, {
          //   childList: true,
          //   subtree: true,
          // });

          function handle(list) {
            queue = [];
            for (let { addedNodes } of list) {
              if (
                addedNodes[0] &&
                addedNodes[0].className === 'notion-page-content'
              ) {
                $page = addedNodes[0];
                showPageWordDetails();

                PAGE_OBSERVER.disconnect();
                PAGE_OBSERVER.observe($page, {
                  childList: true,
                  subtree: true,
                  characterData: true,
                });
              }
            }
          }

          function showPageWordDetails() {
            const words = $page.innerText.match(/\w+|[\u4e00-\u9fa5]/g);
            const details = {
              words: words !== null ? words.length : 0,
              // characters: $page.innerText.length,
              // sentences: $page.innerText.split('.').length,
              // blocks: $page.querySelectorAll('[data-block-id]').length,
            };
            // details['reading time'] = [
            //   humanTime(details.words / 275),
            //   '~275 wpm',
            // ];
            // details['speaking time'] = [
            //   humanTime(details.words / 180),
            //   '~180 wpm',
            // ];

            $scroll.innerHTML = `
              ${Object.keys(details).reduce(
                (prev, key) => prev + (`<p><b>${details[key]}</b> ${key}</p>`),
                ''
              )}`;
            // $page.previousElementSibling.children[0].appendChild($container);
            // if (!$container.offsetParent) return;
            // $container.offsetParent.appendChild($tooltip);
            // $container
            //   .querySelectorAll('p')
            //   .forEach((p) =>
            //     p.addEventListener('click', (e) =>
            //       copyToClipboard(e.target.innerText)
            //     )
            //   );
            // $container.querySelectorAll('[data-tooltip]').forEach((el) => {
            //   el.addEventListener('mouseenter', (e) => {
            //     $tooltip.innerText = el.getAttribute('data-tooltip');
            //     $tooltip.style.top = el.parentElement.offsetTop + 2.5 + 'px';
            //     $tooltip.style.left =
            //       el.parentElement.offsetLeft +
            //       el.parentElement.offsetWidth -
            //       5 +
            //       'px';
            //     $tooltip.classList.add('active');
            //   });
            //   el.addEventListener('mouseleave', (e) =>
            //     $tooltip.classList.remove('active')
            //   );
            // });
          }
        }
      });
    },
  },
};
