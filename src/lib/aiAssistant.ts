import { BASE_YIELD_BPS } from '@/lib/constants'

interface AIFeatures {
  name: string
  description: string
  yieldRate: number
  risk: 'low' | 'medium' | 'high'
}

const YIELD_PROTOCOLS: AIFeatures[] = [
  { name: 'MonadStaking', description: 'Native staking dengan yield stabil 4-6% APY', yieldRate: 5, risk: 'low' },
  { name: 'LendFi', description: 'Lending protocol dengan yield 6-8% APY', yieldRate: 7, risk: 'medium' },
  { name: 'YieldVault', description: 'Auto-compounding vault dengan yield 8-12% APY', yieldRate: 10, risk: 'medium' },
  { name: 'StableSwap', description: 'Stablecoin LP dengan yield 5-7% APY', yieldRate: 6, risk: 'low' },
  { name: 'LeverageFi', description: 'Leveraged position dengan yield 15-20% APY', yieldRate: 18, risk: 'high' },
]

export const armonAI = {
  chat(userMessage: string): string {
    const lower = userMessage.toLowerCase()

    // Yield recommendations
    if (lower.includes('yield') && lower.includes('tinggi')) {
      const sorted = [...YIELD_PROTOCOLS].sort((a, b) => b.yieldRate - a.yieldRate)
      const best = sorted[0]
      return `📈 Yield Tertinggi Saat Ini:\n\n🔹 ${best.name}\n   Yield: ${best.yieldRate}% APY\n   Risk: ${best.risk}\n   ${best.description}\n\n⚠️ Risk tinggi = volatilitas tinggi. Selalu DYOR!`
    }

    if (lower.includes('yield') && lower.includes('aman')) {
      const safe = YIELD_PROTOCOLS.filter(p => p.risk === 'low')
      return `🔒 Pilihan Yield Aman:\n\n${safe.map(p => `• ${p.name}: ${p.yieldRate}% APY`).join('\n')}\n\nYield rendah tapi stabil untuk collateral kamu.`
    }

    if (lower.includes('yield') && /\d/.test(userMessage)) {
      const match = userMessage.match(/\d+/)
      const amount = match ? parseInt(match[0]) : 0
      const estimated = amount * (BASE_YIELD_BPS / 10000) * 12
      return `💰 Estimasi Yield ${amount} MON (5% APY):\n\n• Per Tahun: ~${estimated.toFixed(2)} MON\n• Per Bulan: ~${(estimated / 12).toFixed(4)} MON\n\nCollateral 125% kamu accruing yield otomatis!`
    }

    // Pool rules
    if (lower.includes('aturan') || lower.includes('kerja')) {
      return `📋 Aturan Pool Armon:\n\n1️⃣ Deposit collateral 125% dari iuran\n2️⃣ Bayar iuran bulanan tanggal 1-10\n3️⃣ Undian/pilih pemenang tanggal 25\n4️⃣ Pemenang dapat total iuran\n5️⃣ Collateral + yield dikembalikan di akhir\n\n100% trustless via smart contract!`
    }

    // Collateral info
    if (lower.includes('collateral')) {
      return `🛡️ Info Collateral:\n\n• Setiap peserta deposit 125% dari iuran\n• Collateral digunakan sebagai jaminan pool\n• Yield 5% APY accrue setiap bulan\n• Collateral + yield dikembalikan saat pool selesai\n• Pool owner TIDAK bisa akses collateral peserta`
    }

    // Voting
    if (lower.includes('vote') || lower.includes('voting')) {
      return `🗳️ Sistem Voting:\n\n• Peserta bisa vote untuk pilih pemenang\n• Vote dilakukan sebelum undian\n• Kandidat harus participant pool\n• Vote menang jika >50% peserta setuju\n\nAlternatif dari random draw!`
    }

    // Help
    if (lower.includes('help') || lower.includes('bantu')) {
      return `🤖 Armon AI siap membantu!\n\nKetik:\n• "yield tertinggi" - rekomendasi yield terbaik\n• "yield aman" - opsi risiko rendah\n• "aturan" - cara kerja pool\n• "collateral" - info keamanan\n• "vote" - sistem voting\n\nAtau tanya apapun tentang Armon!`
    }

    // Default
    return `🤖 Halo! Aku Armon AI Assistant.\n\nKetik "yield tertinggi" untuk rekomendasi, atau tanya tentang:\n• Cara kerja pool arisan\n• Sistem collateral & yield\n• Voting untuk pemenang\n\nAku bantu semampunya! 😊`
  },

  getTopYield(): AIFeatures[] {
    return [...YIELD_PROTOCOLS].sort((a, b) => b.yieldRate - a.yieldRate)
  },

  getSafeYield(): AIFeatures[] {
    return YIELD_PROTOCOLS.filter(p => p.risk === 'low')
  },

  calculateYield(amount: number): { yearly: number; monthly: number } {
    const yearly = amount * (BASE_YIELD_BPS / 10000)
    return { yearly, monthly: yearly / 12 }
  }
}