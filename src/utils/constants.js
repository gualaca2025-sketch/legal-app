export const TIPOS_SERVICIO = [
  'Consulta Jurídica',
  'Redacción de Documentos',
  'Contratos',
  'Litigio Civil',
  'Litigio Penal',
  'Litigio Laboral',
  'Derecho Comercial',
  'Derecho Administrativo',
  'Derecho de Familia',
  'Sucesiones y Herencias',
  'Propiedad Intelectual',
  'Propiedad Horizontal',
  'Constitución de Sociedades',
  'Debida Diligencia',
  'Urgencia Legal',
];

export const ESTADOS_TRATAMIENTO = [
  'Pendiente',
  'En Progreso',
  'En Pausa',
  'Completado',
  'Cancelado',
];

export const TIPOS_CLIENTE = [
  'Nuevo',
  'Regular',
  'VIP',
  'Corporativo',
];

export const TIPOS_CITA = [
  'Consulta General',
  'Firma de Documentos',
  'Revisión de Caso',
  'Mediación',
  'Audiencia',
  'Seguimiento',
  'Urgencia',
  'Otro',
];

export const METODOS_PAGO = [
  'Efectivo',
  'Transferencia Bancaria',
  'Tarjeta de Crédito',
  'Tarjeta de Débito',
  'Cheque',
  'Yappy',
  'Seguro',
];

export const TIPOS_CASO = [
  'Consulta',
  'Litigio Civil',
  'Litigio Penal',
  'Litigio Laboral',
  'Derecho Comercial',
  'Derecho Administrativo',
  'Familia',
  'Sucesiones',
  'Propiedad Intelectual',
  'Constitución de Sociedades',
  'Debida Diligencia',
  'Otro',
];

export const AREAS_DERECHO = [
  'Civil',
  'Penal',
  'Laboral',
  'Comercial',
  'Administrativo',
  'Familia',
  'Sucesiones',
  'Propiedad Intelectual',
  'Tributario',
  'Aduanero',
];

export const CATEGORIAS_LEYES = [
  'Constitución',
  'Civil',
  'Penal',
  'Laboral',
  'Comercial',
  'Familia',
  'Administrativo',
  'Tributario',
  'Ambiental',
  'Propiedad Intelectual',
  'Tránsito',
  'General',
];

const GACETA_URL = 'https://www.gacetaoficial.gob.pa/';

