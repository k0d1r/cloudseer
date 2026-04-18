provider "aws" {
  region = "us-east-1"
}

module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = "cloudseer-prod-cluster-1"
  cluster_version = "1.28"
  
  vpc_id     = "vpc-12345678"
  subnet_ids = ["subnet-12345", "subnet-67890"]

  eks_managed_node_groups = {
    general = {
      desired_size = 3
      instance_types = ["t3.medium"]
    }
  }
}

# Örnek TimescaleDB / RDS PostgreSQL provisioning
resource "aws_db_instance" "cloudseer_db" {
  identifier           = "cloudseer-timescale"
  allocated_storage    = 100
  engine               = "postgres"
  engine_version       = "16"
  instance_class       = "db.t4g.large"
  username             = "admin"
  password             = "k0d1r123"
  skip_final_snapshot  = true
}
