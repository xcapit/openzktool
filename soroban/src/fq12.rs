// BN254 Fq12 Tower Extension
// Fq12 = Fq6[w] / (w^2 - v) where Fq6 = Fq2[v] / (v^3 - ξ) and ξ = u + 9
//
// This implements the sextic/quadratic tower extension used in BN254 pairing.
// Fq -> Fq2 -> Fq6 -> Fq12

use crate::field::{Fq, Fq2};

// Fq6 = Fq2[v] / (v^3 - ξ) where ξ = u + 9
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Fq6 {
    pub c0: Fq2, // coefficient of v^0
    pub c1: Fq2, // coefficient of v^1
    pub c2: Fq2, // coefficient of v^2
}

impl Fq6 {
    pub const fn new(c0: Fq2, c1: Fq2, c2: Fq2) -> Self {
        Fq6 { c0, c1, c2 }
    }

    pub const fn zero() -> Self {
        Fq6 {
            c0: Fq2::zero(),
            c1: Fq2::zero(),
            c2: Fq2::zero(),
        }
    }

    pub const fn one() -> Self {
        Fq6 {
            c0: Fq2::one(),
            c1: Fq2::zero(),
            c2: Fq2::zero(),
        }
    }

    pub fn is_zero(&self) -> bool {
        self.c0.is_zero() && self.c1.is_zero() && self.c2.is_zero()
    }

    /// Addition in Fq6
    pub fn add(&self, other: &Fq6) -> Fq6 {
        Fq6 {
            c0: self.c0.add(&other.c0),
            c1: self.c1.add(&other.c1),
            c2: self.c2.add(&other.c2),
        }
    }

    /// Subtraction in Fq6
    pub fn sub(&self, other: &Fq6) -> Fq6 {
        Fq6 {
            c0: self.c0.sub(&other.c0),
            c1: self.c1.sub(&other.c1),
            c2: self.c2.sub(&other.c2),
        }
    }

    /// Negation
    pub fn neg(&self) -> Fq6 {
        Fq6 {
            c0: self.c0.neg(),
            c1: self.c1.neg(),
            c2: self.c2.neg(),
        }
    }

    /// Multiplication in Fq6
    /// Uses Karatsuba multiplication for efficiency
    pub fn mul(&self, other: &Fq6) -> Fq6 {
        // Karatsuba: (a0 + a1*v + a2*v^2) * (b0 + b1*v + b2*v^2)
        let a0 = &self.c0;
        let a1 = &self.c1;
        let a2 = &self.c2;
        let b0 = &other.c0;
        let b1 = &other.c1;
        let b2 = &other.c2;

        // v0 = a0 * b0
        let v0 = a0.mul(b0);
        // v1 = a1 * b1
        let v1 = a1.mul(b1);
        // v2 = a2 * b2
        let v2 = a2.mul(b2);

        // c0 = v0 + ξ((a1 + a2)(b1 + b2) - v1 - v2)
        let t = a1.add(a2).mul(&b1.add(b2)).sub(&v1).sub(&v2);
        let c0 = v0.add(&Self::mul_by_nonresidue(&t));

        // c1 = (a0 + a1)(b0 + b1) - v0 - v1 + ξ*v2
        let c1 = a0.add(a1).mul(&b0.add(b1)).sub(&v0).sub(&v1).add(&Self::mul_by_nonresidue(&v2));

        // c2 = (a0 + a2)(b0 + b2) - v0 - v2 + v1
        let c2 = a0.add(a2).mul(&b0.add(b2)).sub(&v0).sub(&v2).add(&v1);

        Fq6 { c0, c1, c2 }
    }

    /// Multiply by non-residue ξ = u + 9 in Fq2
    /// ξ * a = (a.c0 * 9 - a.c1, a.c0 + a.c1 * 9)
    fn mul_by_nonresidue(a: &Fq2) -> Fq2 {
        let nine = Fq::from_montgomery([9, 0, 0, 0]);

        // ξ = (9, 1) in Fq2 representation
        // ξ * a = (9*a.c0 - a.c1, a.c0 + 9*a.c1)
        Fq2::new(
            nine.mul(&a.c0).sub(&a.c1),
            a.c0.add(&nine.mul(&a.c1))
        )
    }

