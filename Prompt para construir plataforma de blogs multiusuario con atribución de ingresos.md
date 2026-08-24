Quiero que desarrolles una primera versión robusta, segura y escalable de una plataforma web de publicación de historias/artículos, similar conceptualmente a Medium, pero administrada por mí.

IMPORTANTE: no quiero un simple blog. Quiero una plataforma multiusuario en la que determinados usuarios puedan recibir permiso para publicar contenido y en la que, desde el principio, la arquitectura permita saber qué tráfico y qué ingresos publicitarios corresponden a cada publicación y, por tanto, a cada autor.

## 1. OBJETIVO DEL PRODUCTO

La plataforma debe permitir:

- Que cualquier visitante pueda leer las publicaciones públicas.
- Que los usuarios autorizados puedan crear publicaciones.
- Que los autores puedan guardar borradores.
- Que los autores puedan editar sus propias publicaciones.
- Que las publicaciones puedan pasar por un proceso de revisión/aprobación.
- Que un administrador pueda aprobar, rechazar, editar, ocultar o eliminar cualquier publicación.
- Que el administrador también pueda crear y publicar sus propias historias exactamente igual que cualquier autor.
- Que cada publicación esté asociada permanentemente a un autor.
- Que podamos medir las visitas y estadísticas de cada publicación.
- Que la arquitectura esté preparada para atribuir ingresos publicitarios a cada publicación y autor.
- Que exista un panel de administración completo.
- Que exista un panel independiente para cada autor.
- Que el sistema esté preparado para crecer a miles de publicaciones y usuarios.

NO quiero que el rol de administrador sea incompatible con ser autor.

Un administrador debe poder:
1. administrar la plataforma;
2. administrar usuarios;
3. moderar contenido;
4. ver estadísticas globales;
5. ver estadísticas por autor;
6. crear publicaciones;
7. editar sus propias publicaciones;
8. publicar sus propias historias.

## 2. STACK TECNOLÓGICO

Utiliza una arquitectura moderna y mantenible.

Preferencia:

- Next.js con App Router
- TypeScript
- PostgreSQL
- Prisma ORM
- Tailwind CSS
- sistema de autenticación seguro
- almacenamiento de imágenes preparado para producción
- arquitectura compatible con despliegue en Vercel/Cloudflare u otra infraestructura moderna

Si consideras que alguna tecnología alternativa es significativamente mejor, explícala antes de sustituirla.

Evita dependencias innecesarias.

La aplicación debe funcionar correctamente tanto en móvil como en escritorio.

## 3. ROLES

Implementa como mínimo estos roles:

### ADMIN

Puede:

- acceder al dashboard administrativo;
- crear publicaciones;
- editar cualquier publicación;
- eliminar cualquier publicación;
- aprobar publicaciones;
- rechazar publicaciones;
- publicar/despublicar;
- crear usuarios;
- editar usuarios;
- cambiar roles;
- bloquear usuarios;
- ver todos los autores;
- ver estadísticas globales;
- ver estadísticas por autor;
- ver estadísticas por publicación;
- consultar ingresos estimados;
- configurar parámetros de monetización;
- gestionar categorías;
- gestionar etiquetas.

### AUTHOR

Puede:

- iniciar sesión;
- editar su perfil;
- crear publicaciones;
- guardar borradores;
- editar sus propias publicaciones;
- enviar publicaciones para revisión;
- ver el estado de sus publicaciones;
- ver estadísticas de sus publicaciones;
- ver visitas;
- ver ingresos atribuidos/estimados;
- NO puede editar publicaciones de otros autores;
- NO puede acceder al dashboard administrativo.

La autorización debe implementarse en backend, no solamente ocultando botones en frontend.

## 4. MODELO DE PUBLICACIÓN

Cada publicación debe tener:

- id
- authorId
- title
- slug
- excerpt
- content
- featuredImage
- status
- categoryId
- tags
- createdAt
- updatedAt
- publishedAt
- seoTitle
- seoDescription
- canonicalUrl
- viewCount
- readingTime

Estados:

