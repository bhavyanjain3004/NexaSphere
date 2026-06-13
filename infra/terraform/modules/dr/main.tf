variable "primary_endpoint" {
  description = "Primary endpoint for health checks"
  type        = string
}

variable "secondary_endpoint" {
  description = "Secondary endpoint for failover"
  type        = string
}

variable "domain_name" {
  description = "The domain name for the application"
  type        = string
}

# Primary Health Check
resource "aws_route53_health_check" "primary" {
  fqdn              = var.primary_endpoint
  port              = 443
  type              = "HTTPS"
  resource_path     = "/api/health"
  failure_threshold = "3"
  request_interval  = "30"
  tags = {
    Name        = "Primary-Health-Check"
    Environment = "production"
  }
}

# Secondary Health Check
resource "aws_route53_health_check" "secondary" {
  fqdn              = var.secondary_endpoint
  port              = 443
  type              = "HTTPS"
  resource_path     = "/api/health"
  failure_threshold = "3"
  request_interval  = "30"
  tags = {
    Name        = "Secondary-Health-Check"
    Environment = "production"
  }
}

# Failover DNS Record setup
resource "aws_route53_record" "primary" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"

  failover_routing_policy {
    type = "PRIMARY"
  }

  set_identifier  = "Primary-Region"
  health_check_id = aws_route53_health_check.primary.id

  alias {
    name                   = aws_lb.primary.dns_name
    zone_id                = aws_lb.primary.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "secondary" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"

  failover_routing_policy {
    type = "SECONDARY"
  }

  set_identifier  = "Secondary-Region"
  health_check_id = aws_route53_health_check.secondary.id

  alias {
    name                   = aws_lb.secondary.dns_name
    zone_id                = aws_lb.secondary.zone_id
    evaluate_target_health = true
  }
}

# AWS Backup Plan for General Resources
resource "aws_backup_plan" "dr_backup" {
  name = "Disaster-Recovery-Backup-Plan"

  rule {
    rule_name         = "DailyBackups"
    target_vault_name = aws_backup_vault.dr_vault.name
    schedule          = "cron(0 5 * * ? *)"

    lifecycle {
      delete_after = 30
    }
  }

  rule {
    rule_name         = "WeeklyBackups"
    target_vault_name = aws_backup_vault.dr_vault.name
    schedule          = "cron(0 5 ? * 1 *)"

    lifecycle {
      delete_after = 365
    }
  }
}

resource "aws_backup_vault" "dr_vault" {
  name        = "nexasphere-dr-vault"
  kms_key_arn = aws_kms_key.backup_key.arn
}

resource "aws_kms_key" "backup_key" {
  description             = "KMS key for backup vault"
  deletion_window_in_days = 10
}
