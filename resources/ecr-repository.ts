import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

type FmDockerImageArgs = {
    Name: string;
    Product: string;
};

function GenerateDockerImageName(service: string, name: string): string {
    return `${service}-${name}`;
}

export class FmDockerImage extends pulumi.ComponentResource {
    constructor(
        args: FmDockerImageArgs,
        opts?: pulumi.ComponentResourceOptions
    ) {
        const resourceName = GenerateDockerImageName(args.Product, args.Name);

        super("pkg:index:FmDockerImage", resourceName, {}, opts);

        new aws.ecr.Repository(
            args.Name,
            {
                name: resourceName,
                imageTagMutability: "MUTABLE",
                imageScanningConfiguration: {
                    scanOnPush: true,
                },
            },
            {
                parent: this,
            }
        );
    }
}
