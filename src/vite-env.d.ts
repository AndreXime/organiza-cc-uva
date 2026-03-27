/// <reference types="vite/client" />

declare module "virtual:server-data" {
	const data: import("./data").ServerData;
	export default data;
}
