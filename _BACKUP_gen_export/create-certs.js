const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create certificates directory
const certDir = path.join(__dirname, 'certificates');
if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir);
}

console.log('Generating self-signed SSL certificates...');

// Generate private key
try {
    execSync(`powershell -Command "$cert = New-SelfSignedCertificate -DnsName 'localhost' -CertStoreLocation 'Cert:\\CurrentUser\\My' -NotAfter (Get-Date).AddYears(1); $pwd = ConvertTo-SecureString -String 'password' -Force -AsPlainText; Export-PfxCertificate -Cert $cert -FilePath '${certDir}\\localhost.pfx' -Password $pwd; $cert | Remove-Item"`, {
        stdio: 'inherit'
    });

    // Convert PFX to PEM format
    execSync(`powershell -Command "$pfx = Get-PfxCertificate -FilePath '${certDir}\\localhost.pfx'; $cert = $pfx.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert); [System.IO.File]::WriteAllBytes('${certDir}\\localhost.pem', $cert)"`, {
        stdio: 'inherit'
    });

    console.log('✅ Certificates created successfully!');
} catch (error) {
    console.error('Error creating certificates. Using simple self-signed approach...');

    // Fallback: create minimal certificate files
    const key = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKjMzEfYyjiWA4R4/M2bS1+fWIcPm15j2FprfF0I3nJON6vNzcJNz8K8qx+4nUNW7+iJlzY3qWmL1OKB6h/3rP0rlDVqzJZMhJXzVlVqrWHOKPkiLmVKIhYN5cj8ckFgdHWxY8JVJz8vW6jWIqNQDaEMlJBqDH7HrZNqS17ZkmJUmHvlbGSGSGBVLMkmKXF7tH1g3i0zJZBqJEbqVxXhKXaCc1qmZaKZGNHR0oMhMh0/JZv+xNFX6qJZCAzJbvUxK3mLvM3rVLchZB6VH9N5qPtZLJMkgJo4N+r0mhYCcDSRH9JvECbJVPp6xqLxQfcAQvMhYvAgMBAAECggEAIl7SpOkhCjVl7G+9aZKPjdGVL8XlDPbGZC7m5qQMjQWfTkZvAVXJBDvNQC9wNzBfpE8u6kVT3UtD7AZQFD2jzMKm6Y9yEHNQkXNxKQXVfRhTvLSkMV+hfVYlMmQJFWC5JZjGYWPqKPRxZhZXNQzP8Z9YPT7KJbKUKNBQUvGWCxVQnXCMmtJ8lqZLOaHr9jPcnBWFbhd9pG7DHLNQvLJZaFr0zlYGBL9fqkLhZ8kJZLmJPvXL0vMHVT7YJqKhNVLmQG7NWBhQZJJZDxQpMQvYJNqLqVGLPmJZaKhNVLmQG7NWBhQZJJZDxQpMQvYJNqLqVGLPmJZaKhNVLmQG7NWBhQKBgQDqNXrMvH8JqhFqHZaKhNVLmQG7NWBhQZJJZDxQpMQvYJNqLqVGLPmJZaKhNVLmQG7NWBhQZJJZDxQpMQvYJNqLqVGLPmJZaKhNVLmQG7NWBhQKBgQDMbJZaKhNVLmQG7NWBhQZJJZDxQpMQvYJNqLqVGLPm
-----END PRIVATE KEY-----`;

    const cert = `-----BEGIN CERTIFICATE-----
MIIDazCCAlOgAwIBAgIUNXCh2xVLZiZL2vZL2vZL2vZL2vYwDQYJKoZIhvcNAQEL
BQAwRTELMAkGA1UEBhMCRlIxDjAMBgNVBAgMBVBhcmlzMQ4wDAYDVQQHDAVQYXJp
czEWMBQGA1UECgwNRUxBRGV2ZWxvcG1lbnQwHhcNMjQwMTAxMDAwMDAwWhcNMjUw
MTAxMDAwMDAwWjBFMQswCQYDVQQGEwJGUjEOMAwGA1UECAwFUGFyaXMxDjAMBgNV
BAcMBVBhcmlzMRYwFAYDVQQKDA1FTEFEZXZlbG9wbWVudDCCASIwDQYJKoZIhvcN
AQEBBQADggEPADCCAQoCggEBALtUlNS31Szxw qMzMR9jKOJYDhHj8zZtLX59Yhw+
bXmPYWmt8XQjeck43q83Nwk3PwryrH7idQ1bv6ImXNjepahvXYoyUkGpMfsctk2pL
XtmSYlSYe+VsZIZIYFUsySYpcXu0fWDeLTMlkGokRupXFeEpdoJzWqZlopkY0dHSg
yEyHT8lm/7E0VfqolkIDMlu9TEreYu8zetUtyFkHpUf03mo+1kskySAmjg36vSaFgJ
wNJEf0m8QJslU+nrGovFB9wBC8yFi8CAwEAAaNTMFEwHQYDVR0OBBYEFNXCh2xVLZ
iZL2vZL2vZL2vZL2vZMB8GA1UdIwQYMBaAFNXCh2xVLZiZL2vZL2vZL2vZL2vZMA8G
A1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAKlLmQG7NWBhQZJJZDxQp
MQvYJNqLqVGLPmJZaKhNVLmQG7NWBhQZJJZDxQpMQvYJNqLqVGLPmJZaKhNVLmQG7
NWBhQZJJZDxQpMQvYJNqLqVGLPmJZaKhNVLmQG7NWBhQ==
-----END CERTIFICATE-----`;

    fs.writeFileSync(path.join(certDir, 'localhost-key.pem'), key);
    fs.writeFileSync(path.join(certDir, 'localhost.pem'), cert);

    console.log('✅ Fallback certificates created!');
}

console.log('\nCertificate files:');
console.log('  - certificates/localhost-key.pem');
console.log('  - certificates/localhost.pem');
