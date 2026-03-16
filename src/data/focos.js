export const FOCOS = [
  { id:1,  fecha:"2026-02-13", hIP:"08:30", hIA:"08:30", lat1:-28.391995, lon1:-57.911232, lat2:-28.39770, lon2:-57.89913 },
  { id:2,  fecha:"2026-02-15", hIP:"18:50", hIA:"18:57", lat1:-28.369742, lon1:-57.869705, lat2:-28.42738, lon2:-57.91649 },
  { id:3,  fecha:"2026-02-15", hIP:"19:03", hIA:"19:03", lat1:-28.376051, lon1:-57.896187, lat2:-28.39089, lon2:-57.94089 },
  { id:4,  fecha:"2026-02-16", hIP:"09:30", hIA:"09:32", lat1:-28.339737, lon1:-57.735642, lat2:-28.42469, lon2:-57.82776 },
  { id:5,  fecha:"2026-02-18", hIP:"13:22", hIA:"13:23", lat1:-28.402835, lon1:-58.019126, lat2:-28.41501, lon2:-58.00887 },
  { id:6,  fecha:"2026-02-18", hIP:"16:15", hIA:"16:11", lat1:-28.670391, lon1:-57.821355, lat2:-28.67565, lon2:-57.86550 },
  { id:7,  fecha:"2026-02-18", hIP:"18:56", hIA:"18:52", lat1:-28.682000, lon1:-57.812476, lat2:-28.59143, lon2:-57.90148 },
  { id:8,  fecha:"2026-02-23", hIP:"16:30", hIA:"16:36", lat1:-28.342520, lon1:-57.724732, lat2:-28.42365, lon2:-57.83049 },
  { id:9,  fecha:"2026-02-26", hIP:"12:41", hIA:"12:42", lat1:-28.345091, lon1:-58.143413, lat2:-28.29631, lon2:-58.14333 },
  { id:10, fecha:"2026-02-27", hIP:"17:29", hIA:"17:26", lat1:-28.414187, lon1:-58.021046, lat2:-28.34895, lon2:-58.04967 },
  { id:11, fecha:"2026-02-28", hIP:"10:29", hIA:"10:34", lat1:-28.469734, lon1:-57.569635, lat2:-28.48887, lon2:-57.87367 },
  { id:12, fecha:"2026-02-28", hIP:"15:26", hIA:"15:26", lat1:-28.441925, lon1:-58.023309, lat2:-28.37977, lon2:-58.07398 },
  { id:13, fecha:"2026-02-28", hIP:"15:36", hIA:"15:37", lat1:-28.378999, lon1:-58.022147, lat2:-28.31814, lon2:-57.99089 },
  { id:14, fecha:"2026-02-28", hIP:"16:54", hIA:"17:41", lat1:-28.470141, lon1:-58.393891, lat2:-28.44559, lon2:-58.156442 },
  { id:15, fecha:"2026-02-28", hIP:"18:09", hIA:"18:12", lat1:-28.350279, lon1:-57.685260, lat2:-28.43285, lon2:-57.83048 },
  { id:16, fecha:"2026-03-01", hIP:"10:39", hIA:"10:41", lat1:-28.424243, lon1:-58.032956, lat2:-28.44592, lon2:-57.97902 },
  { id:17, fecha:"2026-03-01", hIP:"17:40", hIA:"17:35", lat1:-28.444832, lon1:-58.021095, lat2:-28.37596, lon2:-58.08131 },
  { id:18, fecha:"2026-03-01", hIP:"17:29", hIA:"17:37", lat1:-28.413817, lon1:-57.841992, lat2:-28.42447, lon2:-57.82745 },
  { id:19, fecha:"2026-03-05", hIP:"10:03", hIA:"10:02", lat1:-28.384128, lon1:-58.031837, lat2:-28.44025, lon2:-57.98710 },
  { id:20, fecha:"2026-03-05", hIP:"15:48", hIA:"15:32", lat1:-28.351784, lon1:-58.107521, lat2:-28.34516, lon2:-58.05159 },
  { id:21, fecha:"2026-03-09", hIP:"11:05", hIA:"10:50", lat1:-28.412731, lon1:-58.018168, lat2:-28.42206, lon2:-57.99122 },
  { id:22, fecha:"2026-03-10", hIP:"09:56", hIA:"09:58", lat1:-28.415855, lon1:-58.021696, lat2:-28.47272, lon2:-57.96548 },
  { id:23, fecha:"2026-03-10", hIP:"11:34", hIA:"12:32", lat1:-28.406354, lon1:-58.032166, lat2:-28.43611, lon2:-57.98704 },
  { id:24, fecha:"2026-03-10", hIP:"15:20", hIA:"15:28", lat1:-28.370312, lon1:-58.121288, lat2:-28.35600, lon2:-57.96242 },
  { id:25, fecha:"2026-03-10", hIP:"16:36", hIA:"16:38", lat1:-28.447498, lon1:-57.819872, lat2:-28.34455, lon2:-57.70461 },
  { id:26, fecha:"2026-03-11", hIP:"07:57", hIA:"07:28", lat1:-28.391990, lon1:-57.911242, lat2:-28.35201, lon2:-57.86174 },
]

export const CAMARAS = [
  {
    id: 'cam-1',
    nombre: 'Camara comun',
    sistema: 'ip',
    lat: -28.516661,
    lon: -58.061036,
    etiqueta: "28°30'59.98\"S 58°3'39.73\"O",
  },
  {
    id: 'cam-2',
    nombre: 'Camara IA',
    sistema: 'ia',
    lat: -28.481783,
    lon: -57.947533,
    etiqueta: "28°28.907'S 57°56.852'W",
  },
]

export function haversine(la1, lo1, la2, lo2) {
  const R = 6371000, r = x => x * Math.PI / 180
  const dLa = r(la2 - la1), dLo = r(lo2 - lo1)
  const a = Math.sin(dLa/2)**2 + Math.cos(r(la1)) * Math.cos(r(la2)) * Math.sin(dLo/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function fmtDist(d) {
  return d >= 1000 ? (d / 1000).toFixed(2) + ' km' : Math.round(d) + ' m'
}

export function distColor(d) {
  return d < 2000 ? '#2d7a3a' : d < 8000 ? '#c47d0a' : '#c42020'
}

export function distClass(d) {
  return d < 2000 ? 'dist-low' : d < 8000 ? 'dist-mid' : 'dist-high'
}

export const USO_COLORS = {
  'Plantacion':        '#4a8c2a',
  'Bosque Nativo':     '#2d6b1a',
  'Pastizal pajonal':  '#c8b84a',
  'Sector Cosechado':  '#c4a060',
  'Claro':             '#e8d890',
  'Humedal':           '#4a8caa',
  'Laguna':            '#2a6aaa',
  'Sector habilitado': '#c4704a',
}

export const LINE_COLORS = {
  'Camino principal':   '#8B2500',
  'Camino secundario':  '#c46000',
  'Cfgo Interno':       '#8888aa',
}
