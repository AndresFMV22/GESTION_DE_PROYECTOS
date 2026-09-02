# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este repo

Base de conocimiento de la materia **Gestión de Proyectos (UPB, semestre 6)** y del proyecto que se formula en ella: **Alivia**, una plataforma de recordatorios de obligaciones de la vida adulta en Colombia.

**Aquí no hay código.** El repositorio es documental. La estructura y la convención de nombres están en `README.md`.

Todo está en español: documentación, mensajes de commit y, cuando exista, el código y los textos de UI. Mantenerlo así.

## El prototipo fue descartado

Existió una implementación previa (`GENERAL/backend`, `GENERAL/web`, `GENERAL/mobile`) con Express, React y Expo sobre Supabase. **Se eliminó del working tree por decisión del equipo**, documentada en `docs/proyecto/alcance-tecnico.md` §3: el modelo de información no soportaba el catálogo administrable, la suscripción con vigencia ni el aislamiento de datos que el producto exige.

Sigue en el historial de git (último commit con el código: `c6109f3`). Si hace falta consultarlo:

```bash
git log --oneline -- GENERAL/
git show c6109f3:GENERAL/backend/src/controllers/reminderController.js
```

**No restaurarlo ni reutilizarlo sin decisión explícita del usuario.** Lo que valía la pena conservar ya se rescató como documentación:

- El catálogo de obligaciones → `docs/proyecto/catalogo-obligaciones.md`
- El modelo conceptual del dominio → mismo archivo, §5
- Los defectos que lo hacían fallar → `docs/proyecto/alcance-tecnico.md` §4.1, convertidos en requisitos del sistema nuevo

## Documento de referencia

`docs/proyecto/alcance-tecnico.md` manda sobre cualquier otra fuente en cuanto a qué se construye. Antes de proponer trabajo de software, leerlo. Sus puntos no negociables:

- **Criterio único de aceptación:** el aviso llega antes del vencimiento, no después.
- El catálogo de obligaciones es información administrable del sistema, nunca una constante en el código del cliente.
- La verificación de acceso a módulos de pago ocurre en el servidor.
- Ninguna acción destruye información del usuario sin confirmación.
- La app móvil está fuera del alcance de esta etapa.

## Trabajar con los documentos

Los HTML de `docs/proyecto/` son autocontenidos, sin build: se abren directo en el navegador.

Las transcripciones de `docs/material-clase/` siguen un formato fijo de ocho secciones (`§1` procedencia y método … `§8` resumen ejecutivo). Si se agrega una transcripción nueva, seguir ese formato: extracción del OOXML, sección de auditoría de seguridad, y una sección `§7` que declare explícitamente qué es cita literal, qué es reconstrucción y qué no se pudo verificar. Varias contienen advertencias de integridad que importan — por ejemplo, la 08 documenta un error aritmético del material de clase (declara 18 días de duración donde sus propios datos dan 15).

No inventar comandos de build, test ni lint: no hay nada que ejecutar en este repositorio.

## Estado que conviene tener presente

- El trabajo de campo (200 encuestas, 10 entrevistas, piloto de 50 usuarios) **no se ha hecho**. Bloquea el estudio de mercado de la Entrega 2 y deja el catálogo sin validar.
- El precio de USD 9,99 **no tiene sustento**; el propio PESTEL del proyecto lo marca como la amenaza más crítica. Tratarlo como provisional.
- El cronograma de 114 días hábiles se dimensionó suponiendo una base de software existente y **está pendiente de reestimar**.
