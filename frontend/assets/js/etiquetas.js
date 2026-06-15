/* etiquetas.js */
(function () {
  'use strict';

  const DEMO_ETQ = [
    { lote:'VV-2024-0091', prod:'Vidrio Templado 6mm',  dims:'1200x800', qty:120, cliente:'Constructora Nexo', estado:'aprobado',    hora:'06:20' },
    { lote:'VV-2024-0092', prod:'Vidrio Laminado 8mm',  dims:'1500x900', qty:80,  cliente:'Vidros del Norte',  estado:'aprobado',    hora:'07:05' },
    { lote:'VV-2024-0093', prod:'Vidrio Reflectivo',    dims:'1000x600', qty:60,  cliente:'Arquitectura 21',   estado:'condicionado',hora:'07:38' },
    { lote:'VV-2024-0094', prod:'Vidrio Serigrafiado',  dims:'800x400',  qty:40,  cliente:'Decovidrio SA',     estado:'retenido',    hora:'08:12' },
  ];

  let etiquetas = [...DEMO_ETQ];
  let qrInstance = null;

  /* ---- Tabla ---- */
  function estadoLbl(e) {
    const map = { aprobado:'badge-success', condicionado:'badge-warning', retenido:'badge-danger' };
    const lbl = { aprobado:'Aprobado', condicionado:'Condicionado', retenido:'Retenido' };
    return `<span class="badge ${map[e]}">${lbl[e]}</span>`;
  }

  function renderTabla() {
    const tbody = document.getElementById('tabla-etq');
    tbody.innerHTML = '';
    etiquetas.forEach((e, i) => {
      const tr = document.createElement('tr');
      tr.style.animationDelay = `${0.04 * i}s`;
      tr.innerHTML = `
        <td class="font-mono" style="font-size:12px">${e.lote}</td>
        <td>${e.prod}</td>
        <td class="font-mono">${e.dims}</td>
        <td>${e.qty}</td>
        <td>${e.cliente}</td>
        <td>${estadoLbl(e.estado)}</td>
        <td class="text-muted text-sm">${e.hora}</td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="reimprimirEtq('${e.lote}')">
            <i class="ti ti-printer"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  /* ---- Generar etiqueta ---- */
  function generar() {
    const lote    = document.getElementById('e-lote').value.trim();
    const prod    = document.getElementById('e-prod').value;
    const dims    = document.getElementById('e-dims').value.trim();
    const esp     = document.getElementById('e-esp').value;
    const qty     = document.getElementById('e-qty').value;
    const cliente = document.getElementById('e-cliente').value.trim();
    const norma   = document.getElementById('e-norma').value;
    const estado  = document.getElementById('e-estado').value;

    if (!lote || !prod || !dims || !esp || !qty || !cliente) {
      alert('Completa todos los campos para generar la etiqueta.');
      return;
    }

    const ahora     = new Date();
    const fechaStr  = ahora.toLocaleDateString('es-MX', { day:'2-digit', month:'short', year:'numeric' });
    const horaStr   = ahora.toTimeString().slice(0,5);
    const qrData    = `VENVIDRIO|LOTE:${lote}|PROD:${prod}|DIM:${dims}|ESP:${esp}mm|QTY:${qty}|CLI:${cliente}|EST:${estado.toUpperCase()}`;

    const statusMap = { aprobado:'✓ APROBADO', condicionado:'⚠ CONDICIONADO', retenido:'✕ RETENIDO' };

    const preview = document.getElementById('label-preview');
    preview.innerHTML = `
      <div class="label-card" id="label-card">
        <div class="label-header">
          <div>
            <div class="label-brand">VENV<span>IDRIO</span></div>
            <div class="label-subtitle">Control de Calidad</div>
          </div>
          <div style="font-family:var(--font-mono);font-size:11px;color:rgba(255,255,255,0.6)">${lote}</div>
        </div>
        <div class="label-body">
          <div class="label-info">
            <div class="label-product">${prod}</div>
            <div class="label-row"><span class="label-key">Dimensiones</span><span class="label-val">${dims} mm</span></div>
            <div class="label-row"><span class="label-key">Espesor</span><span class="label-val">${esp} mm</span></div>
            <div class="label-row"><span class="label-key">Cantidad</span><span class="label-val">${qty} pzs</span></div>
            <div class="label-row"><span class="label-key">Cliente</span><span class="label-val">${cliente}</span></div>
            <div class="label-row"><span class="label-key">Norma</span><span class="label-val">${norma.split(' ')[0]}</span></div>
            <div class="label-row"><span class="label-key">Fecha</span><span class="label-val">${fechaStr}</span></div>
          </div>
          <div class="label-qr">
            <div id="qr-container"></div>
            <div class="label-qr-id">${lote}</div>
          </div>
        </div>
        <div class="label-footer">
          <span class="label-status ${estado}">
            ${estado === 'aprobado' ? '<i class="ti ti-circle-check"></i>' : estado === 'condicionado' ? '<i class="ti ti-alert-circle"></i>' : '<i class="ti ti-circle-x"></i>'}
            ${statusMap[estado]}
          </span>
          <span class="label-date">${horaStr} — Turno Matutino</span>
        </div>
      </div>
    `;

    // QR code
    if (qrInstance) { qrInstance.clear(); qrInstance = null; }
    try {
      qrInstance = new QRCode(document.getElementById('qr-container'), {
        text: qrData,
        width: 96,
        height: 96,
        colorDark: '#0f172a',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M,
      });
    } catch (e) { /* silencioso si la lib no cargó */ }

    // Mostrar botones de acción
    document.getElementById('btn-actions').style.opacity = '1';

    // Agregar al historial
    const hora = ahora.toTimeString().slice(0, 5);
    etiquetas.unshift({ lote, prod, dims: dims.replace(' ', '').replace('x','x'), qty, cliente, estado, hora });
    renderTabla();
  }

  document.getElementById('btn-generar').addEventListener('click', generar);

  document.getElementById('btn-limpiar-etq').addEventListener('click', () => {
    ['e-lote','e-dims','e-esp','e-qty','e-cliente'].forEach(id => document.getElementById(id).value = '');
    ['e-prod','e-norma','e-estado'].forEach(id => document.getElementById(id).selectedIndex = 0);
    document.getElementById('label-preview').innerHTML = `
      <div class="label-empty">
        <i class="ti ti-tag" style="font-size:40px;color:var(--border-dark)"></i>
        <p>Completa el formulario y presiona <strong>Generar Etiqueta</strong></p>
      </div>`;
    document.getElementById('btn-actions').style.opacity = '0';
  });

  document.getElementById('btn-imprimir').addEventListener('click', () => {
    window.print();
  });

  document.getElementById('btn-descargar').addEventListener('click', () => {
    alert('Función de descarga PDF disponible con integración backend.');
  });

  /* ---- Global para reimpresión ---- */
  window.reimprimirEtq = function (lote) {
    document.getElementById('e-lote').value = lote;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ---- Init ---- */
  renderTabla();

})();
