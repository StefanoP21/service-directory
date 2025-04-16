import * as pulumi from "@pulumi/pulumi";
import { FmBucket } from "../resources/bucket";

type FmFrontendArgs = {
    Name: string;
    Product: string;
};

function GenerateBucketName(service: string, name: string): string {
    return `${service}-${name}`;
}

export class FmFrontend extends pulumi.ComponentResource {
    constructor(args: FmFrontendArgs, opts?: pulumi.ComponentResourceOptions) {
        const resourceName = GenerateBucketName(args.Product, args.Name);

        super("pkg:index:FmFrontend", resourceName, {}, opts);

        new FmBucket(
            {
                Name: args.Name,
                Product: args.Product,
                Public: true,
            },
            {
                parent: this,
            }
        );

        new FmBucket(
            {
                Name: `${args.Name}-replica`,
                Product: args.Product,
            },
            {
                parent: this,
            }
        );
    }
}
