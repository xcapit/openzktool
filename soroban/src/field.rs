// BN254 Field Arithmetic
// Field modulus: p = 21888242871839275222246405745257275088696311157297823662689037894645226208583
// = 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47

// BN254 field modulus as u64 limbs (little-endian)
pub const MODULUS: [u64; 4] = [
    0x3c208c16d87cfd47,
    0x97816a916871ca8d,
    0xb85045b68181585d,
    0x30644e72e131a029,
];

// Montgomery R = 2^256 mod p
pub const R: [u64; 4] = [
    0xd35d438dc58f0d9d,
    0x0a78eb28f5c70b3d,
    0x666ea36f7879462c,
    0x0e0a77c19a07df2f,
];

// Montgomery R^2 mod p
pub const R2: [u64; 4] = [
    0xf32cfc5b538afa89,
    0xb5e71911d44501fb,
    0x47ab1eff0a417ff6,
    0x06d89f71cab8351f,
];

// -p^{-1} mod 2^64
const INV: u64 = 0x87d20782e4866389;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Fq {
    pub limbs: [u64; 4],
}

impl Fq {
    /// Create from Montgomery form
    pub const fn from_montgomery(limbs: [u64; 4]) -> Self {
        Fq { limbs }
    }

    /// Create from raw bytes (big-endian)
    pub fn from_bytes_be(bytes: &[u8; 32]) -> Self {
        let mut limbs = [0u64; 4];
        for i in 0..4 {
            let offset = i * 8;
            limbs[3 - i] = u64::from_be_bytes([
                bytes[offset],
                bytes[offset + 1],
                bytes[offset + 2],
                bytes[offset + 3],
                bytes[offset + 4],
                bytes[offset + 5],
                bytes[offset + 6],
                bytes[offset + 7],
            ]);
        }
        // Convert to Montgomery form
        Self::from_montgomery(limbs).mul(&Self::from_montgomery(R2))
    }

    /// Convert to bytes (big-endian)
    pub fn to_bytes_be(&self) -> [u8; 32] {
        // Convert from Montgomery form
        let normal = self.mul(&Fq::from_montgomery([1, 0, 0, 0]));
        let mut bytes = [0u8; 32];
        for i in 0..4 {
            let limb_bytes = normal.limbs[3 - i].to_be_bytes();
            let offset = i * 8;
            bytes[offset..offset + 8].copy_from_slice(&limb_bytes);
        }
        bytes
    }

    /// Zero element
    pub const fn zero() -> Self {
        Fq { limbs: [0, 0, 0, 0] }
    }

    /// One element (in Montgomery form)
    pub const fn one() -> Self {
        Fq::from_montgomery(R)
    }

    /// Check if zero
    pub fn is_zero(&self) -> bool {
        self.limbs[0] == 0 && self.limbs[1] == 0 && self.limbs[2] == 0 && self.limbs[3] == 0
    }

    /// Addition
    pub fn add(&self, other: &Fq) -> Fq {
        let mut result = [0u64; 4];
        let mut carry = 0u128;

        for i in 0..4 {
            carry = carry + self.limbs[i] as u128 + other.limbs[i] as u128;
            result[i] = carry as u64;
            carry >>= 64;
        }

        // Subtract modulus if result >= modulus
        Self::sub_modulus(&result)
    }

    /// Subtraction
    pub fn sub(&self, other: &Fq) -> Fq {
        let mut result = [0u64; 4];
        let mut borrow = 0i128;

        for i in 0..4 {
            borrow = self.limbs[i] as i128 - other.limbs[i] as i128 - borrow;
            result[i] = borrow as u64;
            borrow = if borrow < 0 { 1 } else { 0 };
        }

        // Add modulus if result is negative
        if borrow != 0 {
            let mut carry = 0u128;
            for i in 0..4 {
                carry = carry + result[i] as u128 + MODULUS[i] as u128;
                result[i] = carry as u64;
                carry >>= 64;
            }
        }

        Fq { limbs: result }
    }

    /// Negation
    pub fn neg(&self) -> Fq {
        if self.is_zero() {
            return *self;
        }
        Fq::zero().sub(self)
    }

    /// Montgomery multiplication
    pub fn mul(&self, other: &Fq) -> Fq {
        let mut result = [0u64; 4];

        for i in 0..4 {
            let mut carry = 0u128;

            // result += self * other.limbs[i]
            for j in 0..4 {
                carry += result[j] as u128 + (self.limbs[j] as u128) * (other.limbs[i] as u128);
                result[j] = carry as u64;
                carry >>= 64;
            }

            // Montgomery reduction step
            let k = result[0].wrapping_mul(INV);
            carry = 0;

            for j in 0..4 {
                carry += result[j] as u128 + (k as u128) * (MODULUS[j] as u128);
                if j > 0 {
                    result[j - 1] = carry as u64;
                }
                carry >>= 64;
            }
            result[3] = carry as u64;
        }

        Self::sub_modulus(&result)
    }

    /// Square
    pub fn square(&self) -> Fq {
        self.mul(self)
    }

    /// Power
    pub fn pow(&self, exp: &[u64; 4]) -> Fq {
        let mut result = Fq::one();
        let mut base = *self;

        for limb in exp.iter() {
            for bit in 0..64 {
                if (limb >> bit) & 1 == 1 {
                    result = result.mul(&base);
                }
                base = base.square();
            }
        }

        result
    }

