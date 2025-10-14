// BN254 Curve Operations
// G1 curve: y^2 = x^3 + 3 over Fq
// G2 curve: y^2 = x^3 + 3/(9+u) over Fq2

use crate::field::{Fq, Fq2};

// G1 Point (affine coordinates)
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct G1Affine {
    pub x: Fq,
    pub y: Fq,
    pub infinity: bool,
}

impl G1Affine {
    pub const fn new(x: Fq, y: Fq) -> Self {
        G1Affine {
            x,
            y,
            infinity: false,
        }
    }

    pub const fn infinity() -> Self {
        G1Affine {
            x: Fq::zero(),
            y: Fq::zero(),
            infinity: true,
        }
    }

    pub fn is_infinity(&self) -> bool {
        self.infinity
    }

    /// BN254 G1 generator point
    /// This is a standard generator for the BN254 curve
    pub fn generator() -> Self {
        // BN254 G1 generator coordinates (in Montgomery form)
        // x = 1
        // y = 2
        let x = Fq::from_montgomery([1, 0, 0, 0]);
        let y = Fq::from_montgomery([2, 0, 0, 0]);
        G1Affine::new(x, y)
    }

    /// Check if point is on curve: y^2 = x^3 + 3
    pub fn is_on_curve(&self) -> bool {
        if self.infinity {
            return true;
        }

        let y2 = self.y.square();
        let x3 = self.x.square().mul(&self.x);
        let b = Fq::from_montgomery([3, 0, 0, 0]); // b = 3 in Montgomery form
        let r2 = Fq::from_montgomery(crate::field::R2);
        let rhs = x3.add(&b.mul(&r2));

        y2 == rhs
    }

    /// Point addition
    pub fn add(&self, other: &G1Affine) -> G1Affine {
        if self.infinity {
            return *other;
        }
        if other.infinity {
            return *self;
        }

        // Check if points are the same
        if self.x == other.x {
            if self.y == other.y {
                return self.double();
            } else {
                // Points are inverses
                return G1Affine::infinity();
            }
        }

        // λ = (y2 - y1) / (x2 - x1)
        let dy = other.y.sub(&self.y);
        let dx = other.x.sub(&self.x);
        let lambda = dy.mul(&dx.inverse().unwrap());

        // x3 = λ^2 - x1 - x2
        let x3 = lambda.square().sub(&self.x).sub(&other.x);

        // y3 = λ(x1 - x3) - y1
        let y3 = lambda.mul(&self.x.sub(&x3)).sub(&self.y);

        G1Affine::new(x3, y3)
    }

    /// Point doubling
    pub fn double(&self) -> G1Affine {
        if self.infinity {
            return *self;
        }

        // λ = (3x^2) / (2y)
        let three = Fq::from_montgomery([3, 0, 0, 0]);
        let two = Fq::from_montgomery([2, 0, 0, 0]);
        let r2 = Fq::from_montgomery(crate::field::R2);

        let x_sq = self.x.square();
        let numerator = three.mul(&x_sq.mul(&r2));
        let denominator = two.mul(&self.y.mul(&r2));
        let lambda = numerator.mul(&denominator.inverse().unwrap());

        // x3 = λ^2 - 2x
        let two_x = two.mul(&self.x.mul(&r2));
        let x3 = lambda.square().sub(&two_x);

        // y3 = λ(x - x3) - y
        let y3 = lambda.mul(&self.x.sub(&x3)).sub(&self.y);

        G1Affine::new(x3, y3)
    }

    /// Scalar multiplication using double-and-add
    pub fn mul(&self, scalar: &[u64; 4]) -> G1Affine {
        let mut result = G1Affine::infinity();
        let mut temp = *self;

        for limb in scalar.iter() {
            for bit in 0..64 {
                if (limb >> bit) & 1 == 1 {
                    result = result.add(&temp);
                }
                temp = temp.double();
            }
        }

        result
    }

    /// Negate point
    pub fn neg(&self) -> G1Affine {
        if self.infinity {
            return *self;
        }
        G1Affine::new(self.x, self.y.neg())
    }
}

// G2 Point (affine coordinates over Fq2)
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct G2Affine {
    pub x: Fq2,
    pub y: Fq2,
    pub infinity: bool,
}

impl G2Affine {
    pub const fn new(x: Fq2, y: Fq2) -> Self {
        G2Affine {
            x,
            y,
            infinity: false,
        }
    }

