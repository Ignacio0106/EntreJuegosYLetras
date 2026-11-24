export enum Role {
  /** Administra a los docentes (aprobar, quitar, dar permisos) y además hace todo lo del docente. */
  ADMIN = 'ADMINISTRADOR',
  /** Maneja juegos, mensaje del día y ve a los lectores. */
  DOCENTE = 'DOCENTE',
  ESTUDIANTE = 'ESTUDIANTE',
}