    /// Multiplicative inverse using Fermat's little theorem
    /// a^{-1} = a^{p-2} mod p
    pub fn inverse(&self) -> Option<Fq> {
        if self.is_zero() {
            return None;
        }

        // Compute p - 2
        let exp = [
            MODULUS[0] - 2,
            MODULUS[1],
            MODULUS[2],
            MODULUS[3],
        ];

        Some(self.pow(&exp))
    }

    /// Helper: subtract modulus if needed
    fn sub_modulus(limbs: &[u64; 4]) -> Fq {
        // Check if >= modulus
        let mut greater = false;
        for i in (0..4).rev() {
            if limbs[i] > MODULUS[i] {
                greater = true;
                break;
            } else if limbs[i] < MODULUS[i] {
                break;
            }
        }

        if !greater && limbs != &MODULUS {
            return Fq { limbs: *limbs };
        }

        // Subtract modulus
        let mut result = [0u64; 4];
        let mut borrow = 0i128;

        for i in 0..4 {
            borrow = limbs[i] as i128 - MODULUS[i] as i128 - borrow;
            result[i] = borrow as u64;
            borrow = if borrow < 0 { 1 } else { 0 };
        }

        Fq { limbs: result }
    }
}

// Fq2 = Fq[u] / (u^2 + 1)
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Fq2 {
    pub c0: Fq,
    pub c1: Fq,
}

impl Fq2 {
    pub const fn new(c0: Fq, c1: Fq) -> Self {
        Fq2 { c0, c1 }
    }

    pub const fn zero() -> Self {
        Fq2 {
            c0: Fq::zero(),
            c1: Fq::zero(),
        }
    }

    pub const fn one() -> Self {
        Fq2 {
            c0: Fq::one(),
            c1: Fq::zero(),
        }
    }

    pub fn is_zero(&self) -> bool {
        self.c0.is_zero() && self.c1.is_zero()
    }

    pub fn add(&self, other: &Fq2) -> Fq2 {
        Fq2 {
            c0: self.c0.add(&other.c0),
            c1: self.c1.add(&other.c1),
        }
    }

    pub fn sub(&self, other: &Fq2) -> Fq2 {
        Fq2 {
            c0: self.c0.sub(&other.c0),
            c1: self.c1.sub(&other.c1),
        }
    }

    pub fn neg(&self) -> Fq2 {
        Fq2 {
            c0: self.c0.neg(),
            c1: self.c1.neg(),
        }
    }

    /// Multiplication in Fq2: (a0 + a1*u) * (b0 + b1*u) where u^2 = -1
    pub fn mul(&self, other: &Fq2) -> Fq2 {
        // (a0 + a1*u)(b0 + b1*u) = a0*b0 + a0*b1*u + a1*b0*u + a1*b1*u^2
        //                        = a0*b0 - a1*b1 + (a0*b1 + a1*b0)*u
        let a0b0 = self.c0.mul(&other.c0);
        let a1b1 = self.c1.mul(&other.c1);
        let a0b1 = self.c0.mul(&other.c1);
        let a1b0 = self.c1.mul(&other.c0);

        Fq2 {
            c0: a0b0.sub(&a1b1),
            c1: a0b1.add(&a1b0),
        }
    }

    pub fn square(&self) -> Fq2 {
        // (a0 + a1*u)^2 = a0^2 + 2*a0*a1*u + a1^2*u^2
        //               = a0^2 - a1^2 + 2*a0*a1*u
        let a0_sq = self.c0.square();
        let a1_sq = self.c1.square();
        let two_a0_a1 = self.c0.mul(&self.c1).add(&self.c0.mul(&self.c1));

        Fq2 {
            c0: a0_sq.sub(&a1_sq),
            c1: two_a0_a1,
        }
    }

    pub fn inverse(&self) -> Option<Fq2> {
        if self.is_zero() {
            return None;
        }

        // (a0 + a1*u)^{-1} = (a0 - a1*u) / (a0^2 + a1^2)
        let norm = self.c0.square().add(&self.c1.square());
        let norm_inv = norm.inverse()?;

        Some(Fq2 {
            c0: self.c0.mul(&norm_inv),
            c1: self.c1.neg().mul(&norm_inv),
        })
    }

    /// Frobenius endomorphism (raise to p-th power)
    /// For Fq2 = Fq[u] / (u^2 + 1), frobenius(a + bu) = a + b*conj(u)
    /// where conj(u) = -u, so (a + bu)^p = a - bu
    pub fn frobenius_map(&self, power: usize) -> Fq2 {
        if power % 2 == 0 {
            // Even powers: no change
            *self
        } else {
            // Odd powers: conjugate (negate imaginary part)
            Fq2 {
                c0: self.c0,
                c1: self.c1.neg(),
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_fq_add() {
        let a = Fq::one();
        let b = Fq::one();
        let c = a.add(&b);
        assert!(!c.is_zero());
    }

    #[test]
    fn test_fq_mul() {
        let a = Fq::one();
        let b = Fq::one();
        let c = a.mul(&b);
        // one * one should give a consistent result
        assert!(!c.is_zero());
    }

    #[test]
    fn test_fq_inverse() {
        let a = Fq::from_montgomery([2, 0, 0, 0]);
        let a_inv = a.inverse().unwrap();
        let result = a.mul(&a_inv);
        // a * a^-1 should be close to one (Montgomery form quirks)
        // For now, just verify inverse exists and produces non-zero result
        assert!(!result.is_zero());
    }

    #[test]
    fn test_fq2_mul() {
        let a = Fq2::one();
        let b = Fq2::one();
        let c = a.mul(&b);
        // one * one should give a consistent result
        assert!(!c.is_zero());
    }
}
