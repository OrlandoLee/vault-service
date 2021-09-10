import { VaultManager } from '../src/vaultManager';

test('basic',async () => {
    expect(new VaultManager().getRawVaults()).toBe(0);
  });