    /// Squaring (more efficient than mul(self))
    pub fn square(&self) -> Fq6 {
        let s0 = self.c0.square();
        let ab = self.c0.mul(&self.c1);
        let s1 = ab.add(&ab);
        let s2 = self.c0.sub(&self.c1).add(&self.c2).square();
        let s3 = self.c1.mul(&self.c2);
        let s3 = s3.add(&s3);
        let s4 = self.c2.square();

        let c0 = s0.add(&Self::mul_by_nonresidue(&s3));
        let c1 = s1.add(&Self::mul_by_nonresidue(&s4));
        let c2 = s1.add(&s2).add(&s3).sub(&s0).sub(&s4);

        Fq6 { c0, c1, c2 }
    }

    /// Multiplicative inverse
    pub fn inverse(&self) -> Option<Fq6> {
        if self.is_zero() {
            return None;
        }

        // Use Fermat's little theorem: a^(p^6 - 2) = a^(-1)
        // More efficient: use explicit formula for Fq6 inverse
        let c0 = self.c0.square().sub(&Self::mul_by_nonresidue(&self.c1.mul(&self.c2)));
        let c1 = Self::mul_by_nonresidue(&self.c2.square()).sub(&self.c0.mul(&self.c1));
        let c2 = self.c1.square().sub(&self.c0.mul(&self.c2));

        let tmp = self.c2.mul(&c1);
        let tmp = Self::mul_by_nonresidue(&tmp);
        let tmp = tmp.add(&self.c1.mul(&c2));
        let tmp = Self::mul_by_nonresidue(&tmp);
        let tmp = tmp.add(&self.c0.mul(&c0));

        let inv = tmp.inverse()?;

        Some(Fq6 {
            c0: c0.mul(&inv),
            c1: c1.mul(&inv),
            c2: c2.mul(&inv),
        })
    }

    /// Frobenius endomorphism (raise to p-th power)
    pub fn frobenius_map(&self, power: usize) -> Fq6 {
        // Frobenius coefficients for Fq6
        // These are precomputed constants for v^p, v^(2p), etc.
        Fq6 {
            c0: self.c0.frobenius_map(power),
            c1: self.c1.frobenius_map(power).mul(&Self::frobenius_coeff_fq6_c1(power)),
            c2: self.c2.frobenius_map(power).mul(&Self::frobenius_coeff_fq6_c2(power)),
        }
    }

    fn frobenius_coeff_fq6_c1(power: usize) -> Fq2 {
        // Precomputed Frobenius coefficients
        // These would be computed once and stored as constants
        match power % 6 {
            0 => Fq2::one(),
            1 => Fq2::new(
                Fq::from_montgomery([0x0000000000000000, 0x0000000000000000, 0x0000000000000000, 0x0000000000000000]),
                Fq::from_montgomery([0x0000000000000001, 0x0000000000000000, 0x0000000000000000, 0x0000000000000000])
            ),
            _ => Fq2::one(), // Simplified for now
        }
    }

    fn frobenius_coeff_fq6_c2(power: usize) -> Fq2 {
        match power % 6 {
            0 => Fq2::one(),
            _ => Fq2::one(), // Simplified for now
        }
    }
}

// Fq12 = Fq6[w] / (w^2 - v)
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Fq12 {
    pub c0: Fq6, // coefficient of w^0
    pub c1: Fq6, // coefficient of w^1
}

impl Fq12 {
    pub const fn new(c0: Fq6, c1: Fq6) -> Self {
        Fq12 { c0, c1 }
    }

    pub const fn zero() -> Self {
        Fq12 {
            c0: Fq6::zero(),
            c1: Fq6::zero(),
        }
    }

    pub const fn one() -> Self {
        Fq12 {
            c0: Fq6::one(),
            c1: Fq6::zero(),
        }
    }

    pub fn is_zero(&self) -> bool {
        self.c0.is_zero() && self.c1.is_zero()
    }

    pub fn is_one(&self) -> bool {
        self.c0 == Fq6::one() && self.c1.is_zero()
    }

    /// Addition in Fq12
    pub fn add(&self, other: &Fq12) -> Fq12 {
        Fq12 {
            c0: self.c0.add(&other.c0),
            c1: self.c1.add(&other.c1),
        }
    }

