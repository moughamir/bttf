# Back To The Future - DVD Basket Pricing Calculator

A web application that calculates the total price of a DVD basket, applying dynamic discounts for **Back To The Future** saga bundles.

Built as a technical exercise for [Ekinox](https://ekinox.io), demonstrating clean architecture, domain-driven design, and production-quality code practices.

> Uses Bun's native test runner, no additional dependencies.
## Tech Stack
| Technology | Purpose |
|------------|---------|
| [Bun](https://bun.com) | Runtime & bundler |
| [React 19](https://react.dev) | UI framework |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Bun Test](https://bun.sh/docs/cli/test) | Testing |

## Getting Started
### Prerequisites
- [Bun](https://bun.sh) v1.0+
### Installation
- `gh repo clone moughamir/bttf`
- `cd bttf && bun i`
### Testing
- `bun run test`

### Pricing Rules
| Scenario | Rule |
|----------|------|
| 1 distinct BTTF episode | €15 per DVD (no discount) |
| 2 distinct BTTF episodes | 10% off **all** BTTF DVDs |
| 3 distinct BTTF episodes | 20% off **all** BTTF DVDs |
| Standard movies | €20 each (flat) |

> **Example:** 4 BTTF DVDs (3 distinct) = (4 × €15) × 0.80 = **€48**
