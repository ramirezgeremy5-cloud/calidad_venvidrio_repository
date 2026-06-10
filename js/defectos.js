/* defectos.js */
(function () {
  'use strict';

  const DIST = [
    { tipo: 'Burbuja / Inclusión',    n: 12, color: '#0f172a' },
    { tipo: 'Rayadura Superficial',   n: 9,  color: '#3b82f6' },
    { tipo: 'Fractura / Grieta',      n: 7,  color: '#ef4444' },
    { tipo: 'Deformación Geométrica', n: 5,  color: '#f59e0b' },
    { tipo: 'Mancha / Contaminación', n: 5,  color: '#334155' },
  ];

  const DEMO = [
    { lote:'VV-2024-0093', tipo:'Fractura / Grieta',      clase:'Crítico', piezas:4, zona:'Salida de horno',  inspector:'M. Ruiz',    hora:'07:32' },
    { lote:'VV-2024-0091', tipo:'Burbuja / Inclusión',    clase:'Mayor',   piezas:3, zona:'Inspección final', inspector:'C. Morales', hora:'06:50' },
    { lote:'VV-2024-0094', tipo:'Delaminación',           clase:'Crítico', piezas:8, zona:'Mesa de corte',    inspector:'L. Vega',    hora:'08:10' },
    { lote:'VV-2024-0092', tipo:'Rayadura Superficial',   clase:'Menor',   piezas:2, zona:'Empaque',          inspector:'R. Torres',  hora:'07:05' },
    { lote:'VV-2024-0095', tipo:'Ondulación',             clase:'Mayor',   piezas:5, zona:'Salida de horno',  inspector:'C. Morales', hora:'08:55' },
  ];

  let defectos = [...DEMO];
  let markers  = [];

  /* ---- Distribución ---- */
  function renderDist() {
    const total = DIST.reduce((a, b) => a + b.n, 0);
    const cont  = document.getElementById('dist-bars');
    cont.innerHTML = '';
    DIST.forEach((d, i) => {
      const pct = Math.round((d.n / total) * 100);
      const el  = document.createElement('div');
      el.className = 'dist-bar-item';
      el.style.animationDelay = `${0.1 * i}s`;
      el.innerHTML = `
        <div class="dist-bar-label">
          <span>${d.tipo}</span>
          <span>${d.n} uds</span>
        </div>
        <div class="dist-track">
          <div class="dist-fill" style="background:${d.color}" data-pct="${pct}"></div>
        </div>
      `;
      cont.appendChild(el);
    });
    setTimeout(() => {
      document.querySelectorAll('.dist-fill').forEach(el => {
        el.style.width = el.dataset.pct + '%';
      });
    }, 300);
  }

  /* ---- Top defectos ---- */
  function renderTop() {
    const total = DIST.reduce((a, b) => a + b.n, 0);
    const sorted = [...DIST].sort((a, b) => b.n - a.n).slice(0, 4);
    const cont   = document.getElementById('top-defectos');
    cont.innerHTML = '';
    sorted.forEach((d, i) => {
      const pct = Math.round((d.n / total) * 100);
      const el  = document.createElement('div');
      el.className = 'top-item';
      el.style.animationDelay = `${0.1 * i}s`;
      el.innerHTML = `
        <div class="top-rank">${i + 1}</div>
        <div class="top-info">
          <div class="top-name">${d.tipo}</div>
          <div class="top-count">${d.n} registros</div>
        </div>
        <div class="top-pct">${pct}%</div>
      `;
      cont.appendChild(el);
    });
  }

  /* ---- Tabla ---- */
  function clsMap(c) {
    return { 'Crítico':'badge-danger','Mayor':'badge-warning','Menor':'badge-info' }[c] || 'badge-neutral';
  }

  function renderTabla(filtro = '') {
    const tbody = document.getElementById('tabla-def');
    const data  = filtro ? defectos.filter(d => d.clase === filtro) : defectos;
    tbody.innerHTML = '';
    data.forEach((d, i) => {
      const tr = document.createElement('tr');
      tr.style.animationDelay = `${0.04 * i}s`;
      tr.innerHTML = `
        <td class="font-mono" style="font-size:12px">${d.lote}</td>
        <td>${d.tipo}</td>
        <td><span class="badge ${clsMap(d.clase)}">${d.clase}</span></td>
        <td>${d.piezas}</td>
        <td>${d.zona}</td>
        <td>${d.inspector}</td>
        <td class="text-muted text-sm">${d.hora}</td>
        <td><button class="btn btn-outline btn-sm"><i class="ti ti-eye"></i> Ver</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  /* ---- Mapa de vidrio ---- */
  document.getElementById('glass-panel').addEventListener('click', e => {
    const clase = document.getElementById('d-clase').value;
    if (!clase) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x    = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const y    = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    const dot  = document.createElement('div');
    dot.className = `defect-marker ${clase}`;
    dot.style.left = x + '%';
    dot.style.top  = y + '%';
    document.getElementById('glass-markers').appendChild(dot);
    markers.push({ x, y, clase });
  });

  /* ---- Registrar ---- */
  document.getElementById('btn-def').addEventListener('click', () => {
    const lote  = document.getElementById('d-lote').value.trim();
    const tipo  = document.getElementById('d-tipo').value;
    const clase = document.getElementById('d-clase').value;
    const qty   = document.getElementById('d-qty').value;
    const zona  = document.getElementById('d-zona').value;
    const insp  = document.getElementById('d-inspector').value.trim();

    if (!lote || !tipo || !clase || !qty || !zona || !insp) {
      alert('Completa todos los campos obligatorios.');
      return;
    }

    const hora = new Date().toTimeString().slice(0, 5);
    const map  = { critico:'Crítico', mayor:'Mayor', menor:'Menor' };
    defectos.unshift({ lote, tipo, clase: map[clase], piezas: parseInt(qty), zona, inspector: insp, hora });
    renderTabla(document.getElementById('filtro-clase').value);

    const toast = document.getElementById('toast-def');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
    document.getElementById('btn-def-clear').click();
  });

  document.getElementById('btn-def-clear').addEventListener('click', () => {
    ['d-lote','d-qty','d-inspector','d-desc'].forEach(id => document.getElementById(id).value = '');
    ['d-tipo','d-clase','d-zona'].forEach(id => document.getElementById(id).selectedIndex = 0);
    document.getElementById('glass-markers').innerHTML = '';
    markers = [];
  });

  document.getElementById('filtro-clase').addEventListener('change', e => {
    renderTabla(e.target.value);
  });

  /* ---- Init ---- */
  renderDist();
  renderTop();
  renderTabla();

})();
