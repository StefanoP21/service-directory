import * as pulumi from "@pulumi/pulumi";
import { FmDockerImage } from "../resources/ecr-repository";

type FmBackendArgs = {
    Name: string;
    Product: string;
};

function GenerateBucketName(service: string, name: string): string {
    return `${service}-${name}`;
}

export class FmBackend extends pulumi.ComponentResource {
    constructor(args: FmBackendArgs, opts?: pulumi.ComponentResourceOptions) {
        const resourceName = GenerateBucketName(args.Product, args.Name);

        super("pkg:index:FmBackend", resourceName, {}, opts);

        new FmDockerImage(
            {
                Name: args.Name,
                Product: args.Product,
            },
            {
                parent: this,
            }
        );
    }
}
