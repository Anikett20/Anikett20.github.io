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
  "riscv": {
    "title": "32-Bit RISC-V Microcontroller SoC",
    "subtitle": "RV32IM + Zicsr · OpenLane / SKY130 · October 2026",
    "image": "assets/project-riscv-layout.jpg",
    "imageCaption": "ACTUAL GDSII LAYOUT IN KLAYOUT",
    "imageAlt": "KLayout screenshot of the routed phase-5 RV32IM SoC GDSII layout",
    "evidence": [
      {"src": "assets/evidence/riscv-verification-timeline.png", "title": "RTL verification timeline", "caption": "WFI sleep, timer interrupt, and SPI loopback, plotted from the phase-5 testbench VCD.", "alt": "Annotated phase-5 simulation timeline for WFI sleep, timer interrupt, and SPI loopback"},
      {"src": "assets/evidence/riscv-synthesis.png", "title": "Synthesized SoC schematic", "caption": "Saved schematic view of the CPU, sleep controller, and memory-mapped peripherals.", "alt": "Synthesis schematic of the RV32IM SoC and its peripherals"}
    ],
    "description": "A five-stage RV32IM + Zicsr processor with a 32-cycle iterative multiply/divide unit, machine-mode CSRs and traps, UART, GPIO, timer, SPI, and synchronous WFI sleep control. Built across five phases for architectural and physical-design comparison.",
    "steps": [
      "Implemented forwarding and hazard handling, machine-mode traps, and memory-mapped peripherals in Verilog.",
      "Directed firmware simulation reached the expected completion marker at cycle 273 in the published test.",
      "Saved phase-5 OpenLane reports record synthesis, placement, CTS, routing, RC extraction, and Magic DRC / Netgen LVS checks.",
      "Compared phase-4 and phase-5 OpenSTA typical-corner switching estimates: 9.65 to 6.93 mW, a 28.2% reduction after sleep-control and physical-design changes."
    ],
    "metrics": [
      [
        "21,584",
        "Routed standard cells"
      ],
      [
        "1 mm²",
        "Die area"
      ],
      [
        "28.2%",
        "Lower estimated switching power"
      ]
    ],
    "results": "The saved phase-5 reports show zero Magic DRC and Netgen LVS errors. Extracted setup WNS spans −0.83 to −1.42 ns across saved corners, and antenna checks report 507 pin violations. These remain open implementation issues; this is not a timing-closed or fabrication-ready design.",
    "tools": "Verilog · Icarus Verilog · OpenLane · Yosys · OpenROAD · OpenSTA · SKY130 · Magic · Netgen · KLayout",
    "source": "https://github.com/Anikett20/Projects/tree/main/riscv-rv32im-soc",
    "sourceLabel": "View source and verification notes",
    "secondarySource": "https://www.linkedin.com/posts/aniket-kulkarni-2352a0322_rv32im-zicsr-microcontroller-soc-report-activity-7520454299001188352-KaMY",
    "secondarySourceLabel": "Read project post"
  },
  "mips32": {
    "title": "32-Bit Five-Stage MIPS-Subset Processor",
    "subtitle": "Pipelined Verilog CPU · 2026",
    "image": "assets/evidence/mips32-forwarding-synthesis.png",
    "imageCaption": "SYNTHESIZED FORWARDING LOGIC · OPEN FULL IMAGE",
    "imageAlt": "Synthesized forwarding-unit logic for the five-stage MIPS-subset processor",
    "evidence": [
      {"src": "assets/evidence/mips32-gtkwave.png", "title": "GTKWave simulation", "caption": "Directed processor test showing PC, writeback, and memory signals.", "alt": "GTKWave screenshot of the 32-bit MIPS-subset processor directed simulation"}
    ],
    "description": "An educational five-stage MIPS-subset CPU with forwarding, load-use stalls, branch/jump flushes, and instruction and data memories.",
    "steps": [
      "Implemented pipeline stages and hazard-control logic in Verilog.",
      "Ran directed simulation that checked six register values and one data-memory result.",
      "Published source, testbench, generic synthesis result, and historical OpenLane reports."
    ],
    "metrics": [
      [
        "5",
        "Pipeline stages"
      ],
      [
        "6 + 1",
        "Checked register + memory results"
      ],
      [
        "Pass",
        "Generic Yosys synthesis"
      ]
    ],
    "results": "Historical OpenLane reports record zero Magic DRC and LVS errors, but extracted nominal setup WNS is −4.22 ns and antenna checks report 141 pin violations. These results do not establish timing closure or signoff.",
    "tools": "Verilog · Icarus Verilog · Yosys · OpenLane · SKY130",
    "source": "https://github.com/Anikett20/Projects/tree/main/mips32-pipeline",
    "sourceLabel": "View source and verification notes"
  },
  "matrix": {
    "title": "4 × 4 Fixed-Point Matrix Multiplier",
    "subtitle": "Sign-magnitude Q7.8 datapath · 2026",
    "image": "assets/evidence/matrix-verification.png",
    "imageCaption": "DIRECTED RTL VERIFICATION CHART · OPEN FULL IMAGE",
    "imageAlt": "Verification chart for one 4 by 4 fixed-point matrix input pair",
    "evidence": [
      {"src": "assets/evidence/matrix-synthesis.png", "title": "Synthesis schematic", "caption": "Saved network view of the fixed-point matrix-multiplication datapath.", "alt": "Synthesis schematic of the 4 by 4 matrix multiplier"}
    ],
    "description": "A parallel 4 × 4 matrix-multiplication datapath using 16-bit sign-magnitude Q7.8 values, 64 multipliers, and 48 adders.",
    "steps": [
      "Constructed the multiplier and adder network in Verilog.",
      "Checked all 16 output elements for one fixed input-matrix pair.",
      "Published testbench, generic synthesis result, and historical physical-flow reports."
    ],
    "metrics": [
      [
        "4 × 4",
        "Matrix dimensions"
      ],
      [
        "64",
        "Multipliers"
      ],
      [
        "16",
        "Outputs checked for one pair"
      ]
    ],
    "results": "The directed check covers one matrix pair, so arbitrary inputs and overflow behavior remain unverified. Historical OpenLane reports show nominal setup WNS −0.86 ns and 43 antenna pin violations.",
    "tools": "Verilog · Icarus Verilog · Yosys · OpenLane · SKY130",
    "source": "https://github.com/Anikett20/Projects/tree/main/fixed-point-matrix-multiplication",
    "sourceLabel": "View source and verification notes"
  },
  "fifo": {
    "title": "16 × 32 Synchronous FIFO",
    "subtitle": "Parameterized and structural implementations · 2026",
    "image": "assets/evidence/fifo-top-schematic.png",
    "imageCaption": "STRUCTURAL FIFO SCHEMATIC · OPEN FULL IMAGE",
    "imageAlt": "Top-level schematic of the 16 by 32 single-clock FIFO",
    "evidence": [
      {"src": "assets/evidence/fifo-status-synthesis.png", "title": "Status logic after synthesis", "caption": "Saved gate view of full, empty, and threshold control logic.", "alt": "Synthesized FIFO status-flag logic schematic"}
    ],
    "description": "Two single-clock FIFO implementations, one parameterized and one structural, with full, empty, threshold, and boundary behavior.",
    "steps": [
      "Implemented both FIFO architectures with 16 words of 32 bits and threshold 8 in the supplied configurations.",
      "Ran eight directed suites covering data movement, reset, full/empty flags, and simultaneous read/write activity.",
      "Published source, testbenches, generic synthesis result, and historical OpenLane reports."
    ],
    "metrics": [
      [
        "16 × 32",
        "Words × bits"
      ],
      [
        "8",
        "Directed test suites"
      ],
      [
        "Pass",
        "Generic Yosys synthesis"
      ]
    ],
    "results": "The project is a single-clock FIFO; it does not include asynchronous clock-domain crossing. Simultaneous-activity tests are directed rather than a full scoreboard. Historical antenna checks report five pin violations.",
    "tools": "Verilog · Icarus Verilog · Yosys · OpenLane · SKY130",
    "source": "https://github.com/Anikett20/Projects/tree/main/fifo-memory",
    "sourceLabel": "View source and verification notes"
  },
  "mips16": {
    "title": "16-Bit MIPS-Style Processor",
    "subtitle": "Custom single-cycle ISA · 2026",
    "image": "assets/evidence/mips16-control-synthesis.png",
    "imageCaption": "SYNTHESIZED CONTROL LOGIC · OPEN FULL IMAGE",
    "imageAlt": "Synthesized control-unit logic for the 16-bit MIPS-style CPU",
    "evidence": [
      {"src": "assets/evidence/mips16-gtkwave.png", "title": "GTKWave simulation", "caption": "Directed processor test showing instructions, PC, register writes, and ALU results.", "alt": "GTKWave screenshot of the 16-bit MIPS-style CPU directed simulation"}
    ],
    "description": "A compact single-cycle CPU with a custom MIPS-style 16-bit instruction set, eight registers, a 32-word instruction ROM, and a 16-word data memory.",
    "steps": [
      "Developed the datapath, decode, and on-chip memories in Verilog.",
      "Ran directed checks for seven register values, one data-memory result, and halt-loop PC behavior.",
      "Published source, testbench, generic synthesis result, and historical OpenLane reports."
    ],
    "metrics": [
      [
        "16-bit",
        "Custom instruction set"
      ],
      [
        "8",
        "General registers"
      ],
      [
        "Pass",
        "Generic Yosys synthesis"
      ]
    ],
    "results": "The ISA is educational and is not binary compatible with standard MIPS. Historical OpenLane reports record zero Magic DRC and LVS errors, but nominal extracted WNS is −1.26 ns and antenna checks report 16 pin violations.",
    "tools": "Verilog · Icarus Verilog · Yosys · OpenLane · SKY130",
    "source": "https://github.com/Anikett20/Projects/tree/main/mips16",
    "sourceLabel": "View source and verification notes"
  },
  "alu8": {
    "title": "8-Bit ALU and Register Datapath",
    "subtitle": "External-instruction RTL · 2026",
    "image": "assets/project-openlane.svg",
    "description": "An educational 8-bit ALU with an 8 × 8-bit register file and decoder. Instructions are externally supplied; this block has no PC, fetch unit, or program memory.",
    "steps": [
      "Implemented ALU, register file, and decode logic in Verilog.",
      "Ran eleven directed ALU vectors and an eight-instruction integration example.",
      "Published source and testbenches for reproducible RTL simulation."
    ],
    "metrics": [
      [
        "8-bit",
        "ALU datapath"
      ],
      [
        "8 × 8-bit",
        "Register file"
      ],
      [
        "11",
        "Directed ALU vectors"
      ]
    ],
    "results": "The repository supports RTL-level directed simulation for this exact design. It does not contain evidence of a completed OpenLane physical flow or GDSII for this datapath.",
    "tools": "Verilog · Icarus Verilog",
    "source": "https://github.com/Anikett20/Projects/tree/main/alu-8bit-datapath",
    "sourceLabel": "View source and testbench"
  },
  "alu4": {
    "title": "4-Bit Registered ALU",
    "subtitle": "Verilog RTL and saved Synopsys reports · 2026",
    "image": "assets/project-synopsys.svg",
    "description": "An eight-operation registered 4-bit ALU with source, directed simulation, and saved Design Compiler and IC Compiler II reports.",
    "steps": [
      "Developed the modular ALU in Verilog and simulated nine directed scenarios.",
      "Saved Design Compiler synthesis and setup reports.",
      "Reviewed IC Compiler II physical-flow reports for remaining DRC and parasitic issues."
    ],
    "metrics": [
      [
        "8",
        "Defined operations"
      ],
      [
        "9",
        "Directed scenarios"
      ],
      [
        "213",
        "Saved DC cell count"
      ]
    ],
    "results": "The supplied scenarios cover seven of eight opcodes; SHR is untested. Saved DC setup slack is −0.06 ns versus a 1.2 ns clock. ICC II reports 178 DRC errors and missing parasitics; the saved reports do not establish signoff or a verified final routed design.",
    "tools": "Verilog · VCS / Verdi · Design Compiler · IC Compiler II",
    "source": "https://github.com/Anikett20/Projects/tree/main/alu-4bit",
    "sourceLabel": "View source and saved reports"
  }
};

  function openProject(key, trigger) {
    const project = projects[key];
    if (!project) return;
    dialogTrigger = trigger;
    // All content is local, authored portfolio data; no external HTML is inserted.
    dialog.querySelector('.dialog-content').innerHTML = `
      <a class="dialog-banner ${key === 'riscv' ? 'dialog-banner-layout' : ''} ${project.evidence ? 'dialog-banner-evidence' : ''}" href="${project.image}" target="_blank" rel="noopener noreferrer" aria-label="Open full-size image: ${project.title}"><img src="${project.image}" alt="${project.imageAlt || 'Project illustration'}"><span>${project.imageCaption || 'ORIGINAL SCHEMATIC ILLUSTRATION'}</span></a>
      <div class="dialog-body"><h2 id="project-dialog-title">${project.title}</h2><p class="dialog-subtitle">${project.subtitle}</p>
      <p>${project.description}</p>
      ${project.evidence?.length ? `<section class="evidence-section" aria-label="More project images"><h3>More from this project</h3><div class="evidence-grid">${project.evidence.map(item => `<figure><a href="${item.src}" target="_blank" rel="noopener noreferrer" aria-label="Open full-size ${item.title}"><img src="${item.src}" alt="${item.alt}" loading="lazy"><span>OPEN FULL IMAGE ↗</span></a><figcaption><strong>${item.title}</strong><span>${item.caption}</span></figcaption></figure>`).join('')}</div></section>` : ''}
      <h3>The process</h3><ul>${project.steps.map(step => `<li>${step}</li>`).join('')}</ul>
      <p class="results-label">DESIGN AT A GLANCE</p>
      <div class="dialog-stats">${project.metrics.map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join('')}</div>
      <h3>Implementation notes</h3><p class="results-note">${project.results}</p>
      <h3>Tools used</h3><p>${project.tools}</p>
      ${project.source ? `<a class="text-link accent-link" href="${project.source}" target="_blank" rel="noopener noreferrer">${project.sourceLabel}<svg class="icon"><use href="#i-external"/></svg></a>` : ''}
      ${project.secondarySource ? `<a class="text-link accent-link dialog-secondary-link" href="${project.secondarySource}" target="_blank" rel="noopener noreferrer">${project.secondarySourceLabel}<svg class="icon"><use href="#i-external"/></svg></a>` : ''}
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