    /// Subtraction in Fq12
    pub fn sub(&self, other: &Fq12) -> Fq12 {
        Fq12 {
            c0: self.c0.sub(&other.c0),
            c1: self.c1.sub(&other.c1),
        }
    }

    /// Negation
    pub fn neg(&self) -> Fq12 {
        Fq12 {
            c0: self.c0.neg(),
            c1: self.c1.neg(),
        }
    }

    /// Multiplication in Fq12
    /// (a0 + a1*w) * (b0 + b1*w) = (a0*b0 + v*a1*b1) + (a0*b1 + a1*b0)*w
    pub fn mul(&self, other: &Fq12) -> Fq12 {
        let aa = self.c0.mul(&other.c0);
        let bb = self.c1.mul(&other.c1);

        // c1 = (a0 + a1) * (b0 + b1) - aa - bb
        let c1 = self.c0.add(&self.c1).mul(&other.c0.add(&other.c1)).sub(&aa).sub(&bb);

        // c0 = aa + v * bb (where v is non-residue in Fq6)
        let c0 = aa.add(&Self::mul_by_nonresidue_fq12(&bb));

        Fq12 { c0, c1 }
    }

    /// Multiply by non-residue v in Fq12 tower
    fn mul_by_nonresidue_fq12(a: &Fq6) -> Fq6 {
        // v * (a0, a1, a2) = (ξ*a2, a0, a1) where ξ = u + 9
        Fq6::new(
            Fq6::mul_by_nonresidue(&a.c2),
            a.c0,
            a.c1
        )
    }

    /// Squaring (more efficient than mul(self))
    pub fn square(&self) -> Fq12 {
        let ab = self.c0.mul(&self.c1);

        let c0 = self.c1.add(&self.c0).mul(&self.c0.add(&Self::mul_by_nonresidue_fq12(&self.c1))).sub(&ab).sub(&Self::mul_by_nonresidue_fq12(&ab));
        let c1 = ab.add(&ab);

        Fq12 { c0, c1 }
    }

    /// Multiplicative inverse
    pub fn inverse(&self) -> Option<Fq12> {
        if self.is_zero() {
            return None;
        }

        // (a0 + a1*w)^(-1) = (a0 - a1*w) / (a0^2 - v*a1^2)
        let t0 = self.c0.square();
        let t1 = self.c1.square();
        let t1 = Self::mul_by_nonresidue_fq12(&t1);
        let t0 = t0.sub(&t1);

        let t = t0.inverse()?;

        Some(Fq12 {
            c0: self.c0.mul(&t),
            c1: self.c1.neg().mul(&t),
        })
    }

    /// Frobenius endomorphism
    pub fn frobenius_map(&self, power: usize) -> Fq12 {
        Fq12 {
            c0: self.c0.frobenius_map(power),
            c1: self.c1.frobenius_map(power).mul(&Self::frobenius_coeff_fq12_c1(power)),
        }
    }

    fn frobenius_coeff_fq12_c1(power: usize) -> Fq6 {
        // Precomputed Frobenius coefficients for Fq12
        match power % 12 {
            0 => Fq6::one(),
            _ => Fq6::one(), // Simplified for now, real constants needed for production
        }
    }

    /// Exponentiation by squaring
    pub fn pow(&self, exp: &[u64; 4]) -> Fq12 {
        let mut result = Fq12::one();
        let mut base = *self;

        for limb in exp.iter() {
            for i in 0..64 {
                if (limb >> i) & 1 == 1 {
                    result = result.mul(&base);
                }
                base = base.square();
            }
        }

        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_fq6_add() {
        let a = Fq6::one();
        let b = Fq6::one();
        let c = a.add(&b);
        assert!(!c.is_zero());
    }

    #[test]
    fn test_fq6_mul() {
        let a = Fq6::one();
        let b = Fq6::one();
        let c = a.mul(&b);
        assert_eq!(c, Fq6::one());
    }

    #[test]
    fn test_fq12_mul() {
        let a = Fq12::one();
        let b = Fq12::one();
        let c = a.mul(&b);
        assert!(c.is_one());
    }

    #[test]
    fn test_fq12_inverse() {
        let a = Fq12::one();
        let inv = a.inverse().unwrap();
        assert!(inv.is_one());
    }
}
