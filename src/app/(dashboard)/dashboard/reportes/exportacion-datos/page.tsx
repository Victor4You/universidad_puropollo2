// src/app/(dashboard)/dashboard/reportes/exportacion-datos/page.tsx
'use client';

import { useState } from 'react';

export default function ExportacionDatosPage() {
  const [formato, setFormato] = useState<string>('pdf');
  const [rangoFecha, setRangoFecha] = useState<string>('mes');
  const [modoExportacion, setModoExportacion] = useState<string>('automatico');
  const [incluirGraficas, setIncluirGraficas] = useState<boolean>(true);
  const [incluirDatos, setIncluirDatos] = useState<boolean>(true);
  const [exportando, setExportando] = useState<boolean>(false);

  const formatosDisponibles = [
    { id: 'pdf', nombre: 'PDF Document', descripcion: 'Reportes completos con gráficos', icono: '📄' },
    { id: 'excel', nombre: 'Excel Spreadsheet', descripcion: 'Datos para análisis estadístico', icono: '📊' },
    { id: 'csv', nombre: 'CSV File', descripcion: 'Datos para importación a sistemas', icono: '📋' },
    { id: 'json', nombre: 'JSON Data', descripcion: 'Formato para desarrolladores', icono: '🔧' },
  ];

  const rangosFecha = [
    { id: 'hoy', nombre: 'Hoy', descripcion: 'Datos del día actual' },
    { id: 'semana', nombre: 'Última semana', descripcion: 'Datos de los últimos 7 días' },
    { id: 'mes', nombre: 'Último mes', descripcion: 'Datos de los últimos 30 días' },
    { id: 'trimestre', nombre: 'Último trimestre', descripcion: 'Datos de los últimos 90 días' },
    { id: 'anio', nombre: 'Último año', descripcion: 'Datos de los últimos 365 días' },
    { id: 'personalizado', nombre: 'Personalizado', descripcion: 'Selecciona un rango específico' },
  ];

  const modosExportacion = [
    { id: 'automatico', nombre: 'Automático', descripcion: 'Exportación programada automáticamente' },
    { id: 'manual', nombre: 'Manual', descripcion: 'Exportación bajo demanda' },
    { id: 'recurrente', nombre: 'Recurrente', descripcion: 'Exportación periódica' },
  ];

  // Categorías de datos relacionadas con cursos
  const categoriasDatos = [
    { id: 'calificaciones', nombre: 'Calificaciones', seleccionado: true, cantidad: '3,540 registros', icono: '📝' },
    { id: 'asistencias', nombre: 'Asistencias', seleccionado: true, cantidad: '12,890 registros', icono: '👥' },
    { id: 'inscripciones', nombre: 'Inscripciones', seleccionado: true, cantidad: '1,245 registros', icono: '📋' },
    { id: 'matriculas', nombre: 'Matrículas', seleccionado: false, cantidad: '850 registros', icono: '🎓' },
    { id: 'evaluaciones', nombre: 'Evaluaciones', seleccionado: false, cantidad: '680 registros', icono: '📊' },
    { id: 'tareas', nombre: 'Tareas Entregadas', seleccionado: false, cantidad: '2,150 registros', icono: '📚' },
  ];

  // Datos para gráficos - Rendimiento académico por curso
  const rendimientoCursos = [
    { curso: 'Matemáticas Básicas', promedio: 8.5, aprobados: 85, reprobados: 15 },
    { curso: 'Programación I', promedio: 7.8, aprobados: 78, reprobados: 22 },
    { curso: 'Física General', promedio: 7.2, aprobados: 72, reprobados: 28 },
    { curso: 'Historia Universal', promedio: 9.1, aprobados: 91, reprobados: 9 },
    { curso: 'Inglés Técnico', promedio: 8.9, aprobados: 89, reprobados: 11 },
    { curso: 'Química General', promedio: 7.5, aprobados: 75, reprobados: 25 },
  ];

  // Distribución de calificaciones
  const distribucionCalificaciones = [
    { rango: '0-5', cantidad: 120, porcentaje: 12, color: '#EF4444' },
    { rango: '6-7', cantidad: 280, porcentaje: 28, color: '#F59E0B' },
    { rango: '7-8', cantidad: 350, porcentaje: 35, color: '#10B981' },
    { rango: '8-9', cantidad: 180, porcentaje: 18, color: '#3B82F6' },
    { rango: '9-10', cantidad: 70, porcentaje: 7, color: '#8B5CF6' },
  ];

  const handleExportar = () => {
    setExportando(true);
    
    // Simular proceso de exportación
    setTimeout(() => {
      setExportando(false);
      alert(`Reporte académico exportado exitosamente en formato ${formato.toUpperCase()}`);
    }, 2000);
  };

  const handleSeleccionarTodos = () => {
    // Lógica para seleccionar todas las categorías
  };

  // Calcular valores máximos para gráficos
  const maxPromedio = Math.max(...rendimientoCursos.map(d => d.promedio));
  const totalCalificaciones = distribucionCalificaciones.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <div className="space-y-6">
      {/* Header de la página con título y descripción */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Exportación de Reportes Académicos</h1>
        <p className="text-gray-600">Exporta datos e informes de rendimiento académico</p>
      </div>

      {/* Mensaje informativo para administradores y maestros */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-blue-800">Área de Reportes Académicos</h3>
            <p className="text-blue-700">
              Esta sección está diseñada para que administradores y maestros puedan visualizar y exportar 
              reportes detallados del rendimiento académico de los estudiantes.
            </p>
          </div>
        </div>
      </div>

      {/* Panel principal de exportación */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna izquierda - Configuración */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración del Reporte</h3>
              
              {/* Selección de formato */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Formato del Reporte</h4>
                <div className="grid grid-cols-2 gap-3">
                  {formatosDisponibles.map((formatoItem) => (
                    <button
                      key={formatoItem.id}
                      onClick={() => setFormato(formatoItem.id)}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        formato === formatoItem.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{formatoItem.icono}</span>
                        <div>
                          <p className="font-medium text-gray-900">{formatoItem.nombre}</p>
                          <p className="text-xs text-gray-500">{formatoItem.descripcion}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rango de fechas */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Periodo Académico</h4>
                <div className="grid grid-cols-2 gap-2">
                  {rangosFecha.map((rango) => (
                    <button
                      key={rango.id}
                      onClick={() => setRangoFecha(rango.id)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        rangoFecha === rango.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{rango.nombre}</p>
                      <p className="text-xs text-gray-500">{rango.descripcion}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Modo de exportación */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Tipo de Reporte</h4>
                <div className="space-y-2">
                  {modosExportacion.map((modo) => (
                    <button
                      key={modo.id}
                      onClick={() => setModoExportacion(modo.id)}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${
                        modoExportacion === modo.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{modo.nombre}</p>
                          <p className="text-xs text-gray-500">{modo.descripcion}</p>
                        </div>
                        {modoExportacion === modo.id && (
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna derecha - Opciones avanzadas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contenido del Reporte</h3>
              
              {/* Opciones de contenido */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Elementos a Incluir</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          checked={incluirGraficas}
                          onChange={(e) => setIncluirGraficas(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3">
                        <label className="font-medium text-gray-900">Incluir gráficas de rendimiento</label>
                        <p className="text-xs text-gray-500">Gráficas de calificaciones y distribución</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          checked={incluirDatos}
                          onChange={(e) => setIncluirDatos(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3">
                        <label className="font-medium text-gray-900">Incluir datos detallados por estudiante</label>
                        <p className="text-xs text-gray-500">Reportes individuales de calificaciones y asistencias</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selección de categorías de datos */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-gray-900">Datos Académicos</h4>
                  <button 
                    onClick={handleSeleccionarTodos}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Seleccionar todos
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {categoriasDatos.map((categoria) => (
                    <div 
                      key={categoria.id} 
                      className="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            checked={categoria.seleccionado}
                            onChange={() => {}}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 flex items-center">
                          <span className="text-lg mr-2">{categoria.icono}</span>
                          <div>
                            <label className="font-medium text-gray-900">{categoria.nombre}</label>
                            <p className="text-xs text-gray-500">{categoria.cantidad}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vista previa del reporte */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Vista Previa del Reporte</h4>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Reporte Académico - {rangoFecha === 'mes' ? 'Último Mes' : rangoFecha}</p>
                      <p className="text-sm text-gray-500">
                        Formato: {formato.toUpperCase()} • Incluye: {incluirGraficas ? 'Gráficas, ' : ''}{incluirDatos ? 'Datos detallados' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">1,000+</p>
                      <p className="text-xs text-gray-500">registros</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de exportación */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">
                  {exportando ? 'Generando reporte académico...' : 'Reporte listo para exportar'}
                </p>
                <p className="text-xs text-gray-500">
                  El reporte incluirá datos de {categoriasDatos.filter(c => c.seleccionado).length} categorías
                </p>
              </div>
              <button
                onClick={handleExportar}
                disabled={exportando}
                className={`px-6 py-3 rounded-lg font-medium flex items-center ${
                  exportando
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white transition-colors`}
              >
                {exportando ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Exportar Reporte
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Gráficos Académicos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Rendimiento por Curso */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Rendimiento por Curso</h3>
              <p className="text-sm text-gray-500">Promedio de calificaciones por materia</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                {rendimientoCursos.length}
              </p>
              <p className="text-sm text-gray-500">cursos evaluados</p>
            </div>
          </div>
          
          {/* Gráfico de barras para rendimiento por curso */}
          <div className="h-64">
            <div className="flex items-end h-48 space-x-2 mt-4">
              {rendimientoCursos.map((curso, index) => {
                const altura = (curso.promedio / 10) * 100; // Escala 0-10 a 0-100%
                return (
                  <div key={index} className="flex-1 flex flex-col items-center group">
                    <div className="text-xs text-gray-500 mb-1 truncate w-full text-center">{curso.curso.split(' ')[0]}</div>
                    <div className="relative w-full flex justify-center">
                      <div className="flex flex-col items-center w-3/4">
                        {/* Barra de aprobados */}
                        <div 
                          className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg hover:from-green-600 hover:to-green-500 transition-all"
                          style={{ height: `${curso.aprobados}%` }}
                          title={`${curso.aprobados}% Aprobados`}
                        ></div>
                        {/* Barra de reprobados */}
                        <div 
                          className="w-full bg-gradient-to-t from-red-500 to-red-400 rounded-b-lg hover:from-red-600 hover:to-red-500 transition-all"
                          style={{ height: `${curso.reprobados}%` }}
                          title={`${curso.reprobados}% Reprobados`}
                        ></div>
                      </div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {curso.curso}: {curso.promedio}/10
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-gray-600">Aprobados</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-xs text-gray-600">Reprobados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Distribución de Calificaciones */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Distribución de Calificaciones</h3>
              <p className="text-sm text-gray-500">Total de calificaciones: {totalCalificaciones}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                {((distribucionCalificaciones[2].cantidad + distribucionCalificaciones[3].cantidad + distribucionCalificaciones[4].cantidad) / totalCalificaciones * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500">aprobación</p>
            </div>
          </div>
          
          {/* Gráfico de pastel para distribución de calificaciones */}
          <div className="h-64 flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Segmentos del gráfico */}
              {(() => {
                let anguloAcumulado = 0;
                const radio = 80;
                const centroX = 96;
                const centroY = 96;
                
                return distribucionCalificaciones.map((item, index) => {
                  const porcentaje = (item.cantidad / totalCalificaciones) * 100;
                  const angulo = (porcentaje / 100) * 360;
                  const anguloRad = (anguloAcumulado * Math.PI) / 180;
                  const anguloFinalRad = ((anguloAcumulado + angulo) * Math.PI) / 180;
                  
                  const x1 = centroX + radio * Math.cos(anguloRad);
                  const y1 = centroY + radio * Math.sin(anguloRad);
                  const x2 = centroX + radio * Math.cos(anguloFinalRad);
                  const y2 = centroY + radio * Math.sin(anguloFinalRad);
                  
                  const largeArc = angulo > 180 ? 1 : 0;
                  
                  const pathData = [
                    `M ${centroX} ${centroY}`,
                    `L ${x1} ${y1}`,
                    `A ${radio} ${radio} 0 ${largeArc} 1 ${x2} ${y2}`,
                    `Z`
                  ].join(' ');
                  
                  anguloAcumulado += angulo;
                  
                  return (
                    <path
                      key={index}
                      d={pathData}
                      fill={item.color}
                      className="hover:opacity-90 transition-opacity cursor-pointer"
                      title={`${item.rango}: ${item.cantidad} calificaciones (${item.porcentaje}%)`}
                    />
                  );
                });
              })()}
              
              {/* Círculo interno */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-white"></div>
              </div>
              
              {/* Texto central */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {totalCalificaciones}
                </span>
                <span className="text-xs text-gray-500">calificaciones</span>
              </div>
            </div>
          </div>
          
          {/* Leyenda */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {distribucionCalificaciones.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">{item.rango}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {item.cantidad} ({item.porcentaje}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div 
                      className="h-1 rounded-full"
                      style={{ 
                        width: `${item.porcentaje}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla de Reportes Recientes */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Reportes Recientes</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Ver todos los reportes →
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de Reporte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cursos Incluidos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generado Por
                  </th>
                  <th className="px 6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">15 Ene 2024</div>
                      <div className="text-sm text-gray-500">10:30 AM</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        Calificaciones
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Semestre 2024-I</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">6 cursos</span>
                    <p className="text-xs text-gray-500">Matemáticas, Programación, Física...</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Prof. Carlos Mendoza</p>
                        <p className="text-xs text-gray-500">Departamento de Matemáticas</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 px-3 py-1 border border-blue-600 rounded hover:bg-blue-50 transition-colors">
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver
                      </button>
                      <button className="text-green-600 hover:text-green-900 px-3 py-1 border border-green-600 rounded hover:bg-green-50 transition-colors">
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Descargar
                      </button>
                    </div>
                  </td>
                </tr>
                
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">10 Ene 2024</div>
                      <div className="text-sm text-gray-500">03:15 PM</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Asistencias
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Mes de Enero</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">4 cursos</span>
                    <p className="text-xs text-gray-500">Todos los grupos</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Admin. Sistema</p>
                        <p className="text-xs text-gray-500">Administración</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 px-3 py-1 border border-blue-600 rounded hover:bg-blue-50 transition-colors">
                        Ver
                      </button>
                      <button className="text-green-600 hover:text-green-900 px-3 py-1 border border-green-600 rounded hover:bg-green-50 transition-colors">
                        Descargar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}