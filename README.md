# perma-extension
(Prototype) A browser extension for Perma.cc

🚧 Work in progress.

---

## Summary
- [Architecture](#architecture)
- [Development Setup](#development-setup)

---

## Architecture

```mermaid
flowchart RL
    A[Service Worker]
    B[(Indexed DB)]
    C[Popup UI]
    D[Perma.cc API]
    A <--> B 
    B --> |Live Queries| C
    C -.-> |Runtime Messages| A
    D <--> |HTTP| A 
```

[☝️ Back to summary](#summary)
