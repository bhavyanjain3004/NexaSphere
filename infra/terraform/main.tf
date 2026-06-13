module "vpc" {
  source = "./modules/vpc"
}

module "rds" {
  source = "./modules/rds"
}

module "s3" {
  source = "./modules/s3"
}

module "cloudfront" {
  source = "./modules/cloudfront"
}

module "eks" {
  source = "./modules/eks"
}

module "iam" {
  source = "./modules/iam"
}

module "security" {
  source = "./modules/security"
}

module "dr" {
  source = "./modules/dr"
}