export const LEYES_PANAMA = {
  'Constitución': [
    { nombre: 'Constitución Política de la República de Panamá', numero: '1972 (reformada en 1983, 1994, 2004)', descripcion: 'Carta Magna que establece los derechos fundamentales, la organización del Estado, los poderes públicos y el régimen municipal. Es la norma suprema del ordenamiento jurídico panameño.', url: 'https://www.asamblea.gob.pa/APPS/LEGISPAN/PDF_NORMAS/1970/1979/1979_1979_9999.pdf' },
  ],
  'Civil': [
    { nombre: 'Código Civil', numero: 'Ley 2 de 1916', descripcion: 'Regula las relaciones civiles: personas, bienes, obligaciones, contratos, sucesiones y herencias. Base del derecho privado panameño.', url: GACETA_URL },
    { nombre: 'Código Judicial', numero: 'Ley 8 de 1982', descripcion: 'Establece la organización y funcionamiento de los tribunales de justicia, competencias, procesos judiciales y recursos.', url: GACETA_URL },
    { nombre: 'Ley de Procedimiento Civil', numero: 'Ley 8 de 1982 (Libros II y III)', descripcion: 'Regula los procesos civiles: ordinario, sumario, ejecutivo, y las medidas cautelares.', url: GACETA_URL },
    { nombre: 'Ley de Arrendamientos', numero: 'Ley 93 de 1973', descripcion: 'Regula los contratos de arrendamiento de bienes inmuebles, derechos y obligaciones de arrendadores e inquilinos.', url: GACETA_URL },
    { nombre: 'Ley de Propiedad Horizontal', numero: 'Ley 13 de 1993', descripcion: 'Regula el régimen de propiedad horizontal, condominios y administración de edificios.', url: GACETA_URL },
  ],
  'Penal': [
    { nombre: 'Código Penal', numero: 'Ley 14 de 2007', descripcion: 'Define los delitos y las penas en Panamá. Incluye delitos contra la vida, la libertad, el patrimonio, la administración pública, entre otros.', url: 'https://www.gacetaoficial.gob.pa/pdfTemp/25888/25888.pdf' },
    { nombre: 'Código Procesal Penal', numero: 'Ley 63 de 2008', descripcion: 'Regula el proceso penal acusatorio, investigación, juicio, recursos y ejecución de penas.', url: 'https://www.gacetaoficial.gob.pa/pdfTemp/26116/26116.pdf' },
    { nombre: 'Ley de Violencia Doméstica', numero: 'Ley 38 de 2001', descripcion: 'Previene y sanciona la violencia doméstica, establece medidas de protección para las víctimas.', url: GACETA_URL },
    { nombre: 'Ley contra la Delincuencia Organizada', numero: 'Ley 60 de 2012', descripcion: 'Combate el crimen organizado, blanqueo de capitales y financiamiento del terrorismo.', url: GACETA_URL },
    { nombre: 'Ley de Extradición', numero: 'Ley 23 de 1986', descripcion: 'Regula los procedimientos de extradición activa y pasiva en la República de Panamá.', url: GACETA_URL },
  ],
  'Laboral': [
    { nombre: 'Código de Trabajo', numero: 'Decreto de Gabinete 252 de 1971', descripcion: 'Regula las relaciones laborales individuales y colectivas, contratos de trabajo, salarios, jornada, vacaciones y prestaciones sociales.', url: GACETA_URL },
    { nombre: 'Ley de Seguridad Social', numero: 'Ley 51 de 2005', descripcion: 'Regula el sistema de seguridad social, pensiones, jubilaciones y riesgos profesionales.', url: GACETA_URL },
    { nombre: 'Ley de Igualdad de Oportunidades', numero: 'Ley 4 de 1999', descripcion: 'Garantiza la igualdad de oportunidades laborales para las mujeres y prohíbe la discriminación laboral.', url: GACETA_URL },
    { nombre: 'Ley de Salario Mínimo', numero: 'Decreto de Gabinete 68 de 1970 y actualizaciones', descripcion: 'Establece el salario mínimo por actividad económica y región.', url: GACETA_URL },
  ],
  'Comercial': [
    { nombre: 'Código de Comercio', numero: 'Ley 2 de 1916 (Libro II)', descripcion: 'Regula los actos de comercio, comerciantes, sociedades mercantiles, títulos valores y quiebras.', url: GACETA_URL },
    { nombre: 'Ley de Sociedades Anónimas', numero: 'Ley 32 de 1927', descripcion: 'Regula la constitución, funcionamiento y disolución de sociedades anónimas en Panamá.', url: GACETA_URL },
    { nombre: 'Ley de Fideicomiso', numero: 'Ley 1 de 1984', descripcion: 'Regula los contratos de fideicomiso, clases y derechos de las partes.', url: GACETA_URL },
    { nombre: 'Ley de Concursos y Quiebras', numero: 'Ley 18 de 2012', descripcion: 'Regula los procesos concursales, reorganización empresarial y quiebra.', url: GACETA_URL },
  ],
  'Familia': [
    { nombre: 'Código de la Familia', numero: 'Ley 3 de 1994', descripcion: 'Regula el matrimonio, divorcio, parentesco, alimentos, patria potestad, adopción y régimen económico del matrimonio.', url: GACETA_URL },
    { nombre: 'Ley de Alimentos', numero: 'Ley 42 de 1999', descripcion: 'Establece el derecho de alimentos y el procedimiento para su reclamación y cumplimiento.', url: GACETA_URL },
    { nombre: 'Ley de Protección del Menor', numero: 'Ley 15 de 1994', descripcion: 'Establece el régimen de protección integral de niños, niñas y adolescentes.', url: GACETA_URL },
    { nombre: 'Ley de Adopción', numero: 'Ley 61 de 2006', descripcion: 'Regula los procedimientos de adopción nacional e internacional en Panamá.', url: GACETA_URL },
  ],
  'Administrativo': [
    { nombre: 'Ley de Contrataciones Públicas', numero: 'Ley 22 de 2006', descripcion: 'Regula los procesos de contratación pública, licitaciones y concursos.', url: GACETA_URL },
    { nombre: 'Ley de Procedimiento Administrativo', numero: 'Ley 38 de 2000', descripcion: 'Regula el procedimiento administrativo general, recursos y nulidad de actos administrativos.', url: GACETA_URL },
    { nombre: 'Ley de Migración', numero: 'Ley 34 de 2010', descripcion: 'Regula el ingreso, permanencia y salida de extranjeros del territorio nacional.', url: GACETA_URL },
    { nombre: 'Ley Orgánica de la Policía Nacional', numero: 'Ley 18 de 1997', descripcion: 'Organización y funciones de la Policía Nacional de Panamá.', url: GACETA_URL },
    { nombre: 'Ley de la Caja de Seguro Social', numero: 'Ley 134 de 1941', descripcion: 'Organización y funcionamiento de la Caja de Seguro Social.', url: GACETA_URL },
  ],
  'Tributario': [
    { nombre: 'Código Fiscal', numero: 'Ley 8 de 1956', descripcion: 'Regula el sistema tributario panameño, impuestos, tasas y contribuciones.', url: GACETA_URL },
    { nombre: 'Ley de Impuesto sobre la Renta', numero: 'Ley 8 de 1956 (Título I)', descripcion: 'Regula el impuesto sobre la renta de personas naturales y jurídicas.', url: GACETA_URL },
    { nombre: 'Ley del Impuesto al Valor Agregado (ITBMS)', numero: 'Ley 24 de 2005', descripcion: 'Regula el Impuesto de Transferencia de Bienes Muebles y Servicios.', url: GACETA_URL },
    { nombre: 'Ley de Régimen Especial de Tributación', numero: 'Ley 66 de 2011', descripcion: 'Establece el régimen especial de tributación para pequeñas empresas.', url: GACETA_URL },
  ],
  'Ambiental': [
    { nombre: 'Ley General del Ambiente', numero: 'Ley 41 de 1998', descripcion: 'Establece los principios de la política ambiental y el régimen de protección del ambiente.', url: GACETA_URL },
    { nombre: 'Ley de Vida Silvestre', numero: 'Ley 24 de 1995', descripcion: 'Regula la protección y conservación de la vida silvestre en Panamá.', url: GACETA_URL },
    { nombre: 'Ley de Recursos Hídricos', numero: 'Ley 44 de 2002', descripcion: 'Regula el uso y aprovechamiento de los recursos hídricos del país.', url: GACETA_URL },
  ],
  'Propiedad Intelectual': [
    { nombre: 'Ley de Propiedad Intelectual', numero: 'Ley 15 de 1994', descripcion: 'Regula los derechos de autor, derechos conexos y propiedad literaria y artística.', url: GACETA_URL },
    { nombre: 'Ley de Propiedad Industrial', numero: 'Ley 35 de 1996', descripcion: 'Regula patentes, marcas, nombres comerciales y diseños industriales.', url: GACETA_URL },
  ],
  'Tránsito': [
    { nombre: 'Ley de Tránsito y Seguridad Vial', numero: 'Ley 34 de 1999', descripcion: 'Regula la circulación vehicular, licencias, infracciones y sanciones de tránsito.', url: GACETA_URL },
  ],
  'General': [
    { nombre: 'Ley de Protección al Consumidor', numero: 'Ley 45 de 2007', descripcion: 'Protege los derechos de los consumidores y regula las relaciones de consumo.', url: GACETA_URL },
    { nombre: 'Ley de Educación', numero: 'Ley 47 de 1946', descripcion: 'Regula el sistema educativo panameño en todos sus niveles.', url: GACETA_URL },
    { nombre: 'Ley de Salud Pública', numero: 'Ley 66 de 1947', descripcion: 'Regula las normas sanitarias y de salud pública en Panamá.', url: GACETA_URL },
    { nombre: 'Ley de Vivienda de Interés Social', numero: 'Ley 15 de 1995', descripcion: 'Establece el régimen de vivienda de interés social y los programas de solución habitacional.', url: GACETA_URL },
    { nombre: 'Ley de Turismo', numero: 'Ley 8 de 1994', descripcion: 'Regula la actividad turística y promueve el desarrollo del sector.', url: GACETA_URL },
    { nombre: 'Ley de la Micro, Pequeña y Mediana Empresa', numero: 'Ley 5 de 2007', descripcion: 'Establece el régimen de fomento y desarrollo de las MIPYME en Panamá.', url: GACETA_URL },
  ],
};
