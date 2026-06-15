/* auditoria.js */
(function () {
  'use strict';

  /* ---- Checklists por área ---- */
  const CHECKLISTS = {
    proceso: [
      { sec:'Equipo y Condiciones', items:[
        { id:'p1', label:'Temperatura del horno dentro de rango (600–700°C)', ref:'PO-HOR-01' },
        { id:'p2', label:'Calibración del pirómetro verificada', ref:'IT-CAL-03' },
        { id:'p3', label:'Velocidad de cinta ajustada por espesor', ref:'PO-HOR-02' },
        { id:'p4', label:'Quemadores sin obstrucción ni llama irregular', ref:'IT-MAN-01' },
      ]},
      { sec:'Materia Prima', items:[
        { id:'p5', label:'Vidrio inspeccionado antes de hornear (sin rayaduras previas)', ref:'PO-MP-01' },
        { id:'p6', label:'Lote registrado en sistema antes de procesar', ref:'PO-TRZ-01' },
      ]},
      { sec:'Seguridad', items:[
        { id:'p7', label:'EPP completo en operarios (lentes, guantes, zapatos)', ref:'HS-SEG-02' },
        { id:'p8', label:'Extintores CO₂ accesibles y vigentes', ref:'HS-SEG-04' },
      ]},
    ],
    corte: [
      { sec:'Mesa y Equipo', items:[
        { id:'c1', label:'Mesa nivelada y limpia de partículas de vidrio', ref:'IT-COR-01' },
        { id:'c2', label:'Rueda de corte en buen estado (sin desgaste visible)', ref:'IT-COR-02' },
        { id:'c3', label:'Aceite de corte aplicado correctamente', ref:'PO-COR-01' },
      ]},
      { sec:'Dimensiones', items:[
        { id:'c4', label:'Medidas verificadas con cinta calibrada antes del primer corte', ref:'IT-MED-01' },
        { id:'c5', label:'Tolerancia dimensional ±1mm respetada', ref:'ES-DIM-01' },
        { id:'c6', label:'Escuadra comprobada en cortes a 90°', ref:'IT-MED-02' },
      ]},
    ],
    inspeccion: [
      { sec:'Visual', items:[
        { id:'i1', label:'Inspección bajo luz apropiada (≥ 1000 lux)', ref:'IT-INS-01' },
        { id:'i2', label:'Ausencia de burbujas, manchas e inclusiones', ref:'ES-VIS-01' },
        { id:'i3', label:'Bordes sin astillas o fisuras visibles', ref:'ES-VIS-02' },
      ]},
      { sec:'Dimensional', items:[
        { id:'i4', label:'Espesor medido en 4 puntos con micrómetro', ref:'IT-MED-03' },
        { id:'i5', label:'Planitud verificada (flecha ≤ 0.3% de longitud)', ref:'ES-DIM-02' },
      ]},
      { sec:'Documentación', items:[
        { id:'i6', label:'Certificado de calidad emitido y firmado', ref:'PO-DOC-01' },
        { id:'i7', label:'Etiqueta de lote adherida correctamente', ref:'PO-ETQ-01' },
      ]},
    ],
    empaque: [
      { sec:'Materiales', items:[
        { id:'e1', label:'Separadores de papel kraft entre piezas', ref:'IT-EMP-01' },
        { id:'e2', label:'Cantoneras plásticas en esquinas', ref:'IT-EMP-02' },
        { id:'e3', label:'Fleje de acero tensado correctamente', ref:'IT-EMP-03' },
      ]},
      { sec:'Estiba', items:[
        { id:'e4', label:'Pallet en buen estado (sin clavos sueltos)', ref:'IT-EMP-04' },
        { id:'e5', label:'Peso por pallet dentro del límite (≤ 2 000 kg)', ref:'PO-LOG-01' },
        { id:'e6', label:'Señalización de frágil y orientación visible', ref:'PO-LOG-02' },
      ]},
    ],
  };

  let estado = {};
  let checklistActual = 'proceso';

  /* ---- NC demo ---- */
  const NCS = [
    { titulo:'Temperatura fuera de rango — Horno B', clase:'Crítico', area:'Línea B', fecha:'03/Jun', abierta:true },
    { titulo:'Espesor fuera de tolerancia — Lote VV-0094', clase:'Crítico', area:'Línea D', fecha:'02/Jun', abierta:true },
    { titulo:'Etiqueta sin firma de inspector', clase:'Mayor', area:'Inspección', fecha:'01/Jun', abierta:false },
  ];

  /* ---- Historial demo ---- */
  const HISTORIAL = [
    { id:'AUD-061', tipo:'Interna de Proceso',    area:'Línea A', auditor:'J. Ramírez', norma:'ISO 9001', pct:97, nc:0, estado:'Cerrada', fecha:'28/May' },
    { id:'AUD-062', tipo:'Inspección de Producto', area:'Inspección', auditor:'M. Ruiz', norma:'NMX-C-175', pct:88, nc:2, estado:'Cerrada', fecha:'30/May' },
    { id:'AUD-063', tipo:'Interna de Proceso',    area:'Línea B', auditor:'J. Ramírez', norma:'ISO 9001', pct:72, nc:4, estado:'Abierta', fecha:'02/Jun' },
  ];

  /* ---- Render checklist ---- */
  function renderChecklist(key) {
    checklistActual = key;
    const secs    = CHECKLISTS[key];
    const body    = document.getElementById('checklist-body');
    body.innerHTML = '';

    secs.forEach(sec => {
      const div = document.createElement('div');
      div.className = 'chk-section';
      div.innerHTML = `<div class="chk-section-title">${sec.sec}</div>`;
      sec.items.forEach(item => {
        const s   = estado[item.id] || 'pending';
        const el  = document.createElement('div');
        el.className = `chk-item ${s !== 'pending' ? s : ''}`;
        el.id = `chk-${item.id}`;
        el.innerHTML = `
          <div class="chk-check">
            ${s === 'ok' ? '<i class="ti ti-check"></i>' : s === 'nc' ? '<i class="ti ti-x"></i>' : s === 'na' ? '—' : ''}
          </div>
          <div class="chk-text">
            <div class="chk-label">${item.label}</div>
            <div class="chk-meta">Ref: ${item.ref}</div>
          </div>
          <div class="chk-actions">
            <button class="chk-btn ok-btn" title="Cumple" onclick="setChk('${item.id}','ok')">✓</button>
            <button class="chk-btn nc-btn" title="No Cumple" onclick="setChk('${item.id}','nc')">✗</button>
            <button class="chk-btn na-btn" title="N/A" onclick="setChk('${item.id}','na')">—</button>
          </div>
        `;
        div.appendChild(el);
      });
      body.appendChild(div);
    });

    updateProgreso(key);
  }

  /* ---- Global: marcar item ---- */
  window.setChk = function (id, val) {
    estado[id] = val;
    const el   = document.getElementById(`chk-${id}`);
    if (!el) return;
    el.className = `chk-item ${val}`;
    el.querySelector('.chk-check').innerHTML =
      val === 'ok' ? '<i class="ti ti-check"></i>' :
      val === 'nc' ? '<i class="ti ti-x"></i>' : '—';
    updateProgreso(checklistActual);
  };

  function updateProgreso(key) {
    const allIds  = CHECKLISTS[key].flatMap(s => s.items.map(i => i.id));
    const done    = allIds.filter(id => estado[id] && estado[id] !== 'pending').length;
    const total   = allIds.length;
    const pct     = total > 0 ? Math.round((done / total) * 100) : 0;

    const fill = document.getElementById('aud-progress-fill');
    fill.style.width = pct + '%';
    fill.className   = `aud-progress-fill${pct === 100 ? ' complete' : ''}`;
    document.getElementById('pct-label').textContent      = pct + '%';
    document.getElementById('badge-progreso').textContent = `${done} / ${total}`;
  }

  /* ---- Render NC ---- */
  function renderNC() {
    const cont = document.getElementById('nc-list');
    cont.innerHTML = '';
    NCS.forEach((nc, i) => {
      const div = document.createElement('div');
      div.className = 'nc-item';
      div.style.animationDelay = `${0.08 * i}s`;
      const clsBadge = nc.clase === 'Crítico' ? 'badge-danger' : 'badge-warning';
      div.innerHTML = `
        <div class="nc-header">
          <span class="nc-title">${nc.titulo}</span>
          <span class="badge ${clsBadge}">${nc.clase}</span>
        </div>
        <div class="nc-meta">
          <span><i class="ti ti-map-pin" style="font-size:12px"></i> ${nc.area}</span>
          <span><i class="ti ti-calendar" style="font-size:12px"></i> ${nc.fecha}</span>
          <span style="color:${nc.abierta ? 'var(--danger)' : 'var(--success)'}">
            ${nc.abierta ? '● Abierta' : '✓ Cerrada'}
          </span>
        </div>
      `;
      cont.appendChild(div);
    });
  }

  /* ---- Render historial ---- */
  function renderHistorial() {
    const tbody = document.getElementById('tabla-aud');
    tbody.innerHTML = '';
    HISTORIAL.forEach((a, i) => {
      const tr = document.createElement('tr');
      tr.style.animationDelay = `${0.05 * i}s`;
      const pctColor = a.pct >= 90 ? 'var(--success)' : a.pct >= 75 ? 'var(--warning)' : 'var(--danger)';
      const estBadge = a.estado === 'Cerrada' ? 'badge-success' : 'badge-info';
      tr.innerHTML = `
        <td class="font-mono" style="font-size:12px">${a.id}</td>
        <td>${a.tipo}</td>
        <td>${a.area}</td>
        <td>${a.auditor}</td>
        <td style="font-size:12px">${a.norma}</td>
        <td style="font-weight:600;color:${pctColor};font-family:var(--font-mono)">${a.pct}%</td>
        <td style="text-align:center">${a.nc > 0 ? `<span style="color:var(--danger);font-weight:600">${a.nc}</span>` : '—'}</td>
        <td><span class="badge ${estBadge}">${a.estado}</span></td>
        <td class="text-muted text-sm">${a.fecha}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  /* ---- Eventos ---- */
  document.getElementById('sel-checklist').addEventListener('change', e => {
    renderChecklist(e.target.value);
  });

  document.getElementById('btn-reset-chk').addEventListener('click', () => {
    const key  = document.getElementById('sel-checklist').value;
    const ids  = CHECKLISTS[key].flatMap(s => s.items.map(i => i.id));
    ids.forEach(id => delete estado[id]);
    renderChecklist(key);
  });

  document.getElementById('btn-cerrar-aud').addEventListener('click', () => {
    const key  = document.getElementById('sel-checklist').value;
    const ids  = CHECKLISTS[key].flatMap(s => s.items.map(i => i.id));
    const done = ids.filter(id => estado[id]).length;
    if (done < ids.length) {
      if (!confirm(`Quedan ${ids.length - done} ítems sin respuesta. ¿Deseas cerrar de todas formas?`)) return;
    }
    alert('Auditoría cerrada y registrada correctamente.');
  });

  document.getElementById('btn-nueva-aud').addEventListener('click', () => {
    const auditor = document.getElementById('a-auditor').value.trim();
    if (!auditor) { alert('Ingresa el nombre del auditor.'); return; }
    const toast = document.getElementById('toast-aud');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
    document.getElementById('a-auditor').value = '';
    document.getElementById('a-obs').value = '';
  });

  /* ---- Init ---- */
  renderChecklist('proceso');
  renderNC();
  renderHistorial();

})();
