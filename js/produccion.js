/* produccion.js */
(function () {
  'use strict';

  const LINEAS = [
    { name: 'Línea A — Corte',       pct: 88, status: 'success', meta: '440 / 500 unidades' },
    { name: 'Línea B — Templado',    pct: 72, status: 'warning', meta: '360 / 500 unidades' },
    { name: 'Línea C — Laminado',    pct: 95, status: 'success', meta: '570 / 600 unidades' },
    { name: 'Línea D — Serigrafía',  pct: 41, status: 'danger',  meta: '164 / 400 unidades — pausada' },
  ];

  const LOTES_DEMO = [
    { id:'VV-2024-0091', prod:'Vidrio Templado 6mm', linea:'Línea A', op:'C. Morales', uds:120, rechazos:3, estado:'Aprobado', hora:'06:14' },
    { id:'VV-2024-0092', prod:'Vidrio Laminado 8mm', linea:'Línea C', op:'R. Torres',  uds:80,  rechazos:0, estado:'Aprobado', hora:'06:58' },
    { id:'VV-2024-0093', prod:'Vidrio Reflectivo',   linea:'Línea B', op:'M. Ruiz',    uds:60,  rechazos:8, estado:'Revisión', hora:'07:30' },
    { id:'VV-2024-0094', prod:'Vidrio Serigrafiado', linea:'Línea D', op:'L. Vega',    uds:40,  rechazos:12,estado:'Rechazado',hora:'08:05' },
    { id:'VV-2024-0095', prod:'Vidrio Templado 6mm', linea:'Línea A', op:'C. Morales', uds:130, rechazos:1, estado:'Aprobado', hora:'08:44' },
    { id:'VV-2024-0096', prod:'Vidrio Curvo',        linea:'Línea B', op:'M. Ruiz',    uds:20,  rechazos:0, estado:'En proceso',hora:'09:10'},
  ];

  let lotes = [...LOTES_DEMO];

  /* ---- Render líneas ---- */
  function renderLineas() {
    const container = document.getElementById('lineas-list');
    container.innerHTML = '';
    LINEAS.forEach((l, i) => {
      const div = document.createElement('div');
      div.className = 'linea-item';
      div.style.animationDelay = `${0.1 * i}s`;
      div.innerHTML = `
        <div class="linea-header">
          <span class="linea-name">${l.name}</span>
          <span class="linea-pct">${l.pct}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-bar ${l.status}" data-pct="${l.pct}" style="width:0"></div>
        </div>
        <div class="linea-meta">${l.meta}</div>
      `;
      container.appendChild(div);
    });
    // Animar barras
    setTimeout(() => {
      document.querySelectorAll('.progress-bar').forEach(bar => {
        bar.style.width = bar.dataset.pct + '%';
      });
    }, 200);
  }

  /* ---- Render tabla ---- */
  function estadoBadge(e) {
    const map = { 'Aprobado':'badge-success','Rechazado':'badge-danger','Revisión':'badge-warning','En proceso':'badge-info' };
    return `<span class="badge ${map[e] || 'badge-neutral'}">${e}</span>`;
  }

  function renderTabla(filtro = '') {
    const tbody = document.getElementById('tabla-lotes');
    const data = filtro ? lotes.filter(l =>
      l.id.toLowerCase().includes(filtro) ||
      l.prod.toLowerCase().includes(filtro) ||
      l.op.toLowerCase().includes(filtro)
    ) : lotes;

    tbody.innerHTML = '';
    data.forEach((l, i) => {
      const tr = document.createElement('tr');
      tr.style.animationDelay = `${0.04 * i}s`;
      tr.innerHTML = `
        <td class="font-mono" style="font-size:12px">${l.id}</td>
        <td>${l.prod}</td>
        <td>${l.linea}</td>
        <td>${l.op}</td>
        <td>${l.uds}</td>
        <td style="color:${l.rechazos > 5 ? 'var(--danger)' : 'inherit'};font-weight:${l.rechazos > 5 ? 600 : 400}">${l.rechazos}</td>
        <td>${estadoBadge(l.estado)}</td>
        <td class="text-muted text-sm">${l.hora}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  /* ---- Registrar lote ---- */
  document.getElementById('btn-registrar').addEventListener('click', () => {
    const id     = document.getElementById('lote-id').value.trim();
    const linea  = document.getElementById('linea').value;
    const prod   = document.getElementById('producto').value;
    const cant   = document.getElementById('cantidad').value;
    const op     = document.getElementById('operador').value.trim();

    if (!id || !linea || !prod || !cant || !op) {
      alert('Completa todos los campos obligatorios.');
      return;
    }

    const ahora = new Date();
    const hora  = ahora.toTimeString().slice(0, 5);

    lotes.unshift({ id, prod, linea: linea.split('—')[0].trim(), op, uds: parseInt(cant), rechazos: 0, estado: 'En proceso', hora });
    renderTabla();
    document.getElementById('cnt-lotes').textContent = lotes.length;

    const toast = document.getElementById('toast-prod');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);

    document.getElementById('btn-limpiar').click();
  });

  document.getElementById('btn-limpiar').addEventListener('click', () => {
    ['lote-id','cantidad','operador','obs-prod'].forEach(id => document.getElementById(id).value = '');
    ['linea','producto','turno'].forEach(id => document.getElementById(id).selectedIndex = 0);
  });

  /* ---- Búsqueda ---- */
  document.getElementById('buscar-lote').addEventListener('input', e => {
    renderTabla(e.target.value.toLowerCase());
  });

  /* ---- Init ---- */
  renderLineas();
  renderTabla();

})();