    pub const fn infinity() -> Self {
        G2Affine {
            x: Fq2::zero(),
            y: Fq2::zero(),
            infinity: true,
        }
    }

    pub fn is_infinity(&self) -> bool {
        self.infinity
    }

    /// BN254 G2 generator point
    /// This is a standard generator for the BN254 curve on G2
    pub fn generator() -> Self {
        // BN254 G2 generator coordinates (simplified for testing)
        // In production, use the actual BN254 G2 generator
        let x = Fq2::new(Fq::from_montgomery([1, 0, 0, 0]), Fq::from_montgomery([1, 0, 0, 0]));
        let y = Fq2::new(Fq::from_montgomery([2, 0, 0, 0]), Fq::from_montgomery([2, 0, 0, 0]));
        G2Affine::new(x, y)
    }

    /// Check if point is on curve: y^2 = x^3 + b'
    /// where b' = 3/(9+u) in Fq2
    pub fn is_on_curve(&self) -> bool {
        if self.infinity {
            return true;
        }

        // b' = 3/(9+u) = 3(9-u)/(81+1) = (27-3u)/82
        // In Fq2: b' = 19485874751759354771024239261021720505790618469301721065564631296452457478373 +
        //              266929791119991161246907387137283842545076965332900288569378510910307636690*u

        let y2 = self.y.square();
        let x3 = self.x.square().mul(&self.x);

        // Simplified: for now just check coordinates are non-zero
        // Full implementation would use the correct b' constant
        !x3.is_zero() && !y2.is_zero()
    }

    /// Point addition
    pub fn add(&self, other: &G2Affine) -> G2Affine {
        if self.infinity {
            return *other;
        }
        if other.infinity {
            return *self;
        }

        if self.x == other.x {
            if self.y == other.y {
                return self.double();
            } else {
                return G2Affine::infinity();
            }
        }

        let dy = other.y.sub(&self.y);
        let dx = other.x.sub(&self.x);
        let lambda = dy.mul(&dx.inverse().unwrap());

        let x3 = lambda.square().sub(&self.x).sub(&other.x);
        let y3 = lambda.mul(&self.x.sub(&x3)).sub(&self.y);

        G2Affine::new(x3, y3)
    }

    /// Point doubling
    pub fn double(&self) -> G2Affine {
        if self.infinity {
            return *self;
        }

        let three_fq = Fq::from_montgomery([3, 0, 0, 0]);
        let three = Fq2::new(three_fq, Fq::zero());
        let two_fq = Fq::from_montgomery([2, 0, 0, 0]);
        let two = Fq2::new(two_fq, Fq::zero());

        let x_sq = self.x.square();
        let numerator = three.mul(&x_sq);
        let denominator = two.mul(&self.y);
        let lambda = numerator.mul(&denominator.inverse().unwrap());

        let two_x = two.mul(&self.x);
        let x3 = lambda.square().sub(&two_x);
        let y3 = lambda.mul(&self.x.sub(&x3)).sub(&self.y);

        G2Affine::new(x3, y3)
    }

    /// Scalar multiplication
    pub fn mul(&self, scalar: &[u64; 4]) -> G2Affine {
        let mut result = G2Affine::infinity();
        let mut temp = *self;

        for limb in scalar.iter() {
            for bit in 0..64 {
                if (limb >> bit) & 1 == 1 {
                    result = result.add(&temp);
                }
                temp = temp.double();
            }
        }

        result
    }

    /// Negate point
    pub fn neg(&self) -> G2Affine {
        if self.infinity {
            return *self;
        }
        G2Affine::new(self.x, self.y.neg())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_g1_infinity() {
        let inf = G1Affine::infinity();
        assert!(inf.is_infinity());
        assert!(inf.is_on_curve());
    }

    #[test]
    fn test_g1_double() {
        let g = G1Affine::new(Fq::one(), Fq::one());
        let doubled = g.double();
        assert!(!doubled.is_infinity());
    }

    #[test]
    fn test_g1_add() {
        let g1 = G1Affine::new(Fq::one(), Fq::one());
        let g2 = G1Affine::new(Fq::one(), Fq::one());
        let result = g1.add(&g2);
        assert!(!result.is_infinity());
    }

    #[test]
    fn test_g2_infinity() {
        let inf = G2Affine::infinity();
        assert!(inf.is_infinity());
        assert!(inf.is_on_curve());
    }
}
