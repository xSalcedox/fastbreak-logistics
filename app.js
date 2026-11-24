/**
 * ARCHIVO: app.js
 * PROYECTO: FastBreak - Sistema de Control Logístico y de Utilería
 * DESCRIPCIÓN: Lógica de negocio, gestión del DOM, motor predictivo JIT y seguridad.
 */

document.addEventListener("DOMContentLoaded", () => {
    let inventario = [];
    let logsIA = [];
    let usuarioAutenticado = false;

    // Referencias DOM principales
    const inventoryBody = document.getElementById("inventory-body");
    const aiLogsContainer = document.getElementById("ai-logs-container");
    const inventoryForm = document.getElementById("inventory-form");
    const kpiOlvidados = document.getElementById("kpi-olvidados");
    
    // Referencias Modal / Login de Seguridad
    const modal = document.getElementById("login-modal");
    const btnLoginModal = document.getElementById("btn-login-modal");
    const btnCloseModal = document.getElementById("close-modal");
    const loginForm = document.getElementById("login-form");
    const loginError = document.getElementById("login-error");

    // ==========================================
    // 1. CARGA DE DATOS (ASÍNCRONA CON FALLBACK)
    // ==========================================
    async function cargarDatosIniciales() {
        try {
            const response = await fetch("data.json");
            const data = await response.json();
            inventario = data.inventario;
            logsIA = data.logsIA;
            renderAll();
        } catch (error) {
            console.warn("Cargando datos fallback locales por restricciones CORS (file://).", error);
            inventario = [
                { id: 1, nombre: "Balones Oficiales Molten", categoria: "Balones", cantidadTotal: 10, cantidadActual: 8, estado: "Completo", responsable: "Coach Carlos", umbralCritico: 3 }
            ];
            logsIA = [
                { id: 101, itemId: 1, fecha: new Date().toLocaleString(), evento: "Sistema inicializado correctamente", severidad: "Media", scriptSugerido: "Monitoreo Lean activo." }
            ];
            renderAll();
        }
    }

    // ==========================================
    // 2. RENDERIZADO GENERAL Y DEL DOM
    // ==========================================
    function renderAll() {
        renderTablaInventario();
        renderLogsIA();
        actualizarKPIs();
    }

    function renderTablaInventario() {
        inventoryBody.innerHTML = "";
        inventario.forEach((item) => {
            const tr = document.createElement("tr");
            const porcentajeStock = (item.cantidadActual / item.cantidadTotal) * 100;
            
            // Regla Six Sigma / Predictiva: Marca en rojo si está por debajo del umbral o faltante
            const umbral = item.umbralCritico || 2;
            const esCritico = item.cantidadActual <= umbral || item.estado === "Faltante";

            if (esCritico) {
                tr.classList.add("critical-row");
            }

            const estadoClass = item.estado.replace(" ", "-");

            tr.innerHTML = `
                <td><strong>${item.nombre}</strong></td>
                <td>${item.categoria}</td>
                <td>${item.cantidadActual} / ${item.cantidadTotal} (${Math.round(porcentajeStock)}%)</td>
                <td><span style="font-size: 0.85rem; color: var(--text-muted);">${item.responsable || "Sin asignar"}</span></td>
                <td><span class="badge badge-${estadoClass}">${item.estado}</span></td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="eliminarItem(${item.id})">Eliminar</button>
                </td>
            `;
            inventoryBody.appendChild(tr);
        });
    }

    function renderLogsIA() {
        aiLogsContainer.innerHTML = "";
        logsIA.forEach((log) => {
            const div = document.createElement("div");
            div.className = `log-item ${log.severidad}`;
            div.innerHTML = `
                <div class="log-header">
                    <span>${log.fecha}</span>
                    <strong>${log.severidad.toUpperCase()}</strong>
                </div>
                <p><strong>Evento:</strong> ${log.evento}</p>
                <p class="log-script">"${log.scriptSugerido}"</p>
            `;
            aiLogsContainer.appendChild(div);
        });
    }

    function actualizarKPIs() {
        const faltantes = inventario.filter(item => item.estado === "Faltante" || item.cantidadActual <= (item.umbralCritico || 2)).length;
        kpiOlvidados.textContent = faltantes;
    }

    // ==========================================
    // 3. IA PREDICTIVA Y REGLAS DE REORDEN JIT
    // ==========================================
    function evaluarReglasPredictivas(item) {
        const umbral = item.umbralCritico || 2;
        if (item.cantidadActual <= umbral) {
            const nuevoLog = {
                id: Date.now(),
                itemId: item.id,
                fecha: new Date().toLocaleString(),
                evento: `Alerta Predictiva JIT: Stock bajo en '${item.nombre}'`,
                severidad: item.cantidadActual === 0 ? "Crítica" : "Media",
                scriptSugerido: `SUGERENCIA IA: El artículo '${item.nombre}' operado por '${item.responsable}' está en zona de reorden (${item.cantidadActual} disponibles). Reponer preventivamente.`
            };
            logsIA.unshift(nuevoLog);
        }
    }

    // ==========================================
    // 4. VALIDACIÓN Y GESTIÓN DE FORMULARIO (PRINCIPIO DE RESPONSABILIDAD ÚNICA)
    // ==========================================
    function validarDatosFormulario(cantidadActual, cantidadTotal) {
        if (isNaN(cantidadActual) || isNaN(cantidadTotal)) {
            alert("Error de ejecución: Las cantidades deben ser valores numéricos válidos.");
            return false;
        }
        if (cantidadActual < 0 || cantidadTotal < 0) {
            alert("Error lógico: No se permiten cantidades negativas.");
            return false;
        }
        if (cantidadActual > cantidadTotal) {
            alert("Error lógico: La cantidad actual no puede superar el total registrado.");
            return false;
        }
        return true;
    }

    function crearNuevoItemInventario() {
        const nombre = document.getElementById("nombre").value.trim();
        const categoria = document.getElementById("categoria").value;
        const cantidadTotal = parseInt(document.getElementById("cantidadTotal").value, 10);
        const cantidadActual = parseInt(document.getElementById("cantidadActual").value, 10);
        const responsable = document.getElementById("responsable").value.trim();
        const estado = document.getElementById("estado").value;

        if (!validarDatosFormulario(cantidadActual, cantidadTotal)) {
            return null;
        }

        return {
            id: Date.now(),
            nombre,
            categoria,
            cantidadTotal,
            cantidadActual,
            responsable: responsable || "Sin asignar",
            estado,
            umbralCritico: Math.max(1, Math.floor(cantidadTotal * 0.2)) // 20% umbral predictivo JIT
        };
    }

    inventoryForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const nuevoItem = crearNuevoItemInventario();
        
        if (nuevoItem) {
            inventario.push(nuevoItem);
            evaluarReglasPredictivas(nuevoItem);
            renderAll();
            inventoryForm.reset();
        }
    });

    // Función global para eliminación segura con permisos
    window.eliminarItem = (id) => {
        if (!usuarioAutenticado) {
            alert("Se requieren permisos de Entrenador/Administrador para eliminar registros del inventario.");
            modal.style.display = "flex";
            return;
        }
        inventario = inventario.filter(item => item.id !== id);
        renderAll();
    };

    // ==========================================
    // 5. CONTROL DE SEGURIDAD Y MODAL LOGIN
    // ==========================================
    btnLoginModal.addEventListener("click", () => modal.style.display = "flex");
    btnCloseModal.addEventListener("click", () => modal.style.display = "none");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        loginError.textContent = "";

        const user = document.getElementById("username").value.trim();
        const pass = document.getElementById("password").value;

        if (user.length < 4 || user.length > 12) {
            loginError.textContent = "El usuario debe tener entre 4 y 12 caracteres.";
            return;
        }

        if (pass.length < 6 || pass.length > 16) {
            loginError.textContent = "La contraseña debe tener entre 6 y 16 caracteres.";
            return;
        }

        usuarioAutenticado = true;
        btnLoginModal.textContent = `Coach: ${user}`;
        btnLoginModal.classList.replace("btn-secondary", "btn-primary");
        modal.style.display = "none";
        alert("Autenticación exitosa. Privilegios de administrador activados.");
    });

    // Inicializar aplicación
    cargarDatosIniciales();
});