import * as cdk from "aws-cdk-lib";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import {
  CloudFrontWebDistribution,
  OriginAccessIdentity,
  PriceClass,
  ViewerCertificate,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { CanonicalUserPrincipal, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
  ObjectOwnership,
} from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import path = require("path");

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const environment = this.node.tryGetContext("config");
    if (!environment) {
      throw new Error(
        "Environment variable must be passed to cdk: ` cdk -c config=XXX`"
      );
    }
    const config = this.node.getContext(environment);

    const domainName = `${config.domain.prefix}.${config.domain.root}`;

    const zone = HostedZone.fromLookup(this, "hostedZone", {
      domainName: config.domain.root,
    });

    const certificate = new Certificate(this, "certificate", {
      domainName: domainName,
      validation: CertificateValidation.fromDns(zone),
    });

    const bucket = new Bucket(this, "bucket", {
      objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      encryption: BucketEncryption.S3_MANAGED,
    });

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );

    bucket.addToResourcePolicy(
      new PolicyStatement({
        actions: ["s3:*"],
        resources: [bucket.arnForObjects("*")],
        principals: [
          new CanonicalUserPrincipal(
            originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    const distribution = new CloudFrontWebDistribution(this, "distribution", {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
          ],
        },
      ],
      errorConfigurations: [
        {
          errorCode: 400,
          responseCode: 200,
          responsePagePath: "/index.html",
        },
        {
          errorCode: 403,
          responseCode: 200,
          responsePagePath: "/index.html",
        },
        {
          errorCode: 404,
          responseCode: 200,
          responsePagePath: "/index.html",
        },
      ],
      defaultRootObject: "index.html",
      priceClass: PriceClass.PRICE_CLASS_100,
      viewerCertificate: ViewerCertificate.fromAcmCertificate(certificate, {
        aliases: [domainName],
      }),
    });

    new BucketDeployment(this, "bucketDeployment", {
      sources: [
        Source.asset(path.join(__dirname, "..", "angular/dist/angular/")),
      ],

      destinationBucket: bucket,
      distribution,
      distributionPaths: ["/*"],
    });

    new ARecord(this, "alias", {
      zone,
      recordName: config.domain.prefix,

      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });
  }
}

export type Config = {
  domain: {
    prefix: string;
    root: string;
  };
};
