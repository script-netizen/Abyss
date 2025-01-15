class CryptoUtils {
  static async sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  static async generateSalt() {
    const salt = new Uint8Array(16);
    crypto.getRandomValues(salt);
    return Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async deriveKey(password, salt) {
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    const saltData = encoder.encode(salt);
    
    const importedKey = await crypto.subtle.importKey(
      'raw',
      passwordData,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltData,
        iterations: 100000,
        hash: 'SHA-256'
      },
      importedKey,
      256
    );

    const derivedArray = Array.from(new Uint8Array(derivedBits));
    return derivedArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}