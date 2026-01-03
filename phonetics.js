/**
 * phonetics.js
 * Converts Polish text into English-friendly phonetic approximations.
 */

const phonetics = {
  // Mapping of specific Polish sounds to English equivalents
  map: {
    'ą': 'on',   'ę': 'en',   'ć': 'ch', 
    'ł': 'w',    'ń': 'nyuh', 'ó': 'oo', 
    'ś': 'sh',   'ź': 'zh',   'ż': 'zh',
    'sz': 'sh',  'cz': 'ch',  'rz': 'zh',
    'dz': 'dz',  'dź': 'j',   'dż': 'j',
    'w': 'v',    'j': 'y',    'ch': 'kh',
    'h': 'kh',   'c': 'ts',   'y': 'ih'
  },

  /**
   * Generates a phonetic string. 
   * Note: This is a simplified rule-based engine for learners.
   */
  convertToPhonetic(text) {
    let lower = text.toLowerCase();
    
    // 1. Handle double-character sounds first (digraphs)
    const digraphs = ['sz', 'cz', 'rz', 'dz', 'dź', 'dż', 'ch'];
    digraphs.forEach(dg => {
      const regex = new RegExp(dg, 'g');
      lower = lower.replace(regex, this.map[dg] + '-');
    });

    // 2. Handle single characters
    let result = "";
    for (let char of lower) {
      if (this.map[char]) {
        result += this.map[char];
      } else {
        result += char;
      }
    }

    // 3. Clean up formatting and capitalize stressed syllables
    // (In Polish, stress is almost always on the second-to-last syllable)
    return this.applyPolishStress(result.replace(/-+/g, '').trim());
  },

  applyPolishStress(word) {
    // Basic logic to emphasize the penultimate syllable
    const parts = word.split(' ');
    return parts.map(p => {
      if (p.length < 4) return p;
      // Very simplified stress indicator
      return p.slice(0, -3) + p.slice(-3).toUpperCase();
    }).join(' ');
  },

  // Manual overrides for common date words to ensure perfect pronunciation
  overrides: {
    "stycznia": "STYCH-nyah",
    "lutego": "loo-TEH-go",
    "marca": "MAR-tsah",
    "kwietnia": "KVYET-nyah",
    "maja": "MY-ah",
    "czerwca": "CHERV-tsah",
    "lipca": "LEEP-tsah",
    "sierpnia": "SYERP-nyah",
    "września": "VZHESH-nyah",
    "października": "paz-jyer-NEE-kah",
    "listopada": "lees-toh-PAH-dah",
    "grudnia": "GROOD-nyah"
  }
};

export default phonetics;
