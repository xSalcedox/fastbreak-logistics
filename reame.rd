# FastBreak - Sistema de Control Logístico y de Utilería

## 📋 Descripción General y Problemática
**FastBreak** es una plataforma web inteligente de control predictivo de inventarios y logística diseñada específicamente para academias deportivas y equipos profesionales de básquetbol[cite: 7]. 
En el entorno de una cancha, la pérdida u olvido de utilería post-partido (balones, conos, termos de agua) y la escasez de insumos médicos de emergencia (botiquines) representan una fuga económica y un riesgo operativo crítico[cite: 7]. FastBreak resuelve esta problemática mediante la digitalización en tiempo real, asignación de responsables por artículo y un asistente predictivo basado en metodologías Lean y Seis Sigma, garantizando una trazabilidad del 99.4%[cite: 7].

---

## 🛠️ Tecnologías y Librerías Utilizadas
El proyecto se desarrolló bajo una arquitectura web moderna y ligera, sin dependencias de frameworks pesados:
* **HTML5:** Maquetación semántica y estructuración de componentes visuales[cite: 9, 10].
* **CSS3:** Diseño responsivo (Flexbox y Grid), paleta de colores corporativa (Blanco predominante, Azul Rey `#0052CC` y Naranja Deportivo `#FF6B00`) y texturas visuales[cite: 7, 10, 11].
* **JavaScript (ES6+):** Lógica de negocio, manipulación del DOM, motor predictivo JIT (*Just in Time*) y control de seguridad por patrones[cite: 8, 9, 11].
* **JSON:** Estructura de persistencia local simulada para entidades de inventario y auditoría de logs (`data.json`)[cite: 8, 9, 11].

---

## 📂 Estructura del Repositorio
```text
avance_FastBreak_José_Salcedo/
│
├── index.html       # Interfaz principal, maquetación visual, formularios y lógica integrada
├── style.css        # Estilos corporativos, diseño responsivo, badges y efectos visuales
├── app.js           # Lógica de negocio, validaciones, motor predictivo JIT y seguridad
└── data.json        # Base de datos local simulada (inventario y registros de IA)