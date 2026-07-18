export interface EdgeWaypoint {
	x: number;
	y: number;
}

/** Rotas manuais criadas no modo edição (coordenadas absolutas do layout atual). */
export const manualEdgeRoutes: Record<string, EdgeWaypoint[]> = {
	"e-2-10": [
		{
			x: 318,
			y: 304,
		},
		{
			x: 374,
			y: 442,
		},
		{
			x: 377,
			y: 620,
		},
	],
	"e-4-21": [
		{
			x: 228,
			y: 537,
		},
		{
			x: 299,
			y: 542,
		},
		{
			x: 1299,
			y: 542,
		},
		{
			x: 1299,
			y: 620,
		},
	],
	"e-3-7": [
		{
			x: 313,
			y: 266,
		},
		{
			x: 377,
			y: 233,
		},
		{
			x: 420,
			y: 233,
		},
	],
	"e-1-8": [
		{
			x: 215,
			y: 85,
		},
		{
			x: 363,
			y: 275,
		},
		{
			x: 433,
			y: 364,
		},
	],
	"e-9-32": [
		{
			x: 670,
			y: 441,
		},
		{
			x: 753,
			y: 442,
		},
		{
			x: 2717,
			y: 442,
		},
		{
			x: 2717,
			y: 259,
		},
	],
	"e-9-15": [
		{
			x: 710,
			y: 515,
		},
		{
			x: 781,
			y: 515,
		},
		{
			x: 859,
			y: 515,
		},
	],
};
