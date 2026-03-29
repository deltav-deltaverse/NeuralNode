/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUBBLE_ROOM_ADDRESS: string;
  readonly VITE_ORCHESTRATOR_ADDRESS: string;
  readonly VITE_GENESIS_SBT_ADDRESS: string;
  readonly VITE_SPAWN_ADDRESS: string;
  readonly VITE_TRAITS_ADDRESS: string;
  readonly VITE_SEED_REGISTRY_ADDRESS: string;
  readonly VITE_GOVERNANCE_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
