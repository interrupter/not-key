import ncKey from "./ncKey.js";

let manifest = {
    router: {
        manifest: [ncKey.getRoutes()],
    },
    menu: {
        side: {
            items: [
                {
                    id: "system.keys",
                    section: "system",
                    title: "Ключи",
                    href: "/key",
                },
            ],
        },
    },
};

export { manifest, ncKey };