- DRAFT
- PENDING_REVIEW
- PUBLISHED
- REJECTED
- ARCHIVED

El slug debe ser único.

Cuando una publicación se publica, debe tener una URL pública limpia:

/stories/mi-historia

No utilices IDs en las URLs públicas.

## 5. EDITOR

Implementa un editor de contenido moderno.

Debe permitir:

- títulos
- subtítulos
- párrafos
- negrita
- cursiva
- enlaces
- listas
- citas
- imágenes
- separación de secciones
- contenido embebido si es seguro

El contenido debe almacenarse de forma estructurada y segura.

Evita almacenar HTML arbitrario sin sanitización.

Debe existir vista previa antes de publicar.

## 6. FLUJO DE PUBLICACIÓN

El flujo debe ser:

AUTHOR:

Crear borrador
→ editar
→ guardar
→ enviar a revisión
→ PENDING_REVIEW

ADMIN:

Revisar
→ aprobar
→ PUBLISHED

o

Rechazar
→ REJECTED

El administrador también puede publicar directamente sus propias publicaciones si así está configurado.

Debe existir historial básico de cambios/estado para saber quién realizó cada acción.

## 7. PÁGINAS PÚBLICAS

Crear:

/

Página principal con publicaciones destacadas y recientes.

 /stories/[slug]

Página individual de cada historia.

 /category/[slug]

Listado por categoría.

 /tag/[slug]

Listado por etiqueta.

 /author/[username]

Perfil público del autor con sus publicaciones.

 /search

Búsqueda de publicaciones.

Crear también:

- página 404
- política de privacidad
- términos y condiciones
- política de cookies
- página de contacto

Las páginas públicas deben estar optimizadas para SEO.

## 8. SEO

Implementa desde el principio:

- metadata dinámica
- title
- description
- canonical
- Open Graph
- Twitter/X cards
- sitemap.xml
- robots.txt
- datos estructurados Schema.org cuando corresponda
- URLs limpias
- breadcrumbs
- enlaces internos
- imágenes optimizadas
- lazy loading
- Core Web Vitals
- diseño responsive

Las publicaciones públicas deben poder ser indexadas.

Los borradores, publicaciones rechazadas y páginas privadas NO deben ser indexables.

## 9. ANALÍTICA

Quiero que la arquitectura permita saber qué publicación genera qué tráfico.

Cada visita debe poder asociarse a:

- articleId
- authorId
- fecha
- país si está disponible
- dispositivo/categoría de dispositivo
- referrer
- sesión anónima

No quiero almacenar información personal innecesaria.

Implementa analítica respetando privacidad y evitando almacenar IP completa si no es necesaria.

Necesito estadísticas:

### Por publicación

- visitas
- visitantes/sesiones
- páginas vistas
- tiempo aproximado de lectura si es posible
- países
- dispositivos
- fuentes de tráfico
- visitas por día

### Por autor

- visitas totales
- publicaciones publicadas
- publicaciones más visitadas
- visitas por publicación
- ingresos atribuidos/estimados

### Global

- visitas totales
- publicaciones
- autores
- usuarios
- publicaciones pendientes
- publicaciones más populares
- ingresos estimados

## 10. MONETIZACIÓN

La aplicación debe estar preparada para Google AdSense.

IMPORTANTE:

No inventes datos de ingresos.

La aplicación debe diferenciar claramente:

- ingresos reales/importados
- ingresos estimados
- ingresos calculados internamente

Diseña una capa de monetización desacoplada del resto de la aplicación.

Por ejemplo:

AdRevenueRecord:

- id
- date
- articleId opcional
- authorId opcional
- impressions
- estimatedRevenue
- currency
- source
- createdAt

La arquitectura debe permitir posteriormente importar datos reales de una plataforma publicitaria o utilizar métricas agregadas para calcular atribución.

No afirmes que podemos obtener ingresos exactos por autor directamente de AdSense si la API o los datos disponibles no permiten esa granularidad.

En el dashboard, mostrar:

Ingresos estimados

y no "ingresos definitivos" cuando los datos sean una estimación.

