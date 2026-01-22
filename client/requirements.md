## Packages
wagmi | Web3 hooks for Ethereum/World Chain interaction
viem | Low-level Ethereum interface for wagmi
@tanstack/react-query | Async state management (already in base, but explicit for wagmi peer dep)
framer-motion | Animations for the cyberpunk UI effects

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  mono: ["'Fira Code'", "monospace"],
  display: ["'Fira Code'", "monospace"],
}
Chain Configuration:
- World Chain (ID 480) needs to be defined manually in wagmi config as it might not be in default chains.
- Token Address: 0xd2f234926d10549a7232446cc1ff2e3a2fa57581
- Staking Address: 0xd4292d1c53d6e025156c6ef0dd3d7645eb85dfe3
