import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

type FmBucketArgs = {
    Name: string;
    Product: string;
    Public?: boolean;
};

function GenerateBucketName(service: string, name: string): string {
    return `${service}-${name}`;
}

export class FmBucket extends pulumi.ComponentResource {
    constructor(args: FmBucketArgs, opts?: pulumi.ComponentResourceOptions) {
        const resourceName = GenerateBucketName(args.Product, args.Name);

        super("pkg:index:FmBucket", resourceName, {}, opts);

        const stack = pulumi.getStack();

        const bucketName = GenerateBucketName(resourceName, stack);

        let bucketArgs: aws.s3.BucketArgs = {
            bucket: bucketName,
            acl: aws.s3.CannedAcl.Private,
            tags: {
                Name: bucketName,
                Environment: stack,
            },
        };

        if (args.Public) {
            bucketArgs = {
                ...bucketArgs,
                acl: aws.s3.CannedAcl.PublicRead,
                website: {
                    indexDocument: "index.html",
                    errorDocument: "error.html",
                    routingRules: `[{
                        "Condition": {
                            "KeyPrefixEquals": "docs/"
                        },
                        "Redirect": {
                            "ReplaceKeyPrefixWith": "documents/"
                        }
                    }]`,
                },
            };
        }

        const bucket = new aws.s3.Bucket(args.Name, bucketArgs, {
            parent: this,
        });

        if (!args.Public) {
            new aws.s3.BucketPublicAccessBlock(
                args.Name,
                {
                    bucket: bucket.id,
                    blockPublicAcls: true,
                    blockPublicPolicy: true,
                    ignorePublicAcls: true,
                    restrictPublicBuckets: true,
                },
                {
                    parent: this,
                }
            );
        }
    }
}