Debe ser posible configurar un porcentaje de reparto:

platformSharePercentage

authorSharePercentage

Ejemplo:

Ingresos atribuidos: $100

Autor: 70%
Plataforma: 30%

Pero inicialmente NO necesitamos realizar pagos reales a los autores.

Solo necesitamos registrar y mostrar las cantidades.

## 11. PANEL ADMINISTRADOR

Crear /admin.

Dashboard:

- usuarios
- autores
- publicaciones
- pendientes de revisión
- publicaciones publicadas
- visitas
- ingresos estimados
- publicaciones más visitadas
- autores con mayor tráfico

Secciones:

/admin/users
/admin/authors
/admin/stories
/admin/categories
/admin/tags
/admin/analytics
/admin/revenue
/admin/settings

El administrador debe poder filtrar estadísticas por:

- fecha
- autor
- publicación
- categoría

## 12. PANEL DEL AUTOR

Crear:

/dashboard

Mostrar:

- mis publicaciones
- borradores
- pendientes
- publicadas
- visitas
- ingresos estimados
- publicaciones más populares

Crear:

/dashboard/stories
/dashboard/stories/new
/dashboard/stories/[id]/edit
/dashboard/analytics
/dashboard/revenue
/dashboard/profile

Un autor nunca debe poder modificar mediante una petición HTTP directa una publicación que pertenece a otro autor.

Comprueba ownership en servidor.

## 13. BASE DE DATOS

Diseña un esquema PostgreSQL/Prisma normalizado.

Como mínimo:

User
Role
Article
Category
Tag
ArticleTag
ArticleView/Event
RevenueRecord
AuthorRevenue
AuditLog

Añade relaciones, índices y constraints apropiados.

Utiliza índices para:

- slug
- authorId
- status
- publishedAt
- createdAt
- categoryId

Piensa en escalabilidad.

## 14. SEGURIDAD

Esto es MUY importante.

Implementa:

- autenticación segura
- autorización basada en roles
- autorización basada en ownership
- validación de inputs
- sanitización del contenido
- protección contra XSS
- protección CSRF cuando corresponda
- rate limiting en endpoints sensibles
- protección contra abuso
- validación de archivos/imágenes
- límites de tamaño
- no exponer secretos en frontend
- variables de entorno
- errores seguros
- logs
- headers de seguridad
- protección de rutas administrativas

Nunca confíes en datos enviados desde el navegador para determinar:

- usuario
- autor
- rol
- permisos
- ingresos

Todo eso debe validarse en servidor.

## 15. IMÁGENES

Los usuarios podrán subir imágenes para sus historias.

No guardes archivos directamente dentro del repositorio.

Utiliza almacenamiento externo compatible con producción.

Valida:

- MIME type
- extensión
- tamaño
- dimensiones

Optimiza las imágenes automáticamente cuando sea posible.

## 16. DISEÑO

Quiero una interfaz limpia, moderna y rápida.

Prioridad:

1. legibilidad
2. velocidad
3. móvil
4. accesibilidad
5. SEO

La página de lectura debe parecer una plataforma editorial profesional.

No quiero un dashboard visualmente recargado.

## 17. ADMINISTRADOR COMO AUTOR

Esto es obligatorio.

El usuario administrador debe poder crear una historia desde el mismo editor que utilizan los autores.

No quiero duplicar sistemas.

Por ejemplo:

User:

id: 1
name: "Administrador"
role: ADMIN

puede crear:

Article:

authorId: 1

Por tanto, todas las publicaciones deben tener un authorId aunque el autor sea administrador.

## 18. AUDITORÍA

Crear AuditLog.

Registrar acciones importantes:

- login
- creación de publicación
- edición
- envío a revisión
- aprobación
- rechazo
- publicación
- despublicación
- eliminación
- cambio de rol
- bloqueo de usuario

Registrar:

- actorId
- action
- entityType
- entityId
- timestamp
- metadata segura

No almacenar secretos ni datos personales innecesarios.

## 19. RENDIMIENTO

La web pública debe ser extremadamente rápida.

Utiliza:

