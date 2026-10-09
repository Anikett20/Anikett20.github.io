/* Static portfolio interactions. No tracking or remote data requests. */
(() => {
  'use strict';
  const panels = [...document.querySelectorAll('.panel')];
  const navigation = [...document.querySelectorAll('[data-page]')];
  const menuButton = document.querySelector('.menu-toggle');
  const overlay = document.querySelector('.menu-overlay');
  const sidebar = document.querySelector('.sidebar');
  const mobile = window.matchMedia('(max-width: 700px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.querySelector('.motion-toggle');
  const dialog = document.querySelector('.project-dialog');
  let currentPage = '';
  let dialogTrigger = null;
  let motionPaused = reducedMotion.matches;

  const aliases = { projects: 'portfolio', experience: 'resume', education: 'resume', certifications: 'resume', leadership: 'resume', skills: 'about' };
  const titles = { home: 'Aniket Kulkarni | VLSI Design & Technology', about: 'About | Aniket Kulkarni', resume: 'Resume | Aniket Kulkarni', portfolio: 'Projects | Aniket Kulkarni', contact: 'Contact | Aniket Kulkarni' };

  function setMenu(open, returnFocus = false) {
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    overlay.hidden = !open;
    sidebar.inert = mobile.matches && !open;
    if (returnFocus) menuButton.focus();
  }

  function showPage(focusHeading = true) {
    let requested = location.hash.slice(1).toLowerCase();
    const skipToMain = requested === 'main';
    if (skipToMain && currentPage) { document.querySelector('#main').focus(); return; }
    requested = aliases[requested] || requested;
    const page = panels.some(panel => panel.id === requested) ? requested : 'home';
    if (dialog.open) dialog.close();
    setMenu(false);
    if (currentPage === page) return;
    panels.forEach(panel => { panel.hidden = panel.id !== page; panel.classList.toggle('is-active', panel.id === page); });
    navigation.forEach(link => {
      if (link.dataset.page === page) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.title = titles[page];
    currentPage = page;
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (skipToMain) document.querySelector('#main').focus({ preventScroll: true });
    else if (focusHeading) document.querySelector(`#${page} h1, #${page} h2`).focus({ preventScroll: true });
  }

  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    setMenu(open);
    if (open) sidebar.querySelector('[aria-current="page"]').focus();
  });
  overlay.addEventListener('click', () => setMenu(false, true));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.body.classList.contains('menu-open')) setMenu(false, true);
    if (event.key !== 'Tab' || !document.body.classList.contains('menu-open')) return;
    const focusables = [menuButton, ...sidebar.querySelectorAll('a')];
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
    if (mobile.matches) setMenu(false);
    // Clicking the active destination should still close the mobile menu and focus its heading.
    if (link.hash === location.hash && link.hash !== '#main') {
      document.querySelector(`#${currentPage} h1, #${currentPage} h2`)?.focus({ preventScroll: true });
    }
  }));
  mobile.addEventListener('change', () => setMenu(false));
  window.addEventListener('hashchange', () => showPage());

  function updateMotion() {
    const paused = motionPaused || reducedMotion.matches;
    document.body.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.querySelector('.motion-label').textContent = reducedMotion.matches ? 'Reduced motion' : paused ? 'Resume motion' : 'Pause motion';
    motionButton.disabled = reducedMotion.matches;
    motionButton.setAttribute('aria-label', reducedMotion.matches ? 'Motion disabled by your system preference' : paused ? 'Resume decorative motion' : 'Pause decorative motion');
  }
  motionButton.addEventListener('click', () => { motionPaused = !motionPaused; updateMotion(); });
  reducedMotion.addEventListener('change', updateMotion);

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-category]')];
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let visible = 0;
    cards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; if (!card.hidden) visible++; });
    document.querySelector('.filter-status').textContent = `Showing ${visible} ${visible === 1 ? 'project' : 'projects'}${filter === 'all' ? '' : ` using ${button.textContent.trim()}`}.`;
  }));

  const projects = {
    openlane: {
      title: '8-Bit Digital Design', subtitle: 'RTL to GDSII · OpenLane / SKY130', image: 'assets/project-openlane.svg',
      description: 'I implemented an 8-operation ALU, an 8 × 8-bit synchronous register file, and a control unit supporting 12 instructions in Verilog, then took the design through the OpenLane RTL-to-GDSII flow on SKY130.',
      steps: ['Developed the digital blocks in Verilog HDL.', 'Verified RTL behavior using Icarus Verilog testbenches.', 'Ran the OpenLane implementation flow on the SKY130 130 nm process.', 'Inspected the final GDSII layout using KLayout.'],
      metrics: [['8', 'ALU operations'], ['8 × 8-bit', 'Synchronous register file'], ['12', 'Control-unit instructions']],
      results: 'My resume records completion of 42/42 flow steps, with no reported DRC or setup/hold violations.',
      tools: 'Verilog · Icarus Verilog · OpenLane · SKY130 · KLayout'
    },
    synopsys: {
      title: '4-Bit ALU', subtitle: 'Synopsys RTL-to-GDSII flow', image: 'assets/project-synopsys.svg',
      description: 'I designed a modular 4-bit ALU in Verilog and worked through functional verification, synthesis, and physical implementation using the Synopsys tool flow.',
      steps: ['Developed the modular ALU in Verilog.', 'Verified opcode-level functionality using VCS and Verdi.', 'Performed synthesis using Design Vision.', 'Completed physical design from floorplanning through routing using IC Compiler II.'],
      metrics: [['213', 'Leaf cells'], ['375.12 µm²', 'Combinational area'], ['0', 'Reported DRC violations']],
      results: 'These final-design figures are recorded in my resume. The area shown is combinational area.',
      tools: 'Verilog · VCS · Verdi · Design Vision · IC Compiler II'
    }
  };

  function openProject(key, trigger) {
    const project = projects[key];
    if (!project) return;
    dialogTrigger = trigger;
    // All content is local, authored portfolio data; no external HTML is inserted.
    dialog.querySelector('.dialog-content').innerHTML = `
      <div class="dialog-banner"><img src="${project.image}" alt=""><span>ORIGINAL SCHEMATIC ILLUSTRATION</span></div>
      <div class="dialog-body"><h2 id="project-dialog-title">${project.title}</h2><p class="dialog-subtitle">${project.subtitle}</p>
      <p>${project.description}</p><h3>The process</h3><ul>${project.steps.map(step => `<li>${step}</li>`).join('')}</ul>
      <p class="results-label">${key === 'synopsys' ? 'PROJECT RESULTS (FROM RESUME)' : 'DESIGN AT A GLANCE'}</p>
      <div class="dialog-stats">${project.metrics.map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join('')}</div>
      ${key === 'openlane' ? '<h3>Project results (from resume)</h3>' : ''}<p class="results-note">${project.results}</p>
      <h3>Tools used</h3><p>${project.tools}</p>
      </div>`;
    dialog.showModal();
    dialog.scrollTop = 0;
    dialog.querySelector('.dialog-close').focus();
  }
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.project, button)));
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { if (dialogTrigger && !dialogTrigger.closest('[hidden]')) dialogTrigger.focus({ preventScroll: true }); });

  const copyButton = document.querySelector('.copy-email');
  copyButton.addEventListener('click', async () => {
    const status = document.querySelector('.copy-status');
    try {
      await navigator.clipboard.writeText('aniketcoolkarni337@gmail.com');
      status.textContent = 'Email copied.';
    } catch {
      status.textContent = 'Select the email address above to copy it.';
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('.email-block>a'));
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
  updateMotion();
  showPage(false);
})();
