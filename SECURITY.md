# Security Policy

## Supported Versions

Currently, security updates are provided for the following versions of rn-ci-workflow-builder:

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

The rn-ci-workflow-builder team takes security vulnerabilities seriously. We appreciate your efforts to disclose your findings responsibly.

If you believe you've found a security vulnerability in rn-ci-workflow-builder, please follow these steps:

1. **Do not** disclose the vulnerability publicly.
2. **Do not** create a public GitHub issue for the vulnerability.
3. Submit the vulnerability by contacting the project maintainers directly.
   - Include a detailed description of the vulnerability
   - Include steps to reproduce the issue
   - Include the potential impact of the vulnerability
   - If possible, include suggestions for mitigating or fixing the vulnerability

## What to Expect

After you've submitted a vulnerability report, you can expect:

- An acknowledgment of your report within 48 hours
- A determination of the severity and impact of the report
- An estimated timeframe for addressing the vulnerability
- Notification when the vulnerability has been fixed

## Security Best Practices

When using rn-ci-workflow-builder, follow these security best practices:

1. **Keep dependencies updated**: Regularly update your project's dependencies to ensure you have the latest security patches.
2. **Review generated workflows**: Before committing and using generated workflows, review them to ensure they meet your security requirements.
3. **Secure CI/CD environments**: Ensure your CI/CD environment is properly secured, especially when handling sensitive information like API tokens and secrets.
4. **Avoid hardcoded secrets**: Never hardcode secrets in your workflow configurations. Use environment variables or secret management solutions provided by your CI/CD platform.
5. **Limit workflow permissions**: When possible, limit the permissions granted to workflows to follow the principle of least privilege.

## Security Considerations for Generated Workflows

The workflow YAML files generated by this tool are intended to be used in CI/CD environments. Always review generated workflows for security considerations:

1. **Third-party actions**: Be aware that workflows may include third-party GitHub Actions which should be reviewed for security concerns.
2. **Secret handling**: Ensure secrets are properly handled in the generated workflows.
3. **Environment restrictions**: Consider restricting environments where workflows can run, especially those accessing sensitive resources.

Thank you for helping keep rn-ci-workflow-builder and its users safe!