- caching cuando corresponda
- generación estática/revalidación cuando sea conveniente
- imágenes optimizadas
- consultas eficientes
- paginación
- índices
- evitar N+1 queries

No cargues estadísticas pesadas en las páginas públicas.

## 20. ESCALABILIDAD

Diseña pensando en:

- 10.000 usuarios
- 100.000 publicaciones
- millones de visitas

No necesito implementar infraestructura para esos números inmediatamente, pero la arquitectura no debe impedir crecer.

## 21. DATOS DE PRUEBA

Crea seed data para:

- 1 administrador
- 3 autores
- 10 publicaciones
- varias categorías
- etiquetas
- eventos de visitas
- algunos registros de ingresos estimados

Las credenciales de prueba deben estar claramente indicadas y NO deben utilizarse como credenciales de producción.

## 22. TESTS

Incluye tests para las partes críticas:

- autenticación
- autorización
- ownership
- creación de artículos
- edición de artículos
- publicación
- aprobación
- rechazo
- estadísticas
- atribución de ingresos

Especialmente:

Un autor A intenta editar una publicación del autor B.

Debe devolver acceso denegado.

Un usuario normal intenta acceder a /admin.

Debe devolver acceso denegado.

Un autor intenta cambiar authorId en una petición.

El servidor debe ignorar/rechazar esa manipulación.

## 23. DESPLIEGUE

Quiero que la aplicación pueda desplegarse fácilmente.

Incluye:

- .env.example
- instrucciones de instalación
- migraciones Prisma
- seed
- build
- start
- configuración de producción
- README completo

No incluyas secretos reales.

## 24. FORMA DE TRABAJO

NO generes una aplicación superficial de ejemplo.

Quiero código funcional, organizado y preparado para continuar desarrollándolo.

Primero analiza la arquitectura completa.

Después:

1. propón estructura de carpetas;
2. propón esquema de base de datos;
3. propón arquitectura de autenticación/autorización;
4. propón arquitectura de analítica;
5. propón arquitectura de monetización;
6. identifica riesgos técnicos;
7. después implementa.

No inventes APIs de Google AdSense.

Si alguna integración externa requiere credenciales, API, aprobación o configuración manual, indícalo claramente.

Cuando una funcionalidad no pueda implementarse correctamente sin una integración externa, crea una interfaz/adaptador bien definido para poder conectarla posteriormente.

## 25. CRITERIO DE ÉXITO DEL MVP

Al terminar debo poder:

1. entrar como administrador;
2. crear una publicación;
3. publicar mi propia publicación;
4. crear autores;
5. dar acceso a un autor;
6. entrar como ese autor;
7. crear una publicación;
8. enviar la publicación a revisión;
9. entrar como administrador;
10. aprobarla;
11. verla públicamente;
12. registrar visitas;
13. ver estadísticas de esa publicación;
14. ver estadísticas agrupadas por autor;
15. ver un modelo de ingresos estimados por publicación y autor;
16. comprobar que un autor no puede modificar contenido de otro autor;
17. comprobar que el administrador puede gestionar todo;
18. tener SEO básico funcional;
19. tener sitemap y robots.txt;
20. poder desplegar la aplicación en producción.

## 26. REGLA IMPORTANTE SOBRE IMPLEMENTACIÓN

No sacrifiques seguridad ni arquitectura correcta para producir mucho código rápidamente.

Si una decisión tiene varias alternativas, explica brevemente cuál eliges y por qué.

Si necesitas simplificar algo para el MVP, simplifica funcionalidades secundarias, NO:

- autenticación
- autorización
- ownership
- seguridad
- integridad de datos
- SEO básico
- estructura de artículos
- analítica
- arquitectura de monetización

Quiero que el resultado sea una base sólida sobre la que podamos construir posteriormente:

- monetización real
- pagos a autores
- suscripciones
- newsletters
- recomendaciones
- moderación avanzada
- detección de spam
- IA para asistencia editorial
- múltiples idiomas
- aplicación móvil

Empieza por el diseño técnico y después implementa el proyecto completo paso a paso.