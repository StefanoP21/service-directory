import { FmFrontend } from "./services/frontend";
import { FmBackend } from "./services/backend";

function main() {
    new FmFrontend({
        Name: "bucket-test",
        Product: "devops",
    });

    new FmBackend({
        Name: "docker",
        Product: "devops",
    });
}

main();
