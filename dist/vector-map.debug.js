!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Tangram=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.1.0
 */

/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


(function() {
  "use strict";

  var shim = {};
  if (typeof(exports) === 'undefined') {
    if(typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
      shim.exports = {};
      define(function() {
        return shim.exports;
      });
    } else {
      // gl-matrix lives in a browser, define its namespaces in global
      shim.exports = window;
    }    
  }
  else {
    // gl-matrix lives in commonjs, define its namespaces in exports
    shim.exports = exports;
  }

  (function(exports) {
    /* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


if(!GLMAT_EPSILON) {
    var GLMAT_EPSILON = 0.000001;
}

if(!GLMAT_ARRAY_TYPE) {
    var GLMAT_ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
}

/**
 * @class Common utilities
 * @name glMatrix
 */
var glMatrix = {};

/**
 * Sets the type of array used when creating new vectors and matricies
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
glMatrix.setMatrixArrayType = function(type) {
    GLMAT_ARRAY_TYPE = type;
}

if(typeof(exports) !== 'undefined') {
    exports.glMatrix = glMatrix;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2 Dimensional Vector
 * @name vec2
 */

var vec2 = {};

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
vec2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = 0;
    out[1] = 0;
    return out;
};

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
vec2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
vec2.fromValues = function(x, y) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
vec2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
vec2.set = function(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
};

/**
 * Subtracts two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
};

/**
 * Alias for {@link vec2.subtract}
 * @function
 */
vec2.sub = vec2.subtract;

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
};

/**
 * Alias for {@link vec2.multiply}
 * @function
 */
vec2.mul = vec2.multiply;

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
};

/**
 * Alias for {@link vec2.divide}
 * @function
 */
vec2.div = vec2.divide;

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
};

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
};

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
vec2.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
vec2.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.distance}
 * @function
 */
vec2.dist = vec2.distance;

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec2.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */
vec2.sqrDist = vec2.squaredDistance;

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
vec2.length = function (a) {
    var x = a[0],
        y = a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.length}
 * @function
 */
vec2.len = vec2.length;

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec2.squaredLength = function (a) {
    var x = a[0],
        y = a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */
vec2.sqrLen = vec2.squaredLength;

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
vec2.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
vec2.normalize = function(out, a) {
    var x = a[0],
        y = a[1];
    var len = x*x + y*y;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
vec2.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1];
};

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
vec2.cross = function(out, a, b) {
    var z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
    return out;
};

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
vec2.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
};

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    return out;
};

/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2d = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
};

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat3 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
};

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat4 = function(out, a, m) {
    var x = a[0], 
        y = a[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
};

/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec2.forEach = (function() {
    var vec = vec2.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 2;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec2} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec2.str = function (a) {
    return 'vec2(' + a[0] + ', ' + a[1] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec2 = vec2;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 3 Dimensional Vector
 * @name vec3
 */

var vec3 = {};

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
vec3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
};

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
vec3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
vec3.fromValues = function(x, y, z) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
vec3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
vec3.set = function(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
};

/**
 * Subtracts two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
};

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
vec3.sub = vec3.subtract;

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
};

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
vec3.mul = vec3.multiply;

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
};

/**
 * Alias for {@link vec3.divide}
 * @function
 */
vec3.div = vec3.divide;

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
};

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
vec3.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
vec3.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.distance}
 * @function
 */
vec3.dist = vec3.distance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec3.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
vec3.sqrDist = vec3.squaredDistance;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
vec3.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.length}
 * @function
 */
vec3.len = vec3.length;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec3.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
vec3.sqrLen = vec3.squaredLength;

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
vec3.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
};

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
vec3.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
vec3.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.cross = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
};

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
};

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12];
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13];
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14];
    return out;
};

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
vec3.transformQuat = function(out, a, q) {
    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec3.forEach = (function() {
    var vec = vec3.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 3;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec3.str = function (a) {
    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec3 = vec3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4 Dimensional Vector
 * @name vec4
 */

var vec4 = {};

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
vec4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
};

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
vec4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
vec4.fromValues = function(x, y, z, w) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
vec4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
vec4.set = function(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
};

/**
 * Subtracts two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
};

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
vec4.sub = vec4.subtract;

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
};

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
vec4.mul = vec4.multiply;

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
};

/**
 * Alias for {@link vec4.divide}
 * @function
 */
vec4.div = vec4.divide;

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
};

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
};

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
vec4.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
};

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
vec4.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.distance}
 * @function
 */
vec4.dist = vec4.distance;

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec4.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
vec4.sqrDist = vec4.squaredDistance;

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
vec4.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.length}
 * @function
 */
vec4.len = vec4.length;

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec4.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
vec4.sqrLen = vec4.squaredLength;

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
vec4.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
};

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
vec4.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    var len = x*x + y*y + z*z + w*w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
        out[3] = a[3] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
vec4.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
vec4.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
};

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
vec4.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
};

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
vec4.transformQuat = function(out, a, q) {
    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec4.forEach = (function() {
    var vec = vec4.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 4;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec4.str = function (a) {
    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec4 = vec4;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2x2 Matrix
 * @name mat2
 */

var mat2 = {};

var mat2Identity = new Float32Array([
    1, 0,
    0, 1
]);

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
mat2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
mat2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */
mat2.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a1 = a[1];
        out[1] = a[2];
        out[2] = a1;
    } else {
        out[0] = a[0];
        out[1] = a[2];
        out[2] = a[1];
        out[3] = a[3];
    }
    
    return out;
};

/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],

        // Calculate the determinant
        det = a0 * a3 - a2 * a1;

    if (!det) {
        return null;
    }
    det = 1.0 / det;
    
    out[0] =  a3 * det;
    out[1] = -a1 * det;
    out[2] = -a2 * det;
    out[3] =  a0 * det;

    return out;
};

/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.adjoint = function(out, a) {
    // Caching this value is nessecary if out == a
    var a0 = a[0];
    out[0] =  a[3];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] =  a0;

    return out;
};

/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */
mat2.determinant = function (a) {
    return a[0] * a[3] - a[2] * a[1];
};

/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = a0 * b0 + a1 * b2;
    out[1] = a0 * b1 + a1 * b3;
    out[2] = a2 * b0 + a3 * b2;
    out[3] = a2 * b1 + a3 * b3;
    return out;
};

/**
 * Alias for {@link mat2.multiply}
 * @function
 */
mat2.mul = mat2.multiply;

/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a1 * s;
    out[1] = a0 * -s + a1 * c;
    out[2] = a2 *  c + a3 * s;
    out[3] = a2 * -s + a3 * c;
    return out;
};

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
mat2.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v1;
    out[2] = a2 * v0;
    out[3] = a3 * v1;
    return out;
};

/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2.str = function (a) {
    return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.mat2 = mat2;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2x3 Matrix
 * @name mat2d
 * 
 * @description 
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, b,
 *  c, d,
 *  tx,ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, b, 0
 *  c, d, 0
 *  tx,ty,1]
 * </pre>
 * The last column is ignored so the array is shorter and operations are faster.
 */

var mat2d = {};

var mat2dIdentity = new Float32Array([
    1, 0,
    0, 1,
    0, 0
]);

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.create = function() {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */
mat2d.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.invert = function(out, a) {
    var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
        atx = a[4], aty = a[5];

    var det = aa * ad - ab * ac;
    if(!det){
        return null;
    }
    det = 1.0 / det;

    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
};

/**
 * Calculates the determinant of a mat2d
 *
 * @param {mat2d} a the source matrix
 * @returns {Number} determinant of a
 */
mat2d.determinant = function (a) {
    return a[0] * a[3] - a[1] * a[2];
};

/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.multiply = function (out, a, b) {
    var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
        atx = a[4], aty = a[5],
        ba = b[0], bb = b[1], bc = b[2], bd = b[3],
        btx = b[4], bty = b[5];

    out[0] = aa*ba + ab*bc;
    out[1] = aa*bb + ab*bd;
    out[2] = ac*ba + ad*bc;
    out[3] = ac*bb + ad*bd;
    out[4] = ba*atx + bc*aty + btx;
    out[5] = bb*atx + bd*aty + bty;
    return out;
};

/**
 * Alias for {@link mat2d.multiply}
 * @function
 */
mat2d.mul = mat2d.multiply;


/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.rotate = function (out, a, rad) {
    var aa = a[0],
        ab = a[1],
        ac = a[2],
        ad = a[3],
        atx = a[4],
        aty = a[5],
        st = Math.sin(rad),
        ct = Math.cos(rad);

    out[0] = aa*ct + ab*st;
    out[1] = -aa*st + ab*ct;
    out[2] = ac*ct + ad*st;
    out[3] = -ac*st + ct*ad;
    out[4] = ct*atx + st*aty;
    out[5] = ct*aty - st*atx;
    return out;
};

/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {mat2d} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/
mat2d.scale = function(out, a, v) {
    var vx = v[0], vy = v[1];
    out[0] = a[0] * vx;
    out[1] = a[1] * vy;
    out[2] = a[2] * vx;
    out[3] = a[3] * vy;
    out[4] = a[4] * vx;
    out[5] = a[5] * vy;
    return out;
};

/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {mat2d} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/
mat2d.translate = function(out, a, v) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4] + v[0];
    out[5] = a[5] + v[1];
    return out;
};

/**
 * Returns a string representation of a mat2d
 *
 * @param {mat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2d.str = function (a) {
    return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.mat2d = mat2d;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 3x3 Matrix
 * @name mat3
 */

var mat3 = {};

var mat3Identity = new Float32Array([
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
]);

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
mat3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
mat3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
mat3.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a12 = a[5];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a01;
        out[5] = a[7];
        out[6] = a02;
        out[7] = a12;
    } else {
        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];
    }
    
    return out;
};

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,

        // Calculate the determinant
        det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
};

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    out[0] = (a11 * a22 - a12 * a21);
    out[1] = (a02 * a21 - a01 * a22);
    out[2] = (a01 * a12 - a02 * a11);
    out[3] = (a12 * a20 - a10 * a22);
    out[4] = (a00 * a22 - a02 * a20);
    out[5] = (a02 * a10 - a00 * a12);
    out[6] = (a10 * a21 - a11 * a20);
    out[7] = (a01 * a20 - a00 * a21);
    out[8] = (a00 * a11 - a01 * a10);
    return out;
};

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
mat3.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
};

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b00 = b[0], b01 = b[1], b02 = b[2],
        b10 = b[3], b11 = b[4], b12 = b[5],
        b20 = b[6], b21 = b[7], b22 = b[8];

    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;

    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;

    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
};

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
mat3.mul = mat3.multiply;

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
mat3.translate = function(out, a, v) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],
        x = v[0], y = v[1];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;

    out[3] = a10;
    out[4] = a11;
    out[5] = a12;

    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
};

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.rotate = function (out, a, rad) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        s = Math.sin(rad),
        c = Math.cos(rad);

    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;

    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;

    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
mat3.scale = function(out, a, v) {
    var x = v[0], y = v[2];

    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];

    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];

    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
mat3.fromMat2d = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = 0;

    out[3] = a[2];
    out[4] = a[3];
    out[5] = 0;

    out[6] = a[4];
    out[7] = a[5];
    out[8] = 1;
    return out;
};

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
mat3.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;

    out[3] = xy - wz;
    out[4] = 1 - (xx + zz);
    out[5] = yz + wx;

    out[6] = xz + wy;
    out[7] = yz - wx;
    out[8] = 1 - (xx + yy);

    return out;
};

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat3.str = function (a) {
    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + 
                    a[6] + ', ' + a[7] + ', ' + a[8] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.mat3 = mat3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4x4 Matrix
 * @name mat4
 */

var mat4 = {};

var mat4Identity = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
]);

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
mat4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    
    return out;
};

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
mat4.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
mat4.mul = mat4.multiply;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.scale = function(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Rotates a mat4 by the given angle
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.rotate = function (out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < GLMAT_EPSILON) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateX = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateY = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateZ = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslation = function (out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};

/**
* Calculates a 4x4 matrix from the given quaternion
*
* @param {mat4} out mat4 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat4} out
*/
mat4.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;

    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;

    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < GLMAT_EPSILON &&
        Math.abs(eyey - centery) < GLMAT_EPSILON &&
        Math.abs(eyez - centerz) < GLMAT_EPSILON) {
        return mat4.identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.mat4 = mat4;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class Quaternion
 * @name quat
 */

var quat = {};

var quatIdentity = new Float32Array([0, 0, 0, 1]);

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
quat.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
quat.clone = vec4.clone;

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
quat.fromValues = vec4.fromValues;

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
quat.copy = vec4.copy;

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
quat.set = vec4.set;

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
quat.identity = function(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
quat.setAxisAngle = function(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
};

/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
quat.add = vec4.add;

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
quat.multiply = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
};

/**
 * Alias for {@link quat.multiply}
 * @function
 */
quat.mul = quat.multiply;

/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
quat.scale = vec4.scale;

/**
 * Rotates a quaternion by the given angle around the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateX = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
};

/**
 * Rotates a quaternion by the given angle around the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateY = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        by = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
};

/**
 * Rotates a quaternion by the given angle around the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateZ = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bz = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
};

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
quat.calculateW = function (out, a) {
    var x = a[0], y = a[1], z = a[2];

    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = -Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
};

/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
quat.dot = vec4.dot;

/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
quat.lerp = vec4.lerp;

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
quat.slerp = function (out, a, b, t) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    var cosHalfTheta = ax * bx + ay * by + az * bz + aw * bw,
        halfTheta,
        sinHalfTheta,
        ratioA,
        ratioB;

    if (Math.abs(cosHalfTheta) >= 1.0) {
        if (out !== a) {
            out[0] = ax;
            out[1] = ay;
            out[2] = az;
            out[3] = aw;
        }
        return out;
    }

    halfTheta = Math.acos(cosHalfTheta);
    sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

    if (Math.abs(sinHalfTheta) < 0.001) {
        out[0] = (ax * 0.5 + bx * 0.5);
        out[1] = (ay * 0.5 + by * 0.5);
        out[2] = (az * 0.5 + bz * 0.5);
        out[3] = (aw * 0.5 + bw * 0.5);
        return out;
    }

    ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
    ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

    out[0] = (ax * ratioA + bx * ratioB);
    out[1] = (ay * ratioA + by * ratioB);
    out[2] = (az * ratioA + bz * ratioB);
    out[3] = (aw * ratioA + bw * ratioB);

    return out;
};

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
quat.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        dot = a0*a0 + a1*a1 + a2*a2 + a3*a3,
        invDot = dot ? 1.0/dot : 0;
    
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out[0] = -a0*invDot;
    out[1] = -a1*invDot;
    out[2] = -a2*invDot;
    out[3] = a3*invDot;
    return out;
};

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
quat.conjugate = function (out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
};

/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 * @function
 */
quat.length = vec4.length;

/**
 * Alias for {@link quat.length}
 * @function
 */
quat.len = quat.length;

/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
quat.squaredLength = vec4.squaredLength;

/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
quat.sqrLen = quat.squaredLength;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
quat.normalize = vec4.normalize;

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
quat.fromMat3 = (function() {
    var s_iNext = [1,2,0];
    return function(out, m) {
        // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
        // article "Quaternion Calculus and Fast Animation".
        var fTrace = m[0] + m[4] + m[8];
        var fRoot;

        if ( fTrace > 0.0 ) {
            // |w| > 1/2, may as well choose w > 1/2
            fRoot = Math.sqrt(fTrace + 1.0);  // 2w
            out[3] = 0.5 * fRoot;
            fRoot = 0.5/fRoot;  // 1/(4w)
            out[0] = (m[7]-m[5])*fRoot;
            out[1] = (m[2]-m[6])*fRoot;
            out[2] = (m[3]-m[1])*fRoot;
        } else {
            // |w| <= 1/2
            var i = 0;
            if ( m[4] > m[0] )
              i = 1;
            if ( m[8] > m[i*3+i] )
              i = 2;
            var j = s_iNext[i];
            var k = s_iNext[j];
            
            fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
            out[i] = 0.5 * fRoot;
            fRoot = 0.5 / fRoot;
            out[3] = (m[k*3+j] - m[j*3+k]) * fRoot;
            out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
            out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
        }
        
        return out;
    };
})();

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
quat.str = function (a) {
    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.quat = quat;
}
;













  })(shim.exports);
})();

},{}],2:[function(_dereq_,module,exports){
var Point = _dereq_('../point.js');
var Geo = _dereq_('../geo.js');
var VectorRenderer = _dereq_('../vector_renderer.js');

VectorRenderer.CanvasRenderer = CanvasRenderer;
CanvasRenderer.prototype = Object.create(VectorRenderer.prototype);

function CanvasRenderer (tile_source, layers, styles, options)
{
    VectorRenderer.call(this, 'CanvasRenderer', tile_source, layers, styles, options);

    // Selection info shown on hover
    this.selection_info = document.createElement('div');
    this.selection_info.setAttribute('class', 'label');
    this.selection_info.style.display = 'none';

    // For drawing multipolygons w/canvas composite operations
    this.cutout_context = document.createElement('canvas').getContext('2d');
}

CanvasRenderer.prototype._tileWorkerCompleted = function (tile)
{
    // Use existing canvas or create new one
    if (tile.canvas == null) {
        tile.canvas = document.createElement('canvas');
        tile.context = tile.canvas.getContext('2d');

        tile.canvas.style.width = Geo.tile_size + 'px';
        tile.canvas.style.width = Geo.tile_size + 'px';
        tile.canvas.width = Math.round(Geo.tile_size * this.device_pixel_ratio);
        tile.canvas.height = Math.round(Geo.tile_size * this.device_pixel_ratio);
        tile.canvas.style.background = this.colorToString(this.styles.default);
    }
    else {
        tile.context.clearRect(0, 0, tile.canvas.width, tile.canvas.height);
    }

    this.renderTile(tile, tile.context);

    if (tile.canvas.parentNode == null) {
        var tileDiv = document.querySelector("div[data-tile-key='" + tile.key + "']");
        tileDiv.appendChild(tile.canvas);
    }
};

// Scale a GeoJSON coordinate (2-element array) from [min, max] to tile pixels
// returns a copy of geometry.coordinates transformed into Points
CanvasRenderer.prototype.scaleGeometryToPixels = function scaleGeometryToPixels (geometry)
{
    var renderer = this;
    return Geo.transformGeometry(geometry, function (coordinates) {
        return Point(
            // Math.round((coordinates[0] - min.x) * Geo.tile_size / (max.x - min.x)), // rounding removes seams but causes aliasing
            // Math.round((coordinates[1] - min.y) * Geo.tile_size / (max.y - min.y))
            coordinates[0] * Geo.tile_size * renderer.device_pixel_ratio / VectorRenderer.tile_scale,
            coordinates[1] * Geo.tile_size * renderer.device_pixel_ratio / VectorRenderer.tile_scale * -1 // adjust for flipped y-coord
        );
    });
};

// Renders a line given as an array of Points
// line = [Point, Point, ...]
CanvasRenderer.prototype.renderLine = function renderLine (line, style, context)
{
    var segments = line;
    var color = style.color;
    var width = style.width;
    var dash = style.dash;

    var c = context;
    c.beginPath();
    c.strokeStyle = this.colorToString(color);
    c.lineCap = 'round';
    c.lineWidth = width;
    if (c.setLineDash) {
        if (dash) {
            c.setLineDash(dash.map(function (d) { return d * width; }));
        }
        else {
            c.setLineDash([]);
        }
    }

    for (var r=0; r < segments.length - 1; r ++) {
        var segment = [
            segments[r].x, segments[r].y,
            segments[r + 1].x, segments[r + 1].y
        ];

        c.moveTo(segment[0], segment[1]);
        c.lineTo(segment[2], segment[3]);
    };

    c.closePath();
    c.stroke();
};

// Renders a polygon given as an array of Points
// polygon = [Point, Point, ...]
CanvasRenderer.prototype.renderPolygon = function renderPolygon (polygon, style, context)
{
    var segments = polygon;
    var color = style.color;
    var width = style.width;
    var outline_color = style.outline && style.outline.color;
    var outline_width = style.outline && style.outline.width;
    var outline_dash = style.outline && style.outline.dash;

    var c = context;
    c.beginPath();
    c.fillStyle = this.colorToString(color);
    c.moveTo(segments[0].x, segments[0].y);

    for (var r=1; r < segments.length; r ++) {
        c.lineTo(segments[r].x, segments[r].y);
    };

    c.closePath();
    c.fill();

    // Outline
    if (outline_color && outline_width) {
        c.strokeStyle = this.colorToString(outline_color);
        c.lineCap = 'round';
        c.lineWidth = outline_width;
        if (c.setLineDash) {
            if (outline_dash) {
                c.setLineDash(outline_dash.map(function (d) { return d * outline_width; }));
            }
            else {
                c.setLineDash([]);
            }
        }
        c.stroke();
    }
};

// Renders a point given as a Point object
CanvasRenderer.prototype.renderPoint = function renderPoint (point, style, context)
{
    var color = style.color;
    var size = style.size;
    var outline_color = style.outline && style.outline.color;
    var outline_width = style.outline && style.outline.width;
    var outline_dash = style.outline && style.outline.dash;

    var c = context;
    c.fillStyle = this.colorToString(color);

    c.beginPath();
    c.arc(point.x, point.y, size, 0, 2 * Math.PI);
    c.closePath();
    c.fill();

    // Outline
    if (outline_color && outline_width) {
        c.strokeStyle = this.colorToString(outline_color);
        c.lineWidth = outline_width;
        if (c.setLineDash) {
            if (outline_dash) {
                c.setLineDash(outline_dash.map(function (d) { return d * outline_width; }));
            }
            else {
                c.setLineDash([]);
            }
        }
        c.stroke();
    }
};

CanvasRenderer.prototype.renderFeature = function renderFeature (feature, style, context)
{
    var g, h, polys;
    var geometry = feature.geometry;

    if (geometry.type == 'LineString') {
        this.renderLine(geometry.pixels, style, context);
    }
    else if (geometry.type == 'MultiLineString') {
        for (g=0; g < geometry.pixels.length; g++) {
            this.renderLine(geometry.pixels[g], style, context);
        }
    }
    else if (geometry.type == 'Polygon' || geometry.type == 'MultiPolygon') {
        if (geometry.type == 'Polygon') {
            polys = [geometry.pixels]; // treat Polygon as a degenerate MultiPolygon to avoid duplicating code
        }
        else {
            polys = geometry.pixels;
        }

        for (g=0; g < polys.length; g++) {
            // Polygons with holes:
            // Render to a separate canvas, using composite operations to cut holes out of polygon, then copy back to the main canvas
            if (polys[g].length > 1) {
                if (this.cutout_context.canvas.width != context.canvas.width || this.cutout_context.canvas.height != context.canvas.height) {
                    this.cutout_context.canvas.width = context.canvas.width;
                    this.cutout_context.canvas.height = context.canvas.height;
                }
                this.cutout_context.clearRect(0, 0, this.cutout_context.canvas.width, this.cutout_context.canvas.height);

                this.cutout_context.globalCompositeOperation = 'source-over';
                this.renderPolygon(polys[g][0], style, this.cutout_context);

                this.cutout_context.globalCompositeOperation = 'destination-out';
                for (h=1; h < polys[g].length; h++) {
                    this.renderPolygon(polys[g][h], style, this.cutout_context);
                }
                context.drawImage(this.cutout_context.canvas, 0, 0);

                // After compositing back to main canvas, draw outlines on holes
                if (style.outline && style.outline.color) {
                    for (h=1; h < polys[g].length; h++) {
                        this.renderLine(polys[g][h], style.outline, context);
                    }
                }
            }
            // Regular closed polygons
            else {
                this.renderPolygon(polys[g][0], style, context);
            }
        }
    }
    else if (geometry.type == 'Point') {
        this.renderPoint(geometry.pixels, style, context);
    }
    else if (geometry.type == 'MultiPoint') {
        for (g=0; g < geometry.pixels.length; g++) {
            this.renderPoint(geometry.pixels[g], style, context);
        }
    }
};

// Render a GeoJSON tile onto canvas
CanvasRenderer.prototype.renderTile = function renderTile (tile, context)
{
    var renderer = this;
    var style;

    // Selection rendering - off-screen canvas to render a collision map for feature selection
    if (tile.selection_canvas == null) {
        tile.selection_canvas = document.createElement('canvas');
        tile.selection_context = tile.selection_canvas.getContext('2d');

        tile.selection_canvas.style.width = Geo.tile_size + 'px';
        tile.selection_canvas.style.width = Geo.tile_size + 'px';
        tile.selection_canvas.width = Math.round(Geo.tile_size * this.device_pixel_ratio);
        tile.selection_canvas.height = Math.round(Geo.tile_size * this.device_pixel_ratio);
    }

    var selection = { colors: {} };
    var selection_color;
    var selection_count = 0;

    // Render layers
    for (var t in renderer.layers) {
        var layer = renderer.layers[t];

        // Skip layers with no styles defined, or layers set to not be visible
        if (this.styles[layer.name] == null || this.styles[layer.name].visible == false) {
            continue;
        }

        tile.layers[layer.name].features.forEach(function(feature) {
            // Scale local coords to tile pixels
            feature.geometry.pixels = this.scaleGeometryToPixels(feature.geometry);
            style = VectorRenderer.parseStyleForFeature(feature, this.styles[layer.name], tile);

            // Draw visible geometry
            this.renderFeature(feature, style, context);

            // Draw mask for interactivity
            // TODO: move selection filter logic to stylesheet
            // TODO: only alter styles that are explicitly different, don't manually copy style values by property name
            if (layer.selection == true && feature.properties.name != null && feature.properties.name != '') {
                selection_color = this.generateColor(selection.colors);
                selection_color.properties = feature.properties;
                selection_count++;
                this.renderFeature(feature, { color: selection_color.color, width: style.width, size: style.size }, tile.selection_context);
            }
            else {
                // If this geometry isn't interactive, mask it out so geometry under it doesn't appear to pop through
                this.renderFeature(feature, { color: [0, 0, 0], width: style.width, size: style.size }, tile.selection_context);
            }

        }, this);
    }

    // Selection events
    var selection_info = this.selection_info;
    if (selection_count > 0) {
        this.tiles[tile.key].selection = selection;

        selection.pixels = new Uint32Array(tile.selection_context.getImageData(0, 0, tile.selection_canvas.width, tile.selection_canvas.height).data.buffer);

        // TODO: fire events on selection to enable custom behavior
        context.canvas.onmousemove = function (event) {
            var hit = { x: event.offsetX, y: event.offsetY }; // layerX/Y
            var off = (hit.y * renderer.device_pixel_ratio) * (Geo.tile_size * renderer.device_pixel_ratio) + (hit.x * renderer.device_pixel_ratio);
            var color = selection.pixels[off];
            var feature = selection.colors[color];
            if (feature != null) {
                context.canvas.style.cursor = 'crosshair';
                selection_info.style.left = (hit.x + 5) + 'px';
                selection_info.style.top = (hit.y + 5) + 'px';
                selection_info.innerHTML = '<span class="labelInner">' + feature.properties.name + /*' [' + feature.properties.kind + ']*/'</span>';
                selection_info.style.display = 'block';
                context.canvas.parentNode.appendChild(selection_info);
            }
            else {
                context.canvas.style.cursor = null;
                selection_info.style.display = 'none';
                if (selection_info.parentNode == context.canvas.parentNode) {
                    context.canvas.parentNode.removeChild(selection_info);
                }
            }
        };
    }
    else {
        context.canvas.onmousemove = function (event) {
            context.canvas.style.cursor = null;
            selection_info.style.display = 'none';
            if (selection_info.parentNode == context.canvas.parentNode) {
                context.canvas.parentNode.removeChild(selection_info);
            }
        };
    }
};

/* Color helpers */

// Transform color components in 0-1 range to html RGB string for canvas
CanvasRenderer.prototype.colorToString = function (color)
{
    return 'rgb(' + color.map(function(c) { return ~~(c * 256); }).join(',') + ')';
};

// Generates a random color not yet present in the provided hash of colors
CanvasRenderer.prototype.generateColor = function generateColor (color_map)
{
    var r, g, b, ir, ig, ib, key;
    color_map = color_map || {};
    while (true) {
        r = Math.random();
        g = Math.random();
        b = Math.random();

        ir = ~~(r * 256);
        ig = ~~(g * 256);
        ib = ~~(b * 256);
        key = (ir + (ig << 8) + (ib << 16) + (255 << 24)) >>> 0; // need unsigned right shift to convert to positive #

        if (color_map[key] === undefined) {
            color_map[key] = { color: [r, g, b] };
            break;
        }
    }
    return color_map[key];
};

if (module !== undefined) {
    module.exports = CanvasRenderer;
}

},{"../geo.js":3,"../point.js":11,"../vector_renderer.js":15}],3:[function(_dereq_,module,exports){
// Miscellaneous geo functions
var Point = _dereq_('./point.js');

var Geo = {};

// Projection constants
Geo.tile_size = 256;
Geo.half_circumference_meters = 20037508.342789244;
Geo.map_origin_meters = Point(-Geo.half_circumference_meters, Geo.half_circumference_meters);
Geo.min_zoom_meters_per_pixel = Geo.half_circumference_meters * 2 / Geo.tile_size; // min zoom draws world as 2 tiles wide
Geo.meters_per_pixel = [];
Geo.max_zoom = 20;
for (var z=0; z <= Geo.max_zoom; z++) {
    Geo.meters_per_pixel[z] = Geo.min_zoom_meters_per_pixel / Math.pow(2, z);
}

// Conversion functions based on an defined tile scale
Geo.units_per_meter = [];
Geo.setTileScale = function(scale)
{
    Geo.tile_scale = scale;
    Geo.units_per_pixel = Geo.tile_scale / Geo.tile_size;

    for (var z=0; z <= Geo.max_zoom; z++) {
        Geo.units_per_meter[z] = Geo.tile_scale / (Geo.tile_size * Geo.meters_per_pixel[z]);
    }
};

// Convert tile location to mercator meters - multiply by pixels per tile, then by meters per pixel, adjust for map origin
Geo.metersForTile = function (tile)
{
    return Point(
        (tile.x * Geo.tile_size * Geo.meters_per_pixel[tile.z]) + Geo.map_origin_meters.x,
        ((tile.y * Geo.tile_size * Geo.meters_per_pixel[tile.z]) * -1) + Geo.map_origin_meters.y
    );
};

// Convert mercator meters to lat-lng
Geo.metersToLatLng = function (meters)
{
    var c = Point.copy(meters);

    c.x /= Geo.half_circumference_meters;
    c.y /= Geo.half_circumference_meters;

    c.y = (2 * Math.atan(Math.exp(c.y * Math.PI)) - (Math.PI / 2)) / Math.PI;

    c.x *= 180;
    c.y *= 180;

    return c;
};

// Convert lat-lng to mercator meters
Geo.latLngToMeters = function(latlng)
{
    var c = Point.copy(latlng);

    // Latitude
    c.y = Math.log(Math.tan((c.y + 90) * Math.PI / 360)) / (Math.PI / 180);
    c.y = c.y * Geo.half_circumference_meters / 180;

    // Longitude
    c.x = c.x * Geo.half_circumference_meters / 180;

    return c;
};

// Run a transform function on each cooordinate in a GeoJSON geometry
Geo.transformGeometry = function (geometry, transform)
{
    if (geometry.type == 'Point') {
        return transform(geometry.coordinates);
    }
    else if (geometry.type == 'LineString' || geometry.type == 'MultiPoint') {
        return geometry.coordinates.map(transform);
    }
    else if (geometry.type == 'Polygon' || geometry.type == 'MultiLineString') {
        return geometry.coordinates.map(function (coordinates) {
            return coordinates.map(transform);
        });
    }
    else if (geometry.type == 'MultiPolygon') {
        return geometry.coordinates.map(function (polygon) {
            return polygon.map(function (coordinates) {
                return coordinates.map(transform);
            });
        });
    }
    // TODO: support GeometryCollection
    return {};
};

Geo.boxIntersect = function (b1, b2)
{
    return !(
        b2.sw.x > b1.ne.x ||
        b2.ne.x < b1.sw.x ||
        b2.sw.y > b1.ne.y ||
        b2.ne.y < b1.sw.y
    );
};

// Split the lines of a feature wherever two points are farther apart than a given tolerance
Geo.splitFeatureLines  = function (feature, tolerance) {
    var tolerance = tolerance || 0.001;
    var tolerance_sq = tolerance * tolerance;
    var geom = feature.geometry;
    var lines;

    if (geom.type == 'MultiLineString') {
        lines = geom.coordinates;
    }
    else if (geom.type =='LineString') {
        lines = [geom.coordinates];
    }
    else {
        return feature;
    }

    var split_lines = [];

    for (var s=0; s < lines.length; s++) {
        var seg = lines[s];
        var split_seg = [];
        var last_coord = null;
        var keep;

        for (var c=0; c < seg.length; c++) {
            var coord = seg[c];
            keep = true;

            if (last_coord != null) {
                var dist = (coord[0] - last_coord[0]) * (coord[0] - last_coord[0]) + (coord[1] - last_coord[1]) * (coord[1] - last_coord[1]);
                if (dist > tolerance_sq) {
                    // console.log("split lines at (" + coord[0] + ", " + coord[1] + "), " + Math.sqrt(dist) + " apart");
                    keep = false;
                }
            }

            if (keep == false) {
                split_lines.push(split_seg);
                split_seg = [];
            }
            split_seg.push(coord);

            last_coord = coord;
        }

        split_lines.push(split_seg);
        split_seg = [];
    }

    if (split_lines.length == 1) {
        geom.type = 'LineString';
        geom.coordinates = split_lines[0];
    }
    else {
        geom.type = 'MultiLineString';
        geom.coordinates = split_lines;
    }

    return feature;
};

if (module !== undefined) {
    module.exports = Geo;
}

},{"./point.js":11}],4:[function(_dereq_,module,exports){
// WebGL management and rendering functions
var GL = {};

// Setup a WebGL context
// If no canvas element is provided, one is created and added to the document body
GL.getContext = function getContext (canvas)
{
    var canvas = canvas;
    var fullscreen = false;
    if (canvas == null) {
        canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.zIndex = -1;
        document.body.appendChild(canvas);
        fullscreen = true;
    }

    gl = canvas.getContext('experimental-webgl', { /*preserveDrawingBuffer: true*/ }); // preserveDrawingBuffer needed for gl.readPixels (could be used for feature selection)
    if (!gl) {
        alert("Couldn't create WebGL context. Your browser probably doesn't support WebGL or it's turned off?");
        throw "Couldn't create WebGL context";
    }

    GL.resizeCanvas(gl, window.innerWidth, window.innerHeight);
    if (fullscreen == true) {
        window.addEventListener('resize', function () {
            GL.resizeCanvas(gl, window.innerWidth, window.innerHeight);
        });
    }

    GL.VertexArrayObject.init(gl); // TODO: this pattern doesn't support multiple active GL contexts, should that even be supported?

    return gl;
};

GL.resizeCanvas = function (gl, width, height)
{
    var device_pixel_ratio = window.devicePixelRatio || 1;
    gl.canvas.style.width = width + 'px';
    gl.canvas.style.height = height + 'px';
    gl.canvas.width = Math.round(gl.canvas.style.width * device_pixel_ratio);
    gl.canvas.height = Math.round(gl.canvas.style.width * device_pixel_ratio);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
};

// Compile & link a WebGL program from provided vertex and shader source elements
GL.createProgramFromElements = function GLcreateProgramFromElements (gl, vertex_shader_id, fragment_shader_id)
{
    var vertex_shader_source = document.getElementById(vertex_shader_id).textContent;
    var fragment_shader_source = document.getElementById(fragment_shader_id).textContent;
    var program = gl.createProgram();
    return GL.updateProgram(gl, program, vertex_shader_source, fragment_shader_source);
};

// Compile & link a WebGL program from provided vertex and shader source URLs
// NOTE: loads via synchronous XHR for simplicity, could be made async
GL.createProgramFromURLs = function GLcreateProgramFromURLs (gl, vertex_shader_url, fragment_shader_url)
{
    var program = gl.createProgram();
    return GL.updateProgramFromURLs(gl, program, vertex_shader_url, fragment_shader_url);
};

GL.updateProgramFromURLs = function GLUpdateProgramFromURLs (gl, program, vertex_shader_url, fragment_shader_url)
{
    var vertex_shader_source, fragment_shader_source;
    var req = new XMLHttpRequest();

    req.onload = function () { vertex_shader_source = req.response; };
    req.open('GET', vertex_shader_url + '?' + (+new Date()), false /* async flag */);
    req.send();

    req.onload = function () { fragment_shader_source = req.response; };
    req.open('GET', fragment_shader_url + '?' + (+new Date()), false /* async flag */);
    req.send();

    return GL.updateProgram(gl, program, vertex_shader_source, fragment_shader_source);
};

// Compile & link a WebGL program from provided vertex and fragment shader sources
// update a program if one is passed in. Create one if not. Alert and don't update anything if the shaders don't compile.
GL.updateProgram = function GLupdateProgram (gl, program, vertex_shader_source, fragment_shader_source)
{
    try {
        var vertex_shader = GL.createShader(gl, vertex_shader_source, gl.VERTEX_SHADER);
        var fragment_shader = GL.createShader(gl, '#ifdef GL_ES\nprecision highp float;\n#endif\n\n' + fragment_shader_source, gl.FRAGMENT_SHADER);
    }
    catch(err)
    {
        alert(err);
        return program;
    }

    gl.useProgram(null);
    if (program != null) {
        var old_shaders = gl.getAttachedShaders(program);
        for(var i = 0; i < old_shaders.length; i++) {
            gl.detachShader(program, old_shaders[i]);
        }
    } else {
        program = gl.createProgram();
    }

    if (vertex_shader == null || fragment_shader == null) {
        return program;
    }

    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);

    gl.deleteShader(vertex_shader);
    gl.deleteShader(fragment_shader);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var program_error =
            "WebGL program error:\n" +
            "VALIDATE_STATUS: " + gl.getProgramParameter(program, gl.VALIDATE_STATUS) + "\n" +
            "ERROR: " + gl.getError() + "\n\n" +
            "--- Vertex Shader ---\n" + vertex_shader_source + "\n\n" +
            "--- Fragment Shader ---\n" + fragment_shader_source;
        throw program_error;
    }

    return program;
};

// Compile a vertex or fragment shader from provided source
GL.createShader = function GLcreateShader (gl, source, type)
{
    var shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var shader_error =
            "WebGL shader error:\n" +
            (type == gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT") + " SHADER:\n" +
            gl.getShaderInfoLog(shader);
        throw shader_error;
    }

    return shader;
};

// Thin GL program layer to cache uniform locations/values, do compile-time pre-processing (injecting #defines into shaders), etc.
GL.Program = function (gl, vertex_shader_source, fragment_shader_source, options)
{
    options = options || {};

    this.gl = gl;
    this.program = null;
    this.defines = options.defines || {}; // key/values inserted into shaders at compile-time
    this.uniforms = {}; // program locations of uniforms, set/updated at compile-time
    this.attribs = {}; // program locations of vertex attributes
    this.vertex_shader_source = vertex_shader_source;
    this.fragment_shader_source = fragment_shader_source;
    this.compile();
};

// Creates a program that will refresh from source URLs each time it is compiled
GL.Program.createProgramFromURLs = function (gl, vertex_shader_url, fragment_shader_url, options)
{
    var program = Object.create(GL.Program.prototype);

    program.vertex_shader_url = vertex_shader_url;
    program.fragment_shader_url = fragment_shader_url;

    program.updateVertexShaderSource = function () {
        var source;
        var req = new XMLHttpRequest();
        req.onload = function () { source = req.response; };
        req.open('GET', this.vertex_shader_url + '?' + (+new Date()), false /* async flag */);
        req.send();
        return source;
    };

    program.updateFragmentShaderSource = function () {
        var source;
        var req = new XMLHttpRequest();
        req.onload = function () { source = req.response; };
        req.open('GET', this.fragment_shader_url + '?' + (+new Date()), false /* async flag */);
        req.send();
        return source;
    };

    GL.Program.call(program, gl, null, null, options);
    return program;
};

// Global defines applied to all programs (duplicate properties for a specific program will take precedence)
GL.Program.defines = {};

GL.Program.prototype.compile = function ()
{
    // Optionally update sources
    if (typeof this.updateVertexShaderSource == 'function') {
        this.vertex_shader_source = this.updateVertexShaderSource();
    }
    if (typeof this.updateFragmentShaderSource == 'function') {
        this.fragment_shader_source = this.updateFragmentShaderSource();
    }

    // Inject defines (global, then program-specific)
    var defines = {};
    for (var d in GL.Program.defines) {
        defines[d] = GL.Program.defines[d];
    }
    for (var d in this.defines) {
        defines[d] = this.defines[d];
    }

    var define_str = "";
    for (var d in defines) {
        if (defines[d] == false) {
            continue;
        }
        else if (typeof defines[d] == 'boolean' && defines[d] == true) {
            define_str += "#define " + d + "\n";
        }
        else {
            define_str += "#define " + d + " " + defines[d] + "\n";
        }
    }
    this.processed_vertex_shader_source = define_str + this.vertex_shader_source;
    this.processed_fragment_shader_source = define_str + this.fragment_shader_source;

    // Compile & set uniforms to cached values
    this.program = GL.updateProgram(this.gl, this.program, this.processed_vertex_shader_source, this.processed_fragment_shader_source);
    this.gl.useProgram(this.program);
    this.refreshUniforms();
    this.refreshAttributes();
};

// ex: program.uniform('3f', 'position', x, y, z);
GL.Program.prototype.uniform = function (method, name) // method-appropriate arguments follow
{
    var uniform = (this.uniforms[name] = this.uniforms[name] || {});
    uniform.name = name;
    uniform.location = uniform.location || this.gl.getUniformLocation(this.program, name);
    uniform.method = 'uniform' + method;
    uniform.values = Array.prototype.slice.call(arguments, 2);
    this.updateUniform(name);
};

// Set a single uniform
GL.Program.prototype.updateUniform = function (name)
{
    var uniform = this.uniforms[name];
    if (uniform == null || uniform.location == null) {
        return;
    }
    this.gl[uniform.method].apply(this.gl, [uniform.location].concat(uniform.values)); // call appropriate GL uniform method and pass through arguments
};

// Refresh uniform locations and set to last cached values
GL.Program.prototype.refreshUniforms = function ()
{
    for (var u in this.uniforms) {
        this.uniforms[u].location = this.gl.getUniformLocation(this.program, u);
        this.updateUniform(u);
    }
};

GL.Program.prototype.refreshAttributes = function ()
{
    // var len = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);
    // for (var i=0; i < len; i++) {
    //     var a = this.gl.getActiveAttrib(this.program, i);
    //     console.log(a);
    // }
    this.attribs = {};
};

// Get the location of a vertex attribute
GL.Program.prototype.attribute = function (name)
{
    var attrib = (this.attribs[name] = this.attribs[name] || {});
    if (attrib.location != null) {
        return attrib;
    }

    attrib.name = name;
    attrib.location = this.gl.getAttribLocation(this.program, name);

    // var info = this.gl.getActiveAttrib(this.program, attrib.location);
    // attrib.type = info.type;
    // attrib.size = info.size;

    return attrib;
};

// Triangulation using libtess.js port of gluTesselator
// https://github.com/brendankenny/libtess.js
try {
    GL.tesselator = (function initTesselator() {
        // Called for each vertex of tesselator output
        function vertexCallback(data, polyVertArray) {
            polyVertArray.push([data[0], data[1]]);
        }

        // Called when segments intersect and must be split
        function combineCallback(coords, data, weight) {
            return coords;
        }

        // Called when a vertex starts or stops a boundary edge of a polygon
        function edgeCallback(flag) {
            // No-op callback to force simple triangle primitives (no triangle strips or fans).
            // See: http://www.glprogramming.com/red/chapter11.html
            // "Since edge flags make no sense in a triangle fan or triangle strip, if there is a callback
            // associated with GLU_TESS_EDGE_FLAG that enables edge flags, the GLU_TESS_BEGIN callback is
            // called only with GL_TRIANGLES."
            // console.log('GL.tesselator: edge flag: ' + flag);
        }

        var tesselator = new libtess.GluTesselator();
        tesselator.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, vertexCallback);
        tesselator.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, combineCallback);
        tesselator.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, edgeCallback);

        // Brendan Kenny:
        // libtess will take 3d verts and flatten to a plane for tesselation
        // since only doing 2d tesselation here, provide z=1 normal to skip
        // iterating over verts only to get the same answer.
        // comment out to test normal-generation code
        tesselator.gluTessNormal(0, 0, 1);

        return tesselator;
    })();

    GL.triangulatePolygon = function GLTriangulate (contours)
    {
        var triangleVerts = [];
        GL.tesselator.gluTessBeginPolygon(triangleVerts);

        for (var i = 0; i < contours.length; i++) {
            GL.tesselator.gluTessBeginContour();
            var contour = contours[i];
            for (var j = 0; j < contour.length; j ++) {
                var coords = [contour[j][0], contour[j][1], 0];
                GL.tesselator.gluTessVertex(coords, coords);
            }
            GL.tesselator.gluTessEndContour();
        }

        GL.tesselator.gluTessEndPolygon();
        return triangleVerts;
    };
}
catch (e) {
    // console.log("libtess not defined!");
    // skip if libtess not defined
}

// Add one or more vertices to an array (destined to be used as a GL buffer), 'striping' each vertex with constant data
// Used for adding values that are often constant per geometry or polygon, like colors, normals (for polys sitting flat on map), layer and material info, etc.
GL.addVertices = function (vertices, vertex_data, vertex_constants)
{
    if (vertices != null && vertices.length > 0) {
        // Array of vertices
        if (typeof vertices[0] == 'object') {
            for (var v=0; v < vertices.length; v++) {
                vertex_data.push.apply(vertex_data, vertices[v]);
                if (vertex_constants) {
                    vertex_data.push.apply(vertex_data, vertex_constants);
                }
            }
        }
        // Single vertex
        else {
            vertex_data.push.apply(vertex_data, vertices);
            if (vertex_constants) {
                vertex_data.push.apply(vertex_data, vertex_constants);
            }
        }
    }
    return vertex_data;
};

// Creates a Vertex Array Object if the extension is available, or falls back on standard attribute calls
GL.VertexArrayObject = {};
GL.VertexArrayObject.disabled = false; // set to true to disable VAOs even if extension is available
GL.VertexArrayObject.bound_vao = null; // currently bound VAO

GL.VertexArrayObject.init = function (gl)
{
    if (GL.VertexArrayObject.ext == null) {
        if (GL.VertexArrayObject.disabled != true) {
            GL.VertexArrayObject.ext = gl.getExtension("OES_vertex_array_object");
        }

        if (GL.VertexArrayObject.ext != null) {
            console.log("Vertex Array Object extension available");
        }
        else if (GL.VertexArrayObject.disabled != true) {
            console.log("Vertex Array Object extension NOT available");
        }
        else {
            console.log("Vertex Array Object extension force disabled");
        }
    }
};

GL.VertexArrayObject.create = function (setup, teardown)
{
    var vao = {};
    vao.setup = setup;
    vao.teardown = teardown;

    var ext = GL.VertexArrayObject.ext;
    if (ext != null) {
        vao._vao = ext.createVertexArrayOES();
        ext.bindVertexArrayOES(vao._vao);
        vao.setup();
        ext.bindVertexArrayOES(null);
        if (typeof vao.teardown == 'function') {
            vao.teardown();
        }
    }
    else {
        vao.setup();
    }

    return vao;
};

GL.VertexArrayObject.bind = function (vao)
{
    var ext = GL.VertexArrayObject.ext;
    if (vao != null) {
        if (ext != null && vao._vao != null) {
            ext.bindVertexArrayOES(vao._vao);
            GL.VertexArrayObject.bound_vao = vao;
        }
        else {
            vao.setup();
        }
    }
    else {
        if (ext != null) {
            ext.bindVertexArrayOES(null);
        }
        else if (GL.VertexArrayObject.bound_vao != null && typeof GL.VertexArrayObject.bound_vao.teardown == 'function') {
            GL.VertexArrayObject.bound_vao.teardown();
        }
        GL.VertexArrayObject.bound_vao = null;
    }
};

if (module !== undefined) {
    module.exports = GL;
}

},{}],5:[function(_dereq_,module,exports){
var Vector = _dereq_('../vector.js');
var Point = _dereq_('../point.js');
var GL = _dereq_('./gl.js');

var GLBuilders = {};

GLBuilders.debug = false;

// Tesselate a flat 2D polygon with fixed height and add to GL vertex buffer
GLBuilders.buildPolygons = function GLBuildersBuildPolygons (polygons, z, vertex_data, options)
{
    options = options || {};

    var vertex_constants = [z, 0, 0, 1]; // provided z, and upwards-facing normal
    if (options.vertex_constants) {
        vertex_constants.push.apply(vertex_constants, options.vertex_constants);
    }

    var num_polygons = polygons.length;
    for (var p=0; p < num_polygons; p++) {
        var vertices = GL.triangulatePolygon(polygons[p]);
        GL.addVertices(vertices, vertex_data, vertex_constants);
    }

    return vertex_data;
};

// Tesselate and extrude a flat 2D polygon into a simple 3D model with fixed height and add to GL vertex buffer
GLBuilders.buildExtrudedPolygons = function GLBuildersBuildExtrudedPolygon (polygons, z, height, min_height, vertex_data, options)
{
    options = options || {};
    var min_z = z + (min_height || 0);
    var max_z = z + height;

    // Top
    GLBuilders.buildPolygons(polygons, max_z, vertex_data, { vertex_constants: options.vertex_constants });

    // Walls
    var wall_vertex_constants = [null, null, null]; // normals will be calculated below
    if (options.vertex_constants) {
        wall_vertex_constants.push.apply(wall_vertex_constants, options.vertex_constants);
    }

    var num_polygons = polygons.length;
    for (var p=0; p < num_polygons; p++) {
        var polygon = polygons[p];

        for (var q=0; q < polygon.length; q++) {
            var contour = polygon[q];

            for (var w=0; w < contour.length - 1; w++) {
                var wall_vertices = [];

                // Two triangles for the quad formed by each vertex pair, going from bottom to top height
                wall_vertices.push(
                    // Triangle
                    [contour[w+1][0], contour[w+1][1], max_z],
                    [contour[w+1][0], contour[w+1][1], min_z],
                    [contour[w][0], contour[w][1], min_z],
                    // Triangle
                    [contour[w][0], contour[w][1], min_z],
                    [contour[w][0], contour[w][1], max_z],
                    [contour[w+1][0], contour[w+1][1], max_z]
                );

                // Calc the normal of the wall from up vector and one segment of the wall triangles
                var normal = Vector.cross(
                    [0, 0, 1],
                    Vector.normalize([contour[w+1][0] - contour[w][0], contour[w+1][1] - contour[w][1], 0])
                );

                wall_vertex_constants[0] = normal[0];
                wall_vertex_constants[1] = normal[1];
                wall_vertex_constants[2] = normal[2];

                GL.addVertices(wall_vertices, vertex_data, wall_vertex_constants);
            }
        }
    }

    return vertex_data;
};

// Build tessellated triangles for a polyline
// Basically following the method described here for miter joints:
// http://artgrammer.blogspot.co.uk/2011/07/drawing-polylines-by-tessellation.html
GLBuilders.buildPolylines = function GLBuildersBuildPolylines (lines, z, width, vertex_data, options)
{
    options = options || {};
    options.closed_polygon = options.closed_polygon || false;
    options.remove_tile_edges = options.remove_tile_edges || false;

    var vertex_constants = [z, 0, 0, 1]; // provided z, and upwards-facing normal
    if (options.vertex_constants) {
        vertex_constants.push.apply(vertex_constants, options.vertex_constants);
    }

    // Line center - debugging
    if (GLBuilders.debug && options.vertex_lines) {
        var num_lines = lines.length;
        for (var ln=0; ln < num_lines; ln++) {
            var line = lines[ln];

            for (var p=0; p < line.length - 1; p++) {
                // Point A to B
                var pa = line[p];
                var pb = line[p+1];

                options.vertex_lines.push(
                    pa[0], pa[1], z + 0.001, 0, 0, 1, 1.0, 0, 0,
                    pb[0], pb[1], z + 0.001, 0, 0, 1, 1.0, 0, 0
                );
            }
        };
    }

    // Build triangles
    var vertices = [];
    var num_lines = lines.length;
    for (var ln=0; ln < num_lines; ln++) {
        var line = lines[ln];
        // Multiple line segments
        if (line.length > 2) {
            // Build anchors for line segments:
            // anchors are 3 points, each connecting 2 line segments that share a joint (start point, joint point, end point)

            var anchors = [];

            if (line.length > 3) {
                // Find midpoints of each line segment
                // For closed polygons, calculate all midpoints since segments will wrap around to first midpoint
                var mid = [];
                var p, pmax;
                if (options.closed_polygon == true) {
                    p = 0; // start on first point
                    pmax = line.length - 1;
                }
                // For open polygons, skip first midpoint and use line start instead
                else {
                    p = 1; // start on second point
                    pmax = line.length - 2;
                    mid.push(line[0]); // use line start instead of first midpoint
                }

                // Calc midpoints
                for (; p < pmax; p++) {
                    var pa = line[p];
                    var pb = line[p+1];
                    mid.push([(pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2]);
                }

                // Same closed/open polygon logic as above: keep last midpoint for closed, skip for open
                var mmax;
                if (options.closed_polygon == true) {
                    mmax = mid.length;
                }
                else {
                    mid.push(line[line.length-1]); // use line end instead of last midpoint
                    mmax = mid.length - 1;
                }

                // Make anchors by connecting midpoints to line joints
                for (p=0; p < mmax; p++)  {
                    anchors.push([mid[p], line[(p+1) % line.length], mid[(p+1) % mid.length]]);
                }
            }
            else {
                // Degenerate case, a 3-point line is just a single anchor
                anchors = [[line[0], line[1], line[2]]];
            }

            for (var p=0; p < anchors.length; p++) {
                if (!options.remove_tile_edges) {
                    buildAnchor(anchors[p][0], anchors[p][1], anchors[p][2]);
                    // buildSegment(anchors[p][0], anchors[p][1]); // use these to draw extruded segments w/o join, for debugging
                    // buildSegment(anchors[p][1], anchors[p][2]);
                }
                else {
                    var edge1 = GLBuilders.isOnTileEdge(anchors[p][0], anchors[p][1]);
                    var edge2 = GLBuilders.isOnTileEdge(anchors[p][1], anchors[p][2]);
                    if (!edge1 && !edge2) {
                        buildAnchor(anchors[p][0], anchors[p][1], anchors[p][2]);
                    }
                    else if (!edge1) {
                        buildSegment(anchors[p][0], anchors[p][1]);
                    }
                    else if (!edge2) {
                        buildSegment(anchors[p][1], anchors[p][2]);
                    }
                }
            }
        }
        // Single 2-point segment
        else if (line.length == 2) {
            buildSegment(line[0], line[1]); // TODO: replace buildSegment with a degenerate form of buildAnchor? buildSegment is still useful for debugging
        }
    };

    GL.addVertices(vertices, vertex_data, vertex_constants);

    // Build triangles for a single line segment, extruded by the provided width
    function buildSegment (pa, pb) {
        var slope = Vector.normalize([(pb[1] - pa[1]) * -1, pb[0] - pa[0]]);

        var pa_outer = [pa[0] + slope[0] * width/2, pa[1] + slope[1] * width/2];
        var pa_inner = [pa[0] - slope[0] * width/2, pa[1] - slope[1] * width/2];

        var pb_outer = [pb[0] + slope[0] * width/2, pb[1] + slope[1] * width/2];
        var pb_inner = [pb[0] - slope[0] * width/2, pb[1] - slope[1] * width/2];

        vertices.push(
            pb_inner, pb_outer, pa_inner,
            pa_inner, pb_outer, pa_outer
        );
    }

    // Build triangles for a 3-point 'anchor' shape, consisting of two line segments with a joint
    // TODO: move these functions out of closures?
    function buildAnchor (pa, joint, pb) {
        // Inner and outer line segments for [pa, joint] and [joint, pb]
        var pa_slope = Vector.normalize([(joint[1] - pa[1]) * -1, joint[0] - pa[0]]);
        var pa_outer = [
            [pa[0] + pa_slope[0] * width/2, pa[1] + pa_slope[1] * width/2],
            [joint[0] + pa_slope[0] * width/2, joint[1] + pa_slope[1] * width/2]
        ];
        var pa_inner = [
            [pa[0] - pa_slope[0] * width/2, pa[1] - pa_slope[1] * width/2],
            [joint[0] - pa_slope[0] * width/2, joint[1] - pa_slope[1] * width/2]
        ];

        var pb_slope = Vector.normalize([(pb[1] - joint[1]) * -1, pb[0] - joint[0]]);
        var pb_outer = [
            [joint[0] + pb_slope[0] * width/2, joint[1] + pb_slope[1] * width/2],
            [pb[0] + pb_slope[0] * width/2, pb[1] + pb_slope[1] * width/2]
        ];
        var pb_inner = [
            [joint[0] - pb_slope[0] * width/2, joint[1] - pb_slope[1] * width/2],
            [pb[0] - pb_slope[0] * width/2, pb[1] - pb_slope[1] * width/2]
        ];

        // Miter join - solve for the intersection between the two outer line segments
        var intersection = Vector.lineIntersection(pa_outer[0], pa_outer[1], pb_outer[0], pb_outer[1]);
        var line_debug = null;
        if (intersection != null) {
            var intersect_outer = intersection;

            // Cap the intersection point to a reasonable distance (as join angle becomes sharper, miter joint distance would approach infinity)
            var len_sq = Vector.lengthSq([intersect_outer[0] - joint[0], intersect_outer[1] - joint[1]]);
            var miter_len_max = 3; // multiplier on line width for max distance miter join can be from joint
            if (len_sq > (width * width * miter_len_max * miter_len_max)) {
                line_debug = 'distance';
                intersect_outer = Vector.normalize([intersect_outer[0] - joint[0], intersect_outer[1] - joint[1]]);
                intersect_outer = [
                    joint[0] + intersect_outer[0] * miter_len_max,
                    joint[1] + intersect_outer[1] * miter_len_max
                ]
            }

            var intersect_inner = [
                (joint[0] - intersect_outer[0]) + joint[0],
                (joint[1] - intersect_outer[1]) + joint[1]
            ];

            vertices.push(
                intersect_inner, intersect_outer, pa_inner[0],
                pa_inner[0], intersect_outer, pa_outer[0],

                pb_inner[1], pb_outer[1], intersect_inner,
                intersect_inner, pb_outer[1], intersect_outer
            );
        }
        else {
            // Line segments are parallel, use the first outer line segment as join instead
            line_debug = 'parallel';
            pa_inner[1] = pb_inner[0];
            pa_outer[1] = pb_outer[0];

            vertices.push(
                pa_inner[1], pa_outer[1], pa_inner[0],
                pa_inner[0], pa_outer[1], pa_outer[0],

                pb_inner[1], pb_outer[1], pb_inner[0],
                pb_inner[0], pb_outer[1], pb_outer[0]
            );
        }

        // Extruded inner/outer edges - debugging
        if (GLBuilders.debug && options.vertex_lines) {
            options.vertex_lines.push(
                pa_inner[0][0], pa_inner[0][1], z + 0.001, 0, 0, 1, 0, 1.0, 0,
                pa_inner[1][0], pa_inner[1][1], z + 0.001, 0, 0, 1, 0, 1.0, 0,

                pb_inner[0][0], pb_inner[0][1], z + 0.001, 0, 0, 1, 0, 1.0, 0,
                pb_inner[1][0], pb_inner[1][1], z + 0.001, 0, 0, 1, 0, 1.0, 0,

                pa_outer[0][0], pa_outer[0][1], z + 0.001, 0, 0, 1, 0, 1.0, 0,
                pa_outer[1][0], pa_outer[1][1], z + 0.001, 0, 0, 1, 0, 1.0, 0,

                pb_outer[0][0], pb_outer[0][1], z + 0.001, 0, 0, 1, 0, 1.0, 0,
                pb_outer[1][0], pb_outer[1][1], z + 0.001, 0, 0, 1, 0, 1.0, 0,

                pa_inner[0][0], pa_inner[0][1], z + 0.001, 0, 0, 1, 0, 1.0, 0,
                pa_outer[0][0], pa_outer[0][1], z + 0.001, 0, 0, 1, 0, 1.0, 0,

                pa_inner[1][0], pa_inner[1][1], z + 0.001, 0, 0, 1, 0, 1.0, 0,
                pa_outer[1][0], pa_outer[1][1], z + 0.001, 0, 0, 1, 0, 1.0, 0,

                pb_inner[0][0], pb_inner[0][1], z + 0.001, 0, 0, 1, 0, 1.0, 0,
                pb_outer[0][0], pb_outer[0][1], z + 0.001, 0, 0, 1, 0, 1.0, 0,

                pb_inner[1][0], pb_inner[1][1], z + 0.001, 0, 0, 1, 0, 1.0, 0,
                pb_outer[1][0], pb_outer[1][1], z + 0.001, 0, 0, 1, 0, 1.0, 0
            );
        }

        if (GLBuilders.debug && line_debug && options.vertex_lines) {
            var dcolor;
            if (line_debug == 'parallel') {
                // console.log("!!! lines are parallel !!!");
                dcolor = [0, 1, 0];
            }
            else if (line_debug == 'distance') {
                // console.log("!!! miter intersection point exceeded allowed distance from joint !!!");
                dcolor = [1, 0, 0];
            }
            // console.log('OSM id: ' + feature.id); // TODO: if this function is moved out of a closure, this feature debug info won't be available
            // console.log([pa, joint, pb]);
            // console.log(feature);
            options.vertex_lines.push(
                pa[0], pa[1], z + 0.002,
                0, 0, 1, dcolor[0], dcolor[1], dcolor[2],
                joint[0], joint[1], z + 0.002,
                0, 0, 1, dcolor[0], dcolor[1], dcolor[2],
                joint[0], joint[1], z + 0.002,
                0, 0, 1, dcolor[0], dcolor[1], dcolor[2],
                pb[0], pb[1], z + 0.002,
                0, 0, 1, dcolor[0], dcolor[1], dcolor[2]
            );

            var num_lines = lines.length;
            for (var ln=0; ln < num_lines; ln++) {
                var line2 = lines[ln];

                for (var p=0; p < line2.length - 1; p++) {
                    // Point A to B
                    var pa = line2[p];
                    var pb = line2[p+1];

                    options.vertex_lines.push(
                        pa[0], pa[1], z + 0.0005,
                        0, 0, 1, 0, 0, 1.0,
                        pb[0], pb[1], z + 0.0005,
                        0, 0, 1, 0, 0, 1.0
                    );
                }
            };
        }
    }

    return vertex_data;
};

// Build a quad centered on a point
GLBuilders.buildQuads = function GLBuildersBuildQuads (points, width, height, addGeometry, options)
{
    var options = options || {};

    var num_points = points.length;
    for (var p=0; p < num_points; p++) {
        var point = points[p];

        var positions = [
            [point[0] - width/2, point[1] - height/2],
            [point[0] + width/2, point[1] - height/2],
            [point[0] + width/2, point[1] + height/2],

            [point[0] - width/2, point[1] - height/2],
            [point[0] + width/2, point[1] + height/2],
            [point[0] - width/2, point[1] + height/2],
        ];

        if (options.texcoords == true) {
            var texcoords = [
                [-1, -1],
                [1, -1],
                [1, 1],

                [-1, -1],
                [1, 1],
                [-1, 1]
            ];
        }

        var vertices = {
            positions: positions,
            texcoords: (options.texcoords && texcoords)
        };
        addGeometry(vertices);
    }
};

// Build native GL lines for a polyline
GLBuilders.buildLines = function GLBuildersBuildLines (lines, feature, layer, style, tile, z, vertex_data, options)
{
    options = options || {};

    var color = style.color;
    var width = style.width;

    var num_lines = lines.length;
    for (var ln=0; ln < num_lines; ln++) {
        var line = lines[ln];

        for (var p=0; p < line.length - 1; p++) {
            // Point A to B
            var pa = line[p];
            var pb = line[p+1];

            vertex_data.push(
                // Point A
                pa[0], pa[1], z,
                0, 0, 1, // flat surfaces point straight up
                color[0], color[1], color[2],
                // Point B
                pb[0], pb[1], z,
                0, 0, 1, // flat surfaces point straight up
                color[0], color[1], color[2]
            );
        }
    };

    return vertex_data;
};

/* Utility functions */

// Tests if a line segment (from point A to B) is nearly coincident with the edge of a tile
GLBuilders.isOnTileEdge = function (pa, pb, options)
{
    options = options || {};

    var tolerance_function = options.tolerance_function || GLBuilders.valuesWithinTolerance;
    var tolerance = options.tolerance || 1; // tweak this adjust if catching too few/many line segments near tile edges
    var tile_min = GLBuilders.tile_bounds[0];
    var tile_max = GLBuilders.tile_bounds[1];
    var edge = null;

    if (tolerance_function(pa[0], tile_min.x, tolerance) && tolerance_function(pb[0], tile_min.x, tolerance)) {
        edge = 'left';
    }
    else if (tolerance_function(pa[0], tile_max.x, tolerance) && tolerance_function(pb[0], tile_max.x, tolerance)) {
        edge = 'right';
    }
    else if (tolerance_function(pa[1], tile_min.y, tolerance) && tolerance_function(pb[1], tile_min.y, tolerance)) {
        edge = 'top';
    }
    else if (tolerance_function(pa[1], tile_max.y, tolerance) && tolerance_function(pb[1], tile_max.y, tolerance)) {
        edge = 'bottom';
    }
    return edge;
};

GLBuilders.setTileScale = function (scale)
{
    GLBuilders.tile_bounds = [
        Point(0, 0),
        Point(scale, -scale) // TODO: correct for flipped y-axis?
    ];
};

GLBuilders.valuesWithinTolerance = function (a, b, tolerance)
{
    tolerance = tolerance || 1;
    return (Math.abs(a - b) < tolerance);
};

// Build a zigzag line pattern for testing joins and caps
GLBuilders.buildZigzagLineTestPattern = function ()
{
    var min = Point(0, 0); // tile.min;
    var max = Point(4096, 4096); // tile.max;
    var g = {
        id: 123,
        geometry: {
            type: 'LineString',
            coordinates: [
                [min.x * 0.75 + max.x * 0.25, min.y * 0.75 + max.y * 0.25],
                [min.x * 0.75 + max.x * 0.25, min.y * 0.5 + max.y * 0.5],
                [min.x * 0.25 + max.x * 0.75, min.y * 0.75 + max.y * 0.25],
                [min.x * 0.25 + max.x * 0.75, min.y * 0.25 + max.y * 0.75],
                [min.x * 0.4 + max.x * 0.6, min.y * 0.5 + max.y * 0.5],
                [min.x * 0.5 + max.x * 0.5, min.y * 0.25 + max.y * 0.75],
                [min.x * 0.75 + max.x * 0.25, min.y * 0.25 + max.y * 0.75],
                [min.x * 0.75 + max.x * 0.25, min.y * 0.4 + max.y * 0.6]
            ]
        },
        properties: {
            kind: 'debug'
        }
    };
    // console.log(g.geometry.coordinates);
    return g;
};

if (module !== undefined) {
    module.exports = GLBuilders;
}

},{"../point.js":11,"../vector.js":14,"./gl.js":4}],6:[function(_dereq_,module,exports){
/*** Manage rendering for primitives ***/
var GL = _dereq_('./gl.js');

// Attribs are an array, in layout order, of: name, size, type, normalized
// ex: { name: 'position', size: 3, type: gl.FLOAT, normalized: false }
function GLGeometry (gl, gl_program, vertex_data, attribs, options)
{
    options = options || {};

    this.gl = gl;
    this.gl_program = gl_program;
    this.attribs = attribs;
    this.vertex_data = vertex_data; // Float32Array
    this.buffer = this.gl.createBuffer();
    this.draw_mode = options.draw_mode || this.gl.TRIANGLES;
    this.data_usage = options.data_usage || this.gl.STATIC_DRAW;

    // Calc vertex stride
    this.vertex_stride = 0;
    for (var a=0; a < this.attribs.length; a++) {
        var attrib = this.attribs[a];

        attrib.location = this.gl_program.attribute(attrib.name).location;
        attrib.byte_size = attrib.size;

        switch (attrib.type) {
            case this.gl.FLOAT:
            case this.gl.INT:
            case this.gl.UNSIGNED_INT:
                attrib.byte_size *= 4;
                break;
            case this.gl.SHORT:
            case this.gl.UNSIGNED_SHORT:
                attrib.byte_size *= 2;
                break;
        }

        attrib.offset = this.vertex_stride;
        this.vertex_stride += attrib.byte_size;
    }

    this.vertex_count = this.vertex_data.byteLength / this.vertex_stride;

    this.vao = GL.VertexArrayObject.create(function() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.setup();
    }.bind(this));

    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertex_data, this.data_usage);
}

GLGeometry.prototype.setup = function ()
{
    for (var a=0; a < this.attribs.length; a++) {
        var attrib = this.attribs[a];
        this.gl.enableVertexAttribArray(attrib.location);
        this.gl.vertexAttribPointer(attrib.location, attrib.size, attrib.type, attrib.normalized, this.vertex_stride, attrib.offset);
    }
};

GLGeometry.prototype.render = function ()
{
    this.gl.useProgram(this.gl_program.program);
    GL.VertexArrayObject.bind(this.vao);

    if (typeof this._render == 'function') {
        this._render();
    }

    // TODO: support element array mode
    this.gl.drawArrays(this.draw_mode, 0, this.vertex_count);
    GL.VertexArrayObject.bind(null);
};

GLGeometry.prototype.destroy = function ()
{
    console.log("GLGeometry.destroy: delete buffer of size " + this.vertex_data.byteLength);
    this.gl.deleteBuffer(this.buffer);
    delete this.vertex_data;
};

// Draws a set of triangles
GLTriangles.prototype = Object.create(GLGeometry.prototype);

function GLTriangles (gl, gl_program, vertex_data)
{
    GLGeometry.call(this, gl, gl_program, vertex_data, [
        { name: 'a_position', size: 3, type: gl.FLOAT, normalized: false },
        { name: 'a_normal', size: 3, type: gl.FLOAT, normalized: false },
        { name: 'a_color', size: 3, type: gl.FLOAT, normalized: false },
        { name: 'a_layer', size: 1, type: gl.FLOAT, normalized: false }
    ]);
    this.geometry_count = this.vertex_count / 3;
}

// Draws a set of points as quads, intended to be rendered as distance fields
GLPolyPoints.prototype = Object.create(GLGeometry.prototype);

function GLPolyPoints (gl, gl_program, vertex_data)
{
    GLGeometry.call(this, gl, gl_program, vertex_data, [
        { name: 'a_position', size: 3, type: gl.FLOAT, normalized: false },
        { name: 'a_texcoord', size: 2, type: gl.FLOAT, normalized: false },
        { name: 'a_color', size: 3, type: gl.FLOAT, normalized: false },
        { name: 'a_layer', size: 1, type: gl.FLOAT, normalized: false }
    ]);
    this.geometry_count = this.vertex_count / 3;
}

// Draws a set of lines
// Shares all characteristics with triangles except for draw mode
GLLines.prototype = Object.create(GLTriangles.prototype);

function GLLines (gl, gl_program, vertex_data, options)
{
    options = options || {};
    GLTriangles.call(this, gl, program, vertex_data);
    this.draw_mode = this.gl.LINES;
    this.line_width = options.line_width || 2;
    this.geometry_count = this.vertex_count / 2;
}

GLLines.prototype._render = function ()
{
    this.gl.lineWidth(this.line_width);
    if (typeof GLTriangles.prototype._render == 'function') {
        GLTriangles.prototype._render.call(this);
    }
};

if (module !== undefined) {
    module.exports = {
        GLGeometry: GLGeometry,
        GLTriangles: GLTriangles,
        GLPolyPoints: GLPolyPoints,
        GLLines: GLLines
    };
}

},{"./gl.js":4}],7:[function(_dereq_,module,exports){
var Point = _dereq_('../point.js');
var Geo = _dereq_('../geo.js');
var VectorRenderer = _dereq_('../vector_renderer.js');

var GL = _dereq_('./gl.js');
var GLBuilders = _dereq_('./gl_builders.js');
var GLGeometry = _dereq_('./gl_geom.js').GLGeometry;
var GLTriangles = _dereq_('./gl_geom.js').GLTriangles;
var GLPolyPoints = _dereq_('./gl_geom.js').GLPolyPoints;
var GLLines = _dereq_('./gl_geom.js').GLLines;

var mat4 = _dereq_('gl-matrix').mat4;
var vec3 = _dereq_('gl-matrix').vec3;

VectorRenderer.GLRenderer = GLRenderer;
GLRenderer.prototype = Object.create(VectorRenderer.prototype);
GLRenderer.debug = false;

GLRenderer.shader_sources = _dereq_('./gl_shaders.js');

function GLRenderer (tile_source, layers, styles, options)
{
    var options = options || {};

    VectorRenderer.call(this, 'GLRenderer', tile_source, layers, styles, options);

    GLBuilders.setTileScale(VectorRenderer.tile_scale);
    GL.Program.defines.TILE_SCALE = VectorRenderer.tile_scale + '.0';

    this.container = options.container;
    this.continuous_animation = false; // request redraw every frame
}

GLRenderer.prototype._init = function GLRendererInit ()
{
    this.container = this.container || document.body;
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = 0;
    this.canvas.style.left = 0;
    this.canvas.style.zIndex = -1;
    this.container.appendChild(this.canvas);

    this.gl = GL.getContext(this.canvas);

    var renderer = this;

    this.render_modes = {
        'polygons': {
            gl_program: new GL.Program(this.gl, GLRenderer.shader_sources['polygon_vertex'], GLRenderer.shader_sources['polygon_fragment']),
            makeGLGeometry: function (vertex_data) {
                return new GLTriangles(renderer.gl, this.gl_program, vertex_data);
            }
        },
        'polygons_noise': {
            gl_program: new GL.Program(this.gl, GLRenderer.shader_sources['polygon_vertex'], GLRenderer.shader_sources['polygon_fragment'], { defines: { 'EFFECT_NOISE_TEXTURE': true, 'EFFECT_NOISE_ANIMATABLE': true } }),
            makeGLGeometry: function (vertex_data) {
                return new GLTriangles(renderer.gl, this.gl_program, vertex_data);
            }
        },
        'points': {
            // TODO: replace relative shader paths with a better auto-pathing system
            // gl_program: new GL.Program.createProgramFromURLs(this.gl, VectorRenderer.library_base_url + '../shaders/point_vertex.glsl', VectorRenderer.library_base_url + '../shaders/point_fragment.glsl', { defines: { 'EFFECT_SCREEN_COLOR': true } }),
            gl_program: new GL.Program(this.gl, GLRenderer.shader_sources['point_vertex'], GLRenderer.shader_sources['point_fragment'], { defines: { 'EFFECT_SCREEN_COLOR': true } }),
            makeGLGeometry: function (vertex_data) {
                return new GLPolyPoints(renderer.gl, this.gl_program, vertex_data);
            }
        }
    };

    this.resizeMap(this.container.clientWidth, this.container.clientHeight);

    // this.zoom_step = 0.02; // for fractional zoom user adjustment
    this.start_time = +new Date();
    this.last_render_count = null;
    this.initInputHandlers();
};

// Determine a Z value that will stack features in a "painter's algorithm" style, first by layer, then by draw order within layer
// Features are assumed to be already sorted in desired draw order by the layer pre-processor
GLRenderer.calculateZ = function (layer, tile, layer_offset, feature_offset)
{
    // var layer_offset = layer_offset || 0;
    // var feature_offset = feature_offset || 0;
    var z = 0; // TODO: made this a no-op until revisiting where it should live - one-time calc here, in vertex layout/shader, etc.
    return z;
};

// Process geometry for tile - called by web worker
GLRenderer.addTile = function (tile, layers, styles)
{
    var layer, style, feature, z, mode;
    var vertex_data = {};

    // Join line test pattern
    // if (GLRenderer.debug) {
    //     tile.layers['roads'].features.push(GLRenderer.buildZigzagLineTestPattern());
    // }

    // Build raw geometry arrays
    tile.debug.features = 0;
    for (var ln=0; ln < layers.length; ln++) {
        layer = layers[ln];

        // Skip layers with no styles defined, or layers set to not be visible
        if (styles[layer.name] == null || styles[layer.name].visible == false) {
            continue;
        }

        if (tile.layers[layer.name] != null) {
            var num_features = tile.layers[layer.name].features.length;

            // Rendering reverse order aka top to bottom
            for (var f = num_features-1; f >= 0; f--) {
                feature = tile.layers[layer.name].features[f];
                style = VectorRenderer.parseStyleForFeature(feature, styles[layer.name], tile);

                // Skip feature?
                if (style == null) {
                    continue;
                }

                z = GLRenderer.calculateZ(layer, tile) + style.z;

                // First feature in this render mode?
                mode = style.render_mode;
                if (vertex_data[mode] == null) {
                    vertex_data[mode] = [];
                }

                // DEBUGGING line/tile intersections returned as points
                // #mapzen,40.74733011589617,-73.97535145282747,17
                // if (feature.id == 157964813 && feature.geometry.type == 'Point') {
                //     style.color = [1, 1, 0];
                //     style.size = Style.width.pixels(10, tile);
                // }

                var vertex_constants = [
                    style.color[0], style.color[1], style.color[2],
                    ln
                    // TODO: add material info, etc.
                ];

                if (style.outline.color) {
                    var outline_vertex_constants = [
                        style.outline.color[0], style.outline.color[1], style.outline.color[2],
                        ln - 0.5 // outlines sit between layers, underneath current layer but above the one below
                    ];
                }

                var points = null,
                    lines = null,
                    polygons = null;

                if (feature.geometry.type == 'Polygon') {
                    polygons = [feature.geometry.coordinates];
                }
                else if (feature.geometry.type == 'MultiPolygon') {
                    polygons = feature.geometry.coordinates;
                }
                else if (feature.geometry.type == 'LineString') {
                    lines = [feature.geometry.coordinates];
                }
                else if (feature.geometry.type == 'MultiLineString') {
                    lines = feature.geometry.coordinates;
                }
                else if (feature.geometry.type == 'Point') {
                    points = [feature.geometry.coordinates];
                }
                else if (feature.geometry.type == 'MultiPoint') {
                    points = feature.geometry.coordinates;
                }

                if (polygons != null) {
                    // Extruded polygons (e.g. 3D buildings)
                    if (style.extrude && style.height) {
                        GLBuilders.buildExtrudedPolygons(polygons, z, style.height, style.min_height, vertex_data[mode], { vertex_constants: vertex_constants });
                    }
                    // Regular polygons
                    else {
                        GLBuilders.buildPolygons(polygons, z, vertex_data[mode], { vertex_constants: vertex_constants });

                        // var polygon_vertex_constants = [z, 0, 0, 1].concat(vertex_constants); // upwards-facing normal
                        // GLBuilders.buildPolygons2(
                        //     polygons,
                        //     function (vertices) {
                        //         GL.addVertices(vertices.positions, vertex_data[mode], polygon_vertex_constants);
                        //     }
                        // );
                    }

                    // Polygon outlines
                    if (style.outline.color && style.outline.width) {
                        for (var mpc=0; mpc < polygons.length; mpc++) {
                            GLBuilders.buildPolylines(polygons[mpc], GLRenderer.calculateZ(layer, tile, -0.5), style.outline.width, vertex_data[mode], { closed_polygon: true, remove_tile_edges: true, vertex_constants: outline_vertex_constants });
                        }
                    }
                }

                if (lines != null) {
                    GLBuilders.buildPolylines(lines, z, style.width, vertex_data[mode], { vertex_constants: vertex_constants });

                    // Line outlines
                    if (style.outline.color && style.outline.width) {
                        GLBuilders.buildPolylines(lines, GLRenderer.calculateZ(layer, tile, -0.5), style.width + 2 * style.outline.width, vertex_data[mode], { vertex_constants: outline_vertex_constants });
                    }
                }

                if (points != null) {
                    // console.log(JSON.stringify(feature));
                    // NOTE: adding to z to experiment with "floating" POIs
                    var point_vertex_constants = [z + 1, 0, 0, 1].concat(vertex_constants); // upwards-facing normal
                    GLBuilders.buildQuads(
                        points, style.size * 2, style.size * 2,
                        function (vertices) {
                            var vs = vertices.positions;

                            // Alternate vertex layout for 'points' shader
                            if (mode == 'points') {
                                point_vertex_constants = vertex_constants;

                                for (var v in vertices.positions) {
                                    vs[v] = vertices.positions[v].concat(z+ 1, vertices.texcoords[v]);
                                }
                            }

                            // GL.addVertices(vertices.positions, vertex_data[mode], point_vertex_constants);
                            GL.addVertices(vs, vertex_data[mode], point_vertex_constants);
                        },
                        { texcoords: (mode == 'points') }
                    );
                }

                tile.debug.features++;
            }
        }
    }

    tile.vertex_data = {};
    for (var s in vertex_data) {
        tile.vertex_data[s] = new Float32Array(vertex_data[s]);
    }

    return tile;
};

// Called on main thread when a web worker completes processing for a single tile
GLRenderer.prototype._tileWorkerCompleted = function (tile)
{
    var vertex_data = tile.vertex_data;

    // Cleanup existing GL geometry objects
    this.freeTileResources(tile);
    tile.gl_geometry = {};

    // Create GL geometry objects
    for (var s in vertex_data) {
        tile.gl_geometry[s] = this.render_modes[s].makeGLGeometry(vertex_data[s]);
    }

    tile.debug.geometries = 0;
    tile.debug.buffer_size = 0;
    for (var p in tile.gl_geometry) {
        tile.debug.geometries += tile.gl_geometry[p].geometry_count;
        tile.debug.buffer_size += tile.gl_geometry[p].vertex_data.byteLength;
    }

    tile.debug.geom_ratio = (tile.debug.geometries / tile.debug.features).toFixed(1);

    // Selection - experimental/future
    // var gl_renderer = this;
    // var pixel = new Uint8Array(4);
    // tileDiv.onmousemove = function (event) {
    //     // console.log(event.offsetX + ', ' + event.offsetY + ' | ' + parseInt(tileDiv.style.left) + ', ' + parseInt
    //     var p = Point(
    //         event.offsetX + parseInt(tileDiv.style.left),
    //         event.offsetY + parseInt(tileDiv.style.top)
    //     );
    //     gl_renderer.gl.readPixels(p.x, p.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    //     console.log(p.x + ', ' + p.y + ': (' + pixel[0] + ', ' + pixel[1] + ', ' + pixel[2] + ', ' + pixel[3] + ')')
    // };

    delete tile.vertex_data; // TODO: might want to preserve this for rebuilding geometries when styles/etc. change?
};

GLRenderer.prototype.removeTile = function GLRendererRemoveTile (key)
{
    if (this.map_zooming == true) {
        return; // short circuit tile removal, GL renderer will sweep out tiles by zoom level when zoom ends
    }

    this.freeTileResources(this.tiles[key]);
    VectorRenderer.prototype.removeTile.apply(this, arguments);
};

// Free any GL / owned resources
GLRenderer.prototype.freeTileResources = function (tile)
{
    if (tile != null && tile.gl_geometry != null) {
        for (var p in tile.gl_geometry) {
            tile.gl_geometry[p].destroy();
        }
        tile.gl_geometry = null;
    }
};

GLRenderer.prototype.preserve_tiles_within_zoom = 2;
GLRenderer.prototype.setZoom = function (zoom)
{
    // Schedule GL tiles for removal on zoom
    console.log("renderer.map_last_zoom: " + this.map_last_zoom);

    this.map_zooming = false;
    this.zoom = zoom;
    var below = this.zoom;
    var above = this.zoom;
    if (Math.abs(this.zoom - this.map_last_zoom) <= this.preserve_tiles_within_zoom) {
        if (this.zoom > this.map_last_zoom) {
            below = this.zoom - this.preserve_tiles_within_zoom;
        }
        else {
            above = this.zoom + this.preserve_tiles_within_zoom;
        }
    }
    this.removeTilesOutsideZoomRange(below, above);
    this.map_last_zoom = this.zoom;
    this.dirty = true; // calling because this is a full override of the parent class
};

GLRenderer.prototype.removeTilesOutsideZoomRange = function (below, above)
{
    below = Math.min(below, this.tile_source.max_zoom || below);
    above = Math.min(above, this.tile_source.max_zoom || above);

    console.log("removeTilesOutsideZoomRange [" + below + ", " + above + "])");
    var remove_tiles = [];
    for (var t in this.tiles) {
        var tile = this.tiles[t];
        if (tile.coords.z < below || tile.coords.z > above) {
            remove_tiles.push(t);
        }
    }
    for (var r=0; r < remove_tiles.length; r++) {
        var key = remove_tiles[r];
        console.log("removed " + key + " (outside range [" + below + ", " + above + "])");
        this.removeTile(key);
    }
};

// Overrides base class method (a no op)
GLRenderer.prototype.resizeMap = function (width, height)
{
    VectorRenderer.prototype.resizeMap.apply(this, arguments);

    this.css_size = { width: width, height: height };
    this.device_size = { width: Math.round(this.css_size.width * this.device_pixel_ratio), height: Math.round(this.css_size.height * this.device_pixel_ratio) };

    this.canvas.style.width = this.css_size.width + 'px';
    this.canvas.style.height = this.css_size.height + 'px';
    this.canvas.width = this.device_size.width;
    this.canvas.height = this.device_size.height;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
};

GLRenderer.prototype._render = function GLRendererRender ()
{
    var gl = this.gl;

    this.input();

    // Reset frame state
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    // Render tiles grouped by renderg mode (GL program)
    var render_count = 0;
    for (var mode in this.render_modes) {
        var gl_program = this.render_modes[mode].gl_program;

        gl.useProgram(gl_program.program);

        // TODO: set these once per program, don't set when they haven't changed
        gl_program.uniform('2f', 'u_resolution', this.device_size.width, this.device_size.height);
        gl_program.uniform('2f', 'u_aspect', this.device_size.width / this.device_size.height, 1.0);
        gl_program.uniform('1f', 'u_time', ((+new Date()) - this.start_time) / 1000);

        var center = Geo.latLngToMeters(Point(this.center.lng, this.center.lat));
        // gl_program.uniform('2f', 'u_map_center', center.x, center.y);
        gl_program.uniform('1f', 'u_map_zoom', this.zoom); // Math.floor(this.zoom) + (Math.log((this.zoom % 1) + 1) / Math.LN2 // scale fractional zoom by log
        gl_program.uniform('1f', 'u_num_layers', this.layers.length);

        var meters_per_pixel = Geo.min_zoom_meters_per_pixel / Math.pow(2, this.zoom);
        gl_program.uniform('1f', 'u_meters_per_pixel', meters_per_pixel);

        var meter_zoom = Point(this.css_size.width / 2 * meters_per_pixel, this.css_size.height / 2 * meters_per_pixel);
        // gl_program.uniform('2f', 'u_meter_zoom', meter_zoom.x, meter_zoom.y);

        // Matrix transforms
        var tile_view_mat = mat4.create();
        var tile_world_mat = mat4.create();
        var meter_view_mat = mat4.create();

        // Convert mercator meters to screen space
        mat4.scale(meter_view_mat, meter_view_mat, vec3.fromValues(1 / meter_zoom.x, 1 / meter_zoom.y, 1 / meter_zoom.y));
        gl_program.uniform('Matrix4fv', 'u_meter_view', gl.FALSE, meter_view_mat);

        // TODO: make a list of renderable tiles once per frame, outside this loop
        // Render tile GL geometries
        var capped_zoom = Math.min(~~this.zoom, this.tile_source.max_zoom || ~~this.zoom);
        for (var t in this.tiles) {
            var tile = this.tiles[t];
            if (tile.loaded == true &&
                tile.visible == true &&
                Math.min(tile.coords.z, this.tile_source.max_zoom || tile.coords.z) == capped_zoom) {

                if (tile.gl_geometry[mode] != null) {
                    // gl_program.uniform('2f', 'u_tile_min', tile.min.x, tile.min.y);
                    // gl_program.uniform('2f', 'u_tile_max', tile.max.x, tile.max.y);

                    // Tile view matrix - transform tile space into view space (meters, relative to camera)
                    mat4.identity(tile_view_mat);
                    mat4.translate(tile_view_mat, tile_view_mat, vec3.fromValues(tile.min.x - center.x, tile.min.y - center.y, 0)); // adjust for tile origin & map center
                    mat4.scale(tile_view_mat, tile_view_mat, vec3.fromValues((tile.max.x - tile.min.x) / VectorRenderer.tile_scale, -1 * (tile.max.y - tile.min.y) / VectorRenderer.tile_scale, 1)); // scale tile local coords to meters
                    gl_program.uniform('Matrix4fv', 'u_tile_view', gl.FALSE, tile_view_mat);

                    // Tile world matrix - transform tile space into world space (meters, absolute mercator position)
                    mat4.identity(tile_world_mat);
                    mat4.translate(tile_world_mat, tile_world_mat, vec3.fromValues(tile.min.x, tile.min.y, 0));
                    mat4.scale(tile_world_mat, tile_world_mat, vec3.fromValues((tile.max.x - tile.min.x) / VectorRenderer.tile_scale, -1 * (tile.max.y - tile.min.y) / VectorRenderer.tile_scale, 1)); // scale tile local coords to meters
                    gl_program.uniform('Matrix4fv', 'u_tile_world', gl.FALSE, tile_world_mat);


                    tile.gl_geometry[mode].render();
                    render_count += tile.gl_geometry[mode].geometry_count;
                }
            }
        }
    }

    if (render_count != this.last_render_count) {
        console.log("rendered " + render_count + " primitives");
    }
    this.last_render_count = render_count;

    if (this.continuous_animation == true) {
        this.dirty = true;
    }

    return true;
};

// Sum of a debug property across tiles
GLRenderer.prototype.getDebugSum = function (prop, filter)
{
    var sum = 0;
    for (var t in this.tiles) {
        if (this.tiles[t].debug[prop] != null && (typeof filter != 'function' || filter(this.tiles[t]) == true)) {
            sum += this.tiles[t].debug[prop];
        }
    }
    return sum;
};

// Average of a debug property across tiles
GLRenderer.prototype.getDebugAverage = function (prop, filter)
{
    return this.getDebugSum(prop, filter) / Object.keys(this.tiles).length;
};

// User input
// TODO: restore fractional zoom support once leaflet animation refactor pull request is merged

GLRenderer.prototype.initInputHandlers = function GLRendererInitInputHandlers ()
{
    var gl_renderer = this;
    gl_renderer.key = null;

    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 37) {
            gl_renderer.key = 'left';
        }
        else if (event.keyCode == 39) {
            gl_renderer.key = 'right';
        }
        else if (event.keyCode == 38) {
            gl_renderer.key = 'up';
        }
        else if (event.keyCode == 40) {
            gl_renderer.key = 'down';
        }
        else if (event.keyCode == 83) { // s
            console.log("reloading shaders");
            for (var mode in this.render_modes) {
                this.render_modes[mode].gl_program.compile();
            }
            gl_renderer.dirty = true;
        }
    });

    document.addEventListener('keyup', function (event) {
        gl_renderer.key = null;
    });
};

GLRenderer.prototype.input = function GLRendererInput ()
{
    // // Fractional zoom scaling
    // if (this.key == 'up') {
    //     this.setZoom(this.zoom + this.zoom_step);
    // }
    // else if (this.key == 'down') {
    //     this.setZoom(this.zoom - this.zoom_step);
    // }
};

if (module !== undefined) {
    module.exports = GLRenderer;
}

},{"../geo.js":3,"../point.js":11,"../vector_renderer.js":15,"./gl.js":4,"./gl_builders.js":5,"./gl_geom.js":6,"./gl_shaders.js":8,"gl-matrix":1}],8:[function(_dereq_,module,exports){
// Generated from GLSL files, don't edit!
var shader_sources = {};

shader_sources['point_fragment'] =
"\n" +
"#define GLSLIFY 1\n" +
"\n" +
"uniform vec2 u_resolution;\n" +
"varying vec3 v_color;\n" +
"varying vec2 v_texcoord;\n" +
"void main(void) {\n" +
"  vec3 color = v_color;\n" +
"  float len = length(v_texcoord);\n" +
"  if(len > 1.) {\n" +
"    discard;\n" +
"  }\n" +
"  color *= (1. - smoothstep(.25, 1., len)) + 0.5;\n" +
"  #if defined(EFFECT_SCREEN_COLOR)\n" +
"  color += vec3(gl_FragCoord.x / u_resolution.x, 0.0, gl_FragCoord.y / u_resolution.y);\n" +
"  #endif\n" +
"  gl_FragColor = vec4(color, 1.);\n" +
"}\n" +
"";

shader_sources['point_vertex'] =
"\n" +
"#define GLSLIFY 1\n" +
"\n" +
"uniform mat4 u_tile_view;\n" +
"uniform mat4 u_meter_view;\n" +
"uniform float u_num_layers;\n" +
"attribute vec3 a_position;\n" +
"attribute vec2 a_texcoord;\n" +
"attribute vec3 a_color;\n" +
"attribute float a_layer;\n" +
"varying vec3 v_color;\n" +
"varying vec2 v_texcoord;\n" +
"float a_x_calculateZ(float z, float layer, const float num_layers, const float z_layer_scale) {\n" +
"  float z_layer_range = (num_layers + 1.) * z_layer_scale;\n" +
"  float z_layer = (layer + 1.) * z_layer_scale;\n" +
"  z = z_layer + clamp(z, 0., z_layer_scale);\n" +
"  z = (z_layer_range - z) / z_layer_range;\n" +
"  return z;\n" +
"}\n" +
"void main() {\n" +
"  vec4 position = u_meter_view * u_tile_view * vec4(a_position, 1.);\n" +
"  v_color = a_color;\n" +
"  v_texcoord = a_texcoord;\n" +
"  position.z = a_x_calculateZ(position.z, a_layer, u_num_layers, 256.);\n" +
"  gl_Position = position;\n" +
"}\n" +
"";

shader_sources['polygon_fragment'] =
"\n" +
"#define GLSLIFY 1\n" +
"\n" +
"uniform vec2 u_resolution;\n" +
"uniform vec2 u_aspect;\n" +
"uniform mat4 u_meter_view;\n" +
"uniform float u_meters_per_pixel;\n" +
"uniform float u_time;\n" +
"varying vec3 v_color;\n" +
"#if !defined(LIGHTING_VERTEX)\n" +
"\n" +
"varying vec4 v_position;\n" +
"varying vec3 v_normal;\n" +
"#endif\n" +
"\n" +
"#if defined(EFFECT_NOISE_TEXTURE)\n" +
"\n" +
"varying vec4 v_position_world;\n" +
"vec3 a_x_mod289(vec3 x) {\n" +
"  return x - floor(x * (1.0 / 289.0)) * 289.0;\n" +
"}\n" +
"vec4 a_x_mod289(vec4 x) {\n" +
"  return x - floor(x * (1.0 / 289.0)) * 289.0;\n" +
"}\n" +
"vec4 a_x_permute(vec4 x) {\n" +
"  return a_x_mod289(((x * 34.0) + 1.0) * x);\n" +
"}\n" +
"vec4 a_x_taylorInvSqrt(vec4 r) {\n" +
"  return 1.79284291400159 - 0.85373472095314 * r;\n" +
"}\n" +
"vec3 a_x_fade(vec3 t) {\n" +
"  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\n" +
"}\n" +
"float a_x_cnoise(vec3 P) {\n" +
"  vec3 Pi0 = floor(P);\n" +
"  vec3 Pi1 = Pi0 + vec3(1.0);\n" +
"  Pi0 = a_x_mod289(Pi0);\n" +
"  Pi1 = a_x_mod289(Pi1);\n" +
"  vec3 Pf0 = fract(P);\n" +
"  vec3 Pf1 = Pf0 - vec3(1.0);\n" +
"  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n" +
"  vec4 iy = vec4(Pi0.yy, Pi1.yy);\n" +
"  vec4 iz0 = Pi0.zzzz;\n" +
"  vec4 iz1 = Pi1.zzzz;\n" +
"  vec4 ixy = a_x_permute(a_x_permute(ix) + iy);\n" +
"  vec4 ixy0 = a_x_permute(ixy + iz0);\n" +
"  vec4 ixy1 = a_x_permute(ixy + iz1);\n" +
"  vec4 gx0 = ixy0 * (1.0 / 7.0);\n" +
"  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n" +
"  gx0 = fract(gx0);\n" +
"  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n" +
"  vec4 sz0 = step(gz0, vec4(0.0));\n" +
"  gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n" +
"  gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n" +
"  vec4 gx1 = ixy1 * (1.0 / 7.0);\n" +
"  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n" +
"  gx1 = fract(gx1);\n" +
"  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n" +
"  vec4 sz1 = step(gz1, vec4(0.0));\n" +
"  gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n" +
"  gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n" +
"  vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);\n" +
"  vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);\n" +
"  vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);\n" +
"  vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);\n" +
"  vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);\n" +
"  vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);\n" +
"  vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);\n" +
"  vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);\n" +
"  vec4 norm0 = a_x_taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n" +
"  g000 *= norm0.x;\n" +
"  g010 *= norm0.y;\n" +
"  g100 *= norm0.z;\n" +
"  g110 *= norm0.w;\n" +
"  vec4 norm1 = a_x_taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n" +
"  g001 *= norm1.x;\n" +
"  g011 *= norm1.y;\n" +
"  g101 *= norm1.z;\n" +
"  g111 *= norm1.w;\n" +
"  float n000 = dot(g000, Pf0);\n" +
"  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n" +
"  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n" +
"  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n" +
"  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n" +
"  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n" +
"  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n" +
"  float n111 = dot(g111, Pf1);\n" +
"  vec3 fade_xyz = a_x_fade(Pf0);\n" +
"  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n" +
"  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n" +
"  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n" +
"  return 2.2 * n_xyz;\n" +
"}\n" +
"#endif\n" +
"\n" +
"const float light_ambient = 0.5;\n" +
"vec3 c_x_pointLight(vec4 position, vec3 normal, vec3 color, vec4 light_pos, float light_ambient, const bool backlight) {\n" +
"  vec3 light_dir = normalize(position.xyz - light_pos.xyz);\n" +
"  color *= abs(max(float(backlight) * -1., dot(normal, light_dir * -1.0))) + light_ambient;\n" +
"  return color;\n" +
"}\n" +
"vec3 d_x_directionalLight(vec3 normal, vec3 color, vec3 light_dir, float light_ambient) {\n" +
"  light_dir = normalize(light_dir);\n" +
"  color *= dot(normal, light_dir * -1.0) + light_ambient;\n" +
"  return color;\n" +
"}\n" +
"vec3 b_x_lighting(vec4 position, vec3 normal, vec3 color, vec4 light_pos, vec4 night_light_pos, vec3 light_dir, float light_ambient) {\n" +
"  \n" +
"  #if defined(LIGHTING_POINT)\n" +
"  color = c_x_pointLight(position, normal, color, light_pos, light_ambient, true);\n" +
"  #elif defined(LIGHTING_NIGHT)\n" +
"  color = c_x_pointLight(position, normal, color, night_light_pos, 0., false);\n" +
"  #elif defined(LIGHTING_DIRECTION)\n" +
"  color = d_x_directionalLight(normal, color, light_dir, light_ambient);\n" +
"  #else\n" +
"  color = color;\n" +
"  #endif\n" +
"  return color;\n" +
"}\n" +
"void main(void) {\n" +
"  vec3 color;\n" +
"  #if !defined(LIGHTING_VERTEX) // default to per-pixel lighting\n" +
"  color = b_x_lighting(v_position, v_normal, v_color, vec4(0., 0., 150. * u_meters_per_pixel, 1.), vec4(0., 0., 50. * u_meters_per_pixel, 1.), vec3(0.2, 0.7, -0.5), light_ambient);\n" +
"  #else\n" +
"  color = v_color;\n" +
"  #endif\n" +
"  \n" +
"  #if defined(EFFECT_SPOTLIGHT)\n" +
"  vec2 position = gl_FragCoord.xy / u_resolution.xy;\n" +
"  position = position * 2.0 - 1.0;\n" +
"  position *= u_aspect;\n" +
"  color *= max(1.0 - distance(position, vec2(0.0, 0.0)), 0.2);\n" +
"  #endif\n" +
"  \n" +
"  #if defined(EFFECT_COLOR_BLEED)\n" +
"  color += vec3(gl_FragCoord.x / u_resolution.x, 0.0, gl_FragCoord.y / u_resolution.y);\n" +
"  color.r += sin(u_time / 3.0);\n" +
"  #endif\n" +
"  \n" +
"  #if defined (EFFECT_NOISE_TEXTURE)\n" +
"  \n" +
"  #if defined(EFFECT_NOISE_ANIMATABLE) && defined(EFFECT_NOISE_ANIMATED)\n" +
"  color *= (abs(a_x_cnoise((v_position_world.xyz + vec3(u_time * 5., u_time * 7.5, u_time * 10.)) / 10.0)) / 4.0) + 0.75;\n" +
"  #endif\n" +
"  \n" +
"  #ifndef EFFECT_NOISE_ANIMATABLE\n" +
"  color *= (abs(a_x_cnoise(v_position_world.xyz / 10.0)) / 4.0) + 0.75;\n" +
"  #endif\n" +
"  \n" +
"  #endif\n" +
"  gl_FragColor = vec4(color, 1.0);\n" +
"}\n" +
"";

shader_sources['polygon_vertex'] =
"\n" +
"#define GLSLIFY 1\n" +
"\n" +
"uniform vec2 u_resolution;\n" +
"uniform vec2 u_aspect;\n" +
"uniform float u_time;\n" +
"uniform mat4 u_tile_world;\n" +
"uniform mat4 u_tile_view;\n" +
"uniform mat4 u_meter_view;\n" +
"uniform float u_meters_per_pixel;\n" +
"uniform float u_num_layers;\n" +
"attribute vec3 a_position;\n" +
"attribute vec3 a_normal;\n" +
"attribute vec3 a_color;\n" +
"attribute float a_layer;\n" +
"varying vec3 v_color;\n" +
"#if !defined(LIGHTING_VERTEX)\n" +
"\n" +
"varying vec4 v_position;\n" +
"varying vec3 v_normal;\n" +
"#endif\n" +
"\n" +
"#if defined(EFFECT_NOISE_TEXTURE)\n" +
"\n" +
"varying vec4 v_position_world;\n" +
"#endif\n" +
"\n" +
"const float light_ambient = 0.5;\n" +
"vec4 a_x_perspective(vec4 position, const vec2 perspective_offset, const vec2 perspective_factor) {\n" +
"  position.xy += position.z * perspective_factor * (position.xy - perspective_offset);\n" +
"  return position;\n" +
"}\n" +
"vec4 b_x_isometric(vec4 position, const vec2 axis, const float multiplier) {\n" +
"  position.xy += position.z * axis * multiplier / u_aspect;\n" +
"  return position;\n" +
"}\n" +
"vec4 c_x_popup(vec4 position, const vec2 center, const float radius) {\n" +
"  if(position.z > 0.) {\n" +
"    float cd = distance(position.xy, center);\n" +
"    float popup_fade_inner = radius * 2. / 3.;\n" +
"    float popup_fade_outer = radius;\n" +
"    if(cd > popup_fade_inner) {\n" +
"      position.z *= 1.0 - smoothstep(popup_fade_inner, popup_fade_outer, cd);\n" +
"    }\n" +
"  }\n" +
"  return position;\n" +
"}\n" +
"float d_x_calculateZ(float z, float layer, const float num_layers, const float z_layer_scale) {\n" +
"  float z_layer_range = (num_layers + 1.) * z_layer_scale;\n" +
"  float z_layer = (layer + 1.) * z_layer_scale;\n" +
"  z = z_layer + clamp(z, 0., z_layer_scale);\n" +
"  z = (z_layer_range - z) / z_layer_range;\n" +
"  return z;\n" +
"}\n" +
"vec3 f_x_pointLight(vec4 position, vec3 normal, vec3 color, vec4 light_pos, float light_ambient, const bool backlight) {\n" +
"  vec3 light_dir = normalize(position.xyz - light_pos.xyz);\n" +
"  color *= abs(max(float(backlight) * -1., dot(normal, light_dir * -1.0))) + light_ambient;\n" +
"  return color;\n" +
"}\n" +
"vec3 g_x_directionalLight(vec3 normal, vec3 color, vec3 light_dir, float light_ambient) {\n" +
"  light_dir = normalize(light_dir);\n" +
"  color *= dot(normal, light_dir * -1.0) + light_ambient;\n" +
"  return color;\n" +
"}\n" +
"vec3 e_x_lighting(vec4 position, vec3 normal, vec3 color, vec4 light_pos, vec4 night_light_pos, vec3 light_dir, float light_ambient) {\n" +
"  \n" +
"  #if defined(LIGHTING_POINT)\n" +
"  color = f_x_pointLight(position, normal, color, light_pos, light_ambient, true);\n" +
"  #elif defined(LIGHTING_NIGHT)\n" +
"  color = f_x_pointLight(position, normal, color, night_light_pos, 0., false);\n" +
"  #elif defined(LIGHTING_DIRECTION)\n" +
"  color = g_x_directionalLight(normal, color, light_dir, light_ambient);\n" +
"  #else\n" +
"  color = color;\n" +
"  #endif\n" +
"  return color;\n" +
"}\n" +
"void main() {\n" +
"  vec4 position = u_tile_view * vec4(a_position, 1.);\n" +
"  vec4 position_world = u_tile_world * vec4(a_position, 1.);\n" +
"  if(position_world.z > 0.) {\n" +
"    \n" +
"    #if defined(ANIMATION_ELEVATOR)\n" +
"    position.z *= max((sin(position_world.z + u_time) + 1.0) / 2.0, 0.05);\n" +
"    #elif defined(ANIMATION_WAVE)\n" +
"    position.z *= max((sin(position_world.x / 100.0 + u_time) + 1.0) / 2.0, 0.05);\n" +
"    #endif\n" +
"    \n" +
"  }\n" +
"  #if defined(PROJECTION_POPUP)\n" +
"  position.z *= 1.1;\n" +
"  position = c_x_popup(position, vec2(0., 0.), 225. * u_meters_per_pixel);\n" +
"  #endif\n" +
"  \n" +
"  #if defined(EFFECT_NOISE_TEXTURE)\n" +
"  v_position_world = position_world;\n" +
"  #endif\n" +
"  \n" +
"  #if defined(LIGHTING_VERTEX)\n" +
"  v_color = e_x_lighting(position, a_normal, a_color, vec4(0., 0., 150. * u_meters_per_pixel, 1.), vec4(0., 0., 50. * u_meters_per_pixel, 1.), vec3(0.2, 0.7, -0.5), light_ambient);\n" +
"  #else\n" +
"  v_position = position;\n" +
"  v_normal = a_normal;\n" +
"  v_color = a_color;\n" +
"  #endif\n" +
"  position = u_meter_view * position;\n" +
"  #if defined(PROJECTION_PERSPECTIVE)\n" +
"  position = a_x_perspective(position, vec2(-0.25, -0.25), vec2(0.6, 0.6));\n" +
"  #elif defined(PROJECTION_ISOMETRIC) || defined(PROJECTION_POPUP)\n" +
"  position = b_x_isometric(position, vec2(0., 1.), 1.);\n" +
"  #endif\n" +
"  position.z = d_x_calculateZ(position.z, a_layer, u_num_layers, 4096.);\n" +
"  gl_Position = position;\n" +
"}\n" +
"";

if (module.exports !== undefined) { module.exports = shader_sources; }


},{}],9:[function(_dereq_,module,exports){
var VectorRenderer = _dereq_('./vector_renderer.js');

var LeafletLayer = L.GridLayer.extend({

    initialize: function (options) {
        L.setOptions(this, options);
        this.options.vectorRenderer = this.options.vectorRenderer || 'GLRenderer';
        this.renderer = VectorRenderer.create(this.options.vectorRenderer, this.options.vectorTileSource, this.options.vectorLayers, this.options.vectorStyles, { num_workers: this.options.numWorkers });
        this.renderer.debug = this.options.debug;
        this.renderer.continuous_animation = false; // set to true for animatinos, etc. (eventually will be automated)
    },

    // Finish initializing renderer and setup events when layer is added to map
    onAdd: function (map) {
        var layer = this;

        layer.on('tileunload', function (event) {
            var tile = event.tile;
            var key = tile.getAttribute('data-tile-key');
            layer.renderer.removeTile(key);
        });

        layer._map.on('resize', function () {
            var size = layer._map.getSize();
            layer.renderer.resizeMap(size.x, size.y);
            layer.updateBounds();
        });

        layer._map.on('move', function () {
            var center = layer._map.getCenter();
            layer.renderer.setCenter(center.lng, center.lat);
            layer.updateBounds();
        });

        layer._map.on('zoomstart', function () {
            console.log("map.zoomstart " + layer._map.getZoom());
            layer.renderer.startZoom();
        });

        layer._map.on('zoomend', function () {
            console.log("map.zoomend " + layer._map.getZoom());
            layer.renderer.setZoom(layer._map.getZoom());
        });

        // Canvas element will be inserted after map container (leaflet transforms shouldn't be applied to the GL canvas)
        // TODO: find a better way to deal with this? right now GL map only renders correctly as the bottom layer
        layer.renderer.container = layer._map.getContainer();

        var center = layer._map.getCenter();
        layer.renderer.setCenter(center.lng, center.lat);
        layer.renderer.setZoom(layer._map.getZoom());
        layer.updateBounds();

        L.GridLayer.prototype.onAdd.apply(this, arguments);
        layer.renderer.init();
    },

    onRemove: function (map) {
        L.GridLayer.prototype.onRemove.apply(this, arguments);
        // TODO: remove event handlers, destroy map
    },

    createTile: function (coords, done) {
        var div = document.createElement('div');
        this.renderer.loadTile(coords, div, done);
        return div;
    },

    updateBounds: function () {
        var layer = this;
        var bounds = layer._map.getBounds();
        layer.renderer.setBounds(bounds.getSouthWest(), bounds.getNorthEast());
    },

    render: function () {
        this.renderer.render();
    }

});

var leafletLayer = function (options) {
    return new LeafletLayer(options);
};

if (module !== undefined) {
    module.exports = {
        LeafletLayer: LeafletLayer,
        leafletLayer: leafletLayer
    };
}

},{"./vector_renderer.js":15}],10:[function(_dereq_,module,exports){
// Modules and dependencies to expose in the public Tangram module

// The leaflet layer plugin is currently the primary means of using the library
var Leaflet = _dereq_('./leaflet_layer.js');

// Renderer modules need to be explicitly included since they are not otherwise referenced
_dereq_('./gl/gl_renderer.js');
_dereq_('./canvas/canvas_renderer.js');

// GL functions included for easier debugging / direct access to setting global defines, reloading programs, etc.
var GL = _dereq_('./gl/gl.js');

if (module !== undefined) {
    module.exports = {
        LeafletLayer: Leaflet.LeafletLayer,
        leafletLayer: Leaflet.leafletLayer,
        GL: GL
    };
}

},{"./canvas/canvas_renderer.js":2,"./gl/gl.js":4,"./gl/gl_renderer.js":7,"./leaflet_layer.js":9}],11:[function(_dereq_,module,exports){
// Point
function Point (x, y)
{
    return { x: x, y: y };
}

Point.copy = function (p)
{
    if (p == null) {
        return null;
    }
    return { x: p.x, y: p.y };
};

if (module !== undefined) {
    module.exports = Point;
}

},{}],12:[function(_dereq_,module,exports){
/*** Style helpers ***/
var Geo = _dereq_('./geo.js');

var Style = {};

Style.color = {
    pseudoRandomGrayscale: function (f) { var c = Math.max((parseInt(f.id, 16) % 100) / 100, 0.4); return [0.7 * c, 0.7 * c, 0.7 * c]; }, // pseudo-random grayscale by geometry id
    pseudoRandomColor: function (f) { return [0.7 * (parseInt(f.id, 16) / 100 % 1), 0.7 * (parseInt(f.id, 16) / 10000 % 1), 0.7 * (parseInt(f.id, 16) / 1000000 % 1)]; }, // pseudo-random color by geometry id
    randomColor: function (f) { return [0.7 * Math.random(), 0.7 * Math.random(), 0.7 * Math.random()]; } // random color
};

// Returns a function (that can be used as a dynamic style) that converts pixels to meters for the current zoom level.
// The provided pixel value ('p') can itself be a function, in which case it is wrapped by this one.
Style.pixels = function (p, z) {
    var f;
    eval('f = function(f, t, h) { return ' + (typeof p == 'function' ? '(' + (p.toString() + '(f, t, h))') : p) + ' * h.Geo.meters_per_pixel[h.zoom]; }');
    return f;
};

if (module !== undefined) {
    module.exports = Style;
}

},{"./geo.js":3}],13:[function(_dereq_,module,exports){
// Miscellaneous utilities

// Stringify an object into JSON, but convert functions to strings
function serializeWithFunctions (obj)
{
    var serialized = JSON.stringify(obj, function(k, v) {
        // Convert functions to strings
        if (typeof v == 'function') {
            return v.toString();
        }
        return v;
    });

    return serialized;
};

// Parse a JSON string, but convert function-like strings back into functions
function deserializeWithFunctions (serialized) {
    var obj = JSON.parse(serialized);
    obj = stringsToFunctions(obj);

    return obj;
};

// Recursively parse an object, attempting to convert string properties that look like functions back into functions
function stringsToFunctions (obj) {
    for (var p in obj) {
        var val = obj[p];

        // Loop through object properties
        if (typeof val == 'object') {
            obj[p] = stringsToFunctions(val);
        }
        // Convert strings back into functions
        else if (typeof val == 'string' && val.match(/^function.*\(.*\)/) != null) {
            var f;
            try {
                eval('f = ' + val);
                obj[p] = f;
            }
            catch (e) {
                // fall-back to original value if parsing failed
                obj[p] = val;
            }
        }
    }

    return obj;
};

if (module !== undefined) {
    module.exports = {
        serializeWithFunctions: serializeWithFunctions,
        deserializeWithFunctions: deserializeWithFunctions
    };
}

},{}],14:[function(_dereq_,module,exports){
/*** Vector functions - vectors provided as [x, y, z] arrays ***/

var Vector = {};

// Vector length squared
Vector.lengthSq = function (v)
{
    if (v.length == 2) {
        return (v[0]*v[0] + v[1]*v[1]);
    }
    else {
        return (v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
    }
};

// Vector length
Vector.length = function (v)
{
    return Math.sqrt(Vector.lengthSq(v));
};

// Normalize a vector
Vector.normalize = function (v)
{
    var d;
    if (v.length == 2) {
        d = v[0]*v[0] + v[1]*v[1];
        d = Math.sqrt(d);

        if (d != 0) {
            return [v[0] / d, v[1] / d];
        }
        return [0, 0];
    }
    else {
        var d = v[0]*v[0] + v[1]*v[1] + v[2]*v[2];
        d = Math.sqrt(d);

        if (d != 0) {
            return [v[0] / d, v[1] / d, v[2] / d];
        }
        return [0, 0, 0];
    }
};

// Cross product of two vectors
Vector.cross  = function (v1, v2)
{
    return [
        (v1[1] * v2[2]) - (v1[2] * v2[1]),
        (v1[2] * v2[0]) - (v1[0] * v2[2]),
        (v1[0] * v2[1]) - (v1[1] * v2[0])
    ];
};

// Find the intersection of two lines specified as segments from points (p1, p2) and (p3, p4)
// http://en.wikipedia.org/wiki/Line-line_intersection
// http://en.wikipedia.org/wiki/Cramer's_rule
Vector.lineIntersection = function (p1, p2, p3, p4, parallel_tolerance)
{
    var parallel_tolerance = parallel_tolerance || 0.01;

    // a1*x + b1*y = c1 for line (x1, y1) to (x2, y2)
    // a2*x + b2*y = c2 for line (x3, y3) to (x4, y4)
    var a1 = p1[1] - p2[1]; // y1 - y2
    var b1 = p1[0] - p2[0]; // x1 - x2
    var a2 = p3[1] - p4[1]; // y3 - y4
    var b2 = p3[0] - p4[0]; // x3 - x4
    var c1 = (p1[0] * p2[1]) - (p1[1] * p2[0]); // x1*y2 - y1*x2
    var c2 = (p3[0] * p4[1]) - (p3[1] * p4[0]); // x3*y4 - y3*x4
    var denom = (b1 * a2) - (a1 * b2);

    if (Math.abs(denom) > parallel_tolerance) {
        return [
            ((c1 * b2) - (b1 * c2)) / denom,
            ((c1 * a2) - (a1 * c2)) / denom
        ];
    }
    return null; // return null if lines are (close to) parallel
};

if (module !== undefined) {
    module.exports = Vector;
}

},{}],15:[function(_dereq_,module,exports){
var Point = _dereq_('./point.js');
var Geo = _dereq_('./geo.js');
var Style = _dereq_('./style.js');
var Utils = _dereq_('./utils.js');

// Global setup
findBaseLibraryURL();
VectorRenderer.tile_scale = 4096; // coordinates are locally scaled to the range [0, tile_scale]
Geo.setTileScale(VectorRenderer.tile_scale);

// Layers & styles: pass an object directly, or a URL as string to load remotely
function VectorRenderer (type, tile_source, layers, styles, options)
{
    var options = options || {};
    this.type = type;
    this.tile_source = tile_source;
    this.tiles = {};
    this.num_workers = options.num_workers || 1;

    if (typeof(layers) == 'string') {
        this.layer_source = VectorRenderer.urlForPath(layers);
        this.layers = VectorRenderer.loadLayers(this.layer_source);
    }
    else {
        this.layers = layers;
    }
    this.layers_serialized = Utils.serializeWithFunctions(this.layers);

    if (typeof(styles) == 'string') {
        this.style_source = VectorRenderer.urlForPath(styles);
        this.styles = VectorRenderer.loadStyles(this.style_source);
    }
    else {
        this.styles = styles;
    }
    this.styles_serialized = Utils.serializeWithFunctions(this.styles);

    this.createWorkers();

    this.zoom = null;
    this.center = null;
    this.device_pixel_ratio = window.devicePixelRatio || 1;
    this.dirty = true; // request a redraw
    this.initialized = false;
}

VectorRenderer.create = function (type, tile_source, layers, styles, options)
{
    return new VectorRenderer[type](tile_source, layers, styles, options);
};

VectorRenderer.prototype.init = function ()
{
    // Child class-specific initialization (e.g. GL context creation)
    if (typeof(this._init) == 'function') {
        this._init.apply(this, arguments);
    }

    var renderer = this;
    this.workers.forEach(function(worker) {
        worker.addEventListener('message', renderer.workerBuildTileCompleted.bind(renderer));
    });

    this.initialized = true;
};

// Web workers handle heavy duty geometry processing
VectorRenderer.prototype.createWorkers = function ()
{
    var renderer = this;
    var url = VectorRenderer.library_base_url + 'vector-map-worker.min.js' + '?' + (+new Date());

    // To allow workers to be loaded cross-domain, first load worker source via XHR, then create a local URL via a blob
    var req = new XMLHttpRequest();
    req.onload = function () {
        var worker_local_url = window.URL.createObjectURL(new Blob([req.response], { type: 'application/javascript' }));

        renderer.workers = [];
        for (var w=0; w < renderer.num_workers; w++) {
            renderer.workers.push(new Worker(worker_local_url));
        }
    };
    req.open('GET', url, false /* async flag */);
    req.send();

    // Alternate for debugging - tradtional method of loading from remote URL instead of XHR-to-local-blob
    // renderer.workers = [];
    // for (var w=0; w < renderer.num_workers; w++) {
    //     renderer.workers.push(new Worker(url));
    // }

    this.next_worker = 0;
};

// Post a message about a tile to the next worker (round robbin)
VectorRenderer.prototype.workerPostMessageForTile = function (tile, message)
{
    tile.worker = this.next_worker;
    this.workers[tile.worker].postMessage(message);
    this.next_worker = (tile.worker + 1) % this.workers.length;
};

VectorRenderer.prototype.setCenter = function (lng, lat)
{
    this.center = { lng: lng, lat: lat };
    this.dirty = true;
};

VectorRenderer.prototype.setZoom = function (zoom)
{
    this.map_last_zoom = this.zoom;
    this.zoom = zoom;
    this.map_zooming = false;
    this.dirty = true;
};

VectorRenderer.prototype.startZoom = function ()
{
    this.map_last_zoom = this.zoom;
    this.map_zooming = true;
};

VectorRenderer.prototype.setBounds = function (sw, ne)
{
    this.bounds = {
        sw: { lng: sw.lng, lat: sw.lat },
        ne: { lng: ne.lng, lat: ne.lat }
    };

    var buffer = 200 * Geo.meters_per_pixel[~~this.zoom]; // pixels -> meters
    this.buffered_meter_bounds = {
        sw: Geo.latLngToMeters(Point(this.bounds.sw.lng, this.bounds.sw.lat)),
        ne: Geo.latLngToMeters(Point(this.bounds.ne.lng, this.bounds.ne.lat))
    };
    this.buffered_meter_bounds.sw.x -= buffer;
    this.buffered_meter_bounds.sw.y -= buffer;
    this.buffered_meter_bounds.ne.x += buffer;
    this.buffered_meter_bounds.ne.y += buffer;

    this.center_meters = Point(
        (this.buffered_meter_bounds.sw.x + this.buffered_meter_bounds.ne.x) / 2,
        (this.buffered_meter_bounds.sw.y + this.buffered_meter_bounds.ne.y) / 2
    );

    // console.log("set renderer bounds to " + JSON.stringify(this.bounds));

    // Mark tiles as visible/invisible
    for (var t in this.tiles) {
        this.updateVisibilityForTile(this.tiles[t]);
    }

    this.dirty = true;
};

VectorRenderer.prototype.updateVisibilityForTile = function (tile)
{
    tile.visible = Geo.boxIntersect(tile.bounds, this.buffered_meter_bounds);
    tile.center_dist = Math.abs(this.center_meters.x - tile.min.x) + Math.abs(this.center_meters.y - tile.min.y);
    return tile.visible;
};

VectorRenderer.prototype.resizeMap = function (width, height)
{
    this.dirty = true;
};

VectorRenderer.prototype.requestRedraw = function ()
{
    this.dirty = true;
};

VectorRenderer.prototype.render = function ()
{
    if (this.dirty == false || this.initialized == false) {
        return false;
    }
    this.dirty = false; // subclasses can set this back to true when animation is needed

    // Child class-specific rendering (e.g. GL draw calls)
    if (typeof(this._render) == 'function') {
        this._render.apply(this, arguments);
    }

    // console.log("render map");
    return true;
};

// Load a single tile
VectorRenderer.prototype.loadTile = function (coords, div, callback)
{
    // Overzoom?
    if (coords.z > this.tile_source.max_zoom) {
        var zgap = coords.z - this.tile_source.max_zoom;
        // var original_tile = [coords.x, coords.y, coords.z].join('/');
        coords.x = ~~(coords.x / Math.pow(2, zgap));
        coords.y = ~~(coords.y / Math.pow(2, zgap));
        coords.display_z = coords.z; // z without overzoom
        coords.z -= zgap;
        // console.log("adjusted for overzoom, tile " + original_tile + " -> " + [coords.x, coords.y, coords.z].join('/'));
    }

    this.trackTileSetLoadStart();

    var key = [coords.x, coords.y, coords.z].join('/');

    // Already loading/loaded?
    if (this.tiles[key]) {
        // if (this.tiles[key].loaded == true) {
        //     console.log("use loaded tile " + key + " from cache");
        // }
        // if (this.tiles[key].loading == true) {
        //     console.log("already loading tile " + key + ", skip");
        // }

        if (callback) {
            callback(null, div);
        }
        return;
    }

    var tile = this.tiles[key] = {};
    tile.key = key;
    tile.coords = coords;
    tile.min = Geo.metersForTile(tile.coords);
    tile.max = Geo.metersForTile({ x: tile.coords.x + 1, y: tile.coords.y + 1, z: tile.coords.z });
    tile.bounds = { sw: { x: tile.min.x, y: tile.max.y }, ne: { x: tile.max.x, y: tile.min.y } };
    tile.debug = {};
    tile.loading = true;
    tile.loaded = false;
    this.updateVisibilityForTile(tile);

    this.workerPostMessageForTile(tile, {
        type: 'buildTile',
        tile: {
            key: tile.key,
            coords: tile.coords, // used by style helpers
            min: tile.min, // used by TileSource to scale tile to local extents
            max: tile.max, // used by TileSource to scale tile to local extents
            debug: tile.debug
        },
        renderer_type: this.type,
        tile_source: this.tile_source,
        layers: this.layers_serialized,
        styles: this.styles_serialized
    });

    this.updateTileElement(tile, div);

    if (callback) {
        callback(null, div);
    }
};

// Rebuild all tiles
VectorRenderer.prototype.rebuildTiles = function ()
{
    // Tell workers we're about to rebuild (so they can refresh styles, etc.)
    console.log("notify workers");
    this.workers.forEach(function(worker) {
        worker.postMessage({
            type: 'markForRebuild'
        });
    });

    // Update layers & styles
    this.layers_serialized = Utils.serializeWithFunctions(this.layers);
    this.styles_serialized = Utils.serializeWithFunctions(this.styles);

    // Rebuild visible tiles first, from center out
    // console.log("find visible");
    var visible = [], invisible = [];
    for (var t in this.tiles) {
        if (this.tiles[t].visible == true) {
            visible.push(t);
        }
        else {
            invisible.push(t);
        }
    }

    // console.log("sort visible distance");
    visible.sort(function(a, b) {
        // var ad = Math.abs(this.center_meters.x - this.tiles[b].min.x) + Math.abs(this.center_meters.y - this.tiles[b].min.y);
        // var bd = Math.abs(this.center_meters.x - this.tiles[a].min.x) + Math.abs(this.center_meters.y - this.tiles[a].min.y);
        var ad = this.tiles[a].center_dist;
        var bd = this.tiles[b].center_dist;
        return (bd > ad ? -1 : (bd == ad ? 0 : 1));
    }.bind(this));

    // console.log("build visible");
    for (var t in visible) {
        this.buildTile(visible[t]);
    }

    // console.log("build invisible");
    for (var t in invisible) {
        this.buildTile(invisible[t]);
        // this.removeTile(invisible[t]);
    }
};

VectorRenderer.prototype.buildTile = function(key)
{
    var tile = this.tiles[key];

    this.workerPostMessageForTile(tile, {
        type: 'buildTile',
        tile: {
            key: tile.key,
            coords: tile.coords, // used by style helpers
            layers: tile.layers,
            debug: tile.debug
        },
        renderer_type: this.type,
        layers: this.layers_serialized,
        styles: this.styles_serialized
    });
};

// Called on main thread when a web worker completes processing for a single tile (initial load, or rebuild)
VectorRenderer.prototype.workerBuildTileCompleted = function (event)
{
    if (event.data.type != 'buildTileCompleted') {
        return;
    }

    var tile = event.data.tile;

    // Removed this tile during load?
    if (this.tiles[tile.key] == null) {
        console.log("discarded tile " + tile.key + " in VectorRenderer.tileWorkerCompleted because previously removed");
        return;
    }

    // Update tile with properties from worker
    tile = this.mergeTile(tile.key, tile);

    // Child class-specific tile processing
    if (typeof(this._tileWorkerCompleted) == 'function') {
        this._tileWorkerCompleted(tile);
    }

    // NOTE: was previously deleting source data to save memory, but now need to save for re-building geometry
    // delete tile.layers;

    this.dirty = true;
    this.trackTileSetLoadEnd();
    this.printDebugForTile(tile);
};

VectorRenderer.prototype.removeTile = function (key)
{
    console.log("tile unload for " + key);
    var tile = this.tiles[key];
    if (tile != null && tile.loading == true) {
        console.log("cancel tile load for " + key);

        // Web worker will cancel XHR requests
        if (tile.worker != null) {
            this.workers[tile.worker].postMessage({
                type: 'removeTile',
                key: tile.key
            });
        }
    }

    delete this.tiles[key];
    this.dirty = true;
};

// Attaches tracking and debug into to the provided tile DOM element
VectorRenderer.prototype.updateTileElement = function (tile, div)
{
    // Debug info
    div.setAttribute('data-tile-key', tile.key);
    div.style.width = '256px';
    div.style.height = '256px';

    if (this.debug) {
        var debug_overlay = document.createElement('div');
        debug_overlay.textContent = tile.key;
        debug_overlay.style.position = 'absolute';
        debug_overlay.style.left = 0;
        debug_overlay.style.top = 0;
        debug_overlay.style.color = 'white';
        debug_overlay.style.fontSize = '16px';
        // debug_overlay.style.textOutline = '1px #000000';
        div.appendChild(debug_overlay);

        div.style.borderStyle = 'solid';
        div.style.borderColor = 'white';
        div.style.borderWidth = '1px';
    }
};

// Merge properties from a provided tile object into the main tile store. Shallow merge (just copies top-level properties)!
// Used for selectively updating properties of tiles passed between main thread and worker
// (so we don't have to pass the whole tile, including some properties which cannot be cloned for a worker).
VectorRenderer.prototype.mergeTile = function (key, source_tile)
{
    var tile = this.tiles[key];

    if (tile == null) {
        this.tiles[key] = source_tile;
        return this.tiles[key];
    }

    for (var p in source_tile) {
        // console.log("merging " + p + ": " + source_tile[p]);
        tile[p] = source_tile[p];
    }

    return tile;
};

// Reload layers and styles (only if they were originally loaded by URL). Mostly useful for testing.
VectorRenderer.prototype.reloadConfig = function ()
{
    if (this.layer_source != null) {
        this.layers = VectorRenderer.loadLayers(this.layer_source);
        this.layers_serialized = Utils.serializeWithFunctions(this.layers);
    }

    if (this.style_source != null) {
        this.styles = VectorRenderer.loadStyles(this.style_source);
        this.styles_serialized = Utils.serializeWithFunctions(this.styles);
    }

    if (this.layer_source != null || this.style_source != null) {
        this.rebuildTiles();
    }
};

// Profiling methods used to track when sets of tiles start/stop loading together
// e.g. initial page load is one set of tiles, new sets of tile loads are then initiated by a map pan or zoom
VectorRenderer.prototype.trackTileSetLoadStart = function ()
{
    // Start tracking new tile set if no other tiles already loading
    if (this.tile_set_loading == null) {
        this.tile_set_loading = +new Date();
        console.log("tile set load START");
    }
};

VectorRenderer.prototype.trackTileSetLoadEnd = function ()
{
    // No more tiles actively loading?
    if (this.tile_set_loading != null) {
        var end_tile_set = true;
        for (var t in this.tiles) {
            if (this.tiles[t].loading == true) {
                end_tile_set = false;
                break;
            }
        }

        if (end_tile_set == true) {
            this.last_tile_set_load = (+new Date()) - this.tile_set_loading;
            this.tile_set_loading = null;
            console.log("tile set load FINISHED in: " + this.last_tile_set_load);
        }
    }
};

VectorRenderer.prototype.printDebugForTile = function (tile)
{
    console.log(
        "debug for " + tile.key + ': [ ' +
        Object.keys(tile.debug).map(function (t) { return t + ': ' + tile.debug[t]; }).join(', ') + ' ]'
    );
};


/*** Class methods (stateless) ***/

// Simplistic detection of relative paths, append base if necessary
VectorRenderer.urlForPath = function (path) {
    var protocol = path.toLowerCase().substr(0, 4);
    if (!(protocol == 'http' || protocol == 'file')) {
        path = window.location.origin + window.location.pathname + path;
    }
    return path;
};

VectorRenderer.loadLayers = function (url)
{
    var layers;
    var req = new XMLHttpRequest();
    req.onload = function () { eval('layers = ' + req.response); }; // TODO: security!
    req.open('GET', url + '?' + (+new Date()), false /* async flag */);
    req.send();
    return layers;
};

VectorRenderer.loadStyles = function (url)
{
    var styles;
    var req = new XMLHttpRequest();
    req.onload = function () { eval('styles = ' + req.response); }; // TODO: security!
    req.open('GET', url + '?' + (+new Date()), false /* async flag */);
    req.send();
    return styles;
};

// Processes the tile response to create layers as defined by this renderer
// Can include post-processing to partially filter or re-arrange data, e.g. only including POIs that have names
VectorRenderer.processLayersForTile = function (layers, tile)
{
    var tile_layers = {};
    for (var t=0; t < layers.length; t++) {
        layers[t].number = t;

        if (layers[t] != null) {
            // Just pass through data untouched if no data transform function defined
            if (layers[t].data == null) {
                tile_layers[layers[t].name] = tile.layers[layers[t].name];
            }
            // Pass through data but with different layer name in tile source data
            else if (typeof layers[t].data == 'string') {
                tile_layers[layers[t].name] = tile.layers[layers[t].data];
            }
            // Apply the transform function for post-processing
            else if (typeof layers[t].data == 'function') {
                tile_layers[layers[t].name] = layers[t].data(tile.layers);
            }
        }

        // Handle cases where no data was found in tile or returned by post-processor
        tile_layers[layers[t].name] = tile_layers[layers[t].name] || { type: 'FeatureCollection', features: [] };
    }
    tile.layers = tile_layers;
    return tile_layers;
};


/*** Style parsing & defaults ***/

// Determine final style properties (color, width, etc.)
VectorRenderer.style_defaults = {
    color: [1.0, 0, 0],
    width: 1,
    size: 1,
    extrude: false,
    height: 20,
    min_height: 0,
    outline: {
        // color: [1.0, 0, 0],
        // width: 1,
        // dash: null
    },
    // render_mode: {
    //     name: 'polygons'
    // }
    render_mode: 'polygons'
};

VectorRenderer.parseStyleForFeature = function (feature, layer_style, tile)
{
    var layer_style = layer_style || {};
    var style = {};

    // helper functions passed to dynamic style functions
    var helpers = {
        Style: Style,
        Geo: Geo,
        zoom: tile.coords.z
    };

    // Test whether features should be rendered at all
    if (typeof layer_style.filter == 'function') {
        if (layer_style.filter(feature, tile, helpers) == false) {
            return null;
        }
    }

    // Parse styles
    style.color = (layer_style.color && (layer_style.color[feature.properties.kind] || layer_style.color.default)) || VectorRenderer.style_defaults.color;
    if (typeof style.color == 'function') {
        style.color = style.color(feature, tile, helpers);
    }

    style.width = (layer_style.width && (layer_style.width[feature.properties.kind] || layer_style.width.default)) || VectorRenderer.style_defaults.width;
    if (typeof style.width == 'function') {
        style.width = style.width(feature, tile, helpers);
    }
    style.width *= Geo.units_per_meter[tile.coords.z];

    style.size = (layer_style.size && (layer_style.size[feature.properties.kind] || layer_style.size.default)) || VectorRenderer.style_defaults.size;
    if (typeof style.size == 'function') {
        style.size = style.size(feature, tile, helpers);
    }
    style.size *= Geo.units_per_meter[tile.coords.z];

    style.extrude = (layer_style.extrude && (layer_style.extrude[feature.properties.kind] || layer_style.extrude.default)) || VectorRenderer.style_defaults.extrude;
    if (typeof style.extrude == 'function') {
        // returning a boolean will extrude with the feature's height, a number will override the feature height (see below)
        style.extrude = style.extrude(feature, tile, helpers);
    }

    style.height = (feature.properties && feature.properties.height) || VectorRenderer.style_defaults.height;
    style.min_height = (feature.properties && feature.properties.min_height) || VectorRenderer.style_defaults.min_height;

    // height defaults to feature height, but extrude style can dynamically adjust height by returning a number or array (instead of a boolean)
    if (style.extrude) {
        if (typeof style.extrude == 'number') {
            style.height = style.extrude;
        }
        else if (typeof style.extrude == 'object' && style.extrude.length >= 2) {
            style.min_height = style.extrude[0];
            style.height = style.extrude[1];
        }
    }

    style.z = (layer_style.z && (layer_style.z[feature.properties.kind] || layer_style.z.default)) || VectorRenderer.style_defaults.z || 0;
    if (typeof style.z == 'function') {
        style.z = style.z(feature, tile, helpers);
    }

    style.outline = {};
    layer_style.outline = layer_style.outline || {};
    style.outline.color = (layer_style.outline.color && (layer_style.outline.color[feature.properties.kind] || layer_style.outline.color.default)) || VectorRenderer.style_defaults.outline.color;
    if (typeof style.outline.color == 'function') {
        style.outline.color = style.outline.color(feature, tile, helpers);
    }

    style.outline.width = (layer_style.outline.width && (layer_style.outline.width[feature.properties.kind] || layer_style.outline.width.default)) || VectorRenderer.style_defaults.outline.width;
    if (typeof style.outline.width == 'function') {
        style.outline.width = style.outline.width(feature, tile, helpers);
    }
    style.outline.width *= Geo.units_per_meter[tile.coords.z];

    style.outline.dash = (layer_style.outline.dash && (layer_style.outline.dash[feature.properties.kind] || layer_style.outline.dash.default)) || VectorRenderer.style_defaults.outline.dash;
    if (typeof style.outline.dash == 'function') {
        style.outline.dash = style.outline.dash(feature, tile, helpers);
    }

    style.render_mode = layer_style.render_mode || VectorRenderer.style_defaults.render_mode;
    // style.render_mode = {};
    // style.render_mode.name = (layer_style.render_mode && layer_style.render_mode.name) || VectorRenderer.style_defaults.render_mode.name;

    return style;
};

// Private/internal
// Get base URL from which the library was loaded
// Used to load additional resources like shaders, textures, etc. in cases where library was loaded from a relative path
function findBaseLibraryURL ()
{
    try {
        VectorRenderer.library_base_url = '';
        var scripts = document.getElementsByTagName('script'); // document.querySelectorAll('script[src*=".js"]');
        for (var s=0; s < scripts.length; s++) {
            var match = scripts[s].src.indexOf('vector-map.debug.js');
            if (match == -1) {
                match = scripts[s].src.indexOf('vector-map.min.js');
            }
            if (match >= 0) {
                VectorRenderer.library_base_url = scripts[s].src.substr(0, match);
                break;
            }
        }
    }
    catch (e) {
        // skip in web worker
    }
};

if (module !== undefined) {
    module.exports = VectorRenderer;
}

},{"./geo.js":3,"./point.js":11,"./style.js":12,"./utils.js":13}]},{},[10])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYmNhbXBlci9Eb2N1bWVudHMvZGV2L3ZlY3Rvci1tYXAvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9iY2FtcGVyL0RvY3VtZW50cy9kZXYvdmVjdG9yLW1hcC9ub2RlX21vZHVsZXMvZ2wtbWF0cml4L2Rpc3QvZ2wtbWF0cml4LmpzIiwiL1VzZXJzL2JjYW1wZXIvRG9jdW1lbnRzL2Rldi92ZWN0b3ItbWFwL3NyYy9jYW52YXMvY2FudmFzX3JlbmRlcmVyLmpzIiwiL1VzZXJzL2JjYW1wZXIvRG9jdW1lbnRzL2Rldi92ZWN0b3ItbWFwL3NyYy9nZW8uanMiLCIvVXNlcnMvYmNhbXBlci9Eb2N1bWVudHMvZGV2L3ZlY3Rvci1tYXAvc3JjL2dsL2dsLmpzIiwiL1VzZXJzL2JjYW1wZXIvRG9jdW1lbnRzL2Rldi92ZWN0b3ItbWFwL3NyYy9nbC9nbF9idWlsZGVycy5qcyIsIi9Vc2Vycy9iY2FtcGVyL0RvY3VtZW50cy9kZXYvdmVjdG9yLW1hcC9zcmMvZ2wvZ2xfZ2VvbS5qcyIsIi9Vc2Vycy9iY2FtcGVyL0RvY3VtZW50cy9kZXYvdmVjdG9yLW1hcC9zcmMvZ2wvZ2xfcmVuZGVyZXIuanMiLCIvVXNlcnMvYmNhbXBlci9Eb2N1bWVudHMvZGV2L3ZlY3Rvci1tYXAvc3JjL2dsL2dsX3NoYWRlcnMuanMiLCIvVXNlcnMvYmNhbXBlci9Eb2N1bWVudHMvZGV2L3ZlY3Rvci1tYXAvc3JjL2xlYWZsZXRfbGF5ZXIuanMiLCIvVXNlcnMvYmNhbXBlci9Eb2N1bWVudHMvZGV2L3ZlY3Rvci1tYXAvc3JjL21vZHVsZS5qcyIsIi9Vc2Vycy9iY2FtcGVyL0RvY3VtZW50cy9kZXYvdmVjdG9yLW1hcC9zcmMvcG9pbnQuanMiLCIvVXNlcnMvYmNhbXBlci9Eb2N1bWVudHMvZGV2L3ZlY3Rvci1tYXAvc3JjL3N0eWxlLmpzIiwiL1VzZXJzL2JjYW1wZXIvRG9jdW1lbnRzL2Rldi92ZWN0b3ItbWFwL3NyYy91dGlscy5qcyIsIi9Vc2Vycy9iY2FtcGVyL0RvY3VtZW50cy9kZXYvdmVjdG9yLW1hcC9zcmMvdmVjdG9yLmpzIiwiL1VzZXJzL2JjYW1wZXIvRG9jdW1lbnRzL2Rldi92ZWN0b3ItbWFwL3NyYy92ZWN0b3JfcmVuZGVyZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy94SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Y0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxZ0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgZ2wtbWF0cml4IC0gSGlnaCBwZXJmb3JtYW5jZSBtYXRyaXggYW5kIHZlY3RvciBvcGVyYXRpb25zXG4gKiBAYXV0aG9yIEJyYW5kb24gSm9uZXNcbiAqIEBhdXRob3IgQ29saW4gTWFjS2VuemllIElWXG4gKiBAdmVyc2lvbiAyLjEuMFxuICovXG5cbi8qIENvcHlyaWdodCAoYykgMjAxMywgQnJhbmRvbiBKb25lcywgQ29saW4gTWFjS2VuemllIElWLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuXG5SZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXQgbW9kaWZpY2F0aW9uLFxuYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuXG4gICogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzXG4gICAgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuICAgIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb24gXG4gICAgYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG5cblRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORFxuQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRURcbldBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgXG5ESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIEhPTERFUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUlxuQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTXG4oSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7XG5MT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT05cbkFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4oSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJU1xuU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuICovXG5cblxuKGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgc2hpbSA9IHt9O1xuICBpZiAodHlwZW9mKGV4cG9ydHMpID09PSAndW5kZWZpbmVkJykge1xuICAgIGlmKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICBzaGltLmV4cG9ydHMgPSB7fTtcbiAgICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHNoaW0uZXhwb3J0cztcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBnbC1tYXRyaXggbGl2ZXMgaW4gYSBicm93c2VyLCBkZWZpbmUgaXRzIG5hbWVzcGFjZXMgaW4gZ2xvYmFsXG4gICAgICBzaGltLmV4cG9ydHMgPSB3aW5kb3c7XG4gICAgfSAgICBcbiAgfVxuICBlbHNlIHtcbiAgICAvLyBnbC1tYXRyaXggbGl2ZXMgaW4gY29tbW9uanMsIGRlZmluZSBpdHMgbmFtZXNwYWNlcyBpbiBleHBvcnRzXG4gICAgc2hpbS5leHBvcnRzID0gZXhwb3J0cztcbiAgfVxuXG4gIChmdW5jdGlvbihleHBvcnRzKSB7XG4gICAgLyogQ29weXJpZ2h0IChjKSAyMDEzLCBCcmFuZG9uIEpvbmVzLCBDb2xpbiBNYWNLZW56aWUgSVYuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cblJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dCBtb2RpZmljYXRpb24sXG5hcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG5cbiAgKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXNcbiAgICBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAgKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4gICAgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBcbiAgICBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cblxuVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCIgQU5EXG5BTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRFxuV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBcbkRJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgSE9MREVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SXG5BTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVNcbihJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUztcbkxPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTlxuQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcbihJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTXG5TT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS4gKi9cblxuXG5pZighR0xNQVRfRVBTSUxPTikge1xuICAgIHZhciBHTE1BVF9FUFNJTE9OID0gMC4wMDAwMDE7XG59XG5cbmlmKCFHTE1BVF9BUlJBWV9UWVBFKSB7XG4gICAgdmFyIEdMTUFUX0FSUkFZX1RZUEUgPSAodHlwZW9mIEZsb2F0MzJBcnJheSAhPT0gJ3VuZGVmaW5lZCcpID8gRmxvYXQzMkFycmF5IDogQXJyYXk7XG59XG5cbi8qKlxuICogQGNsYXNzIENvbW1vbiB1dGlsaXRpZXNcbiAqIEBuYW1lIGdsTWF0cml4XG4gKi9cbnZhciBnbE1hdHJpeCA9IHt9O1xuXG4vKipcbiAqIFNldHMgdGhlIHR5cGUgb2YgYXJyYXkgdXNlZCB3aGVuIGNyZWF0aW5nIG5ldyB2ZWN0b3JzIGFuZCBtYXRyaWNpZXNcbiAqXG4gKiBAcGFyYW0ge1R5cGV9IHR5cGUgQXJyYXkgdHlwZSwgc3VjaCBhcyBGbG9hdDMyQXJyYXkgb3IgQXJyYXlcbiAqL1xuZ2xNYXRyaXguc2V0TWF0cml4QXJyYXlUeXBlID0gZnVuY3Rpb24odHlwZSkge1xuICAgIEdMTUFUX0FSUkFZX1RZUEUgPSB0eXBlO1xufVxuXG5pZih0eXBlb2YoZXhwb3J0cykgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZXhwb3J0cy5nbE1hdHJpeCA9IGdsTWF0cml4O1xufVxuO1xuLyogQ29weXJpZ2h0IChjKSAyMDEzLCBCcmFuZG9uIEpvbmVzLCBDb2xpbiBNYWNLZW56aWUgSVYuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cblJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dCBtb2RpZmljYXRpb24sXG5hcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG5cbiAgKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXNcbiAgICBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAgKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4gICAgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBcbiAgICBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cblxuVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCIgQU5EXG5BTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRFxuV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBcbkRJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgSE9MREVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SXG5BTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVNcbihJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUztcbkxPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTlxuQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcbihJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTXG5TT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS4gKi9cblxuLyoqXG4gKiBAY2xhc3MgMiBEaW1lbnNpb25hbCBWZWN0b3JcbiAqIEBuYW1lIHZlYzJcbiAqL1xuXG52YXIgdmVjMiA9IHt9O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcsIGVtcHR5IHZlYzJcbiAqXG4gKiBAcmV0dXJucyB7dmVjMn0gYSBuZXcgMkQgdmVjdG9yXG4gKi9cbnZlYzIuY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG91dCA9IG5ldyBHTE1BVF9BUlJBWV9UWVBFKDIpO1xuICAgIG91dFswXSA9IDA7XG4gICAgb3V0WzFdID0gMDtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHZlYzIgaW5pdGlhbGl6ZWQgd2l0aCB2YWx1ZXMgZnJvbSBhbiBleGlzdGluZyB2ZWN0b3JcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdmVjdG9yIHRvIGNsb25lXG4gKiBAcmV0dXJucyB7dmVjMn0gYSBuZXcgMkQgdmVjdG9yXG4gKi9cbnZlYzIuY2xvbmUgPSBmdW5jdGlvbihhKSB7XG4gICAgdmFyIG91dCA9IG5ldyBHTE1BVF9BUlJBWV9UWVBFKDIpO1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHZlYzIgaW5pdGlhbGl6ZWQgd2l0aCB0aGUgZ2l2ZW4gdmFsdWVzXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHggWCBjb21wb25lbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSB5IFkgY29tcG9uZW50XG4gKiBAcmV0dXJucyB7dmVjMn0gYSBuZXcgMkQgdmVjdG9yXG4gKi9cbnZlYzIuZnJvbVZhbHVlcyA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICB2YXIgb3V0ID0gbmV3IEdMTUFUX0FSUkFZX1RZUEUoMik7XG4gICAgb3V0WzBdID0geDtcbiAgICBvdXRbMV0gPSB5O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENvcHkgdGhlIHZhbHVlcyBmcm9tIG9uZSB2ZWMyIHRvIGFub3RoZXJcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMyfSBhIHRoZSBzb3VyY2UgdmVjdG9yXG4gKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gKi9cbnZlYzIuY29weSA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIGNvbXBvbmVudHMgb2YgYSB2ZWMyIHRvIHRoZSBnaXZlbiB2YWx1ZXNcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHtOdW1iZXJ9IHggWCBjb21wb25lbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSB5IFkgY29tcG9uZW50XG4gKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gKi9cbnZlYzIuc2V0ID0gZnVuY3Rpb24ob3V0LCB4LCB5KSB7XG4gICAgb3V0WzBdID0geDtcbiAgICBvdXRbMV0gPSB5O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEFkZHMgdHdvIHZlYzInc1xuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjMn0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAqL1xudmVjMi5hZGQgPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdICsgYlswXTtcbiAgICBvdXRbMV0gPSBhWzFdICsgYlsxXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBTdWJ0cmFjdHMgdHdvIHZlYzInc1xuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjMn0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAqL1xudmVjMi5zdWJ0cmFjdCA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gLSBiWzBdO1xuICAgIG91dFsxXSA9IGFbMV0gLSBiWzFdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgdmVjMi5zdWJ0cmFjdH1cbiAqIEBmdW5jdGlvblxuICovXG52ZWMyLnN1YiA9IHZlYzIuc3VidHJhY3Q7XG5cbi8qKlxuICogTXVsdGlwbGllcyB0d28gdmVjMidzXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMyfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3ZlYzJ9IG91dFxuICovXG52ZWMyLm11bHRpcGx5ID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSAqIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSAqIGJbMV07XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayB2ZWMyLm11bHRpcGx5fVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzIubXVsID0gdmVjMi5tdWx0aXBseTtcblxuLyoqXG4gKiBEaXZpZGVzIHR3byB2ZWMyJ3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMyfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzJ9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gKi9cbnZlYzIuZGl2aWRlID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSAvIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSAvIGJbMV07XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayB2ZWMyLmRpdmlkZX1cbiAqIEBmdW5jdGlvblxuICovXG52ZWMyLmRpdiA9IHZlYzIuZGl2aWRlO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG1pbmltdW0gb2YgdHdvIHZlYzInc1xuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjMn0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAqL1xudmVjMi5taW4gPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBNYXRoLm1pbihhWzBdLCBiWzBdKTtcbiAgICBvdXRbMV0gPSBNYXRoLm1pbihhWzFdLCBiWzFdKTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBtYXhpbXVtIG9mIHR3byB2ZWMyJ3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMyfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzJ9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gKi9cbnZlYzIubWF4ID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gTWF0aC5tYXgoYVswXSwgYlswXSk7XG4gICAgb3V0WzFdID0gTWF0aC5tYXgoYVsxXSwgYlsxXSk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogU2NhbGVzIGEgdmVjMiBieSBhIHNjYWxhciBudW1iZXJcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMyfSBhIHRoZSB2ZWN0b3IgdG8gc2NhbGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBiIGFtb3VudCB0byBzY2FsZSB0aGUgdmVjdG9yIGJ5XG4gKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gKi9cbnZlYzIuc2NhbGUgPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdICogYjtcbiAgICBvdXRbMV0gPSBhWzFdICogYjtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBldWNsaWRpYW4gZGlzdGFuY2UgYmV0d2VlbiB0d28gdmVjMidzXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzJ9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBkaXN0YW5jZSBiZXR3ZWVuIGEgYW5kIGJcbiAqL1xudmVjMi5kaXN0YW5jZSA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICB2YXIgeCA9IGJbMF0gLSBhWzBdLFxuICAgICAgICB5ID0gYlsxXSAtIGFbMV07XG4gICAgcmV0dXJuIE1hdGguc3FydCh4KnggKyB5KnkpO1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzIuZGlzdGFuY2V9XG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjMi5kaXN0ID0gdmVjMi5kaXN0YW5jZTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBzcXVhcmVkIGV1Y2xpZGlhbiBkaXN0YW5jZSBiZXR3ZWVuIHR3byB2ZWMyJ3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjMn0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IHNxdWFyZWQgZGlzdGFuY2UgYmV0d2VlbiBhIGFuZCBiXG4gKi9cbnZlYzIuc3F1YXJlZERpc3RhbmNlID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHZhciB4ID0gYlswXSAtIGFbMF0sXG4gICAgICAgIHkgPSBiWzFdIC0gYVsxXTtcbiAgICByZXR1cm4geCp4ICsgeSp5O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzIuc3F1YXJlZERpc3RhbmNlfVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzIuc3FyRGlzdCA9IHZlYzIuc3F1YXJlZERpc3RhbmNlO1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGxlbmd0aCBvZiBhIHZlYzJcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdmVjdG9yIHRvIGNhbGN1bGF0ZSBsZW5ndGggb2ZcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IGxlbmd0aCBvZiBhXG4gKi9cbnZlYzIubGVuZ3RoID0gZnVuY3Rpb24gKGEpIHtcbiAgICB2YXIgeCA9IGFbMF0sXG4gICAgICAgIHkgPSBhWzFdO1xuICAgIHJldHVybiBNYXRoLnNxcnQoeCp4ICsgeSp5KTtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayB2ZWMyLmxlbmd0aH1cbiAqIEBmdW5jdGlvblxuICovXG52ZWMyLmxlbiA9IHZlYzIubGVuZ3RoO1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIHNxdWFyZWQgbGVuZ3RoIG9mIGEgdmVjMlxuICpcbiAqIEBwYXJhbSB7dmVjMn0gYSB2ZWN0b3IgdG8gY2FsY3VsYXRlIHNxdWFyZWQgbGVuZ3RoIG9mXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBzcXVhcmVkIGxlbmd0aCBvZiBhXG4gKi9cbnZlYzIuc3F1YXJlZExlbmd0aCA9IGZ1bmN0aW9uIChhKSB7XG4gICAgdmFyIHggPSBhWzBdLFxuICAgICAgICB5ID0gYVsxXTtcbiAgICByZXR1cm4geCp4ICsgeSp5O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzIuc3F1YXJlZExlbmd0aH1cbiAqIEBmdW5jdGlvblxuICovXG52ZWMyLnNxckxlbiA9IHZlYzIuc3F1YXJlZExlbmd0aDtcblxuLyoqXG4gKiBOZWdhdGVzIHRoZSBjb21wb25lbnRzIG9mIGEgdmVjMlxuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdmVjdG9yIHRvIG5lZ2F0ZVxuICogQHJldHVybnMge3ZlYzJ9IG91dFxuICovXG52ZWMyLm5lZ2F0ZSA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIG91dFswXSA9IC1hWzBdO1xuICAgIG91dFsxXSA9IC1hWzFdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIE5vcm1hbGl6ZSBhIHZlYzJcbiAqXG4gKiBAcGFyYW0ge3ZlYzJ9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMyfSBhIHZlY3RvciB0byBub3JtYWxpemVcbiAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAqL1xudmVjMi5ub3JtYWxpemUgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICB2YXIgeCA9IGFbMF0sXG4gICAgICAgIHkgPSBhWzFdO1xuICAgIHZhciBsZW4gPSB4KnggKyB5Knk7XG4gICAgaWYgKGxlbiA+IDApIHtcbiAgICAgICAgLy9UT0RPOiBldmFsdWF0ZSB1c2Ugb2YgZ2xtX2ludnNxcnQgaGVyZT9cbiAgICAgICAgbGVuID0gMSAvIE1hdGguc3FydChsZW4pO1xuICAgICAgICBvdXRbMF0gPSBhWzBdICogbGVuO1xuICAgICAgICBvdXRbMV0gPSBhWzFdICogbGVuO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gdmVjMidzXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzJ9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBkb3QgcHJvZHVjdCBvZiBhIGFuZCBiXG4gKi9cbnZlYzIuZG90ID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gYVswXSAqIGJbMF0gKyBhWzFdICogYlsxXTtcbn07XG5cbi8qKlxuICogQ29tcHV0ZXMgdGhlIGNyb3NzIHByb2R1Y3Qgb2YgdHdvIHZlYzInc1xuICogTm90ZSB0aGF0IHRoZSBjcm9zcyBwcm9kdWN0IG11c3QgYnkgZGVmaW5pdGlvbiBwcm9kdWNlIGEgM0QgdmVjdG9yXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMyfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3ZlYzN9IG91dFxuICovXG52ZWMyLmNyb3NzID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgdmFyIHogPSBhWzBdICogYlsxXSAtIGFbMV0gKiBiWzBdO1xuICAgIG91dFswXSA9IG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gejtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBQZXJmb3JtcyBhIGxpbmVhciBpbnRlcnBvbGF0aW9uIGJldHdlZW4gdHdvIHZlYzInc1xuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjMn0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEBwYXJhbSB7TnVtYmVyfSB0IGludGVycG9sYXRpb24gYW1vdW50IGJldHdlZW4gdGhlIHR3byBpbnB1dHNcbiAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAqL1xudmVjMi5sZXJwID0gZnVuY3Rpb24gKG91dCwgYSwgYiwgdCkge1xuICAgIHZhciBheCA9IGFbMF0sXG4gICAgICAgIGF5ID0gYVsxXTtcbiAgICBvdXRbMF0gPSBheCArIHQgKiAoYlswXSAtIGF4KTtcbiAgICBvdXRbMV0gPSBheSArIHQgKiAoYlsxXSAtIGF5KTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSB2ZWMyIHdpdGggYSBtYXQyXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgdmVjdG9yIHRvIHRyYW5zZm9ybVxuICogQHBhcmFtIHttYXQyfSBtIG1hdHJpeCB0byB0cmFuc2Zvcm0gd2l0aFxuICogQHJldHVybnMge3ZlYzJ9IG91dFxuICovXG52ZWMyLnRyYW5zZm9ybU1hdDIgPSBmdW5jdGlvbihvdXQsIGEsIG0pIHtcbiAgICB2YXIgeCA9IGFbMF0sXG4gICAgICAgIHkgPSBhWzFdO1xuICAgIG91dFswXSA9IG1bMF0gKiB4ICsgbVsyXSAqIHk7XG4gICAgb3V0WzFdID0gbVsxXSAqIHggKyBtWzNdICogeTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSB2ZWMyIHdpdGggYSBtYXQyZFxuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIHZlY3RvciB0byB0cmFuc2Zvcm1cbiAqIEBwYXJhbSB7bWF0MmR9IG0gbWF0cml4IHRvIHRyYW5zZm9ybSB3aXRoXG4gKiBAcmV0dXJucyB7dmVjMn0gb3V0XG4gKi9cbnZlYzIudHJhbnNmb3JtTWF0MmQgPSBmdW5jdGlvbihvdXQsIGEsIG0pIHtcbiAgICB2YXIgeCA9IGFbMF0sXG4gICAgICAgIHkgPSBhWzFdO1xuICAgIG91dFswXSA9IG1bMF0gKiB4ICsgbVsyXSAqIHkgKyBtWzRdO1xuICAgIG91dFsxXSA9IG1bMV0gKiB4ICsgbVszXSAqIHkgKyBtWzVdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFRyYW5zZm9ybXMgdGhlIHZlYzIgd2l0aCBhIG1hdDNcbiAqIDNyZCB2ZWN0b3IgY29tcG9uZW50IGlzIGltcGxpY2l0bHkgJzEnXG4gKlxuICogQHBhcmFtIHt2ZWMyfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjMn0gYSB0aGUgdmVjdG9yIHRvIHRyYW5zZm9ybVxuICogQHBhcmFtIHttYXQzfSBtIG1hdHJpeCB0byB0cmFuc2Zvcm0gd2l0aFxuICogQHJldHVybnMge3ZlYzJ9IG91dFxuICovXG52ZWMyLnRyYW5zZm9ybU1hdDMgPSBmdW5jdGlvbihvdXQsIGEsIG0pIHtcbiAgICB2YXIgeCA9IGFbMF0sXG4gICAgICAgIHkgPSBhWzFdO1xuICAgIG91dFswXSA9IG1bMF0gKiB4ICsgbVszXSAqIHkgKyBtWzZdO1xuICAgIG91dFsxXSA9IG1bMV0gKiB4ICsgbVs0XSAqIHkgKyBtWzddO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFRyYW5zZm9ybXMgdGhlIHZlYzIgd2l0aCBhIG1hdDRcbiAqIDNyZCB2ZWN0b3IgY29tcG9uZW50IGlzIGltcGxpY2l0bHkgJzAnXG4gKiA0dGggdmVjdG9yIGNvbXBvbmVudCBpcyBpbXBsaWNpdGx5ICcxJ1xuICpcbiAqIEBwYXJhbSB7dmVjMn0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzJ9IGEgdGhlIHZlY3RvciB0byB0cmFuc2Zvcm1cbiAqIEBwYXJhbSB7bWF0NH0gbSBtYXRyaXggdG8gdHJhbnNmb3JtIHdpdGhcbiAqIEByZXR1cm5zIHt2ZWMyfSBvdXRcbiAqL1xudmVjMi50cmFuc2Zvcm1NYXQ0ID0gZnVuY3Rpb24ob3V0LCBhLCBtKSB7XG4gICAgdmFyIHggPSBhWzBdLCBcbiAgICAgICAgeSA9IGFbMV07XG4gICAgb3V0WzBdID0gbVswXSAqIHggKyBtWzRdICogeSArIG1bMTJdO1xuICAgIG91dFsxXSA9IG1bMV0gKiB4ICsgbVs1XSAqIHkgKyBtWzEzXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBQZXJmb3JtIHNvbWUgb3BlcmF0aW9uIG92ZXIgYW4gYXJyYXkgb2YgdmVjMnMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYSB0aGUgYXJyYXkgb2YgdmVjdG9ycyB0byBpdGVyYXRlIG92ZXJcbiAqIEBwYXJhbSB7TnVtYmVyfSBzdHJpZGUgTnVtYmVyIG9mIGVsZW1lbnRzIGJldHdlZW4gdGhlIHN0YXJ0IG9mIGVhY2ggdmVjMi4gSWYgMCBhc3N1bWVzIHRpZ2h0bHkgcGFja2VkXG4gKiBAcGFyYW0ge051bWJlcn0gb2Zmc2V0IE51bWJlciBvZiBlbGVtZW50cyB0byBza2lwIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGFycmF5XG4gKiBAcGFyYW0ge051bWJlcn0gY291bnQgTnVtYmVyIG9mIHZlYzJzIHRvIGl0ZXJhdGUgb3Zlci4gSWYgMCBpdGVyYXRlcyBvdmVyIGVudGlyZSBhcnJheVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gRnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCB2ZWN0b3IgaW4gdGhlIGFycmF5XG4gKiBAcGFyYW0ge09iamVjdH0gW2FyZ10gYWRkaXRpb25hbCBhcmd1bWVudCB0byBwYXNzIHRvIGZuXG4gKiBAcmV0dXJucyB7QXJyYXl9IGFcbiAqIEBmdW5jdGlvblxuICovXG52ZWMyLmZvckVhY2ggPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZlYyA9IHZlYzIuY3JlYXRlKCk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oYSwgc3RyaWRlLCBvZmZzZXQsIGNvdW50LCBmbiwgYXJnKSB7XG4gICAgICAgIHZhciBpLCBsO1xuICAgICAgICBpZighc3RyaWRlKSB7XG4gICAgICAgICAgICBzdHJpZGUgPSAyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIW9mZnNldCkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gMDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYoY291bnQpIHtcbiAgICAgICAgICAgIGwgPSBNYXRoLm1pbigoY291bnQgKiBzdHJpZGUpICsgb2Zmc2V0LCBhLmxlbmd0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsID0gYS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IoaSA9IG9mZnNldDsgaSA8IGw7IGkgKz0gc3RyaWRlKSB7XG4gICAgICAgICAgICB2ZWNbMF0gPSBhW2ldOyB2ZWNbMV0gPSBhW2krMV07XG4gICAgICAgICAgICBmbih2ZWMsIHZlYywgYXJnKTtcbiAgICAgICAgICAgIGFbaV0gPSB2ZWNbMF07IGFbaSsxXSA9IHZlY1sxXTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIHZlY3RvclxuICpcbiAqIEBwYXJhbSB7dmVjMn0gdmVjIHZlY3RvciB0byByZXByZXNlbnQgYXMgYSBzdHJpbmdcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdmVjdG9yXG4gKi9cbnZlYzIuc3RyID0gZnVuY3Rpb24gKGEpIHtcbiAgICByZXR1cm4gJ3ZlYzIoJyArIGFbMF0gKyAnLCAnICsgYVsxXSArICcpJztcbn07XG5cbmlmKHR5cGVvZihleHBvcnRzKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBleHBvcnRzLnZlYzIgPSB2ZWMyO1xufVxuO1xuLyogQ29weXJpZ2h0IChjKSAyMDEzLCBCcmFuZG9uIEpvbmVzLCBDb2xpbiBNYWNLZW56aWUgSVYuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cblJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dCBtb2RpZmljYXRpb24sXG5hcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG5cbiAgKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXNcbiAgICBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAgKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4gICAgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBcbiAgICBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cblxuVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCIgQU5EXG5BTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRFxuV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBcbkRJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgSE9MREVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SXG5BTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVNcbihJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUztcbkxPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTlxuQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcbihJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTXG5TT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS4gKi9cblxuLyoqXG4gKiBAY2xhc3MgMyBEaW1lbnNpb25hbCBWZWN0b3JcbiAqIEBuYW1lIHZlYzNcbiAqL1xuXG52YXIgdmVjMyA9IHt9O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcsIGVtcHR5IHZlYzNcbiAqXG4gKiBAcmV0dXJucyB7dmVjM30gYSBuZXcgM0QgdmVjdG9yXG4gKi9cbnZlYzMuY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG91dCA9IG5ldyBHTE1BVF9BUlJBWV9UWVBFKDMpO1xuICAgIG91dFswXSA9IDA7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgdmVjMyBpbml0aWFsaXplZCB3aXRoIHZhbHVlcyBmcm9tIGFuIGV4aXN0aW5nIHZlY3RvclxuICpcbiAqIEBwYXJhbSB7dmVjM30gYSB2ZWN0b3IgdG8gY2xvbmVcbiAqIEByZXR1cm5zIHt2ZWMzfSBhIG5ldyAzRCB2ZWN0b3JcbiAqL1xudmVjMy5jbG9uZSA9IGZ1bmN0aW9uKGEpIHtcbiAgICB2YXIgb3V0ID0gbmV3IEdMTUFUX0FSUkFZX1RZUEUoMyk7XG4gICAgb3V0WzBdID0gYVswXTtcbiAgICBvdXRbMV0gPSBhWzFdO1xuICAgIG91dFsyXSA9IGFbMl07XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyB2ZWMzIGluaXRpYWxpemVkIHdpdGggdGhlIGdpdmVuIHZhbHVlc1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB4IFggY29tcG9uZW50XG4gKiBAcGFyYW0ge051bWJlcn0geSBZIGNvbXBvbmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IHogWiBjb21wb25lbnRcbiAqIEByZXR1cm5zIHt2ZWMzfSBhIG5ldyAzRCB2ZWN0b3JcbiAqL1xudmVjMy5mcm9tVmFsdWVzID0gZnVuY3Rpb24oeCwgeSwgeikge1xuICAgIHZhciBvdXQgPSBuZXcgR0xNQVRfQVJSQVlfVFlQRSgzKTtcbiAgICBvdXRbMF0gPSB4O1xuICAgIG91dFsxXSA9IHk7XG4gICAgb3V0WzJdID0gejtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgdmVjMyB0byBhbm90aGVyXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjM30gYSB0aGUgc291cmNlIHZlY3RvclxuICogQHJldHVybnMge3ZlYzN9IG91dFxuICovXG52ZWMzLmNvcHkgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gYVsyXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIGNvbXBvbmVudHMgb2YgYSB2ZWMzIHRvIHRoZSBnaXZlbiB2YWx1ZXNcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHtOdW1iZXJ9IHggWCBjb21wb25lbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSB5IFkgY29tcG9uZW50XG4gKiBAcGFyYW0ge051bWJlcn0geiBaIGNvbXBvbmVudFxuICogQHJldHVybnMge3ZlYzN9IG91dFxuICovXG52ZWMzLnNldCA9IGZ1bmN0aW9uKG91dCwgeCwgeSwgeikge1xuICAgIG91dFswXSA9IHg7XG4gICAgb3V0WzFdID0geTtcbiAgICBvdXRbMl0gPSB6O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEFkZHMgdHdvIHZlYzMnc1xuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjM30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy5hZGQgPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdICsgYlswXTtcbiAgICBvdXRbMV0gPSBhWzFdICsgYlsxXTtcbiAgICBvdXRbMl0gPSBhWzJdICsgYlsyXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBTdWJ0cmFjdHMgdHdvIHZlYzMnc1xuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjM30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy5zdWJ0cmFjdCA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gLSBiWzBdO1xuICAgIG91dFsxXSA9IGFbMV0gLSBiWzFdO1xuICAgIG91dFsyXSA9IGFbMl0gLSBiWzJdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgdmVjMy5zdWJ0cmFjdH1cbiAqIEBmdW5jdGlvblxuICovXG52ZWMzLnN1YiA9IHZlYzMuc3VidHJhY3Q7XG5cbi8qKlxuICogTXVsdGlwbGllcyB0d28gdmVjMydzXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjM30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMzfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3ZlYzN9IG91dFxuICovXG52ZWMzLm11bHRpcGx5ID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSAqIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSAqIGJbMV07XG4gICAgb3V0WzJdID0gYVsyXSAqIGJbMl07XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayB2ZWMzLm11bHRpcGx5fVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzMubXVsID0gdmVjMy5tdWx0aXBseTtcblxuLyoqXG4gKiBEaXZpZGVzIHR3byB2ZWMzJ3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzN9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gKi9cbnZlYzMuZGl2aWRlID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSAvIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSAvIGJbMV07XG4gICAgb3V0WzJdID0gYVsyXSAvIGJbMl07XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayB2ZWMzLmRpdmlkZX1cbiAqIEBmdW5jdGlvblxuICovXG52ZWMzLmRpdiA9IHZlYzMuZGl2aWRlO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG1pbmltdW0gb2YgdHdvIHZlYzMnc1xuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjM30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy5taW4gPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBNYXRoLm1pbihhWzBdLCBiWzBdKTtcbiAgICBvdXRbMV0gPSBNYXRoLm1pbihhWzFdLCBiWzFdKTtcbiAgICBvdXRbMl0gPSBNYXRoLm1pbihhWzJdLCBiWzJdKTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBtYXhpbXVtIG9mIHR3byB2ZWMzJ3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzN9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gKi9cbnZlYzMubWF4ID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gTWF0aC5tYXgoYVswXSwgYlswXSk7XG4gICAgb3V0WzFdID0gTWF0aC5tYXgoYVsxXSwgYlsxXSk7XG4gICAgb3V0WzJdID0gTWF0aC5tYXgoYVsyXSwgYlsyXSk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogU2NhbGVzIGEgdmVjMyBieSBhIHNjYWxhciBudW1iZXJcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBhIHRoZSB2ZWN0b3IgdG8gc2NhbGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBiIGFtb3VudCB0byBzY2FsZSB0aGUgdmVjdG9yIGJ5XG4gKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gKi9cbnZlYzMuc2NhbGUgPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdICogYjtcbiAgICBvdXRbMV0gPSBhWzFdICogYjtcbiAgICBvdXRbMl0gPSBhWzJdICogYjtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBldWNsaWRpYW4gZGlzdGFuY2UgYmV0d2VlbiB0d28gdmVjMydzXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzN9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBkaXN0YW5jZSBiZXR3ZWVuIGEgYW5kIGJcbiAqL1xudmVjMy5kaXN0YW5jZSA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICB2YXIgeCA9IGJbMF0gLSBhWzBdLFxuICAgICAgICB5ID0gYlsxXSAtIGFbMV0sXG4gICAgICAgIHogPSBiWzJdIC0gYVsyXTtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHgqeCArIHkqeSArIHoqeik7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgdmVjMy5kaXN0YW5jZX1cbiAqIEBmdW5jdGlvblxuICovXG52ZWMzLmRpc3QgPSB2ZWMzLmRpc3RhbmNlO1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIHNxdWFyZWQgZXVjbGlkaWFuIGRpc3RhbmNlIGJldHdlZW4gdHdvIHZlYzMnc1xuICpcbiAqIEBwYXJhbSB7dmVjM30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMzfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge051bWJlcn0gc3F1YXJlZCBkaXN0YW5jZSBiZXR3ZWVuIGEgYW5kIGJcbiAqL1xudmVjMy5zcXVhcmVkRGlzdGFuY2UgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgdmFyIHggPSBiWzBdIC0gYVswXSxcbiAgICAgICAgeSA9IGJbMV0gLSBhWzFdLFxuICAgICAgICB6ID0gYlsyXSAtIGFbMl07XG4gICAgcmV0dXJuIHgqeCArIHkqeSArIHoqejtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayB2ZWMzLnNxdWFyZWREaXN0YW5jZX1cbiAqIEBmdW5jdGlvblxuICovXG52ZWMzLnNxckRpc3QgPSB2ZWMzLnNxdWFyZWREaXN0YW5jZTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBsZW5ndGggb2YgYSB2ZWMzXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBhIHZlY3RvciB0byBjYWxjdWxhdGUgbGVuZ3RoIG9mXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBsZW5ndGggb2YgYVxuICovXG52ZWMzLmxlbmd0aCA9IGZ1bmN0aW9uIChhKSB7XG4gICAgdmFyIHggPSBhWzBdLFxuICAgICAgICB5ID0gYVsxXSxcbiAgICAgICAgeiA9IGFbMl07XG4gICAgcmV0dXJuIE1hdGguc3FydCh4KnggKyB5KnkgKyB6KnopO1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzMubGVuZ3RofVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzMubGVuID0gdmVjMy5sZW5ndGg7XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgc3F1YXJlZCBsZW5ndGggb2YgYSB2ZWMzXG4gKlxuICogQHBhcmFtIHt2ZWMzfSBhIHZlY3RvciB0byBjYWxjdWxhdGUgc3F1YXJlZCBsZW5ndGggb2ZcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IHNxdWFyZWQgbGVuZ3RoIG9mIGFcbiAqL1xudmVjMy5zcXVhcmVkTGVuZ3RoID0gZnVuY3Rpb24gKGEpIHtcbiAgICB2YXIgeCA9IGFbMF0sXG4gICAgICAgIHkgPSBhWzFdLFxuICAgICAgICB6ID0gYVsyXTtcbiAgICByZXR1cm4geCp4ICsgeSp5ICsgeip6O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzMuc3F1YXJlZExlbmd0aH1cbiAqIEBmdW5jdGlvblxuICovXG52ZWMzLnNxckxlbiA9IHZlYzMuc3F1YXJlZExlbmd0aDtcblxuLyoqXG4gKiBOZWdhdGVzIHRoZSBjb21wb25lbnRzIG9mIGEgdmVjM1xuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdmVjdG9yIHRvIG5lZ2F0ZVxuICogQHJldHVybnMge3ZlYzN9IG91dFxuICovXG52ZWMzLm5lZ2F0ZSA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIG91dFswXSA9IC1hWzBdO1xuICAgIG91dFsxXSA9IC1hWzFdO1xuICAgIG91dFsyXSA9IC1hWzJdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIE5vcm1hbGl6ZSBhIHZlYzNcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBhIHZlY3RvciB0byBub3JtYWxpemVcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy5ub3JtYWxpemUgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICB2YXIgeCA9IGFbMF0sXG4gICAgICAgIHkgPSBhWzFdLFxuICAgICAgICB6ID0gYVsyXTtcbiAgICB2YXIgbGVuID0geCp4ICsgeSp5ICsgeip6O1xuICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgIC8vVE9ETzogZXZhbHVhdGUgdXNlIG9mIGdsbV9pbnZzcXJ0IGhlcmU/XG4gICAgICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQobGVuKTtcbiAgICAgICAgb3V0WzBdID0gYVswXSAqIGxlbjtcbiAgICAgICAgb3V0WzFdID0gYVsxXSAqIGxlbjtcbiAgICAgICAgb3V0WzJdID0gYVsyXSAqIGxlbjtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIHZlYzMnc1xuICpcbiAqIEBwYXJhbSB7dmVjM30gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWMzfSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge051bWJlcn0gZG90IHByb2R1Y3Qgb2YgYSBhbmQgYlxuICovXG52ZWMzLmRvdCA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgcmV0dXJuIGFbMF0gKiBiWzBdICsgYVsxXSAqIGJbMV0gKyBhWzJdICogYlsyXTtcbn07XG5cbi8qKlxuICogQ29tcHV0ZXMgdGhlIGNyb3NzIHByb2R1Y3Qgb2YgdHdvIHZlYzMnc1xuICpcbiAqIEBwYXJhbSB7dmVjM30gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzN9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjM30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy5jcm9zcyA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIHZhciBheCA9IGFbMF0sIGF5ID0gYVsxXSwgYXogPSBhWzJdLFxuICAgICAgICBieCA9IGJbMF0sIGJ5ID0gYlsxXSwgYnogPSBiWzJdO1xuXG4gICAgb3V0WzBdID0gYXkgKiBieiAtIGF6ICogYnk7XG4gICAgb3V0WzFdID0gYXogKiBieCAtIGF4ICogYno7XG4gICAgb3V0WzJdID0gYXggKiBieSAtIGF5ICogYng7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUGVyZm9ybXMgYSBsaW5lYXIgaW50ZXJwb2xhdGlvbiBiZXR3ZWVuIHR3byB2ZWMzJ3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzN9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcGFyYW0ge051bWJlcn0gdCBpbnRlcnBvbGF0aW9uIGFtb3VudCBiZXR3ZWVuIHRoZSB0d28gaW5wdXRzXG4gKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gKi9cbnZlYzMubGVycCA9IGZ1bmN0aW9uIChvdXQsIGEsIGIsIHQpIHtcbiAgICB2YXIgYXggPSBhWzBdLFxuICAgICAgICBheSA9IGFbMV0sXG4gICAgICAgIGF6ID0gYVsyXTtcbiAgICBvdXRbMF0gPSBheCArIHQgKiAoYlswXSAtIGF4KTtcbiAgICBvdXRbMV0gPSBheSArIHQgKiAoYlsxXSAtIGF5KTtcbiAgICBvdXRbMl0gPSBheiArIHQgKiAoYlsyXSAtIGF6KTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSB2ZWMzIHdpdGggYSBtYXQ0LlxuICogNHRoIHZlY3RvciBjb21wb25lbnQgaXMgaW1wbGljaXRseSAnMSdcbiAqXG4gKiBAcGFyYW0ge3ZlYzN9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWMzfSBhIHRoZSB2ZWN0b3IgdG8gdHJhbnNmb3JtXG4gKiBAcGFyYW0ge21hdDR9IG0gbWF0cml4IHRvIHRyYW5zZm9ybSB3aXRoXG4gKiBAcmV0dXJucyB7dmVjM30gb3V0XG4gKi9cbnZlYzMudHJhbnNmb3JtTWF0NCA9IGZ1bmN0aW9uKG91dCwgYSwgbSkge1xuICAgIHZhciB4ID0gYVswXSwgeSA9IGFbMV0sIHogPSBhWzJdO1xuICAgIG91dFswXSA9IG1bMF0gKiB4ICsgbVs0XSAqIHkgKyBtWzhdICogeiArIG1bMTJdO1xuICAgIG91dFsxXSA9IG1bMV0gKiB4ICsgbVs1XSAqIHkgKyBtWzldICogeiArIG1bMTNdO1xuICAgIG91dFsyXSA9IG1bMl0gKiB4ICsgbVs2XSAqIHkgKyBtWzEwXSAqIHogKyBtWzE0XTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSB2ZWMzIHdpdGggYSBxdWF0XG4gKlxuICogQHBhcmFtIHt2ZWMzfSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjM30gYSB0aGUgdmVjdG9yIHRvIHRyYW5zZm9ybVxuICogQHBhcmFtIHtxdWF0fSBxIHF1YXRlcm5pb24gdG8gdHJhbnNmb3JtIHdpdGhcbiAqIEByZXR1cm5zIHt2ZWMzfSBvdXRcbiAqL1xudmVjMy50cmFuc2Zvcm1RdWF0ID0gZnVuY3Rpb24ob3V0LCBhLCBxKSB7XG4gICAgdmFyIHggPSBhWzBdLCB5ID0gYVsxXSwgeiA9IGFbMl0sXG4gICAgICAgIHF4ID0gcVswXSwgcXkgPSBxWzFdLCBxeiA9IHFbMl0sIHF3ID0gcVszXSxcblxuICAgICAgICAvLyBjYWxjdWxhdGUgcXVhdCAqIHZlY1xuICAgICAgICBpeCA9IHF3ICogeCArIHF5ICogeiAtIHF6ICogeSxcbiAgICAgICAgaXkgPSBxdyAqIHkgKyBxeiAqIHggLSBxeCAqIHosXG4gICAgICAgIGl6ID0gcXcgKiB6ICsgcXggKiB5IC0gcXkgKiB4LFxuICAgICAgICBpdyA9IC1xeCAqIHggLSBxeSAqIHkgLSBxeiAqIHo7XG5cbiAgICAvLyBjYWxjdWxhdGUgcmVzdWx0ICogaW52ZXJzZSBxdWF0XG4gICAgb3V0WzBdID0gaXggKiBxdyArIGl3ICogLXF4ICsgaXkgKiAtcXogLSBpeiAqIC1xeTtcbiAgICBvdXRbMV0gPSBpeSAqIHF3ICsgaXcgKiAtcXkgKyBpeiAqIC1xeCAtIGl4ICogLXF6O1xuICAgIG91dFsyXSA9IGl6ICogcXcgKyBpdyAqIC1xeiArIGl4ICogLXF5IC0gaXkgKiAtcXg7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUGVyZm9ybSBzb21lIG9wZXJhdGlvbiBvdmVyIGFuIGFycmF5IG9mIHZlYzNzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGEgdGhlIGFycmF5IG9mIHZlY3RvcnMgdG8gaXRlcmF0ZSBvdmVyXG4gKiBAcGFyYW0ge051bWJlcn0gc3RyaWRlIE51bWJlciBvZiBlbGVtZW50cyBiZXR3ZWVuIHRoZSBzdGFydCBvZiBlYWNoIHZlYzMuIElmIDAgYXNzdW1lcyB0aWdodGx5IHBhY2tlZFxuICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldCBOdW1iZXIgb2YgZWxlbWVudHMgdG8gc2tpcCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBhcnJheVxuICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50IE51bWJlciBvZiB2ZWMzcyB0byBpdGVyYXRlIG92ZXIuIElmIDAgaXRlcmF0ZXMgb3ZlciBlbnRpcmUgYXJyYXlcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIEZ1bmN0aW9uIHRvIGNhbGwgZm9yIGVhY2ggdmVjdG9yIGluIHRoZSBhcnJheVxuICogQHBhcmFtIHtPYmplY3R9IFthcmddIGFkZGl0aW9uYWwgYXJndW1lbnQgdG8gcGFzcyB0byBmblxuICogQHJldHVybnMge0FycmF5fSBhXG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjMy5mb3JFYWNoID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ZWMgPSB2ZWMzLmNyZWF0ZSgpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGEsIHN0cmlkZSwgb2Zmc2V0LCBjb3VudCwgZm4sIGFyZykge1xuICAgICAgICB2YXIgaSwgbDtcbiAgICAgICAgaWYoIXN0cmlkZSkge1xuICAgICAgICAgICAgc3RyaWRlID0gMztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCFvZmZzZXQpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmKGNvdW50KSB7XG4gICAgICAgICAgICBsID0gTWF0aC5taW4oKGNvdW50ICogc3RyaWRlKSArIG9mZnNldCwgYS5sZW5ndGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbCA9IGEubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGkgPSBvZmZzZXQ7IGkgPCBsOyBpICs9IHN0cmlkZSkge1xuICAgICAgICAgICAgdmVjWzBdID0gYVtpXTsgdmVjWzFdID0gYVtpKzFdOyB2ZWNbMl0gPSBhW2krMl07XG4gICAgICAgICAgICBmbih2ZWMsIHZlYywgYXJnKTtcbiAgICAgICAgICAgIGFbaV0gPSB2ZWNbMF07IGFbaSsxXSA9IHZlY1sxXTsgYVtpKzJdID0gdmVjWzJdO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gYTtcbiAgICB9O1xufSkoKTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgdmVjdG9yXG4gKlxuICogQHBhcmFtIHt2ZWMzfSB2ZWMgdmVjdG9yIHRvIHJlcHJlc2VudCBhcyBhIHN0cmluZ1xuICogQHJldHVybnMge1N0cmluZ30gc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3JcbiAqL1xudmVjMy5zdHIgPSBmdW5jdGlvbiAoYSkge1xuICAgIHJldHVybiAndmVjMygnICsgYVswXSArICcsICcgKyBhWzFdICsgJywgJyArIGFbMl0gKyAnKSc7XG59O1xuXG5pZih0eXBlb2YoZXhwb3J0cykgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZXhwb3J0cy52ZWMzID0gdmVjMztcbn1cbjtcbi8qIENvcHlyaWdodCAoYykgMjAxMywgQnJhbmRvbiBKb25lcywgQ29saW4gTWFjS2VuemllIElWLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuXG5SZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXQgbW9kaWZpY2F0aW9uLFxuYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuXG4gICogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzXG4gICAgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuICAgIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb24gXG4gICAgYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG5cblRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORFxuQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRURcbldBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgXG5ESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIEhPTERFUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUlxuQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTXG4oSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7XG5MT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT05cbkFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4oSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJU1xuU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuICovXG5cbi8qKlxuICogQGNsYXNzIDQgRGltZW5zaW9uYWwgVmVjdG9yXG4gKiBAbmFtZSB2ZWM0XG4gKi9cblxudmFyIHZlYzQgPSB7fTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3LCBlbXB0eSB2ZWM0XG4gKlxuICogQHJldHVybnMge3ZlYzR9IGEgbmV3IDREIHZlY3RvclxuICovXG52ZWM0LmNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvdXQgPSBuZXcgR0xNQVRfQVJSQVlfVFlQRSg0KTtcbiAgICBvdXRbMF0gPSAwO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAwO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgdmVjNCBpbml0aWFsaXplZCB3aXRoIHZhbHVlcyBmcm9tIGFuIGV4aXN0aW5nIHZlY3RvclxuICpcbiAqIEBwYXJhbSB7dmVjNH0gYSB2ZWN0b3IgdG8gY2xvbmVcbiAqIEByZXR1cm5zIHt2ZWM0fSBhIG5ldyA0RCB2ZWN0b3JcbiAqL1xudmVjNC5jbG9uZSA9IGZ1bmN0aW9uKGEpIHtcbiAgICB2YXIgb3V0ID0gbmV3IEdMTUFUX0FSUkFZX1RZUEUoNCk7XG4gICAgb3V0WzBdID0gYVswXTtcbiAgICBvdXRbMV0gPSBhWzFdO1xuICAgIG91dFsyXSA9IGFbMl07XG4gICAgb3V0WzNdID0gYVszXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHZlYzQgaW5pdGlhbGl6ZWQgd2l0aCB0aGUgZ2l2ZW4gdmFsdWVzXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHggWCBjb21wb25lbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSB5IFkgY29tcG9uZW50XG4gKiBAcGFyYW0ge051bWJlcn0geiBaIGNvbXBvbmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IHcgVyBjb21wb25lbnRcbiAqIEByZXR1cm5zIHt2ZWM0fSBhIG5ldyA0RCB2ZWN0b3JcbiAqL1xudmVjNC5mcm9tVmFsdWVzID0gZnVuY3Rpb24oeCwgeSwgeiwgdykge1xuICAgIHZhciBvdXQgPSBuZXcgR0xNQVRfQVJSQVlfVFlQRSg0KTtcbiAgICBvdXRbMF0gPSB4O1xuICAgIG91dFsxXSA9IHk7XG4gICAgb3V0WzJdID0gejtcbiAgICBvdXRbM10gPSB3O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENvcHkgdGhlIHZhbHVlcyBmcm9tIG9uZSB2ZWM0IHRvIGFub3RoZXJcbiAqXG4gKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWM0fSBhIHRoZSBzb3VyY2UgdmVjdG9yXG4gKiBAcmV0dXJucyB7dmVjNH0gb3V0XG4gKi9cbnZlYzQuY29weSA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICBvdXRbMl0gPSBhWzJdO1xuICAgIG91dFszXSA9IGFbM107XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogU2V0IHRoZSBjb21wb25lbnRzIG9mIGEgdmVjNCB0byB0aGUgZ2l2ZW4gdmFsdWVzXG4gKlxuICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7TnVtYmVyfSB4IFggY29tcG9uZW50XG4gKiBAcGFyYW0ge051bWJlcn0geSBZIGNvbXBvbmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IHogWiBjb21wb25lbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSB3IFcgY29tcG9uZW50XG4gKiBAcmV0dXJucyB7dmVjNH0gb3V0XG4gKi9cbnZlYzQuc2V0ID0gZnVuY3Rpb24ob3V0LCB4LCB5LCB6LCB3KSB7XG4gICAgb3V0WzBdID0geDtcbiAgICBvdXRbMV0gPSB5O1xuICAgIG91dFsyXSA9IHo7XG4gICAgb3V0WzNdID0gdztcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBBZGRzIHR3byB2ZWM0J3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWM0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7dmVjNH0gb3V0XG4gKi9cbnZlYzQuYWRkID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSArIGJbMF07XG4gICAgb3V0WzFdID0gYVsxXSArIGJbMV07XG4gICAgb3V0WzJdID0gYVsyXSArIGJbMl07XG4gICAgb3V0WzNdID0gYVszXSArIGJbM107XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogU3VidHJhY3RzIHR3byB2ZWM0J3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWM0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7dmVjNH0gb3V0XG4gKi9cbnZlYzQuc3VidHJhY3QgPSBmdW5jdGlvbihvdXQsIGEsIGIpIHtcbiAgICBvdXRbMF0gPSBhWzBdIC0gYlswXTtcbiAgICBvdXRbMV0gPSBhWzFdIC0gYlsxXTtcbiAgICBvdXRbMl0gPSBhWzJdIC0gYlsyXTtcbiAgICBvdXRbM10gPSBhWzNdIC0gYlszXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzQuc3VidHJhY3R9XG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjNC5zdWIgPSB2ZWM0LnN1YnRyYWN0O1xuXG4vKipcbiAqIE11bHRpcGxpZXMgdHdvIHZlYzQnc1xuICpcbiAqIEBwYXJhbSB7dmVjNH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7dmVjNH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHt2ZWM0fSBvdXRcbiAqL1xudmVjNC5tdWx0aXBseSA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gKiBiWzBdO1xuICAgIG91dFsxXSA9IGFbMV0gKiBiWzFdO1xuICAgIG91dFsyXSA9IGFbMl0gKiBiWzJdO1xuICAgIG91dFszXSA9IGFbM10gKiBiWzNdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgdmVjNC5tdWx0aXBseX1cbiAqIEBmdW5jdGlvblxuICovXG52ZWM0Lm11bCA9IHZlYzQubXVsdGlwbHk7XG5cbi8qKlxuICogRGl2aWRlcyB0d28gdmVjNCdzXG4gKlxuICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjNH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWM0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3ZlYzR9IG91dFxuICovXG52ZWM0LmRpdmlkZSA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IGFbMF0gLyBiWzBdO1xuICAgIG91dFsxXSA9IGFbMV0gLyBiWzFdO1xuICAgIG91dFsyXSA9IGFbMl0gLyBiWzJdO1xuICAgIG91dFszXSA9IGFbM10gLyBiWzNdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgdmVjNC5kaXZpZGV9XG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjNC5kaXYgPSB2ZWM0LmRpdmlkZTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBtaW5pbXVtIG9mIHR3byB2ZWM0J3NcbiAqXG4gKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWM0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7dmVjNH0gb3V0XG4gKi9cbnZlYzQubWluID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gTWF0aC5taW4oYVswXSwgYlswXSk7XG4gICAgb3V0WzFdID0gTWF0aC5taW4oYVsxXSwgYlsxXSk7XG4gICAgb3V0WzJdID0gTWF0aC5taW4oYVsyXSwgYlsyXSk7XG4gICAgb3V0WzNdID0gTWF0aC5taW4oYVszXSwgYlszXSk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbWF4aW11bSBvZiB0d28gdmVjNCdzXG4gKlxuICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjNH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWM0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3ZlYzR9IG91dFxuICovXG52ZWM0Lm1heCA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIG91dFswXSA9IE1hdGgubWF4KGFbMF0sIGJbMF0pO1xuICAgIG91dFsxXSA9IE1hdGgubWF4KGFbMV0sIGJbMV0pO1xuICAgIG91dFsyXSA9IE1hdGgubWF4KGFbMl0sIGJbMl0pO1xuICAgIG91dFszXSA9IE1hdGgubWF4KGFbM10sIGJbM10pO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFNjYWxlcyBhIHZlYzQgYnkgYSBzY2FsYXIgbnVtYmVyXG4gKlxuICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjNH0gYSB0aGUgdmVjdG9yIHRvIHNjYWxlXG4gKiBAcGFyYW0ge051bWJlcn0gYiBhbW91bnQgdG8gc2NhbGUgdGhlIHZlY3RvciBieVxuICogQHJldHVybnMge3ZlYzR9IG91dFxuICovXG52ZWM0LnNjYWxlID0gZnVuY3Rpb24ob3V0LCBhLCBiKSB7XG4gICAgb3V0WzBdID0gYVswXSAqIGI7XG4gICAgb3V0WzFdID0gYVsxXSAqIGI7XG4gICAgb3V0WzJdID0gYVsyXSAqIGI7XG4gICAgb3V0WzNdID0gYVszXSAqIGI7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgZXVjbGlkaWFuIGRpc3RhbmNlIGJldHdlZW4gdHdvIHZlYzQnc1xuICpcbiAqIEBwYXJhbSB7dmVjNH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWM0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge051bWJlcn0gZGlzdGFuY2UgYmV0d2VlbiBhIGFuZCBiXG4gKi9cbnZlYzQuZGlzdGFuY2UgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgdmFyIHggPSBiWzBdIC0gYVswXSxcbiAgICAgICAgeSA9IGJbMV0gLSBhWzFdLFxuICAgICAgICB6ID0gYlsyXSAtIGFbMl0sXG4gICAgICAgIHcgPSBiWzNdIC0gYVszXTtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHgqeCArIHkqeSArIHoqeiArIHcqdyk7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgdmVjNC5kaXN0YW5jZX1cbiAqIEBmdW5jdGlvblxuICovXG52ZWM0LmRpc3QgPSB2ZWM0LmRpc3RhbmNlO1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIHNxdWFyZWQgZXVjbGlkaWFuIGRpc3RhbmNlIGJldHdlZW4gdHdvIHZlYzQnc1xuICpcbiAqIEBwYXJhbSB7dmVjNH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWM0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge051bWJlcn0gc3F1YXJlZCBkaXN0YW5jZSBiZXR3ZWVuIGEgYW5kIGJcbiAqL1xudmVjNC5zcXVhcmVkRGlzdGFuY2UgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgdmFyIHggPSBiWzBdIC0gYVswXSxcbiAgICAgICAgeSA9IGJbMV0gLSBhWzFdLFxuICAgICAgICB6ID0gYlsyXSAtIGFbMl0sXG4gICAgICAgIHcgPSBiWzNdIC0gYVszXTtcbiAgICByZXR1cm4geCp4ICsgeSp5ICsgeip6ICsgdyp3O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzQuc3F1YXJlZERpc3RhbmNlfVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzQuc3FyRGlzdCA9IHZlYzQuc3F1YXJlZERpc3RhbmNlO1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGxlbmd0aCBvZiBhIHZlYzRcbiAqXG4gKiBAcGFyYW0ge3ZlYzR9IGEgdmVjdG9yIHRvIGNhbGN1bGF0ZSBsZW5ndGggb2ZcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IGxlbmd0aCBvZiBhXG4gKi9cbnZlYzQubGVuZ3RoID0gZnVuY3Rpb24gKGEpIHtcbiAgICB2YXIgeCA9IGFbMF0sXG4gICAgICAgIHkgPSBhWzFdLFxuICAgICAgICB6ID0gYVsyXSxcbiAgICAgICAgdyA9IGFbM107XG4gICAgcmV0dXJuIE1hdGguc3FydCh4KnggKyB5KnkgKyB6KnogKyB3KncpO1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHZlYzQubGVuZ3RofVxuICogQGZ1bmN0aW9uXG4gKi9cbnZlYzQubGVuID0gdmVjNC5sZW5ndGg7XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgc3F1YXJlZCBsZW5ndGggb2YgYSB2ZWM0XG4gKlxuICogQHBhcmFtIHt2ZWM0fSBhIHZlY3RvciB0byBjYWxjdWxhdGUgc3F1YXJlZCBsZW5ndGggb2ZcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IHNxdWFyZWQgbGVuZ3RoIG9mIGFcbiAqL1xudmVjNC5zcXVhcmVkTGVuZ3RoID0gZnVuY3Rpb24gKGEpIHtcbiAgICB2YXIgeCA9IGFbMF0sXG4gICAgICAgIHkgPSBhWzFdLFxuICAgICAgICB6ID0gYVsyXSxcbiAgICAgICAgdyA9IGFbM107XG4gICAgcmV0dXJuIHgqeCArIHkqeSArIHoqeiArIHcqdztcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayB2ZWM0LnNxdWFyZWRMZW5ndGh9XG4gKiBAZnVuY3Rpb25cbiAqL1xudmVjNC5zcXJMZW4gPSB2ZWM0LnNxdWFyZWRMZW5ndGg7XG5cbi8qKlxuICogTmVnYXRlcyB0aGUgY29tcG9uZW50cyBvZiBhIHZlYzRcbiAqXG4gKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWM0fSBhIHZlY3RvciB0byBuZWdhdGVcbiAqIEByZXR1cm5zIHt2ZWM0fSBvdXRcbiAqL1xudmVjNC5uZWdhdGUgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSAtYVswXTtcbiAgICBvdXRbMV0gPSAtYVsxXTtcbiAgICBvdXRbMl0gPSAtYVsyXTtcbiAgICBvdXRbM10gPSAtYVszXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBOb3JtYWxpemUgYSB2ZWM0XG4gKlxuICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjNH0gYSB2ZWN0b3IgdG8gbm9ybWFsaXplXG4gKiBAcmV0dXJucyB7dmVjNH0gb3V0XG4gKi9cbnZlYzQubm9ybWFsaXplID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgdmFyIHggPSBhWzBdLFxuICAgICAgICB5ID0gYVsxXSxcbiAgICAgICAgeiA9IGFbMl0sXG4gICAgICAgIHcgPSBhWzNdO1xuICAgIHZhciBsZW4gPSB4KnggKyB5KnkgKyB6KnogKyB3Knc7XG4gICAgaWYgKGxlbiA+IDApIHtcbiAgICAgICAgbGVuID0gMSAvIE1hdGguc3FydChsZW4pO1xuICAgICAgICBvdXRbMF0gPSBhWzBdICogbGVuO1xuICAgICAgICBvdXRbMV0gPSBhWzFdICogbGVuO1xuICAgICAgICBvdXRbMl0gPSBhWzJdICogbGVuO1xuICAgICAgICBvdXRbM10gPSBhWzNdICogbGVuO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gdmVjNCdzXG4gKlxuICogQHBhcmFtIHt2ZWM0fSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge3ZlYzR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBkb3QgcHJvZHVjdCBvZiBhIGFuZCBiXG4gKi9cbnZlYzQuZG90ID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gYVswXSAqIGJbMF0gKyBhWzFdICogYlsxXSArIGFbMl0gKiBiWzJdICsgYVszXSAqIGJbM107XG59O1xuXG4vKipcbiAqIFBlcmZvcm1zIGEgbGluZWFyIGludGVycG9sYXRpb24gYmV0d2VlbiB0d28gdmVjNCdzXG4gKlxuICogQHBhcmFtIHt2ZWM0fSBvdXQgdGhlIHJlY2VpdmluZyB2ZWN0b3JcbiAqIEBwYXJhbSB7dmVjNH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHt2ZWM0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHBhcmFtIHtOdW1iZXJ9IHQgaW50ZXJwb2xhdGlvbiBhbW91bnQgYmV0d2VlbiB0aGUgdHdvIGlucHV0c1xuICogQHJldHVybnMge3ZlYzR9IG91dFxuICovXG52ZWM0LmxlcnAgPSBmdW5jdGlvbiAob3V0LCBhLCBiLCB0KSB7XG4gICAgdmFyIGF4ID0gYVswXSxcbiAgICAgICAgYXkgPSBhWzFdLFxuICAgICAgICBheiA9IGFbMl0sXG4gICAgICAgIGF3ID0gYVszXTtcbiAgICBvdXRbMF0gPSBheCArIHQgKiAoYlswXSAtIGF4KTtcbiAgICBvdXRbMV0gPSBheSArIHQgKiAoYlsxXSAtIGF5KTtcbiAgICBvdXRbMl0gPSBheiArIHQgKiAoYlsyXSAtIGF6KTtcbiAgICBvdXRbM10gPSBhdyArIHQgKiAoYlszXSAtIGF3KTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSB2ZWM0IHdpdGggYSBtYXQ0LlxuICpcbiAqIEBwYXJhbSB7dmVjNH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3ZlYzR9IGEgdGhlIHZlY3RvciB0byB0cmFuc2Zvcm1cbiAqIEBwYXJhbSB7bWF0NH0gbSBtYXRyaXggdG8gdHJhbnNmb3JtIHdpdGhcbiAqIEByZXR1cm5zIHt2ZWM0fSBvdXRcbiAqL1xudmVjNC50cmFuc2Zvcm1NYXQ0ID0gZnVuY3Rpb24ob3V0LCBhLCBtKSB7XG4gICAgdmFyIHggPSBhWzBdLCB5ID0gYVsxXSwgeiA9IGFbMl0sIHcgPSBhWzNdO1xuICAgIG91dFswXSA9IG1bMF0gKiB4ICsgbVs0XSAqIHkgKyBtWzhdICogeiArIG1bMTJdICogdztcbiAgICBvdXRbMV0gPSBtWzFdICogeCArIG1bNV0gKiB5ICsgbVs5XSAqIHogKyBtWzEzXSAqIHc7XG4gICAgb3V0WzJdID0gbVsyXSAqIHggKyBtWzZdICogeSArIG1bMTBdICogeiArIG1bMTRdICogdztcbiAgICBvdXRbM10gPSBtWzNdICogeCArIG1bN10gKiB5ICsgbVsxMV0gKiB6ICsgbVsxNV0gKiB3O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFRyYW5zZm9ybXMgdGhlIHZlYzQgd2l0aCBhIHF1YXRcbiAqXG4gKiBAcGFyYW0ge3ZlYzR9IG91dCB0aGUgcmVjZWl2aW5nIHZlY3RvclxuICogQHBhcmFtIHt2ZWM0fSBhIHRoZSB2ZWN0b3IgdG8gdHJhbnNmb3JtXG4gKiBAcGFyYW0ge3F1YXR9IHEgcXVhdGVybmlvbiB0byB0cmFuc2Zvcm0gd2l0aFxuICogQHJldHVybnMge3ZlYzR9IG91dFxuICovXG52ZWM0LnRyYW5zZm9ybVF1YXQgPSBmdW5jdGlvbihvdXQsIGEsIHEpIHtcbiAgICB2YXIgeCA9IGFbMF0sIHkgPSBhWzFdLCB6ID0gYVsyXSxcbiAgICAgICAgcXggPSBxWzBdLCBxeSA9IHFbMV0sIHF6ID0gcVsyXSwgcXcgPSBxWzNdLFxuXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBxdWF0ICogdmVjXG4gICAgICAgIGl4ID0gcXcgKiB4ICsgcXkgKiB6IC0gcXogKiB5LFxuICAgICAgICBpeSA9IHF3ICogeSArIHF6ICogeCAtIHF4ICogeixcbiAgICAgICAgaXogPSBxdyAqIHogKyBxeCAqIHkgLSBxeSAqIHgsXG4gICAgICAgIGl3ID0gLXF4ICogeCAtIHF5ICogeSAtIHF6ICogejtcblxuICAgIC8vIGNhbGN1bGF0ZSByZXN1bHQgKiBpbnZlcnNlIHF1YXRcbiAgICBvdXRbMF0gPSBpeCAqIHF3ICsgaXcgKiAtcXggKyBpeSAqIC1xeiAtIGl6ICogLXF5O1xuICAgIG91dFsxXSA9IGl5ICogcXcgKyBpdyAqIC1xeSArIGl6ICogLXF4IC0gaXggKiAtcXo7XG4gICAgb3V0WzJdID0gaXogKiBxdyArIGl3ICogLXF6ICsgaXggKiAtcXkgLSBpeSAqIC1xeDtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBQZXJmb3JtIHNvbWUgb3BlcmF0aW9uIG92ZXIgYW4gYXJyYXkgb2YgdmVjNHMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYSB0aGUgYXJyYXkgb2YgdmVjdG9ycyB0byBpdGVyYXRlIG92ZXJcbiAqIEBwYXJhbSB7TnVtYmVyfSBzdHJpZGUgTnVtYmVyIG9mIGVsZW1lbnRzIGJldHdlZW4gdGhlIHN0YXJ0IG9mIGVhY2ggdmVjNC4gSWYgMCBhc3N1bWVzIHRpZ2h0bHkgcGFja2VkXG4gKiBAcGFyYW0ge051bWJlcn0gb2Zmc2V0IE51bWJlciBvZiBlbGVtZW50cyB0byBza2lwIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGFycmF5XG4gKiBAcGFyYW0ge051bWJlcn0gY291bnQgTnVtYmVyIG9mIHZlYzJzIHRvIGl0ZXJhdGUgb3Zlci4gSWYgMCBpdGVyYXRlcyBvdmVyIGVudGlyZSBhcnJheVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gRnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCB2ZWN0b3IgaW4gdGhlIGFycmF5XG4gKiBAcGFyYW0ge09iamVjdH0gW2FyZ10gYWRkaXRpb25hbCBhcmd1bWVudCB0byBwYXNzIHRvIGZuXG4gKiBAcmV0dXJucyB7QXJyYXl9IGFcbiAqIEBmdW5jdGlvblxuICovXG52ZWM0LmZvckVhY2ggPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZlYyA9IHZlYzQuY3JlYXRlKCk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oYSwgc3RyaWRlLCBvZmZzZXQsIGNvdW50LCBmbiwgYXJnKSB7XG4gICAgICAgIHZhciBpLCBsO1xuICAgICAgICBpZighc3RyaWRlKSB7XG4gICAgICAgICAgICBzdHJpZGUgPSA0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIW9mZnNldCkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gMDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYoY291bnQpIHtcbiAgICAgICAgICAgIGwgPSBNYXRoLm1pbigoY291bnQgKiBzdHJpZGUpICsgb2Zmc2V0LCBhLmxlbmd0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsID0gYS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IoaSA9IG9mZnNldDsgaSA8IGw7IGkgKz0gc3RyaWRlKSB7XG4gICAgICAgICAgICB2ZWNbMF0gPSBhW2ldOyB2ZWNbMV0gPSBhW2krMV07IHZlY1syXSA9IGFbaSsyXTsgdmVjWzNdID0gYVtpKzNdO1xuICAgICAgICAgICAgZm4odmVjLCB2ZWMsIGFyZyk7XG4gICAgICAgICAgICBhW2ldID0gdmVjWzBdOyBhW2krMV0gPSB2ZWNbMV07IGFbaSsyXSA9IHZlY1syXTsgYVtpKzNdID0gdmVjWzNdO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gYTtcbiAgICB9O1xufSkoKTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgdmVjdG9yXG4gKlxuICogQHBhcmFtIHt2ZWM0fSB2ZWMgdmVjdG9yIHRvIHJlcHJlc2VudCBhcyBhIHN0cmluZ1xuICogQHJldHVybnMge1N0cmluZ30gc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB2ZWN0b3JcbiAqL1xudmVjNC5zdHIgPSBmdW5jdGlvbiAoYSkge1xuICAgIHJldHVybiAndmVjNCgnICsgYVswXSArICcsICcgKyBhWzFdICsgJywgJyArIGFbMl0gKyAnLCAnICsgYVszXSArICcpJztcbn07XG5cbmlmKHR5cGVvZihleHBvcnRzKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBleHBvcnRzLnZlYzQgPSB2ZWM0O1xufVxuO1xuLyogQ29weXJpZ2h0IChjKSAyMDEzLCBCcmFuZG9uIEpvbmVzLCBDb2xpbiBNYWNLZW56aWUgSVYuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cblJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dCBtb2RpZmljYXRpb24sXG5hcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG5cbiAgKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXNcbiAgICBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAgKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4gICAgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBcbiAgICBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cblxuVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCIgQU5EXG5BTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRFxuV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBcbkRJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgSE9MREVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SXG5BTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVNcbihJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUztcbkxPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTlxuQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcbihJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTXG5TT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS4gKi9cblxuLyoqXG4gKiBAY2xhc3MgMngyIE1hdHJpeFxuICogQG5hbWUgbWF0MlxuICovXG5cbnZhciBtYXQyID0ge307XG5cbnZhciBtYXQySWRlbnRpdHkgPSBuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAxLCAwLFxuICAgIDAsIDFcbl0pO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgaWRlbnRpdHkgbWF0MlxuICpcbiAqIEByZXR1cm5zIHttYXQyfSBhIG5ldyAyeDIgbWF0cml4XG4gKi9cbm1hdDIuY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG91dCA9IG5ldyBHTE1BVF9BUlJBWV9UWVBFKDQpO1xuICAgIG91dFswXSA9IDE7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBtYXQyIGluaXRpYWxpemVkIHdpdGggdmFsdWVzIGZyb20gYW4gZXhpc3RpbmcgbWF0cml4XG4gKlxuICogQHBhcmFtIHttYXQyfSBhIG1hdHJpeCB0byBjbG9uZVxuICogQHJldHVybnMge21hdDJ9IGEgbmV3IDJ4MiBtYXRyaXhcbiAqL1xubWF0Mi5jbG9uZSA9IGZ1bmN0aW9uKGEpIHtcbiAgICB2YXIgb3V0ID0gbmV3IEdMTUFUX0FSUkFZX1RZUEUoNCk7XG4gICAgb3V0WzBdID0gYVswXTtcbiAgICBvdXRbMV0gPSBhWzFdO1xuICAgIG91dFsyXSA9IGFbMl07XG4gICAgb3V0WzNdID0gYVszXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgbWF0MiB0byBhbm90aGVyXG4gKlxuICogQHBhcmFtIHttYXQyfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0Mn0gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge21hdDJ9IG91dFxuICovXG5tYXQyLmNvcHkgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gYVsyXTtcbiAgICBvdXRbM10gPSBhWzNdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFNldCBhIG1hdDIgdG8gdGhlIGlkZW50aXR5IG1hdHJpeFxuICpcbiAqIEBwYXJhbSB7bWF0Mn0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0Mn0gb3V0XG4gKi9cbm1hdDIuaWRlbnRpdHkgPSBmdW5jdGlvbihvdXQpIHtcbiAgICBvdXRbMF0gPSAxO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAxO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFRyYW5zcG9zZSB0aGUgdmFsdWVzIG9mIGEgbWF0MlxuICpcbiAqIEBwYXJhbSB7bWF0Mn0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDJ9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAqIEByZXR1cm5zIHttYXQyfSBvdXRcbiAqL1xubWF0Mi50cmFuc3Bvc2UgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICAvLyBJZiB3ZSBhcmUgdHJhbnNwb3Npbmcgb3Vyc2VsdmVzIHdlIGNhbiBza2lwIGEgZmV3IHN0ZXBzIGJ1dCBoYXZlIHRvIGNhY2hlIHNvbWUgdmFsdWVzXG4gICAgaWYgKG91dCA9PT0gYSkge1xuICAgICAgICB2YXIgYTEgPSBhWzFdO1xuICAgICAgICBvdXRbMV0gPSBhWzJdO1xuICAgICAgICBvdXRbMl0gPSBhMTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvdXRbMF0gPSBhWzBdO1xuICAgICAgICBvdXRbMV0gPSBhWzJdO1xuICAgICAgICBvdXRbMl0gPSBhWzFdO1xuICAgICAgICBvdXRbM10gPSBhWzNdO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBJbnZlcnRzIGEgbWF0MlxuICpcbiAqIEBwYXJhbSB7bWF0Mn0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDJ9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAqIEByZXR1cm5zIHttYXQyfSBvdXRcbiAqL1xubWF0Mi5pbnZlcnQgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICB2YXIgYTAgPSBhWzBdLCBhMSA9IGFbMV0sIGEyID0gYVsyXSwgYTMgPSBhWzNdLFxuXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgZGV0ZXJtaW5hbnRcbiAgICAgICAgZGV0ID0gYTAgKiBhMyAtIGEyICogYTE7XG5cbiAgICBpZiAoIWRldCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZGV0ID0gMS4wIC8gZGV0O1xuICAgIFxuICAgIG91dFswXSA9ICBhMyAqIGRldDtcbiAgICBvdXRbMV0gPSAtYTEgKiBkZXQ7XG4gICAgb3V0WzJdID0gLWEyICogZGV0O1xuICAgIG91dFszXSA9ICBhMCAqIGRldDtcblxuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGFkanVnYXRlIG9mIGEgbWF0MlxuICpcbiAqIEBwYXJhbSB7bWF0Mn0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDJ9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAqIEByZXR1cm5zIHttYXQyfSBvdXRcbiAqL1xubWF0Mi5hZGpvaW50ID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgLy8gQ2FjaGluZyB0aGlzIHZhbHVlIGlzIG5lc3NlY2FyeSBpZiBvdXQgPT0gYVxuICAgIHZhciBhMCA9IGFbMF07XG4gICAgb3V0WzBdID0gIGFbM107XG4gICAgb3V0WzFdID0gLWFbMV07XG4gICAgb3V0WzJdID0gLWFbMl07XG4gICAgb3V0WzNdID0gIGEwO1xuXG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgZGV0ZXJtaW5hbnQgb2YgYSBtYXQyXG4gKlxuICogQHBhcmFtIHttYXQyfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7TnVtYmVyfSBkZXRlcm1pbmFudCBvZiBhXG4gKi9cbm1hdDIuZGV0ZXJtaW5hbnQgPSBmdW5jdGlvbiAoYSkge1xuICAgIHJldHVybiBhWzBdICogYVszXSAtIGFbMl0gKiBhWzFdO1xufTtcblxuLyoqXG4gKiBNdWx0aXBsaWVzIHR3byBtYXQyJ3NcbiAqXG4gKiBAcGFyYW0ge21hdDJ9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQyfSBhIHRoZSBmaXJzdCBvcGVyYW5kXG4gKiBAcGFyYW0ge21hdDJ9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7bWF0Mn0gb3V0XG4gKi9cbm1hdDIubXVsdGlwbHkgPSBmdW5jdGlvbiAob3V0LCBhLCBiKSB7XG4gICAgdmFyIGEwID0gYVswXSwgYTEgPSBhWzFdLCBhMiA9IGFbMl0sIGEzID0gYVszXTtcbiAgICB2YXIgYjAgPSBiWzBdLCBiMSA9IGJbMV0sIGIyID0gYlsyXSwgYjMgPSBiWzNdO1xuICAgIG91dFswXSA9IGEwICogYjAgKyBhMSAqIGIyO1xuICAgIG91dFsxXSA9IGEwICogYjEgKyBhMSAqIGIzO1xuICAgIG91dFsyXSA9IGEyICogYjAgKyBhMyAqIGIyO1xuICAgIG91dFszXSA9IGEyICogYjEgKyBhMyAqIGIzO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgbWF0Mi5tdWx0aXBseX1cbiAqIEBmdW5jdGlvblxuICovXG5tYXQyLm11bCA9IG1hdDIubXVsdGlwbHk7XG5cbi8qKlxuICogUm90YXRlcyBhIG1hdDIgYnkgdGhlIGdpdmVuIGFuZ2xlXG4gKlxuICogQHBhcmFtIHttYXQyfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0Mn0gYSB0aGUgbWF0cml4IHRvIHJvdGF0ZVxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcbiAqIEByZXR1cm5zIHttYXQyfSBvdXRcbiAqL1xubWF0Mi5yb3RhdGUgPSBmdW5jdGlvbiAob3V0LCBhLCByYWQpIHtcbiAgICB2YXIgYTAgPSBhWzBdLCBhMSA9IGFbMV0sIGEyID0gYVsyXSwgYTMgPSBhWzNdLFxuICAgICAgICBzID0gTWF0aC5zaW4ocmFkKSxcbiAgICAgICAgYyA9IE1hdGguY29zKHJhZCk7XG4gICAgb3V0WzBdID0gYTAgKiAgYyArIGExICogcztcbiAgICBvdXRbMV0gPSBhMCAqIC1zICsgYTEgKiBjO1xuICAgIG91dFsyXSA9IGEyICogIGMgKyBhMyAqIHM7XG4gICAgb3V0WzNdID0gYTIgKiAtcyArIGEzICogYztcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBTY2FsZXMgdGhlIG1hdDIgYnkgdGhlIGRpbWVuc2lvbnMgaW4gdGhlIGdpdmVuIHZlYzJcbiAqXG4gKiBAcGFyYW0ge21hdDJ9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQyfSBhIHRoZSBtYXRyaXggdG8gcm90YXRlXG4gKiBAcGFyYW0ge3ZlYzJ9IHYgdGhlIHZlYzIgdG8gc2NhbGUgdGhlIG1hdHJpeCBieVxuICogQHJldHVybnMge21hdDJ9IG91dFxuICoqL1xubWF0Mi5zY2FsZSA9IGZ1bmN0aW9uKG91dCwgYSwgdikge1xuICAgIHZhciBhMCA9IGFbMF0sIGExID0gYVsxXSwgYTIgPSBhWzJdLCBhMyA9IGFbM10sXG4gICAgICAgIHYwID0gdlswXSwgdjEgPSB2WzFdO1xuICAgIG91dFswXSA9IGEwICogdjA7XG4gICAgb3V0WzFdID0gYTEgKiB2MTtcbiAgICBvdXRbMl0gPSBhMiAqIHYwO1xuICAgIG91dFszXSA9IGEzICogdjE7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIG1hdDJcbiAqXG4gKiBAcGFyYW0ge21hdDJ9IG1hdCBtYXRyaXggdG8gcmVwcmVzZW50IGFzIGEgc3RyaW5nXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIG1hdHJpeFxuICovXG5tYXQyLnN0ciA9IGZ1bmN0aW9uIChhKSB7XG4gICAgcmV0dXJuICdtYXQyKCcgKyBhWzBdICsgJywgJyArIGFbMV0gKyAnLCAnICsgYVsyXSArICcsICcgKyBhWzNdICsgJyknO1xufTtcblxuaWYodHlwZW9mKGV4cG9ydHMpICE9PSAndW5kZWZpbmVkJykge1xuICAgIGV4cG9ydHMubWF0MiA9IG1hdDI7XG59XG47XG4vKiBDb3B5cmlnaHQgKGMpIDIwMTMsIEJyYW5kb24gSm9uZXMsIENvbGluIE1hY0tlbnppZSBJVi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cblxuUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0IG1vZGlmaWNhdGlvbixcbmFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcblxuICAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpc1xuICAgIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcbiAgICB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uIFxuICAgIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuXG5USElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIiBBTkRcbkFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEXG5XQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIFxuRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBIT0xERVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1JcbkFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFU1xuKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTO1xuTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OXG5BTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVFxuKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVNcblNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLiAqL1xuXG4vKipcbiAqIEBjbGFzcyAyeDMgTWF0cml4XG4gKiBAbmFtZSBtYXQyZFxuICogXG4gKiBAZGVzY3JpcHRpb24gXG4gKiBBIG1hdDJkIGNvbnRhaW5zIHNpeCBlbGVtZW50cyBkZWZpbmVkIGFzOlxuICogPHByZT5cbiAqIFthLCBiLFxuICogIGMsIGQsXG4gKiAgdHgsdHldXG4gKiA8L3ByZT5cbiAqIFRoaXMgaXMgYSBzaG9ydCBmb3JtIGZvciB0aGUgM3gzIG1hdHJpeDpcbiAqIDxwcmU+XG4gKiBbYSwgYiwgMFxuICogIGMsIGQsIDBcbiAqICB0eCx0eSwxXVxuICogPC9wcmU+XG4gKiBUaGUgbGFzdCBjb2x1bW4gaXMgaWdub3JlZCBzbyB0aGUgYXJyYXkgaXMgc2hvcnRlciBhbmQgb3BlcmF0aW9ucyBhcmUgZmFzdGVyLlxuICovXG5cbnZhciBtYXQyZCA9IHt9O1xuXG52YXIgbWF0MmRJZGVudGl0eSA9IG5ldyBGbG9hdDMyQXJyYXkoW1xuICAgIDEsIDAsXG4gICAgMCwgMSxcbiAgICAwLCAwXG5dKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGlkZW50aXR5IG1hdDJkXG4gKlxuICogQHJldHVybnMge21hdDJkfSBhIG5ldyAyeDMgbWF0cml4XG4gKi9cbm1hdDJkLmNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvdXQgPSBuZXcgR0xNQVRfQVJSQVlfVFlQRSg2KTtcbiAgICBvdXRbMF0gPSAxO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAxO1xuICAgIG91dFs0XSA9IDA7XG4gICAgb3V0WzVdID0gMDtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IG1hdDJkIGluaXRpYWxpemVkIHdpdGggdmFsdWVzIGZyb20gYW4gZXhpc3RpbmcgbWF0cml4XG4gKlxuICogQHBhcmFtIHttYXQyZH0gYSBtYXRyaXggdG8gY2xvbmVcbiAqIEByZXR1cm5zIHttYXQyZH0gYSBuZXcgMngzIG1hdHJpeFxuICovXG5tYXQyZC5jbG9uZSA9IGZ1bmN0aW9uKGEpIHtcbiAgICB2YXIgb3V0ID0gbmV3IEdMTUFUX0FSUkFZX1RZUEUoNik7XG4gICAgb3V0WzBdID0gYVswXTtcbiAgICBvdXRbMV0gPSBhWzFdO1xuICAgIG91dFsyXSA9IGFbMl07XG4gICAgb3V0WzNdID0gYVszXTtcbiAgICBvdXRbNF0gPSBhWzRdO1xuICAgIG91dFs1XSA9IGFbNV07XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ29weSB0aGUgdmFsdWVzIGZyb20gb25lIG1hdDJkIHRvIGFub3RoZXJcbiAqXG4gKiBAcGFyYW0ge21hdDJkfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0MmR9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAqIEByZXR1cm5zIHttYXQyZH0gb3V0XG4gKi9cbm1hdDJkLmNvcHkgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gYVsyXTtcbiAgICBvdXRbM10gPSBhWzNdO1xuICAgIG91dFs0XSA9IGFbNF07XG4gICAgb3V0WzVdID0gYVs1XTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBTZXQgYSBtYXQyZCB0byB0aGUgaWRlbnRpdHkgbWF0cml4XG4gKlxuICogQHBhcmFtIHttYXQyZH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0MmR9IG91dFxuICovXG5tYXQyZC5pZGVudGl0eSA9IGZ1bmN0aW9uKG91dCkge1xuICAgIG91dFswXSA9IDE7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDE7XG4gICAgb3V0WzRdID0gMDtcbiAgICBvdXRbNV0gPSAwO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEludmVydHMgYSBtYXQyZFxuICpcbiAqIEBwYXJhbSB7bWF0MmR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQyZH0gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge21hdDJkfSBvdXRcbiAqL1xubWF0MmQuaW52ZXJ0ID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgdmFyIGFhID0gYVswXSwgYWIgPSBhWzFdLCBhYyA9IGFbMl0sIGFkID0gYVszXSxcbiAgICAgICAgYXR4ID0gYVs0XSwgYXR5ID0gYVs1XTtcblxuICAgIHZhciBkZXQgPSBhYSAqIGFkIC0gYWIgKiBhYztcbiAgICBpZighZGV0KXtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGRldCA9IDEuMCAvIGRldDtcblxuICAgIG91dFswXSA9IGFkICogZGV0O1xuICAgIG91dFsxXSA9IC1hYiAqIGRldDtcbiAgICBvdXRbMl0gPSAtYWMgKiBkZXQ7XG4gICAgb3V0WzNdID0gYWEgKiBkZXQ7XG4gICAgb3V0WzRdID0gKGFjICogYXR5IC0gYWQgKiBhdHgpICogZGV0O1xuICAgIG91dFs1XSA9IChhYiAqIGF0eCAtIGFhICogYXR5KSAqIGRldDtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBkZXRlcm1pbmFudCBvZiBhIG1hdDJkXG4gKlxuICogQHBhcmFtIHttYXQyZH0gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge051bWJlcn0gZGV0ZXJtaW5hbnQgb2YgYVxuICovXG5tYXQyZC5kZXRlcm1pbmFudCA9IGZ1bmN0aW9uIChhKSB7XG4gICAgcmV0dXJuIGFbMF0gKiBhWzNdIC0gYVsxXSAqIGFbMl07XG59O1xuXG4vKipcbiAqIE11bHRpcGxpZXMgdHdvIG1hdDJkJ3NcbiAqXG4gKiBAcGFyYW0ge21hdDJkfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0MmR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7bWF0MmR9IGIgdGhlIHNlY29uZCBvcGVyYW5kXG4gKiBAcmV0dXJucyB7bWF0MmR9IG91dFxuICovXG5tYXQyZC5tdWx0aXBseSA9IGZ1bmN0aW9uIChvdXQsIGEsIGIpIHtcbiAgICB2YXIgYWEgPSBhWzBdLCBhYiA9IGFbMV0sIGFjID0gYVsyXSwgYWQgPSBhWzNdLFxuICAgICAgICBhdHggPSBhWzRdLCBhdHkgPSBhWzVdLFxuICAgICAgICBiYSA9IGJbMF0sIGJiID0gYlsxXSwgYmMgPSBiWzJdLCBiZCA9IGJbM10sXG4gICAgICAgIGJ0eCA9IGJbNF0sIGJ0eSA9IGJbNV07XG5cbiAgICBvdXRbMF0gPSBhYSpiYSArIGFiKmJjO1xuICAgIG91dFsxXSA9IGFhKmJiICsgYWIqYmQ7XG4gICAgb3V0WzJdID0gYWMqYmEgKyBhZCpiYztcbiAgICBvdXRbM10gPSBhYypiYiArIGFkKmJkO1xuICAgIG91dFs0XSA9IGJhKmF0eCArIGJjKmF0eSArIGJ0eDtcbiAgICBvdXRbNV0gPSBiYiphdHggKyBiZCphdHkgKyBidHk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayBtYXQyZC5tdWx0aXBseX1cbiAqIEBmdW5jdGlvblxuICovXG5tYXQyZC5tdWwgPSBtYXQyZC5tdWx0aXBseTtcblxuXG4vKipcbiAqIFJvdGF0ZXMgYSBtYXQyZCBieSB0aGUgZ2l2ZW4gYW5nbGVcbiAqXG4gKiBAcGFyYW0ge21hdDJkfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0MmR9IGEgdGhlIG1hdHJpeCB0byByb3RhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0MmR9IG91dFxuICovXG5tYXQyZC5yb3RhdGUgPSBmdW5jdGlvbiAob3V0LCBhLCByYWQpIHtcbiAgICB2YXIgYWEgPSBhWzBdLFxuICAgICAgICBhYiA9IGFbMV0sXG4gICAgICAgIGFjID0gYVsyXSxcbiAgICAgICAgYWQgPSBhWzNdLFxuICAgICAgICBhdHggPSBhWzRdLFxuICAgICAgICBhdHkgPSBhWzVdLFxuICAgICAgICBzdCA9IE1hdGguc2luKHJhZCksXG4gICAgICAgIGN0ID0gTWF0aC5jb3MocmFkKTtcblxuICAgIG91dFswXSA9IGFhKmN0ICsgYWIqc3Q7XG4gICAgb3V0WzFdID0gLWFhKnN0ICsgYWIqY3Q7XG4gICAgb3V0WzJdID0gYWMqY3QgKyBhZCpzdDtcbiAgICBvdXRbM10gPSAtYWMqc3QgKyBjdCphZDtcbiAgICBvdXRbNF0gPSBjdCphdHggKyBzdCphdHk7XG4gICAgb3V0WzVdID0gY3QqYXR5IC0gc3QqYXR4O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFNjYWxlcyB0aGUgbWF0MmQgYnkgdGhlIGRpbWVuc2lvbnMgaW4gdGhlIGdpdmVuIHZlYzJcbiAqXG4gKiBAcGFyYW0ge21hdDJkfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0MmR9IGEgdGhlIG1hdHJpeCB0byB0cmFuc2xhdGVcbiAqIEBwYXJhbSB7bWF0MmR9IHYgdGhlIHZlYzIgdG8gc2NhbGUgdGhlIG1hdHJpeCBieVxuICogQHJldHVybnMge21hdDJkfSBvdXRcbiAqKi9cbm1hdDJkLnNjYWxlID0gZnVuY3Rpb24ob3V0LCBhLCB2KSB7XG4gICAgdmFyIHZ4ID0gdlswXSwgdnkgPSB2WzFdO1xuICAgIG91dFswXSA9IGFbMF0gKiB2eDtcbiAgICBvdXRbMV0gPSBhWzFdICogdnk7XG4gICAgb3V0WzJdID0gYVsyXSAqIHZ4O1xuICAgIG91dFszXSA9IGFbM10gKiB2eTtcbiAgICBvdXRbNF0gPSBhWzRdICogdng7XG4gICAgb3V0WzVdID0gYVs1XSAqIHZ5O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFRyYW5zbGF0ZXMgdGhlIG1hdDJkIGJ5IHRoZSBkaW1lbnNpb25zIGluIHRoZSBnaXZlbiB2ZWMyXG4gKlxuICogQHBhcmFtIHttYXQyZH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDJkfSBhIHRoZSBtYXRyaXggdG8gdHJhbnNsYXRlXG4gKiBAcGFyYW0ge21hdDJkfSB2IHRoZSB2ZWMyIHRvIHRyYW5zbGF0ZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0MmR9IG91dFxuICoqL1xubWF0MmQudHJhbnNsYXRlID0gZnVuY3Rpb24ob3V0LCBhLCB2KSB7XG4gICAgb3V0WzBdID0gYVswXTtcbiAgICBvdXRbMV0gPSBhWzFdO1xuICAgIG91dFsyXSA9IGFbMl07XG4gICAgb3V0WzNdID0gYVszXTtcbiAgICBvdXRbNF0gPSBhWzRdICsgdlswXTtcbiAgICBvdXRbNV0gPSBhWzVdICsgdlsxXTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgbWF0MmRcbiAqXG4gKiBAcGFyYW0ge21hdDJkfSBhIG1hdHJpeCB0byByZXByZXNlbnQgYXMgYSBzdHJpbmdcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgbWF0cml4XG4gKi9cbm1hdDJkLnN0ciA9IGZ1bmN0aW9uIChhKSB7XG4gICAgcmV0dXJuICdtYXQyZCgnICsgYVswXSArICcsICcgKyBhWzFdICsgJywgJyArIGFbMl0gKyAnLCAnICsgXG4gICAgICAgICAgICAgICAgICAgIGFbM10gKyAnLCAnICsgYVs0XSArICcsICcgKyBhWzVdICsgJyknO1xufTtcblxuaWYodHlwZW9mKGV4cG9ydHMpICE9PSAndW5kZWZpbmVkJykge1xuICAgIGV4cG9ydHMubWF0MmQgPSBtYXQyZDtcbn1cbjtcbi8qIENvcHlyaWdodCAoYykgMjAxMywgQnJhbmRvbiBKb25lcywgQ29saW4gTWFjS2VuemllIElWLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuXG5SZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXQgbW9kaWZpY2F0aW9uLFxuYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuXG4gICogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzXG4gICAgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuICAgIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb24gXG4gICAgYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG5cblRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORFxuQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRURcbldBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgXG5ESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIEhPTERFUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUlxuQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTXG4oSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7XG5MT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT05cbkFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4oSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJU1xuU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuICovXG5cbi8qKlxuICogQGNsYXNzIDN4MyBNYXRyaXhcbiAqIEBuYW1lIG1hdDNcbiAqL1xuXG52YXIgbWF0MyA9IHt9O1xuXG52YXIgbWF0M0lkZW50aXR5ID0gbmV3IEZsb2F0MzJBcnJheShbXG4gICAgMSwgMCwgMCxcbiAgICAwLCAxLCAwLFxuICAgIDAsIDAsIDFcbl0pO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgaWRlbnRpdHkgbWF0M1xuICpcbiAqIEByZXR1cm5zIHttYXQzfSBhIG5ldyAzeDMgbWF0cml4XG4gKi9cbm1hdDMuY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG91dCA9IG5ldyBHTE1BVF9BUlJBWV9UWVBFKDkpO1xuICAgIG91dFswXSA9IDE7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0gMTtcbiAgICBvdXRbNV0gPSAwO1xuICAgIG91dFs2XSA9IDA7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSAxO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgbWF0MyBpbml0aWFsaXplZCB3aXRoIHZhbHVlcyBmcm9tIGFuIGV4aXN0aW5nIG1hdHJpeFxuICpcbiAqIEBwYXJhbSB7bWF0M30gYSBtYXRyaXggdG8gY2xvbmVcbiAqIEByZXR1cm5zIHttYXQzfSBhIG5ldyAzeDMgbWF0cml4XG4gKi9cbm1hdDMuY2xvbmUgPSBmdW5jdGlvbihhKSB7XG4gICAgdmFyIG91dCA9IG5ldyBHTE1BVF9BUlJBWV9UWVBFKDkpO1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICBvdXRbMl0gPSBhWzJdO1xuICAgIG91dFszXSA9IGFbM107XG4gICAgb3V0WzRdID0gYVs0XTtcbiAgICBvdXRbNV0gPSBhWzVdO1xuICAgIG91dFs2XSA9IGFbNl07XG4gICAgb3V0WzddID0gYVs3XTtcbiAgICBvdXRbOF0gPSBhWzhdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENvcHkgdGhlIHZhbHVlcyBmcm9tIG9uZSBtYXQzIHRvIGFub3RoZXJcbiAqXG4gKiBAcGFyYW0ge21hdDN9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQzfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0M30gb3V0XG4gKi9cbm1hdDMuY29weSA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICBvdXRbMl0gPSBhWzJdO1xuICAgIG91dFszXSA9IGFbM107XG4gICAgb3V0WzRdID0gYVs0XTtcbiAgICBvdXRbNV0gPSBhWzVdO1xuICAgIG91dFs2XSA9IGFbNl07XG4gICAgb3V0WzddID0gYVs3XTtcbiAgICBvdXRbOF0gPSBhWzhdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFNldCBhIG1hdDMgdG8gdGhlIGlkZW50aXR5IG1hdHJpeFxuICpcbiAqIEBwYXJhbSB7bWF0M30gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0M30gb3V0XG4gKi9cbm1hdDMuaWRlbnRpdHkgPSBmdW5jdGlvbihvdXQpIHtcbiAgICBvdXRbMF0gPSAxO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IDE7XG4gICAgb3V0WzVdID0gMDtcbiAgICBvdXRbNl0gPSAwO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gMTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBUcmFuc3Bvc2UgdGhlIHZhbHVlcyBvZiBhIG1hdDNcbiAqXG4gKiBAcGFyYW0ge21hdDN9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQzfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0M30gb3V0XG4gKi9cbm1hdDMudHJhbnNwb3NlID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgLy8gSWYgd2UgYXJlIHRyYW5zcG9zaW5nIG91cnNlbHZlcyB3ZSBjYW4gc2tpcCBhIGZldyBzdGVwcyBidXQgaGF2ZSB0byBjYWNoZSBzb21lIHZhbHVlc1xuICAgIGlmIChvdXQgPT09IGEpIHtcbiAgICAgICAgdmFyIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sIGExMiA9IGFbNV07XG4gICAgICAgIG91dFsxXSA9IGFbM107XG4gICAgICAgIG91dFsyXSA9IGFbNl07XG4gICAgICAgIG91dFszXSA9IGEwMTtcbiAgICAgICAgb3V0WzVdID0gYVs3XTtcbiAgICAgICAgb3V0WzZdID0gYTAyO1xuICAgICAgICBvdXRbN10gPSBhMTI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb3V0WzBdID0gYVswXTtcbiAgICAgICAgb3V0WzFdID0gYVszXTtcbiAgICAgICAgb3V0WzJdID0gYVs2XTtcbiAgICAgICAgb3V0WzNdID0gYVsxXTtcbiAgICAgICAgb3V0WzRdID0gYVs0XTtcbiAgICAgICAgb3V0WzVdID0gYVs3XTtcbiAgICAgICAgb3V0WzZdID0gYVsyXTtcbiAgICAgICAgb3V0WzddID0gYVs1XTtcbiAgICAgICAgb3V0WzhdID0gYVs4XTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogSW52ZXJ0cyBhIG1hdDNcbiAqXG4gKiBAcGFyYW0ge21hdDN9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQzfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0M30gb3V0XG4gKi9cbm1hdDMuaW52ZXJ0ID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sXG4gICAgICAgIGExMCA9IGFbM10sIGExMSA9IGFbNF0sIGExMiA9IGFbNV0sXG4gICAgICAgIGEyMCA9IGFbNl0sIGEyMSA9IGFbN10sIGEyMiA9IGFbOF0sXG5cbiAgICAgICAgYjAxID0gYTIyICogYTExIC0gYTEyICogYTIxLFxuICAgICAgICBiMTEgPSAtYTIyICogYTEwICsgYTEyICogYTIwLFxuICAgICAgICBiMjEgPSBhMjEgKiBhMTAgLSBhMTEgKiBhMjAsXG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBkZXRlcm1pbmFudFxuICAgICAgICBkZXQgPSBhMDAgKiBiMDEgKyBhMDEgKiBiMTEgKyBhMDIgKiBiMjE7XG5cbiAgICBpZiAoIWRldCkgeyBcbiAgICAgICAgcmV0dXJuIG51bGw7IFxuICAgIH1cbiAgICBkZXQgPSAxLjAgLyBkZXQ7XG5cbiAgICBvdXRbMF0gPSBiMDEgKiBkZXQ7XG4gICAgb3V0WzFdID0gKC1hMjIgKiBhMDEgKyBhMDIgKiBhMjEpICogZGV0O1xuICAgIG91dFsyXSA9IChhMTIgKiBhMDEgLSBhMDIgKiBhMTEpICogZGV0O1xuICAgIG91dFszXSA9IGIxMSAqIGRldDtcbiAgICBvdXRbNF0gPSAoYTIyICogYTAwIC0gYTAyICogYTIwKSAqIGRldDtcbiAgICBvdXRbNV0gPSAoLWExMiAqIGEwMCArIGEwMiAqIGExMCkgKiBkZXQ7XG4gICAgb3V0WzZdID0gYjIxICogZGV0O1xuICAgIG91dFs3XSA9ICgtYTIxICogYTAwICsgYTAxICogYTIwKSAqIGRldDtcbiAgICBvdXRbOF0gPSAoYTExICogYTAwIC0gYTAxICogYTEwKSAqIGRldDtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBhZGp1Z2F0ZSBvZiBhIG1hdDNcbiAqXG4gKiBAcGFyYW0ge21hdDN9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQzfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0M30gb3V0XG4gKi9cbm1hdDMuYWRqb2ludCA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLFxuICAgICAgICBhMTAgPSBhWzNdLCBhMTEgPSBhWzRdLCBhMTIgPSBhWzVdLFxuICAgICAgICBhMjAgPSBhWzZdLCBhMjEgPSBhWzddLCBhMjIgPSBhWzhdO1xuXG4gICAgb3V0WzBdID0gKGExMSAqIGEyMiAtIGExMiAqIGEyMSk7XG4gICAgb3V0WzFdID0gKGEwMiAqIGEyMSAtIGEwMSAqIGEyMik7XG4gICAgb3V0WzJdID0gKGEwMSAqIGExMiAtIGEwMiAqIGExMSk7XG4gICAgb3V0WzNdID0gKGExMiAqIGEyMCAtIGExMCAqIGEyMik7XG4gICAgb3V0WzRdID0gKGEwMCAqIGEyMiAtIGEwMiAqIGEyMCk7XG4gICAgb3V0WzVdID0gKGEwMiAqIGExMCAtIGEwMCAqIGExMik7XG4gICAgb3V0WzZdID0gKGExMCAqIGEyMSAtIGExMSAqIGEyMCk7XG4gICAgb3V0WzddID0gKGEwMSAqIGEyMCAtIGEwMCAqIGEyMSk7XG4gICAgb3V0WzhdID0gKGEwMCAqIGExMSAtIGEwMSAqIGExMCk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgZGV0ZXJtaW5hbnQgb2YgYSBtYXQzXG4gKlxuICogQHBhcmFtIHttYXQzfSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7TnVtYmVyfSBkZXRlcm1pbmFudCBvZiBhXG4gKi9cbm1hdDMuZGV0ZXJtaW5hbnQgPSBmdW5jdGlvbiAoYSkge1xuICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLFxuICAgICAgICBhMTAgPSBhWzNdLCBhMTEgPSBhWzRdLCBhMTIgPSBhWzVdLFxuICAgICAgICBhMjAgPSBhWzZdLCBhMjEgPSBhWzddLCBhMjIgPSBhWzhdO1xuXG4gICAgcmV0dXJuIGEwMCAqIChhMjIgKiBhMTEgLSBhMTIgKiBhMjEpICsgYTAxICogKC1hMjIgKiBhMTAgKyBhMTIgKiBhMjApICsgYTAyICogKGEyMSAqIGExMCAtIGExMSAqIGEyMCk7XG59O1xuXG4vKipcbiAqIE11bHRpcGxpZXMgdHdvIG1hdDMnc1xuICpcbiAqIEBwYXJhbSB7bWF0M30gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDN9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7bWF0M30gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHttYXQzfSBvdXRcbiAqL1xubWF0My5tdWx0aXBseSA9IGZ1bmN0aW9uIChvdXQsIGEsIGIpIHtcbiAgICB2YXIgYTAwID0gYVswXSwgYTAxID0gYVsxXSwgYTAyID0gYVsyXSxcbiAgICAgICAgYTEwID0gYVszXSwgYTExID0gYVs0XSwgYTEyID0gYVs1XSxcbiAgICAgICAgYTIwID0gYVs2XSwgYTIxID0gYVs3XSwgYTIyID0gYVs4XSxcblxuICAgICAgICBiMDAgPSBiWzBdLCBiMDEgPSBiWzFdLCBiMDIgPSBiWzJdLFxuICAgICAgICBiMTAgPSBiWzNdLCBiMTEgPSBiWzRdLCBiMTIgPSBiWzVdLFxuICAgICAgICBiMjAgPSBiWzZdLCBiMjEgPSBiWzddLCBiMjIgPSBiWzhdO1xuXG4gICAgb3V0WzBdID0gYjAwICogYTAwICsgYjAxICogYTEwICsgYjAyICogYTIwO1xuICAgIG91dFsxXSA9IGIwMCAqIGEwMSArIGIwMSAqIGExMSArIGIwMiAqIGEyMTtcbiAgICBvdXRbMl0gPSBiMDAgKiBhMDIgKyBiMDEgKiBhMTIgKyBiMDIgKiBhMjI7XG5cbiAgICBvdXRbM10gPSBiMTAgKiBhMDAgKyBiMTEgKiBhMTAgKyBiMTIgKiBhMjA7XG4gICAgb3V0WzRdID0gYjEwICogYTAxICsgYjExICogYTExICsgYjEyICogYTIxO1xuICAgIG91dFs1XSA9IGIxMCAqIGEwMiArIGIxMSAqIGExMiArIGIxMiAqIGEyMjtcblxuICAgIG91dFs2XSA9IGIyMCAqIGEwMCArIGIyMSAqIGExMCArIGIyMiAqIGEyMDtcbiAgICBvdXRbN10gPSBiMjAgKiBhMDEgKyBiMjEgKiBhMTEgKyBiMjIgKiBhMjE7XG4gICAgb3V0WzhdID0gYjIwICogYTAyICsgYjIxICogYTEyICsgYjIyICogYTIyO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgbWF0My5tdWx0aXBseX1cbiAqIEBmdW5jdGlvblxuICovXG5tYXQzLm11bCA9IG1hdDMubXVsdGlwbHk7XG5cbi8qKlxuICogVHJhbnNsYXRlIGEgbWF0MyBieSB0aGUgZ2l2ZW4gdmVjdG9yXG4gKlxuICogQHBhcmFtIHttYXQzfSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0M30gYSB0aGUgbWF0cml4IHRvIHRyYW5zbGF0ZVxuICogQHBhcmFtIHt2ZWMyfSB2IHZlY3RvciB0byB0cmFuc2xhdGUgYnlcbiAqIEByZXR1cm5zIHttYXQzfSBvdXRcbiAqL1xubWF0My50cmFuc2xhdGUgPSBmdW5jdGlvbihvdXQsIGEsIHYpIHtcbiAgICB2YXIgYTAwID0gYVswXSwgYTAxID0gYVsxXSwgYTAyID0gYVsyXSxcbiAgICAgICAgYTEwID0gYVszXSwgYTExID0gYVs0XSwgYTEyID0gYVs1XSxcbiAgICAgICAgYTIwID0gYVs2XSwgYTIxID0gYVs3XSwgYTIyID0gYVs4XSxcbiAgICAgICAgeCA9IHZbMF0sIHkgPSB2WzFdO1xuXG4gICAgb3V0WzBdID0gYTAwO1xuICAgIG91dFsxXSA9IGEwMTtcbiAgICBvdXRbMl0gPSBhMDI7XG5cbiAgICBvdXRbM10gPSBhMTA7XG4gICAgb3V0WzRdID0gYTExO1xuICAgIG91dFs1XSA9IGExMjtcblxuICAgIG91dFs2XSA9IHggKiBhMDAgKyB5ICogYTEwICsgYTIwO1xuICAgIG91dFs3XSA9IHggKiBhMDEgKyB5ICogYTExICsgYTIxO1xuICAgIG91dFs4XSA9IHggKiBhMDIgKyB5ICogYTEyICsgYTIyO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFJvdGF0ZXMgYSBtYXQzIGJ5IHRoZSBnaXZlbiBhbmdsZVxuICpcbiAqIEBwYXJhbSB7bWF0M30gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDN9IGEgdGhlIG1hdHJpeCB0byByb3RhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0M30gb3V0XG4gKi9cbm1hdDMucm90YXRlID0gZnVuY3Rpb24gKG91dCwgYSwgcmFkKSB7XG4gICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sXG4gICAgICAgIGExMCA9IGFbM10sIGExMSA9IGFbNF0sIGExMiA9IGFbNV0sXG4gICAgICAgIGEyMCA9IGFbNl0sIGEyMSA9IGFbN10sIGEyMiA9IGFbOF0sXG5cbiAgICAgICAgcyA9IE1hdGguc2luKHJhZCksXG4gICAgICAgIGMgPSBNYXRoLmNvcyhyYWQpO1xuXG4gICAgb3V0WzBdID0gYyAqIGEwMCArIHMgKiBhMTA7XG4gICAgb3V0WzFdID0gYyAqIGEwMSArIHMgKiBhMTE7XG4gICAgb3V0WzJdID0gYyAqIGEwMiArIHMgKiBhMTI7XG5cbiAgICBvdXRbM10gPSBjICogYTEwIC0gcyAqIGEwMDtcbiAgICBvdXRbNF0gPSBjICogYTExIC0gcyAqIGEwMTtcbiAgICBvdXRbNV0gPSBjICogYTEyIC0gcyAqIGEwMjtcblxuICAgIG91dFs2XSA9IGEyMDtcbiAgICBvdXRbN10gPSBhMjE7XG4gICAgb3V0WzhdID0gYTIyO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFNjYWxlcyB0aGUgbWF0MyBieSB0aGUgZGltZW5zaW9ucyBpbiB0aGUgZ2l2ZW4gdmVjMlxuICpcbiAqIEBwYXJhbSB7bWF0M30gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDN9IGEgdGhlIG1hdHJpeCB0byByb3RhdGVcbiAqIEBwYXJhbSB7dmVjMn0gdiB0aGUgdmVjMiB0byBzY2FsZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0M30gb3V0XG4gKiovXG5tYXQzLnNjYWxlID0gZnVuY3Rpb24ob3V0LCBhLCB2KSB7XG4gICAgdmFyIHggPSB2WzBdLCB5ID0gdlsyXTtcblxuICAgIG91dFswXSA9IHggKiBhWzBdO1xuICAgIG91dFsxXSA9IHggKiBhWzFdO1xuICAgIG91dFsyXSA9IHggKiBhWzJdO1xuXG4gICAgb3V0WzNdID0geSAqIGFbM107XG4gICAgb3V0WzRdID0geSAqIGFbNF07XG4gICAgb3V0WzVdID0geSAqIGFbNV07XG5cbiAgICBvdXRbNl0gPSBhWzZdO1xuICAgIG91dFs3XSA9IGFbN107XG4gICAgb3V0WzhdID0gYVs4XTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDb3BpZXMgdGhlIHZhbHVlcyBmcm9tIGEgbWF0MmQgaW50byBhIG1hdDNcbiAqXG4gKiBAcGFyYW0ge21hdDN9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQzfSBhIHRoZSBtYXRyaXggdG8gcm90YXRlXG4gKiBAcGFyYW0ge3ZlYzJ9IHYgdGhlIHZlYzIgdG8gc2NhbGUgdGhlIG1hdHJpeCBieVxuICogQHJldHVybnMge21hdDN9IG91dFxuICoqL1xubWF0My5mcm9tTWF0MmQgPSBmdW5jdGlvbihvdXQsIGEpIHtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gMDtcblxuICAgIG91dFszXSA9IGFbMl07XG4gICAgb3V0WzRdID0gYVszXTtcbiAgICBvdXRbNV0gPSAwO1xuXG4gICAgb3V0WzZdID0gYVs0XTtcbiAgICBvdXRbN10gPSBhWzVdO1xuICAgIG91dFs4XSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuKiBDYWxjdWxhdGVzIGEgM3gzIG1hdHJpeCBmcm9tIHRoZSBnaXZlbiBxdWF0ZXJuaW9uXG4qXG4qIEBwYXJhbSB7bWF0M30gb3V0IG1hdDMgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiogQHBhcmFtIHtxdWF0fSBxIFF1YXRlcm5pb24gdG8gY3JlYXRlIG1hdHJpeCBmcm9tXG4qXG4qIEByZXR1cm5zIHttYXQzfSBvdXRcbiovXG5tYXQzLmZyb21RdWF0ID0gZnVuY3Rpb24gKG91dCwgcSkge1xuICAgIHZhciB4ID0gcVswXSwgeSA9IHFbMV0sIHogPSBxWzJdLCB3ID0gcVszXSxcbiAgICAgICAgeDIgPSB4ICsgeCxcbiAgICAgICAgeTIgPSB5ICsgeSxcbiAgICAgICAgejIgPSB6ICsgeixcblxuICAgICAgICB4eCA9IHggKiB4MixcbiAgICAgICAgeHkgPSB4ICogeTIsXG4gICAgICAgIHh6ID0geCAqIHoyLFxuICAgICAgICB5eSA9IHkgKiB5MixcbiAgICAgICAgeXogPSB5ICogejIsXG4gICAgICAgIHp6ID0geiAqIHoyLFxuICAgICAgICB3eCA9IHcgKiB4MixcbiAgICAgICAgd3kgPSB3ICogeTIsXG4gICAgICAgIHd6ID0gdyAqIHoyO1xuXG4gICAgb3V0WzBdID0gMSAtICh5eSArIHp6KTtcbiAgICBvdXRbMV0gPSB4eSArIHd6O1xuICAgIG91dFsyXSA9IHh6IC0gd3k7XG5cbiAgICBvdXRbM10gPSB4eSAtIHd6O1xuICAgIG91dFs0XSA9IDEgLSAoeHggKyB6eik7XG4gICAgb3V0WzVdID0geXogKyB3eDtcblxuICAgIG91dFs2XSA9IHh6ICsgd3k7XG4gICAgb3V0WzddID0geXogLSB3eDtcbiAgICBvdXRbOF0gPSAxIC0gKHh4ICsgeXkpO1xuXG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIG1hdDNcbiAqXG4gKiBAcGFyYW0ge21hdDN9IG1hdCBtYXRyaXggdG8gcmVwcmVzZW50IGFzIGEgc3RyaW5nXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIG1hdHJpeFxuICovXG5tYXQzLnN0ciA9IGZ1bmN0aW9uIChhKSB7XG4gICAgcmV0dXJuICdtYXQzKCcgKyBhWzBdICsgJywgJyArIGFbMV0gKyAnLCAnICsgYVsyXSArICcsICcgKyBcbiAgICAgICAgICAgICAgICAgICAgYVszXSArICcsICcgKyBhWzRdICsgJywgJyArIGFbNV0gKyAnLCAnICsgXG4gICAgICAgICAgICAgICAgICAgIGFbNl0gKyAnLCAnICsgYVs3XSArICcsICcgKyBhWzhdICsgJyknO1xufTtcblxuaWYodHlwZW9mKGV4cG9ydHMpICE9PSAndW5kZWZpbmVkJykge1xuICAgIGV4cG9ydHMubWF0MyA9IG1hdDM7XG59XG47XG4vKiBDb3B5cmlnaHQgKGMpIDIwMTMsIEJyYW5kb24gSm9uZXMsIENvbGluIE1hY0tlbnppZSBJVi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cblxuUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0IG1vZGlmaWNhdGlvbixcbmFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcblxuICAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpc1xuICAgIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcbiAgICB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uIFxuICAgIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuXG5USElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIiBBTkRcbkFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEXG5XQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIFxuRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBIT0xERVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1JcbkFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFU1xuKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTO1xuTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OXG5BTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVFxuKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVNcblNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLiAqL1xuXG4vKipcbiAqIEBjbGFzcyA0eDQgTWF0cml4XG4gKiBAbmFtZSBtYXQ0XG4gKi9cblxudmFyIG1hdDQgPSB7fTtcblxudmFyIG1hdDRJZGVudGl0eSA9IG5ldyBGbG9hdDMyQXJyYXkoW1xuICAgIDEsIDAsIDAsIDAsXG4gICAgMCwgMSwgMCwgMCxcbiAgICAwLCAwLCAxLCAwLFxuICAgIDAsIDAsIDAsIDFcbl0pO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgaWRlbnRpdHkgbWF0NFxuICpcbiAqIEByZXR1cm5zIHttYXQ0fSBhIG5ldyA0eDQgbWF0cml4XG4gKi9cbm1hdDQuY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG91dCA9IG5ldyBHTE1BVF9BUlJBWV9UWVBFKDE2KTtcbiAgICBvdXRbMF0gPSAxO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IDA7XG4gICAgb3V0WzVdID0gMTtcbiAgICBvdXRbNl0gPSAwO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0gMDtcbiAgICBvdXRbOV0gPSAwO1xuICAgIG91dFsxMF0gPSAxO1xuICAgIG91dFsxMV0gPSAwO1xuICAgIG91dFsxMl0gPSAwO1xuICAgIG91dFsxM10gPSAwO1xuICAgIG91dFsxNF0gPSAwO1xuICAgIG91dFsxNV0gPSAxO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgbWF0NCBpbml0aWFsaXplZCB3aXRoIHZhbHVlcyBmcm9tIGFuIGV4aXN0aW5nIG1hdHJpeFxuICpcbiAqIEBwYXJhbSB7bWF0NH0gYSBtYXRyaXggdG8gY2xvbmVcbiAqIEByZXR1cm5zIHttYXQ0fSBhIG5ldyA0eDQgbWF0cml4XG4gKi9cbm1hdDQuY2xvbmUgPSBmdW5jdGlvbihhKSB7XG4gICAgdmFyIG91dCA9IG5ldyBHTE1BVF9BUlJBWV9UWVBFKDE2KTtcbiAgICBvdXRbMF0gPSBhWzBdO1xuICAgIG91dFsxXSA9IGFbMV07XG4gICAgb3V0WzJdID0gYVsyXTtcbiAgICBvdXRbM10gPSBhWzNdO1xuICAgIG91dFs0XSA9IGFbNF07XG4gICAgb3V0WzVdID0gYVs1XTtcbiAgICBvdXRbNl0gPSBhWzZdO1xuICAgIG91dFs3XSA9IGFbN107XG4gICAgb3V0WzhdID0gYVs4XTtcbiAgICBvdXRbOV0gPSBhWzldO1xuICAgIG91dFsxMF0gPSBhWzEwXTtcbiAgICBvdXRbMTFdID0gYVsxMV07XG4gICAgb3V0WzEyXSA9IGFbMTJdO1xuICAgIG91dFsxM10gPSBhWzEzXTtcbiAgICBvdXRbMTRdID0gYVsxNF07XG4gICAgb3V0WzE1XSA9IGFbMTVdO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENvcHkgdGhlIHZhbHVlcyBmcm9tIG9uZSBtYXQ0IHRvIGFub3RoZXJcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQ0fSBhIHRoZSBzb3VyY2UgbWF0cml4XG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQuY29weSA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIG91dFswXSA9IGFbMF07XG4gICAgb3V0WzFdID0gYVsxXTtcbiAgICBvdXRbMl0gPSBhWzJdO1xuICAgIG91dFszXSA9IGFbM107XG4gICAgb3V0WzRdID0gYVs0XTtcbiAgICBvdXRbNV0gPSBhWzVdO1xuICAgIG91dFs2XSA9IGFbNl07XG4gICAgb3V0WzddID0gYVs3XTtcbiAgICBvdXRbOF0gPSBhWzhdO1xuICAgIG91dFs5XSA9IGFbOV07XG4gICAgb3V0WzEwXSA9IGFbMTBdO1xuICAgIG91dFsxMV0gPSBhWzExXTtcbiAgICBvdXRbMTJdID0gYVsxMl07XG4gICAgb3V0WzEzXSA9IGFbMTNdO1xuICAgIG91dFsxNF0gPSBhWzE0XTtcbiAgICBvdXRbMTVdID0gYVsxNV07XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogU2V0IGEgbWF0NCB0byB0aGUgaWRlbnRpdHkgbWF0cml4XG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC5pZGVudGl0eSA9IGZ1bmN0aW9uKG91dCkge1xuICAgIG91dFswXSA9IDE7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0gMDtcbiAgICBvdXRbNV0gPSAxO1xuICAgIG91dFs2XSA9IDA7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSAwO1xuICAgIG91dFs5XSA9IDA7XG4gICAgb3V0WzEwXSA9IDE7XG4gICAgb3V0WzExXSA9IDA7XG4gICAgb3V0WzEyXSA9IDA7XG4gICAgb3V0WzEzXSA9IDA7XG4gICAgb3V0WzE0XSA9IDA7XG4gICAgb3V0WzE1XSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogVHJhbnNwb3NlIHRoZSB2YWx1ZXMgb2YgYSBtYXQ0XG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5tYXQ0LnRyYW5zcG9zZSA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIC8vIElmIHdlIGFyZSB0cmFuc3Bvc2luZyBvdXJzZWx2ZXMgd2UgY2FuIHNraXAgYSBmZXcgc3RlcHMgYnV0IGhhdmUgdG8gY2FjaGUgc29tZSB2YWx1ZXNcbiAgICBpZiAob3V0ID09PSBhKSB7XG4gICAgICAgIHZhciBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLCBhMDMgPSBhWzNdLFxuICAgICAgICAgICAgYTEyID0gYVs2XSwgYTEzID0gYVs3XSxcbiAgICAgICAgICAgIGEyMyA9IGFbMTFdO1xuXG4gICAgICAgIG91dFsxXSA9IGFbNF07XG4gICAgICAgIG91dFsyXSA9IGFbOF07XG4gICAgICAgIG91dFszXSA9IGFbMTJdO1xuICAgICAgICBvdXRbNF0gPSBhMDE7XG4gICAgICAgIG91dFs2XSA9IGFbOV07XG4gICAgICAgIG91dFs3XSA9IGFbMTNdO1xuICAgICAgICBvdXRbOF0gPSBhMDI7XG4gICAgICAgIG91dFs5XSA9IGExMjtcbiAgICAgICAgb3V0WzExXSA9IGFbMTRdO1xuICAgICAgICBvdXRbMTJdID0gYTAzO1xuICAgICAgICBvdXRbMTNdID0gYTEzO1xuICAgICAgICBvdXRbMTRdID0gYTIzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG91dFswXSA9IGFbMF07XG4gICAgICAgIG91dFsxXSA9IGFbNF07XG4gICAgICAgIG91dFsyXSA9IGFbOF07XG4gICAgICAgIG91dFszXSA9IGFbMTJdO1xuICAgICAgICBvdXRbNF0gPSBhWzFdO1xuICAgICAgICBvdXRbNV0gPSBhWzVdO1xuICAgICAgICBvdXRbNl0gPSBhWzldO1xuICAgICAgICBvdXRbN10gPSBhWzEzXTtcbiAgICAgICAgb3V0WzhdID0gYVsyXTtcbiAgICAgICAgb3V0WzldID0gYVs2XTtcbiAgICAgICAgb3V0WzEwXSA9IGFbMTBdO1xuICAgICAgICBvdXRbMTFdID0gYVsxNF07XG4gICAgICAgIG91dFsxMl0gPSBhWzNdO1xuICAgICAgICBvdXRbMTNdID0gYVs3XTtcbiAgICAgICAgb3V0WzE0XSA9IGFbMTFdO1xuICAgICAgICBvdXRbMTVdID0gYVsxNV07XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEludmVydHMgYSBtYXQ0XG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5tYXQ0LmludmVydCA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIHZhciBhMDAgPSBhWzBdLCBhMDEgPSBhWzFdLCBhMDIgPSBhWzJdLCBhMDMgPSBhWzNdLFxuICAgICAgICBhMTAgPSBhWzRdLCBhMTEgPSBhWzVdLCBhMTIgPSBhWzZdLCBhMTMgPSBhWzddLFxuICAgICAgICBhMjAgPSBhWzhdLCBhMjEgPSBhWzldLCBhMjIgPSBhWzEwXSwgYTIzID0gYVsxMV0sXG4gICAgICAgIGEzMCA9IGFbMTJdLCBhMzEgPSBhWzEzXSwgYTMyID0gYVsxNF0sIGEzMyA9IGFbMTVdLFxuXG4gICAgICAgIGIwMCA9IGEwMCAqIGExMSAtIGEwMSAqIGExMCxcbiAgICAgICAgYjAxID0gYTAwICogYTEyIC0gYTAyICogYTEwLFxuICAgICAgICBiMDIgPSBhMDAgKiBhMTMgLSBhMDMgKiBhMTAsXG4gICAgICAgIGIwMyA9IGEwMSAqIGExMiAtIGEwMiAqIGExMSxcbiAgICAgICAgYjA0ID0gYTAxICogYTEzIC0gYTAzICogYTExLFxuICAgICAgICBiMDUgPSBhMDIgKiBhMTMgLSBhMDMgKiBhMTIsXG4gICAgICAgIGIwNiA9IGEyMCAqIGEzMSAtIGEyMSAqIGEzMCxcbiAgICAgICAgYjA3ID0gYTIwICogYTMyIC0gYTIyICogYTMwLFxuICAgICAgICBiMDggPSBhMjAgKiBhMzMgLSBhMjMgKiBhMzAsXG4gICAgICAgIGIwOSA9IGEyMSAqIGEzMiAtIGEyMiAqIGEzMSxcbiAgICAgICAgYjEwID0gYTIxICogYTMzIC0gYTIzICogYTMxLFxuICAgICAgICBiMTEgPSBhMjIgKiBhMzMgLSBhMjMgKiBhMzIsXG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBkZXRlcm1pbmFudFxuICAgICAgICBkZXQgPSBiMDAgKiBiMTEgLSBiMDEgKiBiMTAgKyBiMDIgKiBiMDkgKyBiMDMgKiBiMDggLSBiMDQgKiBiMDcgKyBiMDUgKiBiMDY7XG5cbiAgICBpZiAoIWRldCkgeyBcbiAgICAgICAgcmV0dXJuIG51bGw7IFxuICAgIH1cbiAgICBkZXQgPSAxLjAgLyBkZXQ7XG5cbiAgICBvdXRbMF0gPSAoYTExICogYjExIC0gYTEyICogYjEwICsgYTEzICogYjA5KSAqIGRldDtcbiAgICBvdXRbMV0gPSAoYTAyICogYjEwIC0gYTAxICogYjExIC0gYTAzICogYjA5KSAqIGRldDtcbiAgICBvdXRbMl0gPSAoYTMxICogYjA1IC0gYTMyICogYjA0ICsgYTMzICogYjAzKSAqIGRldDtcbiAgICBvdXRbM10gPSAoYTIyICogYjA0IC0gYTIxICogYjA1IC0gYTIzICogYjAzKSAqIGRldDtcbiAgICBvdXRbNF0gPSAoYTEyICogYjA4IC0gYTEwICogYjExIC0gYTEzICogYjA3KSAqIGRldDtcbiAgICBvdXRbNV0gPSAoYTAwICogYjExIC0gYTAyICogYjA4ICsgYTAzICogYjA3KSAqIGRldDtcbiAgICBvdXRbNl0gPSAoYTMyICogYjAyIC0gYTMwICogYjA1IC0gYTMzICogYjAxKSAqIGRldDtcbiAgICBvdXRbN10gPSAoYTIwICogYjA1IC0gYTIyICogYjAyICsgYTIzICogYjAxKSAqIGRldDtcbiAgICBvdXRbOF0gPSAoYTEwICogYjEwIC0gYTExICogYjA4ICsgYTEzICogYjA2KSAqIGRldDtcbiAgICBvdXRbOV0gPSAoYTAxICogYjA4IC0gYTAwICogYjEwIC0gYTAzICogYjA2KSAqIGRldDtcbiAgICBvdXRbMTBdID0gKGEzMCAqIGIwNCAtIGEzMSAqIGIwMiArIGEzMyAqIGIwMCkgKiBkZXQ7XG4gICAgb3V0WzExXSA9IChhMjEgKiBiMDIgLSBhMjAgKiBiMDQgLSBhMjMgKiBiMDApICogZGV0O1xuICAgIG91dFsxMl0gPSAoYTExICogYjA3IC0gYTEwICogYjA5IC0gYTEyICogYjA2KSAqIGRldDtcbiAgICBvdXRbMTNdID0gKGEwMCAqIGIwOSAtIGEwMSAqIGIwNyArIGEwMiAqIGIwNikgKiBkZXQ7XG4gICAgb3V0WzE0XSA9IChhMzEgKiBiMDEgLSBhMzAgKiBiMDMgLSBhMzIgKiBiMDApICogZGV0O1xuICAgIG91dFsxNV0gPSAoYTIwICogYjAzIC0gYTIxICogYjAxICsgYTIyICogYjAwKSAqIGRldDtcblxuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGFkanVnYXRlIG9mIGEgbWF0NFxuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDR9IGEgdGhlIHNvdXJjZSBtYXRyaXhcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC5hZGpvaW50ID0gZnVuY3Rpb24ob3V0LCBhKSB7XG4gICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl0sIGEwMyA9IGFbM10sXG4gICAgICAgIGExMCA9IGFbNF0sIGExMSA9IGFbNV0sIGExMiA9IGFbNl0sIGExMyA9IGFbN10sXG4gICAgICAgIGEyMCA9IGFbOF0sIGEyMSA9IGFbOV0sIGEyMiA9IGFbMTBdLCBhMjMgPSBhWzExXSxcbiAgICAgICAgYTMwID0gYVsxMl0sIGEzMSA9IGFbMTNdLCBhMzIgPSBhWzE0XSwgYTMzID0gYVsxNV07XG5cbiAgICBvdXRbMF0gID0gIChhMTEgKiAoYTIyICogYTMzIC0gYTIzICogYTMyKSAtIGEyMSAqIChhMTIgKiBhMzMgLSBhMTMgKiBhMzIpICsgYTMxICogKGExMiAqIGEyMyAtIGExMyAqIGEyMikpO1xuICAgIG91dFsxXSAgPSAtKGEwMSAqIChhMjIgKiBhMzMgLSBhMjMgKiBhMzIpIC0gYTIxICogKGEwMiAqIGEzMyAtIGEwMyAqIGEzMikgKyBhMzEgKiAoYTAyICogYTIzIC0gYTAzICogYTIyKSk7XG4gICAgb3V0WzJdICA9ICAoYTAxICogKGExMiAqIGEzMyAtIGExMyAqIGEzMikgLSBhMTEgKiAoYTAyICogYTMzIC0gYTAzICogYTMyKSArIGEzMSAqIChhMDIgKiBhMTMgLSBhMDMgKiBhMTIpKTtcbiAgICBvdXRbM10gID0gLShhMDEgKiAoYTEyICogYTIzIC0gYTEzICogYTIyKSAtIGExMSAqIChhMDIgKiBhMjMgLSBhMDMgKiBhMjIpICsgYTIxICogKGEwMiAqIGExMyAtIGEwMyAqIGExMikpO1xuICAgIG91dFs0XSAgPSAtKGExMCAqIChhMjIgKiBhMzMgLSBhMjMgKiBhMzIpIC0gYTIwICogKGExMiAqIGEzMyAtIGExMyAqIGEzMikgKyBhMzAgKiAoYTEyICogYTIzIC0gYTEzICogYTIyKSk7XG4gICAgb3V0WzVdICA9ICAoYTAwICogKGEyMiAqIGEzMyAtIGEyMyAqIGEzMikgLSBhMjAgKiAoYTAyICogYTMzIC0gYTAzICogYTMyKSArIGEzMCAqIChhMDIgKiBhMjMgLSBhMDMgKiBhMjIpKTtcbiAgICBvdXRbNl0gID0gLShhMDAgKiAoYTEyICogYTMzIC0gYTEzICogYTMyKSAtIGExMCAqIChhMDIgKiBhMzMgLSBhMDMgKiBhMzIpICsgYTMwICogKGEwMiAqIGExMyAtIGEwMyAqIGExMikpO1xuICAgIG91dFs3XSAgPSAgKGEwMCAqIChhMTIgKiBhMjMgLSBhMTMgKiBhMjIpIC0gYTEwICogKGEwMiAqIGEyMyAtIGEwMyAqIGEyMikgKyBhMjAgKiAoYTAyICogYTEzIC0gYTAzICogYTEyKSk7XG4gICAgb3V0WzhdICA9ICAoYTEwICogKGEyMSAqIGEzMyAtIGEyMyAqIGEzMSkgLSBhMjAgKiAoYTExICogYTMzIC0gYTEzICogYTMxKSArIGEzMCAqIChhMTEgKiBhMjMgLSBhMTMgKiBhMjEpKTtcbiAgICBvdXRbOV0gID0gLShhMDAgKiAoYTIxICogYTMzIC0gYTIzICogYTMxKSAtIGEyMCAqIChhMDEgKiBhMzMgLSBhMDMgKiBhMzEpICsgYTMwICogKGEwMSAqIGEyMyAtIGEwMyAqIGEyMSkpO1xuICAgIG91dFsxMF0gPSAgKGEwMCAqIChhMTEgKiBhMzMgLSBhMTMgKiBhMzEpIC0gYTEwICogKGEwMSAqIGEzMyAtIGEwMyAqIGEzMSkgKyBhMzAgKiAoYTAxICogYTEzIC0gYTAzICogYTExKSk7XG4gICAgb3V0WzExXSA9IC0oYTAwICogKGExMSAqIGEyMyAtIGExMyAqIGEyMSkgLSBhMTAgKiAoYTAxICogYTIzIC0gYTAzICogYTIxKSArIGEyMCAqIChhMDEgKiBhMTMgLSBhMDMgKiBhMTEpKTtcbiAgICBvdXRbMTJdID0gLShhMTAgKiAoYTIxICogYTMyIC0gYTIyICogYTMxKSAtIGEyMCAqIChhMTEgKiBhMzIgLSBhMTIgKiBhMzEpICsgYTMwICogKGExMSAqIGEyMiAtIGExMiAqIGEyMSkpO1xuICAgIG91dFsxM10gPSAgKGEwMCAqIChhMjEgKiBhMzIgLSBhMjIgKiBhMzEpIC0gYTIwICogKGEwMSAqIGEzMiAtIGEwMiAqIGEzMSkgKyBhMzAgKiAoYTAxICogYTIyIC0gYTAyICogYTIxKSk7XG4gICAgb3V0WzE0XSA9IC0oYTAwICogKGExMSAqIGEzMiAtIGExMiAqIGEzMSkgLSBhMTAgKiAoYTAxICogYTMyIC0gYTAyICogYTMxKSArIGEzMCAqIChhMDEgKiBhMTIgLSBhMDIgKiBhMTEpKTtcbiAgICBvdXRbMTVdID0gIChhMDAgKiAoYTExICogYTIyIC0gYTEyICogYTIxKSAtIGExMCAqIChhMDEgKiBhMjIgLSBhMDIgKiBhMjEpICsgYTIwICogKGEwMSAqIGExMiAtIGEwMiAqIGExMSkpO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGRldGVybWluYW50IG9mIGEgbWF0NFxuICpcbiAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgc291cmNlIG1hdHJpeFxuICogQHJldHVybnMge051bWJlcn0gZGV0ZXJtaW5hbnQgb2YgYVxuICovXG5tYXQ0LmRldGVybWluYW50ID0gZnVuY3Rpb24gKGEpIHtcbiAgICB2YXIgYTAwID0gYVswXSwgYTAxID0gYVsxXSwgYTAyID0gYVsyXSwgYTAzID0gYVszXSxcbiAgICAgICAgYTEwID0gYVs0XSwgYTExID0gYVs1XSwgYTEyID0gYVs2XSwgYTEzID0gYVs3XSxcbiAgICAgICAgYTIwID0gYVs4XSwgYTIxID0gYVs5XSwgYTIyID0gYVsxMF0sIGEyMyA9IGFbMTFdLFxuICAgICAgICBhMzAgPSBhWzEyXSwgYTMxID0gYVsxM10sIGEzMiA9IGFbMTRdLCBhMzMgPSBhWzE1XSxcblxuICAgICAgICBiMDAgPSBhMDAgKiBhMTEgLSBhMDEgKiBhMTAsXG4gICAgICAgIGIwMSA9IGEwMCAqIGExMiAtIGEwMiAqIGExMCxcbiAgICAgICAgYjAyID0gYTAwICogYTEzIC0gYTAzICogYTEwLFxuICAgICAgICBiMDMgPSBhMDEgKiBhMTIgLSBhMDIgKiBhMTEsXG4gICAgICAgIGIwNCA9IGEwMSAqIGExMyAtIGEwMyAqIGExMSxcbiAgICAgICAgYjA1ID0gYTAyICogYTEzIC0gYTAzICogYTEyLFxuICAgICAgICBiMDYgPSBhMjAgKiBhMzEgLSBhMjEgKiBhMzAsXG4gICAgICAgIGIwNyA9IGEyMCAqIGEzMiAtIGEyMiAqIGEzMCxcbiAgICAgICAgYjA4ID0gYTIwICogYTMzIC0gYTIzICogYTMwLFxuICAgICAgICBiMDkgPSBhMjEgKiBhMzIgLSBhMjIgKiBhMzEsXG4gICAgICAgIGIxMCA9IGEyMSAqIGEzMyAtIGEyMyAqIGEzMSxcbiAgICAgICAgYjExID0gYTIyICogYTMzIC0gYTIzICogYTMyO1xuXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBkZXRlcm1pbmFudFxuICAgIHJldHVybiBiMDAgKiBiMTEgLSBiMDEgKiBiMTAgKyBiMDIgKiBiMDkgKyBiMDMgKiBiMDggLSBiMDQgKiBiMDcgKyBiMDUgKiBiMDY7XG59O1xuXG4vKipcbiAqIE11bHRpcGxpZXMgdHdvIG1hdDQnc1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7bWF0NH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC5tdWx0aXBseSA9IGZ1bmN0aW9uIChvdXQsIGEsIGIpIHtcbiAgICB2YXIgYTAwID0gYVswXSwgYTAxID0gYVsxXSwgYTAyID0gYVsyXSwgYTAzID0gYVszXSxcbiAgICAgICAgYTEwID0gYVs0XSwgYTExID0gYVs1XSwgYTEyID0gYVs2XSwgYTEzID0gYVs3XSxcbiAgICAgICAgYTIwID0gYVs4XSwgYTIxID0gYVs5XSwgYTIyID0gYVsxMF0sIGEyMyA9IGFbMTFdLFxuICAgICAgICBhMzAgPSBhWzEyXSwgYTMxID0gYVsxM10sIGEzMiA9IGFbMTRdLCBhMzMgPSBhWzE1XTtcblxuICAgIC8vIENhY2hlIG9ubHkgdGhlIGN1cnJlbnQgbGluZSBvZiB0aGUgc2Vjb25kIG1hdHJpeFxuICAgIHZhciBiMCAgPSBiWzBdLCBiMSA9IGJbMV0sIGIyID0gYlsyXSwgYjMgPSBiWzNdOyAgXG4gICAgb3V0WzBdID0gYjAqYTAwICsgYjEqYTEwICsgYjIqYTIwICsgYjMqYTMwO1xuICAgIG91dFsxXSA9IGIwKmEwMSArIGIxKmExMSArIGIyKmEyMSArIGIzKmEzMTtcbiAgICBvdXRbMl0gPSBiMCphMDIgKyBiMSphMTIgKyBiMiphMjIgKyBiMyphMzI7XG4gICAgb3V0WzNdID0gYjAqYTAzICsgYjEqYTEzICsgYjIqYTIzICsgYjMqYTMzO1xuXG4gICAgYjAgPSBiWzRdOyBiMSA9IGJbNV07IGIyID0gYls2XTsgYjMgPSBiWzddO1xuICAgIG91dFs0XSA9IGIwKmEwMCArIGIxKmExMCArIGIyKmEyMCArIGIzKmEzMDtcbiAgICBvdXRbNV0gPSBiMCphMDEgKyBiMSphMTEgKyBiMiphMjEgKyBiMyphMzE7XG4gICAgb3V0WzZdID0gYjAqYTAyICsgYjEqYTEyICsgYjIqYTIyICsgYjMqYTMyO1xuICAgIG91dFs3XSA9IGIwKmEwMyArIGIxKmExMyArIGIyKmEyMyArIGIzKmEzMztcblxuICAgIGIwID0gYls4XTsgYjEgPSBiWzldOyBiMiA9IGJbMTBdOyBiMyA9IGJbMTFdO1xuICAgIG91dFs4XSA9IGIwKmEwMCArIGIxKmExMCArIGIyKmEyMCArIGIzKmEzMDtcbiAgICBvdXRbOV0gPSBiMCphMDEgKyBiMSphMTEgKyBiMiphMjEgKyBiMyphMzE7XG4gICAgb3V0WzEwXSA9IGIwKmEwMiArIGIxKmExMiArIGIyKmEyMiArIGIzKmEzMjtcbiAgICBvdXRbMTFdID0gYjAqYTAzICsgYjEqYTEzICsgYjIqYTIzICsgYjMqYTMzO1xuXG4gICAgYjAgPSBiWzEyXTsgYjEgPSBiWzEzXTsgYjIgPSBiWzE0XTsgYjMgPSBiWzE1XTtcbiAgICBvdXRbMTJdID0gYjAqYTAwICsgYjEqYTEwICsgYjIqYTIwICsgYjMqYTMwO1xuICAgIG91dFsxM10gPSBiMCphMDEgKyBiMSphMTEgKyBiMiphMjEgKyBiMyphMzE7XG4gICAgb3V0WzE0XSA9IGIwKmEwMiArIGIxKmExMiArIGIyKmEyMiArIGIzKmEzMjtcbiAgICBvdXRbMTVdID0gYjAqYTAzICsgYjEqYTEzICsgYjIqYTIzICsgYjMqYTMzO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgbWF0NC5tdWx0aXBseX1cbiAqIEBmdW5jdGlvblxuICovXG5tYXQ0Lm11bCA9IG1hdDQubXVsdGlwbHk7XG5cbi8qKlxuICogVHJhbnNsYXRlIGEgbWF0NCBieSB0aGUgZ2l2ZW4gdmVjdG9yXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgbWF0cml4IHRvIHRyYW5zbGF0ZVxuICogQHBhcmFtIHt2ZWMzfSB2IHZlY3RvciB0byB0cmFuc2xhdGUgYnlcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC50cmFuc2xhdGUgPSBmdW5jdGlvbiAob3V0LCBhLCB2KSB7XG4gICAgdmFyIHggPSB2WzBdLCB5ID0gdlsxXSwgeiA9IHZbMl0sXG4gICAgICAgIGEwMCwgYTAxLCBhMDIsIGEwMyxcbiAgICAgICAgYTEwLCBhMTEsIGExMiwgYTEzLFxuICAgICAgICBhMjAsIGEyMSwgYTIyLCBhMjM7XG5cbiAgICBpZiAoYSA9PT0gb3V0KSB7XG4gICAgICAgIG91dFsxMl0gPSBhWzBdICogeCArIGFbNF0gKiB5ICsgYVs4XSAqIHogKyBhWzEyXTtcbiAgICAgICAgb3V0WzEzXSA9IGFbMV0gKiB4ICsgYVs1XSAqIHkgKyBhWzldICogeiArIGFbMTNdO1xuICAgICAgICBvdXRbMTRdID0gYVsyXSAqIHggKyBhWzZdICogeSArIGFbMTBdICogeiArIGFbMTRdO1xuICAgICAgICBvdXRbMTVdID0gYVszXSAqIHggKyBhWzddICogeSArIGFbMTFdICogeiArIGFbMTVdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGEwMCA9IGFbMF07IGEwMSA9IGFbMV07IGEwMiA9IGFbMl07IGEwMyA9IGFbM107XG4gICAgICAgIGExMCA9IGFbNF07IGExMSA9IGFbNV07IGExMiA9IGFbNl07IGExMyA9IGFbN107XG4gICAgICAgIGEyMCA9IGFbOF07IGEyMSA9IGFbOV07IGEyMiA9IGFbMTBdOyBhMjMgPSBhWzExXTtcblxuICAgICAgICBvdXRbMF0gPSBhMDA7IG91dFsxXSA9IGEwMTsgb3V0WzJdID0gYTAyOyBvdXRbM10gPSBhMDM7XG4gICAgICAgIG91dFs0XSA9IGExMDsgb3V0WzVdID0gYTExOyBvdXRbNl0gPSBhMTI7IG91dFs3XSA9IGExMztcbiAgICAgICAgb3V0WzhdID0gYTIwOyBvdXRbOV0gPSBhMjE7IG91dFsxMF0gPSBhMjI7IG91dFsxMV0gPSBhMjM7XG5cbiAgICAgICAgb3V0WzEyXSA9IGEwMCAqIHggKyBhMTAgKiB5ICsgYTIwICogeiArIGFbMTJdO1xuICAgICAgICBvdXRbMTNdID0gYTAxICogeCArIGExMSAqIHkgKyBhMjEgKiB6ICsgYVsxM107XG4gICAgICAgIG91dFsxNF0gPSBhMDIgKiB4ICsgYTEyICogeSArIGEyMiAqIHogKyBhWzE0XTtcbiAgICAgICAgb3V0WzE1XSA9IGEwMyAqIHggKyBhMTMgKiB5ICsgYTIzICogeiArIGFbMTVdO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFNjYWxlcyB0aGUgbWF0NCBieSB0aGUgZGltZW5zaW9ucyBpbiB0aGUgZ2l2ZW4gdmVjM1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDR9IGEgdGhlIG1hdHJpeCB0byBzY2FsZVxuICogQHBhcmFtIHt2ZWMzfSB2IHRoZSB2ZWMzIHRvIHNjYWxlIHRoZSBtYXRyaXggYnlcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqKi9cbm1hdDQuc2NhbGUgPSBmdW5jdGlvbihvdXQsIGEsIHYpIHtcbiAgICB2YXIgeCA9IHZbMF0sIHkgPSB2WzFdLCB6ID0gdlsyXTtcblxuICAgIG91dFswXSA9IGFbMF0gKiB4O1xuICAgIG91dFsxXSA9IGFbMV0gKiB4O1xuICAgIG91dFsyXSA9IGFbMl0gKiB4O1xuICAgIG91dFszXSA9IGFbM10gKiB4O1xuICAgIG91dFs0XSA9IGFbNF0gKiB5O1xuICAgIG91dFs1XSA9IGFbNV0gKiB5O1xuICAgIG91dFs2XSA9IGFbNl0gKiB5O1xuICAgIG91dFs3XSA9IGFbN10gKiB5O1xuICAgIG91dFs4XSA9IGFbOF0gKiB6O1xuICAgIG91dFs5XSA9IGFbOV0gKiB6O1xuICAgIG91dFsxMF0gPSBhWzEwXSAqIHo7XG4gICAgb3V0WzExXSA9IGFbMTFdICogejtcbiAgICBvdXRbMTJdID0gYVsxMl07XG4gICAgb3V0WzEzXSA9IGFbMTNdO1xuICAgIG91dFsxNF0gPSBhWzE0XTtcbiAgICBvdXRbMTVdID0gYVsxNV07XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUm90YXRlcyBhIG1hdDQgYnkgdGhlIGdpdmVuIGFuZ2xlXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgbWF0cml4IHRvIHJvdGF0ZVxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcbiAqIEBwYXJhbSB7dmVjM30gYXhpcyB0aGUgYXhpcyB0byByb3RhdGUgYXJvdW5kXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQucm90YXRlID0gZnVuY3Rpb24gKG91dCwgYSwgcmFkLCBheGlzKSB7XG4gICAgdmFyIHggPSBheGlzWzBdLCB5ID0gYXhpc1sxXSwgeiA9IGF4aXNbMl0sXG4gICAgICAgIGxlbiA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopLFxuICAgICAgICBzLCBjLCB0LFxuICAgICAgICBhMDAsIGEwMSwgYTAyLCBhMDMsXG4gICAgICAgIGExMCwgYTExLCBhMTIsIGExMyxcbiAgICAgICAgYTIwLCBhMjEsIGEyMiwgYTIzLFxuICAgICAgICBiMDAsIGIwMSwgYjAyLFxuICAgICAgICBiMTAsIGIxMSwgYjEyLFxuICAgICAgICBiMjAsIGIyMSwgYjIyO1xuXG4gICAgaWYgKE1hdGguYWJzKGxlbikgPCBHTE1BVF9FUFNJTE9OKSB7IHJldHVybiBudWxsOyB9XG4gICAgXG4gICAgbGVuID0gMSAvIGxlbjtcbiAgICB4ICo9IGxlbjtcbiAgICB5ICo9IGxlbjtcbiAgICB6ICo9IGxlbjtcblxuICAgIHMgPSBNYXRoLnNpbihyYWQpO1xuICAgIGMgPSBNYXRoLmNvcyhyYWQpO1xuICAgIHQgPSAxIC0gYztcblxuICAgIGEwMCA9IGFbMF07IGEwMSA9IGFbMV07IGEwMiA9IGFbMl07IGEwMyA9IGFbM107XG4gICAgYTEwID0gYVs0XTsgYTExID0gYVs1XTsgYTEyID0gYVs2XTsgYTEzID0gYVs3XTtcbiAgICBhMjAgPSBhWzhdOyBhMjEgPSBhWzldOyBhMjIgPSBhWzEwXTsgYTIzID0gYVsxMV07XG5cbiAgICAvLyBDb25zdHJ1Y3QgdGhlIGVsZW1lbnRzIG9mIHRoZSByb3RhdGlvbiBtYXRyaXhcbiAgICBiMDAgPSB4ICogeCAqIHQgKyBjOyBiMDEgPSB5ICogeCAqIHQgKyB6ICogczsgYjAyID0geiAqIHggKiB0IC0geSAqIHM7XG4gICAgYjEwID0geCAqIHkgKiB0IC0geiAqIHM7IGIxMSA9IHkgKiB5ICogdCArIGM7IGIxMiA9IHogKiB5ICogdCArIHggKiBzO1xuICAgIGIyMCA9IHggKiB6ICogdCArIHkgKiBzOyBiMjEgPSB5ICogeiAqIHQgLSB4ICogczsgYjIyID0geiAqIHogKiB0ICsgYztcblxuICAgIC8vIFBlcmZvcm0gcm90YXRpb24tc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG4gICAgb3V0WzBdID0gYTAwICogYjAwICsgYTEwICogYjAxICsgYTIwICogYjAyO1xuICAgIG91dFsxXSA9IGEwMSAqIGIwMCArIGExMSAqIGIwMSArIGEyMSAqIGIwMjtcbiAgICBvdXRbMl0gPSBhMDIgKiBiMDAgKyBhMTIgKiBiMDEgKyBhMjIgKiBiMDI7XG4gICAgb3V0WzNdID0gYTAzICogYjAwICsgYTEzICogYjAxICsgYTIzICogYjAyO1xuICAgIG91dFs0XSA9IGEwMCAqIGIxMCArIGExMCAqIGIxMSArIGEyMCAqIGIxMjtcbiAgICBvdXRbNV0gPSBhMDEgKiBiMTAgKyBhMTEgKiBiMTEgKyBhMjEgKiBiMTI7XG4gICAgb3V0WzZdID0gYTAyICogYjEwICsgYTEyICogYjExICsgYTIyICogYjEyO1xuICAgIG91dFs3XSA9IGEwMyAqIGIxMCArIGExMyAqIGIxMSArIGEyMyAqIGIxMjtcbiAgICBvdXRbOF0gPSBhMDAgKiBiMjAgKyBhMTAgKiBiMjEgKyBhMjAgKiBiMjI7XG4gICAgb3V0WzldID0gYTAxICogYjIwICsgYTExICogYjIxICsgYTIxICogYjIyO1xuICAgIG91dFsxMF0gPSBhMDIgKiBiMjAgKyBhMTIgKiBiMjEgKyBhMjIgKiBiMjI7XG4gICAgb3V0WzExXSA9IGEwMyAqIGIyMCArIGExMyAqIGIyMSArIGEyMyAqIGIyMjtcblxuICAgIGlmIChhICE9PSBvdXQpIHsgLy8gSWYgdGhlIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gZGlmZmVyLCBjb3B5IHRoZSB1bmNoYW5nZWQgbGFzdCByb3dcbiAgICAgICAgb3V0WzEyXSA9IGFbMTJdO1xuICAgICAgICBvdXRbMTNdID0gYVsxM107XG4gICAgICAgIG91dFsxNF0gPSBhWzE0XTtcbiAgICAgICAgb3V0WzE1XSA9IGFbMTVdO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBSb3RhdGVzIGEgbWF0cml4IGJ5IHRoZSBnaXZlbiBhbmdsZSBhcm91bmQgdGhlIFggYXhpc1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IHRoZSByZWNlaXZpbmcgbWF0cml4XG4gKiBAcGFyYW0ge21hdDR9IGEgdGhlIG1hdHJpeCB0byByb3RhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQucm90YXRlWCA9IGZ1bmN0aW9uIChvdXQsIGEsIHJhZCkge1xuICAgIHZhciBzID0gTWF0aC5zaW4ocmFkKSxcbiAgICAgICAgYyA9IE1hdGguY29zKHJhZCksXG4gICAgICAgIGExMCA9IGFbNF0sXG4gICAgICAgIGExMSA9IGFbNV0sXG4gICAgICAgIGExMiA9IGFbNl0sXG4gICAgICAgIGExMyA9IGFbN10sXG4gICAgICAgIGEyMCA9IGFbOF0sXG4gICAgICAgIGEyMSA9IGFbOV0sXG4gICAgICAgIGEyMiA9IGFbMTBdLFxuICAgICAgICBhMjMgPSBhWzExXTtcblxuICAgIGlmIChhICE9PSBvdXQpIHsgLy8gSWYgdGhlIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gZGlmZmVyLCBjb3B5IHRoZSB1bmNoYW5nZWQgcm93c1xuICAgICAgICBvdXRbMF0gID0gYVswXTtcbiAgICAgICAgb3V0WzFdICA9IGFbMV07XG4gICAgICAgIG91dFsyXSAgPSBhWzJdO1xuICAgICAgICBvdXRbM10gID0gYVszXTtcbiAgICAgICAgb3V0WzEyXSA9IGFbMTJdO1xuICAgICAgICBvdXRbMTNdID0gYVsxM107XG4gICAgICAgIG91dFsxNF0gPSBhWzE0XTtcbiAgICAgICAgb3V0WzE1XSA9IGFbMTVdO1xuICAgIH1cblxuICAgIC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cbiAgICBvdXRbNF0gPSBhMTAgKiBjICsgYTIwICogcztcbiAgICBvdXRbNV0gPSBhMTEgKiBjICsgYTIxICogcztcbiAgICBvdXRbNl0gPSBhMTIgKiBjICsgYTIyICogcztcbiAgICBvdXRbN10gPSBhMTMgKiBjICsgYTIzICogcztcbiAgICBvdXRbOF0gPSBhMjAgKiBjIC0gYTEwICogcztcbiAgICBvdXRbOV0gPSBhMjEgKiBjIC0gYTExICogcztcbiAgICBvdXRbMTBdID0gYTIyICogYyAtIGExMiAqIHM7XG4gICAgb3V0WzExXSA9IGEyMyAqIGMgLSBhMTMgKiBzO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFJvdGF0ZXMgYSBtYXRyaXggYnkgdGhlIGdpdmVuIGFuZ2xlIGFyb3VuZCB0aGUgWSBheGlzXG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgdGhlIHJlY2VpdmluZyBtYXRyaXhcbiAqIEBwYXJhbSB7bWF0NH0gYSB0aGUgbWF0cml4IHRvIHJvdGF0ZVxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgdG8gcm90YXRlIHRoZSBtYXRyaXggYnlcbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC5yb3RhdGVZID0gZnVuY3Rpb24gKG91dCwgYSwgcmFkKSB7XG4gICAgdmFyIHMgPSBNYXRoLnNpbihyYWQpLFxuICAgICAgICBjID0gTWF0aC5jb3MocmFkKSxcbiAgICAgICAgYTAwID0gYVswXSxcbiAgICAgICAgYTAxID0gYVsxXSxcbiAgICAgICAgYTAyID0gYVsyXSxcbiAgICAgICAgYTAzID0gYVszXSxcbiAgICAgICAgYTIwID0gYVs4XSxcbiAgICAgICAgYTIxID0gYVs5XSxcbiAgICAgICAgYTIyID0gYVsxMF0sXG4gICAgICAgIGEyMyA9IGFbMTFdO1xuXG4gICAgaWYgKGEgIT09IG91dCkgeyAvLyBJZiB0aGUgc291cmNlIGFuZCBkZXN0aW5hdGlvbiBkaWZmZXIsIGNvcHkgdGhlIHVuY2hhbmdlZCByb3dzXG4gICAgICAgIG91dFs0XSAgPSBhWzRdO1xuICAgICAgICBvdXRbNV0gID0gYVs1XTtcbiAgICAgICAgb3V0WzZdICA9IGFbNl07XG4gICAgICAgIG91dFs3XSAgPSBhWzddO1xuICAgICAgICBvdXRbMTJdID0gYVsxMl07XG4gICAgICAgIG91dFsxM10gPSBhWzEzXTtcbiAgICAgICAgb3V0WzE0XSA9IGFbMTRdO1xuICAgICAgICBvdXRbMTVdID0gYVsxNV07XG4gICAgfVxuXG4gICAgLy8gUGVyZm9ybSBheGlzLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxuICAgIG91dFswXSA9IGEwMCAqIGMgLSBhMjAgKiBzO1xuICAgIG91dFsxXSA9IGEwMSAqIGMgLSBhMjEgKiBzO1xuICAgIG91dFsyXSA9IGEwMiAqIGMgLSBhMjIgKiBzO1xuICAgIG91dFszXSA9IGEwMyAqIGMgLSBhMjMgKiBzO1xuICAgIG91dFs4XSA9IGEwMCAqIHMgKyBhMjAgKiBjO1xuICAgIG91dFs5XSA9IGEwMSAqIHMgKyBhMjEgKiBjO1xuICAgIG91dFsxMF0gPSBhMDIgKiBzICsgYTIyICogYztcbiAgICBvdXRbMTFdID0gYTAzICogcyArIGEyMyAqIGM7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUm90YXRlcyBhIG1hdHJpeCBieSB0aGUgZ2l2ZW4gYW5nbGUgYXJvdW5kIHRoZSBaIGF4aXNcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCB0aGUgcmVjZWl2aW5nIG1hdHJpeFxuICogQHBhcmFtIHttYXQ0fSBhIHRoZSBtYXRyaXggdG8gcm90YXRlXG4gKiBAcGFyYW0ge051bWJlcn0gcmFkIHRoZSBhbmdsZSB0byByb3RhdGUgdGhlIG1hdHJpeCBieVxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5tYXQ0LnJvdGF0ZVogPSBmdW5jdGlvbiAob3V0LCBhLCByYWQpIHtcbiAgICB2YXIgcyA9IE1hdGguc2luKHJhZCksXG4gICAgICAgIGMgPSBNYXRoLmNvcyhyYWQpLFxuICAgICAgICBhMDAgPSBhWzBdLFxuICAgICAgICBhMDEgPSBhWzFdLFxuICAgICAgICBhMDIgPSBhWzJdLFxuICAgICAgICBhMDMgPSBhWzNdLFxuICAgICAgICBhMTAgPSBhWzRdLFxuICAgICAgICBhMTEgPSBhWzVdLFxuICAgICAgICBhMTIgPSBhWzZdLFxuICAgICAgICBhMTMgPSBhWzddO1xuXG4gICAgaWYgKGEgIT09IG91dCkgeyAvLyBJZiB0aGUgc291cmNlIGFuZCBkZXN0aW5hdGlvbiBkaWZmZXIsIGNvcHkgdGhlIHVuY2hhbmdlZCBsYXN0IHJvd1xuICAgICAgICBvdXRbOF0gID0gYVs4XTtcbiAgICAgICAgb3V0WzldICA9IGFbOV07XG4gICAgICAgIG91dFsxMF0gPSBhWzEwXTtcbiAgICAgICAgb3V0WzExXSA9IGFbMTFdO1xuICAgICAgICBvdXRbMTJdID0gYVsxMl07XG4gICAgICAgIG91dFsxM10gPSBhWzEzXTtcbiAgICAgICAgb3V0WzE0XSA9IGFbMTRdO1xuICAgICAgICBvdXRbMTVdID0gYVsxNV07XG4gICAgfVxuXG4gICAgLy8gUGVyZm9ybSBheGlzLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxuICAgIG91dFswXSA9IGEwMCAqIGMgKyBhMTAgKiBzO1xuICAgIG91dFsxXSA9IGEwMSAqIGMgKyBhMTEgKiBzO1xuICAgIG91dFsyXSA9IGEwMiAqIGMgKyBhMTIgKiBzO1xuICAgIG91dFszXSA9IGEwMyAqIGMgKyBhMTMgKiBzO1xuICAgIG91dFs0XSA9IGExMCAqIGMgLSBhMDAgKiBzO1xuICAgIG91dFs1XSA9IGExMSAqIGMgLSBhMDEgKiBzO1xuICAgIG91dFs2XSA9IGExMiAqIGMgLSBhMDIgKiBzO1xuICAgIG91dFs3XSA9IGExMyAqIGMgLSBhMDMgKiBzO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXRyaXggZnJvbSBhIHF1YXRlcm5pb24gcm90YXRpb24gYW5kIHZlY3RvciB0cmFuc2xhdGlvblxuICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XG4gKlxuICogICAgIG1hdDQuaWRlbnRpdHkoZGVzdCk7XG4gKiAgICAgbWF0NC50cmFuc2xhdGUoZGVzdCwgdmVjKTtcbiAqICAgICB2YXIgcXVhdE1hdCA9IG1hdDQuY3JlYXRlKCk7XG4gKiAgICAgcXVhdDQudG9NYXQ0KHF1YXQsIHF1YXRNYXQpO1xuICogICAgIG1hdDQubXVsdGlwbHkoZGVzdCwgcXVhdE1hdCk7XG4gKlxuICogQHBhcmFtIHttYXQ0fSBvdXQgbWF0NCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICogQHBhcmFtIHtxdWF0NH0gcSBSb3RhdGlvbiBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge3ZlYzN9IHYgVHJhbnNsYXRpb24gdmVjdG9yXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQuZnJvbVJvdGF0aW9uVHJhbnNsYXRpb24gPSBmdW5jdGlvbiAob3V0LCBxLCB2KSB7XG4gICAgLy8gUXVhdGVybmlvbiBtYXRoXG4gICAgdmFyIHggPSBxWzBdLCB5ID0gcVsxXSwgeiA9IHFbMl0sIHcgPSBxWzNdLFxuICAgICAgICB4MiA9IHggKyB4LFxuICAgICAgICB5MiA9IHkgKyB5LFxuICAgICAgICB6MiA9IHogKyB6LFxuXG4gICAgICAgIHh4ID0geCAqIHgyLFxuICAgICAgICB4eSA9IHggKiB5MixcbiAgICAgICAgeHogPSB4ICogejIsXG4gICAgICAgIHl5ID0geSAqIHkyLFxuICAgICAgICB5eiA9IHkgKiB6MixcbiAgICAgICAgenogPSB6ICogejIsXG4gICAgICAgIHd4ID0gdyAqIHgyLFxuICAgICAgICB3eSA9IHcgKiB5MixcbiAgICAgICAgd3ogPSB3ICogejI7XG5cbiAgICBvdXRbMF0gPSAxIC0gKHl5ICsgenopO1xuICAgIG91dFsxXSA9IHh5ICsgd3o7XG4gICAgb3V0WzJdID0geHogLSB3eTtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IHh5IC0gd3o7XG4gICAgb3V0WzVdID0gMSAtICh4eCArIHp6KTtcbiAgICBvdXRbNl0gPSB5eiArIHd4O1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0geHogKyB3eTtcbiAgICBvdXRbOV0gPSB5eiAtIHd4O1xuICAgIG91dFsxMF0gPSAxIC0gKHh4ICsgeXkpO1xuICAgIG91dFsxMV0gPSAwO1xuICAgIG91dFsxMl0gPSB2WzBdO1xuICAgIG91dFsxM10gPSB2WzFdO1xuICAgIG91dFsxNF0gPSB2WzJdO1xuICAgIG91dFsxNV0gPSAxO1xuICAgIFxuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiogQ2FsY3VsYXRlcyBhIDR4NCBtYXRyaXggZnJvbSB0aGUgZ2l2ZW4gcXVhdGVybmlvblxuKlxuKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4qIEBwYXJhbSB7cXVhdH0gcSBRdWF0ZXJuaW9uIHRvIGNyZWF0ZSBtYXRyaXggZnJvbVxuKlxuKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4qL1xubWF0NC5mcm9tUXVhdCA9IGZ1bmN0aW9uIChvdXQsIHEpIHtcbiAgICB2YXIgeCA9IHFbMF0sIHkgPSBxWzFdLCB6ID0gcVsyXSwgdyA9IHFbM10sXG4gICAgICAgIHgyID0geCArIHgsXG4gICAgICAgIHkyID0geSArIHksXG4gICAgICAgIHoyID0geiArIHosXG5cbiAgICAgICAgeHggPSB4ICogeDIsXG4gICAgICAgIHh5ID0geCAqIHkyLFxuICAgICAgICB4eiA9IHggKiB6MixcbiAgICAgICAgeXkgPSB5ICogeTIsXG4gICAgICAgIHl6ID0geSAqIHoyLFxuICAgICAgICB6eiA9IHogKiB6MixcbiAgICAgICAgd3ggPSB3ICogeDIsXG4gICAgICAgIHd5ID0gdyAqIHkyLFxuICAgICAgICB3eiA9IHcgKiB6MjtcblxuICAgIG91dFswXSA9IDEgLSAoeXkgKyB6eik7XG4gICAgb3V0WzFdID0geHkgKyB3ejtcbiAgICBvdXRbMl0gPSB4eiAtIHd5O1xuICAgIG91dFszXSA9IDA7XG5cbiAgICBvdXRbNF0gPSB4eSAtIHd6O1xuICAgIG91dFs1XSA9IDEgLSAoeHggKyB6eik7XG4gICAgb3V0WzZdID0geXogKyB3eDtcbiAgICBvdXRbN10gPSAwO1xuXG4gICAgb3V0WzhdID0geHogKyB3eTtcbiAgICBvdXRbOV0gPSB5eiAtIHd4O1xuICAgIG91dFsxMF0gPSAxIC0gKHh4ICsgeXkpO1xuICAgIG91dFsxMV0gPSAwO1xuXG4gICAgb3V0WzEyXSA9IDA7XG4gICAgb3V0WzEzXSA9IDA7XG4gICAgb3V0WzE0XSA9IDA7XG4gICAgb3V0WzE1XSA9IDE7XG5cbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBmcnVzdHVtIG1hdHJpeCB3aXRoIHRoZSBnaXZlbiBib3VuZHNcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IGZydXN0dW0gbWF0cml4IHdpbGwgYmUgd3JpdHRlbiBpbnRvXG4gKiBAcGFyYW0ge051bWJlcn0gbGVmdCBMZWZ0IGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcGFyYW0ge051bWJlcn0gcmlnaHQgUmlnaHQgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7TnVtYmVyfSBib3R0b20gQm90dG9tIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcGFyYW0ge051bWJlcn0gdG9wIFRvcCBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHBhcmFtIHtOdW1iZXJ9IG5lYXIgTmVhciBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHBhcmFtIHtOdW1iZXJ9IGZhciBGYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC5mcnVzdHVtID0gZnVuY3Rpb24gKG91dCwgbGVmdCwgcmlnaHQsIGJvdHRvbSwgdG9wLCBuZWFyLCBmYXIpIHtcbiAgICB2YXIgcmwgPSAxIC8gKHJpZ2h0IC0gbGVmdCksXG4gICAgICAgIHRiID0gMSAvICh0b3AgLSBib3R0b20pLFxuICAgICAgICBuZiA9IDEgLyAobmVhciAtIGZhcik7XG4gICAgb3V0WzBdID0gKG5lYXIgKiAyKSAqIHJsO1xuICAgIG91dFsxXSA9IDA7XG4gICAgb3V0WzJdID0gMDtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IDA7XG4gICAgb3V0WzVdID0gKG5lYXIgKiAyKSAqIHRiO1xuICAgIG91dFs2XSA9IDA7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSAocmlnaHQgKyBsZWZ0KSAqIHJsO1xuICAgIG91dFs5XSA9ICh0b3AgKyBib3R0b20pICogdGI7XG4gICAgb3V0WzEwXSA9IChmYXIgKyBuZWFyKSAqIG5mO1xuICAgIG91dFsxMV0gPSAtMTtcbiAgICBvdXRbMTJdID0gMDtcbiAgICBvdXRbMTNdID0gMDtcbiAgICBvdXRbMTRdID0gKGZhciAqIG5lYXIgKiAyKSAqIG5mO1xuICAgIG91dFsxNV0gPSAwO1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIHBlcnNwZWN0aXZlIHByb2plY3Rpb24gbWF0cml4IHdpdGggdGhlIGdpdmVuIGJvdW5kc1xuICpcbiAqIEBwYXJhbSB7bWF0NH0gb3V0IG1hdDQgZnJ1c3R1bSBtYXRyaXggd2lsbCBiZSB3cml0dGVuIGludG9cbiAqIEBwYXJhbSB7bnVtYmVyfSBmb3Z5IFZlcnRpY2FsIGZpZWxkIG9mIHZpZXcgaW4gcmFkaWFuc1xuICogQHBhcmFtIHtudW1iZXJ9IGFzcGVjdCBBc3BlY3QgcmF0aW8uIHR5cGljYWxseSB2aWV3cG9ydCB3aWR0aC9oZWlnaHRcbiAqIEBwYXJhbSB7bnVtYmVyfSBuZWFyIE5lYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7bnVtYmVyfSBmYXIgRmFyIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcmV0dXJucyB7bWF0NH0gb3V0XG4gKi9cbm1hdDQucGVyc3BlY3RpdmUgPSBmdW5jdGlvbiAob3V0LCBmb3Z5LCBhc3BlY3QsIG5lYXIsIGZhcikge1xuICAgIHZhciBmID0gMS4wIC8gTWF0aC50YW4oZm92eSAvIDIpLFxuICAgICAgICBuZiA9IDEgLyAobmVhciAtIGZhcik7XG4gICAgb3V0WzBdID0gZiAvIGFzcGVjdDtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMDtcbiAgICBvdXRbNF0gPSAwO1xuICAgIG91dFs1XSA9IGY7XG4gICAgb3V0WzZdID0gMDtcbiAgICBvdXRbN10gPSAwO1xuICAgIG91dFs4XSA9IDA7XG4gICAgb3V0WzldID0gMDtcbiAgICBvdXRbMTBdID0gKGZhciArIG5lYXIpICogbmY7XG4gICAgb3V0WzExXSA9IC0xO1xuICAgIG91dFsxMl0gPSAwO1xuICAgIG91dFsxM10gPSAwO1xuICAgIG91dFsxNF0gPSAoMiAqIGZhciAqIG5lYXIpICogbmY7XG4gICAgb3V0WzE1XSA9IDA7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgb3J0aG9nb25hbCBwcm9qZWN0aW9uIG1hdHJpeCB3aXRoIHRoZSBnaXZlbiBib3VuZHNcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IGZydXN0dW0gbWF0cml4IHdpbGwgYmUgd3JpdHRlbiBpbnRvXG4gKiBAcGFyYW0ge251bWJlcn0gbGVmdCBMZWZ0IGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcGFyYW0ge251bWJlcn0gcmlnaHQgUmlnaHQgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEBwYXJhbSB7bnVtYmVyfSBib3R0b20gQm90dG9tIGJvdW5kIG9mIHRoZSBmcnVzdHVtXG4gKiBAcGFyYW0ge251bWJlcn0gdG9wIFRvcCBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHBhcmFtIHtudW1iZXJ9IG5lYXIgTmVhciBib3VuZCBvZiB0aGUgZnJ1c3R1bVxuICogQHBhcmFtIHtudW1iZXJ9IGZhciBGYXIgYm91bmQgb2YgdGhlIGZydXN0dW1cbiAqIEByZXR1cm5zIHttYXQ0fSBvdXRcbiAqL1xubWF0NC5vcnRobyA9IGZ1bmN0aW9uIChvdXQsIGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCwgbmVhciwgZmFyKSB7XG4gICAgdmFyIGxyID0gMSAvIChsZWZ0IC0gcmlnaHQpLFxuICAgICAgICBidCA9IDEgLyAoYm90dG9tIC0gdG9wKSxcbiAgICAgICAgbmYgPSAxIC8gKG5lYXIgLSBmYXIpO1xuICAgIG91dFswXSA9IC0yICogbHI7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDA7XG4gICAgb3V0WzRdID0gMDtcbiAgICBvdXRbNV0gPSAtMiAqIGJ0O1xuICAgIG91dFs2XSA9IDA7XG4gICAgb3V0WzddID0gMDtcbiAgICBvdXRbOF0gPSAwO1xuICAgIG91dFs5XSA9IDA7XG4gICAgb3V0WzEwXSA9IDIgKiBuZjtcbiAgICBvdXRbMTFdID0gMDtcbiAgICBvdXRbMTJdID0gKGxlZnQgKyByaWdodCkgKiBscjtcbiAgICBvdXRbMTNdID0gKHRvcCArIGJvdHRvbSkgKiBidDtcbiAgICBvdXRbMTRdID0gKGZhciArIG5lYXIpICogbmY7XG4gICAgb3V0WzE1XSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgbG9vay1hdCBtYXRyaXggd2l0aCB0aGUgZ2l2ZW4gZXllIHBvc2l0aW9uLCBmb2NhbCBwb2ludCwgYW5kIHVwIGF4aXNcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG91dCBtYXQ0IGZydXN0dW0gbWF0cml4IHdpbGwgYmUgd3JpdHRlbiBpbnRvXG4gKiBAcGFyYW0ge3ZlYzN9IGV5ZSBQb3NpdGlvbiBvZiB0aGUgdmlld2VyXG4gKiBAcGFyYW0ge3ZlYzN9IGNlbnRlciBQb2ludCB0aGUgdmlld2VyIGlzIGxvb2tpbmcgYXRcbiAqIEBwYXJhbSB7dmVjM30gdXAgdmVjMyBwb2ludGluZyB1cFxuICogQHJldHVybnMge21hdDR9IG91dFxuICovXG5tYXQ0Lmxvb2tBdCA9IGZ1bmN0aW9uIChvdXQsIGV5ZSwgY2VudGVyLCB1cCkge1xuICAgIHZhciB4MCwgeDEsIHgyLCB5MCwgeTEsIHkyLCB6MCwgejEsIHoyLCBsZW4sXG4gICAgICAgIGV5ZXggPSBleWVbMF0sXG4gICAgICAgIGV5ZXkgPSBleWVbMV0sXG4gICAgICAgIGV5ZXogPSBleWVbMl0sXG4gICAgICAgIHVweCA9IHVwWzBdLFxuICAgICAgICB1cHkgPSB1cFsxXSxcbiAgICAgICAgdXB6ID0gdXBbMl0sXG4gICAgICAgIGNlbnRlcnggPSBjZW50ZXJbMF0sXG4gICAgICAgIGNlbnRlcnkgPSBjZW50ZXJbMV0sXG4gICAgICAgIGNlbnRlcnogPSBjZW50ZXJbMl07XG5cbiAgICBpZiAoTWF0aC5hYnMoZXlleCAtIGNlbnRlcngpIDwgR0xNQVRfRVBTSUxPTiAmJlxuICAgICAgICBNYXRoLmFicyhleWV5IC0gY2VudGVyeSkgPCBHTE1BVF9FUFNJTE9OICYmXG4gICAgICAgIE1hdGguYWJzKGV5ZXogLSBjZW50ZXJ6KSA8IEdMTUFUX0VQU0lMT04pIHtcbiAgICAgICAgcmV0dXJuIG1hdDQuaWRlbnRpdHkob3V0KTtcbiAgICB9XG5cbiAgICB6MCA9IGV5ZXggLSBjZW50ZXJ4O1xuICAgIHoxID0gZXlleSAtIGNlbnRlcnk7XG4gICAgejIgPSBleWV6IC0gY2VudGVyejtcblxuICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQoejAgKiB6MCArIHoxICogejEgKyB6MiAqIHoyKTtcbiAgICB6MCAqPSBsZW47XG4gICAgejEgKj0gbGVuO1xuICAgIHoyICo9IGxlbjtcblxuICAgIHgwID0gdXB5ICogejIgLSB1cHogKiB6MTtcbiAgICB4MSA9IHVweiAqIHowIC0gdXB4ICogejI7XG4gICAgeDIgPSB1cHggKiB6MSAtIHVweSAqIHowO1xuICAgIGxlbiA9IE1hdGguc3FydCh4MCAqIHgwICsgeDEgKiB4MSArIHgyICogeDIpO1xuICAgIGlmICghbGVuKSB7XG4gICAgICAgIHgwID0gMDtcbiAgICAgICAgeDEgPSAwO1xuICAgICAgICB4MiA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGVuID0gMSAvIGxlbjtcbiAgICAgICAgeDAgKj0gbGVuO1xuICAgICAgICB4MSAqPSBsZW47XG4gICAgICAgIHgyICo9IGxlbjtcbiAgICB9XG5cbiAgICB5MCA9IHoxICogeDIgLSB6MiAqIHgxO1xuICAgIHkxID0gejIgKiB4MCAtIHowICogeDI7XG4gICAgeTIgPSB6MCAqIHgxIC0gejEgKiB4MDtcblxuICAgIGxlbiA9IE1hdGguc3FydCh5MCAqIHkwICsgeTEgKiB5MSArIHkyICogeTIpO1xuICAgIGlmICghbGVuKSB7XG4gICAgICAgIHkwID0gMDtcbiAgICAgICAgeTEgPSAwO1xuICAgICAgICB5MiA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGVuID0gMSAvIGxlbjtcbiAgICAgICAgeTAgKj0gbGVuO1xuICAgICAgICB5MSAqPSBsZW47XG4gICAgICAgIHkyICo9IGxlbjtcbiAgICB9XG5cbiAgICBvdXRbMF0gPSB4MDtcbiAgICBvdXRbMV0gPSB5MDtcbiAgICBvdXRbMl0gPSB6MDtcbiAgICBvdXRbM10gPSAwO1xuICAgIG91dFs0XSA9IHgxO1xuICAgIG91dFs1XSA9IHkxO1xuICAgIG91dFs2XSA9IHoxO1xuICAgIG91dFs3XSA9IDA7XG4gICAgb3V0WzhdID0geDI7XG4gICAgb3V0WzldID0geTI7XG4gICAgb3V0WzEwXSA9IHoyO1xuICAgIG91dFsxMV0gPSAwO1xuICAgIG91dFsxMl0gPSAtKHgwICogZXlleCArIHgxICogZXlleSArIHgyICogZXlleik7XG4gICAgb3V0WzEzXSA9IC0oeTAgKiBleWV4ICsgeTEgKiBleWV5ICsgeTIgKiBleWV6KTtcbiAgICBvdXRbMTRdID0gLSh6MCAqIGV5ZXggKyB6MSAqIGV5ZXkgKyB6MiAqIGV5ZXopO1xuICAgIG91dFsxNV0gPSAxO1xuXG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIG1hdDRcbiAqXG4gKiBAcGFyYW0ge21hdDR9IG1hdCBtYXRyaXggdG8gcmVwcmVzZW50IGFzIGEgc3RyaW5nXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIG1hdHJpeFxuICovXG5tYXQ0LnN0ciA9IGZ1bmN0aW9uIChhKSB7XG4gICAgcmV0dXJuICdtYXQ0KCcgKyBhWzBdICsgJywgJyArIGFbMV0gKyAnLCAnICsgYVsyXSArICcsICcgKyBhWzNdICsgJywgJyArXG4gICAgICAgICAgICAgICAgICAgIGFbNF0gKyAnLCAnICsgYVs1XSArICcsICcgKyBhWzZdICsgJywgJyArIGFbN10gKyAnLCAnICtcbiAgICAgICAgICAgICAgICAgICAgYVs4XSArICcsICcgKyBhWzldICsgJywgJyArIGFbMTBdICsgJywgJyArIGFbMTFdICsgJywgJyArIFxuICAgICAgICAgICAgICAgICAgICBhWzEyXSArICcsICcgKyBhWzEzXSArICcsICcgKyBhWzE0XSArICcsICcgKyBhWzE1XSArICcpJztcbn07XG5cbmlmKHR5cGVvZihleHBvcnRzKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBleHBvcnRzLm1hdDQgPSBtYXQ0O1xufVxuO1xuLyogQ29weXJpZ2h0IChjKSAyMDEzLCBCcmFuZG9uIEpvbmVzLCBDb2xpbiBNYWNLZW56aWUgSVYuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cblJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dCBtb2RpZmljYXRpb24sXG5hcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG5cbiAgKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXNcbiAgICBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAgKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4gICAgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBcbiAgICBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cblxuVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCIgQU5EXG5BTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRFxuV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBcbkRJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgSE9MREVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SXG5BTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVNcbihJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUztcbkxPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTlxuQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcbihJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTXG5TT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS4gKi9cblxuLyoqXG4gKiBAY2xhc3MgUXVhdGVybmlvblxuICogQG5hbWUgcXVhdFxuICovXG5cbnZhciBxdWF0ID0ge307XG5cbnZhciBxdWF0SWRlbnRpdHkgPSBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAwLCAxXSk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBpZGVudGl0eSBxdWF0XG4gKlxuICogQHJldHVybnMge3F1YXR9IGEgbmV3IHF1YXRlcm5pb25cbiAqL1xucXVhdC5jcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgb3V0ID0gbmV3IEdMTUFUX0FSUkFZX1RZUEUoNCk7XG4gICAgb3V0WzBdID0gMDtcbiAgICBvdXRbMV0gPSAwO1xuICAgIG91dFsyXSA9IDA7XG4gICAgb3V0WzNdID0gMTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHF1YXQgaW5pdGlhbGl6ZWQgd2l0aCB2YWx1ZXMgZnJvbSBhbiBleGlzdGluZyBxdWF0ZXJuaW9uXG4gKlxuICogQHBhcmFtIHtxdWF0fSBhIHF1YXRlcm5pb24gdG8gY2xvbmVcbiAqIEByZXR1cm5zIHtxdWF0fSBhIG5ldyBxdWF0ZXJuaW9uXG4gKiBAZnVuY3Rpb25cbiAqL1xucXVhdC5jbG9uZSA9IHZlYzQuY2xvbmU7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBxdWF0IGluaXRpYWxpemVkIHdpdGggdGhlIGdpdmVuIHZhbHVlc1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB4IFggY29tcG9uZW50XG4gKiBAcGFyYW0ge051bWJlcn0geSBZIGNvbXBvbmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IHogWiBjb21wb25lbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSB3IFcgY29tcG9uZW50XG4gKiBAcmV0dXJucyB7cXVhdH0gYSBuZXcgcXVhdGVybmlvblxuICogQGZ1bmN0aW9uXG4gKi9cbnF1YXQuZnJvbVZhbHVlcyA9IHZlYzQuZnJvbVZhbHVlcztcblxuLyoqXG4gKiBDb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgcXVhdCB0byBhbm90aGVyXG4gKlxuICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge3F1YXR9IGEgdGhlIHNvdXJjZSBxdWF0ZXJuaW9uXG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gKiBAZnVuY3Rpb25cbiAqL1xucXVhdC5jb3B5ID0gdmVjNC5jb3B5O1xuXG4vKipcbiAqIFNldCB0aGUgY29tcG9uZW50cyBvZiBhIHF1YXQgdG8gdGhlIGdpdmVuIHZhbHVlc1xuICpcbiAqIEBwYXJhbSB7cXVhdH0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvblxuICogQHBhcmFtIHtOdW1iZXJ9IHggWCBjb21wb25lbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSB5IFkgY29tcG9uZW50XG4gKiBAcGFyYW0ge051bWJlcn0geiBaIGNvbXBvbmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IHcgVyBjb21wb25lbnRcbiAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAqIEBmdW5jdGlvblxuICovXG5xdWF0LnNldCA9IHZlYzQuc2V0O1xuXG4vKipcbiAqIFNldCBhIHF1YXQgdG8gdGhlIGlkZW50aXR5IHF1YXRlcm5pb25cbiAqXG4gKiBAcGFyYW0ge3F1YXR9IG91dCB0aGUgcmVjZWl2aW5nIHF1YXRlcm5pb25cbiAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAqL1xucXVhdC5pZGVudGl0eSA9IGZ1bmN0aW9uKG91dCkge1xuICAgIG91dFswXSA9IDA7XG4gICAgb3V0WzFdID0gMDtcbiAgICBvdXRbMl0gPSAwO1xuICAgIG91dFszXSA9IDE7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogU2V0cyBhIHF1YXQgZnJvbSB0aGUgZ2l2ZW4gYW5nbGUgYW5kIHJvdGF0aW9uIGF4aXMsXG4gKiB0aGVuIHJldHVybnMgaXQuXG4gKlxuICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge3ZlYzN9IGF4aXMgdGhlIGF4aXMgYXJvdW5kIHdoaWNoIHRvIHJvdGF0ZVxuICogQHBhcmFtIHtOdW1iZXJ9IHJhZCB0aGUgYW5nbGUgaW4gcmFkaWFuc1xuICogQHJldHVybnMge3F1YXR9IG91dFxuICoqL1xucXVhdC5zZXRBeGlzQW5nbGUgPSBmdW5jdGlvbihvdXQsIGF4aXMsIHJhZCkge1xuICAgIHJhZCA9IHJhZCAqIDAuNTtcbiAgICB2YXIgcyA9IE1hdGguc2luKHJhZCk7XG4gICAgb3V0WzBdID0gcyAqIGF4aXNbMF07XG4gICAgb3V0WzFdID0gcyAqIGF4aXNbMV07XG4gICAgb3V0WzJdID0gcyAqIGF4aXNbMl07XG4gICAgb3V0WzNdID0gTWF0aC5jb3MocmFkKTtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBBZGRzIHR3byBxdWF0J3NcbiAqXG4gKiBAcGFyYW0ge3F1YXR9IG91dCB0aGUgcmVjZWl2aW5nIHF1YXRlcm5pb25cbiAqIEBwYXJhbSB7cXVhdH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHtxdWF0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge3F1YXR9IG91dFxuICogQGZ1bmN0aW9uXG4gKi9cbnF1YXQuYWRkID0gdmVjNC5hZGQ7XG5cbi8qKlxuICogTXVsdGlwbGllcyB0d28gcXVhdCdzXG4gKlxuICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge3F1YXR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7cXVhdH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAqL1xucXVhdC5tdWx0aXBseSA9IGZ1bmN0aW9uKG91dCwgYSwgYikge1xuICAgIHZhciBheCA9IGFbMF0sIGF5ID0gYVsxXSwgYXogPSBhWzJdLCBhdyA9IGFbM10sXG4gICAgICAgIGJ4ID0gYlswXSwgYnkgPSBiWzFdLCBieiA9IGJbMl0sIGJ3ID0gYlszXTtcblxuICAgIG91dFswXSA9IGF4ICogYncgKyBhdyAqIGJ4ICsgYXkgKiBieiAtIGF6ICogYnk7XG4gICAgb3V0WzFdID0gYXkgKiBidyArIGF3ICogYnkgKyBheiAqIGJ4IC0gYXggKiBiejtcbiAgICBvdXRbMl0gPSBheiAqIGJ3ICsgYXcgKiBieiArIGF4ICogYnkgLSBheSAqIGJ4O1xuICAgIG91dFszXSA9IGF3ICogYncgLSBheCAqIGJ4IC0gYXkgKiBieSAtIGF6ICogYno7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHtAbGluayBxdWF0Lm11bHRpcGx5fVxuICogQGZ1bmN0aW9uXG4gKi9cbnF1YXQubXVsID0gcXVhdC5tdWx0aXBseTtcblxuLyoqXG4gKiBTY2FsZXMgYSBxdWF0IGJ5IGEgc2NhbGFyIG51bWJlclxuICpcbiAqIEBwYXJhbSB7cXVhdH0gb3V0IHRoZSByZWNlaXZpbmcgdmVjdG9yXG4gKiBAcGFyYW0ge3F1YXR9IGEgdGhlIHZlY3RvciB0byBzY2FsZVxuICogQHBhcmFtIHtOdW1iZXJ9IGIgYW1vdW50IHRvIHNjYWxlIHRoZSB2ZWN0b3IgYnlcbiAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAqIEBmdW5jdGlvblxuICovXG5xdWF0LnNjYWxlID0gdmVjNC5zY2FsZTtcblxuLyoqXG4gKiBSb3RhdGVzIGEgcXVhdGVybmlvbiBieSB0aGUgZ2l2ZW4gYW5nbGUgYXJvdW5kIHRoZSBYIGF4aXNcbiAqXG4gKiBAcGFyYW0ge3F1YXR9IG91dCBxdWF0IHJlY2VpdmluZyBvcGVyYXRpb24gcmVzdWx0XG4gKiBAcGFyYW0ge3F1YXR9IGEgcXVhdCB0byByb3RhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSByYWQgYW5nbGUgKGluIHJhZGlhbnMpIHRvIHJvdGF0ZVxuICogQHJldHVybnMge3F1YXR9IG91dFxuICovXG5xdWF0LnJvdGF0ZVggPSBmdW5jdGlvbiAob3V0LCBhLCByYWQpIHtcbiAgICByYWQgKj0gMC41OyBcblxuICAgIHZhciBheCA9IGFbMF0sIGF5ID0gYVsxXSwgYXogPSBhWzJdLCBhdyA9IGFbM10sXG4gICAgICAgIGJ4ID0gTWF0aC5zaW4ocmFkKSwgYncgPSBNYXRoLmNvcyhyYWQpO1xuXG4gICAgb3V0WzBdID0gYXggKiBidyArIGF3ICogYng7XG4gICAgb3V0WzFdID0gYXkgKiBidyArIGF6ICogYng7XG4gICAgb3V0WzJdID0gYXogKiBidyAtIGF5ICogYng7XG4gICAgb3V0WzNdID0gYXcgKiBidyAtIGF4ICogYng7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUm90YXRlcyBhIHF1YXRlcm5pb24gYnkgdGhlIGdpdmVuIGFuZ2xlIGFyb3VuZCB0aGUgWSBheGlzXG4gKlxuICogQHBhcmFtIHtxdWF0fSBvdXQgcXVhdCByZWNlaXZpbmcgb3BlcmF0aW9uIHJlc3VsdFxuICogQHBhcmFtIHtxdWF0fSBhIHF1YXQgdG8gcm90YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gcmFkIGFuZ2xlIChpbiByYWRpYW5zKSB0byByb3RhdGVcbiAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAqL1xucXVhdC5yb3RhdGVZID0gZnVuY3Rpb24gKG91dCwgYSwgcmFkKSB7XG4gICAgcmFkICo9IDAuNTsgXG5cbiAgICB2YXIgYXggPSBhWzBdLCBheSA9IGFbMV0sIGF6ID0gYVsyXSwgYXcgPSBhWzNdLFxuICAgICAgICBieSA9IE1hdGguc2luKHJhZCksIGJ3ID0gTWF0aC5jb3MocmFkKTtcblxuICAgIG91dFswXSA9IGF4ICogYncgLSBheiAqIGJ5O1xuICAgIG91dFsxXSA9IGF5ICogYncgKyBhdyAqIGJ5O1xuICAgIG91dFsyXSA9IGF6ICogYncgKyBheCAqIGJ5O1xuICAgIG91dFszXSA9IGF3ICogYncgLSBheSAqIGJ5O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFJvdGF0ZXMgYSBxdWF0ZXJuaW9uIGJ5IHRoZSBnaXZlbiBhbmdsZSBhcm91bmQgdGhlIFogYXhpc1xuICpcbiAqIEBwYXJhbSB7cXVhdH0gb3V0IHF1YXQgcmVjZWl2aW5nIG9wZXJhdGlvbiByZXN1bHRcbiAqIEBwYXJhbSB7cXVhdH0gYSBxdWF0IHRvIHJvdGF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IHJhZCBhbmdsZSAoaW4gcmFkaWFucykgdG8gcm90YXRlXG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gKi9cbnF1YXQucm90YXRlWiA9IGZ1bmN0aW9uIChvdXQsIGEsIHJhZCkge1xuICAgIHJhZCAqPSAwLjU7IFxuXG4gICAgdmFyIGF4ID0gYVswXSwgYXkgPSBhWzFdLCBheiA9IGFbMl0sIGF3ID0gYVszXSxcbiAgICAgICAgYnogPSBNYXRoLnNpbihyYWQpLCBidyA9IE1hdGguY29zKHJhZCk7XG5cbiAgICBvdXRbMF0gPSBheCAqIGJ3ICsgYXkgKiBiejtcbiAgICBvdXRbMV0gPSBheSAqIGJ3IC0gYXggKiBiejtcbiAgICBvdXRbMl0gPSBheiAqIGJ3ICsgYXcgKiBiejtcbiAgICBvdXRbM10gPSBhdyAqIGJ3IC0gYXogKiBiejtcbiAgICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBXIGNvbXBvbmVudCBvZiBhIHF1YXQgZnJvbSB0aGUgWCwgWSwgYW5kIFogY29tcG9uZW50cy5cbiAqIEFzc3VtZXMgdGhhdCBxdWF0ZXJuaW9uIGlzIDEgdW5pdCBpbiBsZW5ndGguXG4gKiBBbnkgZXhpc3RpbmcgVyBjb21wb25lbnQgd2lsbCBiZSBpZ25vcmVkLlxuICpcbiAqIEBwYXJhbSB7cXVhdH0gb3V0IHRoZSByZWNlaXZpbmcgcXVhdGVybmlvblxuICogQHBhcmFtIHtxdWF0fSBhIHF1YXQgdG8gY2FsY3VsYXRlIFcgY29tcG9uZW50IG9mXG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gKi9cbnF1YXQuY2FsY3VsYXRlVyA9IGZ1bmN0aW9uIChvdXQsIGEpIHtcbiAgICB2YXIgeCA9IGFbMF0sIHkgPSBhWzFdLCB6ID0gYVsyXTtcblxuICAgIG91dFswXSA9IHg7XG4gICAgb3V0WzFdID0geTtcbiAgICBvdXRbMl0gPSB6O1xuICAgIG91dFszXSA9IC1NYXRoLnNxcnQoTWF0aC5hYnMoMS4wIC0geCAqIHggLSB5ICogeSAtIHogKiB6KSk7XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIHF1YXQnc1xuICpcbiAqIEBwYXJhbSB7cXVhdH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHtxdWF0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHJldHVybnMge051bWJlcn0gZG90IHByb2R1Y3Qgb2YgYSBhbmQgYlxuICogQGZ1bmN0aW9uXG4gKi9cbnF1YXQuZG90ID0gdmVjNC5kb3Q7XG5cbi8qKlxuICogUGVyZm9ybXMgYSBsaW5lYXIgaW50ZXJwb2xhdGlvbiBiZXR3ZWVuIHR3byBxdWF0J3NcbiAqXG4gKiBAcGFyYW0ge3F1YXR9IG91dCB0aGUgcmVjZWl2aW5nIHF1YXRlcm5pb25cbiAqIEBwYXJhbSB7cXVhdH0gYSB0aGUgZmlyc3Qgb3BlcmFuZFxuICogQHBhcmFtIHtxdWF0fSBiIHRoZSBzZWNvbmQgb3BlcmFuZFxuICogQHBhcmFtIHtOdW1iZXJ9IHQgaW50ZXJwb2xhdGlvbiBhbW91bnQgYmV0d2VlbiB0aGUgdHdvIGlucHV0c1xuICogQHJldHVybnMge3F1YXR9IG91dFxuICogQGZ1bmN0aW9uXG4gKi9cbnF1YXQubGVycCA9IHZlYzQubGVycDtcblxuLyoqXG4gKiBQZXJmb3JtcyBhIHNwaGVyaWNhbCBsaW5lYXIgaW50ZXJwb2xhdGlvbiBiZXR3ZWVuIHR3byBxdWF0XG4gKlxuICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge3F1YXR9IGEgdGhlIGZpcnN0IG9wZXJhbmRcbiAqIEBwYXJhbSB7cXVhdH0gYiB0aGUgc2Vjb25kIG9wZXJhbmRcbiAqIEBwYXJhbSB7TnVtYmVyfSB0IGludGVycG9sYXRpb24gYW1vdW50IGJldHdlZW4gdGhlIHR3byBpbnB1dHNcbiAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAqL1xucXVhdC5zbGVycCA9IGZ1bmN0aW9uIChvdXQsIGEsIGIsIHQpIHtcbiAgICB2YXIgYXggPSBhWzBdLCBheSA9IGFbMV0sIGF6ID0gYVsyXSwgYXcgPSBhWzNdLFxuICAgICAgICBieCA9IGJbMF0sIGJ5ID0gYlsxXSwgYnogPSBiWzJdLCBidyA9IGJbM107XG5cbiAgICB2YXIgY29zSGFsZlRoZXRhID0gYXggKiBieCArIGF5ICogYnkgKyBheiAqIGJ6ICsgYXcgKiBidyxcbiAgICAgICAgaGFsZlRoZXRhLFxuICAgICAgICBzaW5IYWxmVGhldGEsXG4gICAgICAgIHJhdGlvQSxcbiAgICAgICAgcmF0aW9CO1xuXG4gICAgaWYgKE1hdGguYWJzKGNvc0hhbGZUaGV0YSkgPj0gMS4wKSB7XG4gICAgICAgIGlmIChvdXQgIT09IGEpIHtcbiAgICAgICAgICAgIG91dFswXSA9IGF4O1xuICAgICAgICAgICAgb3V0WzFdID0gYXk7XG4gICAgICAgICAgICBvdXRbMl0gPSBhejtcbiAgICAgICAgICAgIG91dFszXSA9IGF3O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgaGFsZlRoZXRhID0gTWF0aC5hY29zKGNvc0hhbGZUaGV0YSk7XG4gICAgc2luSGFsZlRoZXRhID0gTWF0aC5zcXJ0KDEuMCAtIGNvc0hhbGZUaGV0YSAqIGNvc0hhbGZUaGV0YSk7XG5cbiAgICBpZiAoTWF0aC5hYnMoc2luSGFsZlRoZXRhKSA8IDAuMDAxKSB7XG4gICAgICAgIG91dFswXSA9IChheCAqIDAuNSArIGJ4ICogMC41KTtcbiAgICAgICAgb3V0WzFdID0gKGF5ICogMC41ICsgYnkgKiAwLjUpO1xuICAgICAgICBvdXRbMl0gPSAoYXogKiAwLjUgKyBieiAqIDAuNSk7XG4gICAgICAgIG91dFszXSA9IChhdyAqIDAuNSArIGJ3ICogMC41KTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICByYXRpb0EgPSBNYXRoLnNpbigoMSAtIHQpICogaGFsZlRoZXRhKSAvIHNpbkhhbGZUaGV0YTtcbiAgICByYXRpb0IgPSBNYXRoLnNpbih0ICogaGFsZlRoZXRhKSAvIHNpbkhhbGZUaGV0YTtcblxuICAgIG91dFswXSA9IChheCAqIHJhdGlvQSArIGJ4ICogcmF0aW9CKTtcbiAgICBvdXRbMV0gPSAoYXkgKiByYXRpb0EgKyBieSAqIHJhdGlvQik7XG4gICAgb3V0WzJdID0gKGF6ICogcmF0aW9BICsgYnogKiByYXRpb0IpO1xuICAgIG91dFszXSA9IChhdyAqIHJhdGlvQSArIGJ3ICogcmF0aW9CKTtcblxuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGludmVyc2Ugb2YgYSBxdWF0XG4gKlxuICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge3F1YXR9IGEgcXVhdCB0byBjYWxjdWxhdGUgaW52ZXJzZSBvZlxuICogQHJldHVybnMge3F1YXR9IG91dFxuICovXG5xdWF0LmludmVydCA9IGZ1bmN0aW9uKG91dCwgYSkge1xuICAgIHZhciBhMCA9IGFbMF0sIGExID0gYVsxXSwgYTIgPSBhWzJdLCBhMyA9IGFbM10sXG4gICAgICAgIGRvdCA9IGEwKmEwICsgYTEqYTEgKyBhMiphMiArIGEzKmEzLFxuICAgICAgICBpbnZEb3QgPSBkb3QgPyAxLjAvZG90IDogMDtcbiAgICBcbiAgICAvLyBUT0RPOiBXb3VsZCBiZSBmYXN0ZXIgdG8gcmV0dXJuIFswLDAsMCwwXSBpbW1lZGlhdGVseSBpZiBkb3QgPT0gMFxuXG4gICAgb3V0WzBdID0gLWEwKmludkRvdDtcbiAgICBvdXRbMV0gPSAtYTEqaW52RG90O1xuICAgIG91dFsyXSA9IC1hMippbnZEb3Q7XG4gICAgb3V0WzNdID0gYTMqaW52RG90O1xuICAgIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGNvbmp1Z2F0ZSBvZiBhIHF1YXRcbiAqIElmIHRoZSBxdWF0ZXJuaW9uIGlzIG5vcm1hbGl6ZWQsIHRoaXMgZnVuY3Rpb24gaXMgZmFzdGVyIHRoYW4gcXVhdC5pbnZlcnNlIGFuZCBwcm9kdWNlcyB0aGUgc2FtZSByZXN1bHQuXG4gKlxuICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge3F1YXR9IGEgcXVhdCB0byBjYWxjdWxhdGUgY29uanVnYXRlIG9mXG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gKi9cbnF1YXQuY29uanVnYXRlID0gZnVuY3Rpb24gKG91dCwgYSkge1xuICAgIG91dFswXSA9IC1hWzBdO1xuICAgIG91dFsxXSA9IC1hWzFdO1xuICAgIG91dFsyXSA9IC1hWzJdO1xuICAgIG91dFszXSA9IGFbM107XG4gICAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgbGVuZ3RoIG9mIGEgcXVhdFxuICpcbiAqIEBwYXJhbSB7cXVhdH0gYSB2ZWN0b3IgdG8gY2FsY3VsYXRlIGxlbmd0aCBvZlxuICogQHJldHVybnMge051bWJlcn0gbGVuZ3RoIG9mIGFcbiAqIEBmdW5jdGlvblxuICovXG5xdWF0Lmxlbmd0aCA9IHZlYzQubGVuZ3RoO1xuXG4vKipcbiAqIEFsaWFzIGZvciB7QGxpbmsgcXVhdC5sZW5ndGh9XG4gKiBAZnVuY3Rpb25cbiAqL1xucXVhdC5sZW4gPSBxdWF0Lmxlbmd0aDtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBzcXVhcmVkIGxlbmd0aCBvZiBhIHF1YXRcbiAqXG4gKiBAcGFyYW0ge3F1YXR9IGEgdmVjdG9yIHRvIGNhbGN1bGF0ZSBzcXVhcmVkIGxlbmd0aCBvZlxuICogQHJldHVybnMge051bWJlcn0gc3F1YXJlZCBsZW5ndGggb2YgYVxuICogQGZ1bmN0aW9uXG4gKi9cbnF1YXQuc3F1YXJlZExlbmd0aCA9IHZlYzQuc3F1YXJlZExlbmd0aDtcblxuLyoqXG4gKiBBbGlhcyBmb3Ige0BsaW5rIHF1YXQuc3F1YXJlZExlbmd0aH1cbiAqIEBmdW5jdGlvblxuICovXG5xdWF0LnNxckxlbiA9IHF1YXQuc3F1YXJlZExlbmd0aDtcblxuLyoqXG4gKiBOb3JtYWxpemUgYSBxdWF0XG4gKlxuICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge3F1YXR9IGEgcXVhdGVybmlvbiB0byBub3JtYWxpemVcbiAqIEByZXR1cm5zIHtxdWF0fSBvdXRcbiAqIEBmdW5jdGlvblxuICovXG5xdWF0Lm5vcm1hbGl6ZSA9IHZlYzQubm9ybWFsaXplO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBxdWF0ZXJuaW9uIGZyb20gdGhlIGdpdmVuIDN4MyByb3RhdGlvbiBtYXRyaXguXG4gKlxuICogQHBhcmFtIHtxdWF0fSBvdXQgdGhlIHJlY2VpdmluZyBxdWF0ZXJuaW9uXG4gKiBAcGFyYW0ge21hdDN9IG0gcm90YXRpb24gbWF0cml4XG4gKiBAcmV0dXJucyB7cXVhdH0gb3V0XG4gKiBAZnVuY3Rpb25cbiAqL1xucXVhdC5mcm9tTWF0MyA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgc19pTmV4dCA9IFsxLDIsMF07XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG91dCwgbSkge1xuICAgICAgICAvLyBBbGdvcml0aG0gaW4gS2VuIFNob2VtYWtlJ3MgYXJ0aWNsZSBpbiAxOTg3IFNJR0dSQVBIIGNvdXJzZSBub3Rlc1xuICAgICAgICAvLyBhcnRpY2xlIFwiUXVhdGVybmlvbiBDYWxjdWx1cyBhbmQgRmFzdCBBbmltYXRpb25cIi5cbiAgICAgICAgdmFyIGZUcmFjZSA9IG1bMF0gKyBtWzRdICsgbVs4XTtcbiAgICAgICAgdmFyIGZSb290O1xuXG4gICAgICAgIGlmICggZlRyYWNlID4gMC4wICkge1xuICAgICAgICAgICAgLy8gfHd8ID4gMS8yLCBtYXkgYXMgd2VsbCBjaG9vc2UgdyA+IDEvMlxuICAgICAgICAgICAgZlJvb3QgPSBNYXRoLnNxcnQoZlRyYWNlICsgMS4wKTsgIC8vIDJ3XG4gICAgICAgICAgICBvdXRbM10gPSAwLjUgKiBmUm9vdDtcbiAgICAgICAgICAgIGZSb290ID0gMC41L2ZSb290OyAgLy8gMS8oNHcpXG4gICAgICAgICAgICBvdXRbMF0gPSAobVs3XS1tWzVdKSpmUm9vdDtcbiAgICAgICAgICAgIG91dFsxXSA9IChtWzJdLW1bNl0pKmZSb290O1xuICAgICAgICAgICAgb3V0WzJdID0gKG1bM10tbVsxXSkqZlJvb3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB8d3wgPD0gMS8yXG4gICAgICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgICAgICBpZiAoIG1bNF0gPiBtWzBdIClcbiAgICAgICAgICAgICAgaSA9IDE7XG4gICAgICAgICAgICBpZiAoIG1bOF0gPiBtW2kqMytpXSApXG4gICAgICAgICAgICAgIGkgPSAyO1xuICAgICAgICAgICAgdmFyIGogPSBzX2lOZXh0W2ldO1xuICAgICAgICAgICAgdmFyIGsgPSBzX2lOZXh0W2pdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmUm9vdCA9IE1hdGguc3FydChtW2kqMytpXS1tW2oqMytqXS1tW2sqMytrXSArIDEuMCk7XG4gICAgICAgICAgICBvdXRbaV0gPSAwLjUgKiBmUm9vdDtcbiAgICAgICAgICAgIGZSb290ID0gMC41IC8gZlJvb3Q7XG4gICAgICAgICAgICBvdXRbM10gPSAobVtrKjMral0gLSBtW2oqMytrXSkgKiBmUm9vdDtcbiAgICAgICAgICAgIG91dFtqXSA9IChtW2oqMytpXSArIG1baSozK2pdKSAqIGZSb290O1xuICAgICAgICAgICAgb3V0W2tdID0gKG1bayozK2ldICsgbVtpKjMra10pICogZlJvb3Q7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIHF1YXRlbmlvblxuICpcbiAqIEBwYXJhbSB7cXVhdH0gdmVjIHZlY3RvciB0byByZXByZXNlbnQgYXMgYSBzdHJpbmdcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdmVjdG9yXG4gKi9cbnF1YXQuc3RyID0gZnVuY3Rpb24gKGEpIHtcbiAgICByZXR1cm4gJ3F1YXQoJyArIGFbMF0gKyAnLCAnICsgYVsxXSArICcsICcgKyBhWzJdICsgJywgJyArIGFbM10gKyAnKSc7XG59O1xuXG5pZih0eXBlb2YoZXhwb3J0cykgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZXhwb3J0cy5xdWF0ID0gcXVhdDtcbn1cbjtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuICB9KShzaGltLmV4cG9ydHMpO1xufSkoKTtcbiIsInZhciBQb2ludCA9IHJlcXVpcmUoJy4uL3BvaW50LmpzJyk7XG52YXIgR2VvID0gcmVxdWlyZSgnLi4vZ2VvLmpzJyk7XG52YXIgVmVjdG9yUmVuZGVyZXIgPSByZXF1aXJlKCcuLi92ZWN0b3JfcmVuZGVyZXIuanMnKTtcblxuVmVjdG9yUmVuZGVyZXIuQ2FudmFzUmVuZGVyZXIgPSBDYW52YXNSZW5kZXJlcjtcbkNhbnZhc1JlbmRlcmVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmVjdG9yUmVuZGVyZXIucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gQ2FudmFzUmVuZGVyZXIgKHRpbGVfc291cmNlLCBsYXllcnMsIHN0eWxlcywgb3B0aW9ucylcbntcbiAgICBWZWN0b3JSZW5kZXJlci5jYWxsKHRoaXMsICdDYW52YXNSZW5kZXJlcicsIHRpbGVfc291cmNlLCBsYXllcnMsIHN0eWxlcywgb3B0aW9ucyk7XG5cbiAgICAvLyBTZWxlY3Rpb24gaW5mbyBzaG93biBvbiBob3ZlclxuICAgIHRoaXMuc2VsZWN0aW9uX2luZm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLnNlbGVjdGlvbl9pbmZvLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbGFiZWwnKTtcbiAgICB0aGlzLnNlbGVjdGlvbl9pbmZvLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgICAvLyBGb3IgZHJhd2luZyBtdWx0aXBvbHlnb25zIHcvY2FudmFzIGNvbXBvc2l0ZSBvcGVyYXRpb25zXG4gICAgdGhpcy5jdXRvdXRfY29udGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpLmdldENvbnRleHQoJzJkJyk7XG59XG5cbkNhbnZhc1JlbmRlcmVyLnByb3RvdHlwZS5fdGlsZVdvcmtlckNvbXBsZXRlZCA9IGZ1bmN0aW9uICh0aWxlKVxue1xuICAgIC8vIFVzZSBleGlzdGluZyBjYW52YXMgb3IgY3JlYXRlIG5ldyBvbmVcbiAgICBpZiAodGlsZS5jYW52YXMgPT0gbnVsbCkge1xuICAgICAgICB0aWxlLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICB0aWxlLmNvbnRleHQgPSB0aWxlLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgIHRpbGUuY2FudmFzLnN0eWxlLndpZHRoID0gR2VvLnRpbGVfc2l6ZSArICdweCc7XG4gICAgICAgIHRpbGUuY2FudmFzLnN0eWxlLndpZHRoID0gR2VvLnRpbGVfc2l6ZSArICdweCc7XG4gICAgICAgIHRpbGUuY2FudmFzLndpZHRoID0gTWF0aC5yb3VuZChHZW8udGlsZV9zaXplICogdGhpcy5kZXZpY2VfcGl4ZWxfcmF0aW8pO1xuICAgICAgICB0aWxlLmNhbnZhcy5oZWlnaHQgPSBNYXRoLnJvdW5kKEdlby50aWxlX3NpemUgKiB0aGlzLmRldmljZV9waXhlbF9yYXRpbyk7XG4gICAgICAgIHRpbGUuY2FudmFzLnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLmNvbG9yVG9TdHJpbmcodGhpcy5zdHlsZXMuZGVmYXVsdCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aWxlLmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRpbGUuY2FudmFzLndpZHRoLCB0aWxlLmNhbnZhcy5oZWlnaHQpO1xuICAgIH1cblxuICAgIHRoaXMucmVuZGVyVGlsZSh0aWxlLCB0aWxlLmNvbnRleHQpO1xuXG4gICAgaWYgKHRpbGUuY2FudmFzLnBhcmVudE5vZGUgPT0gbnVsbCkge1xuICAgICAgICB2YXIgdGlsZURpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXZbZGF0YS10aWxlLWtleT0nXCIgKyB0aWxlLmtleSArIFwiJ11cIik7XG4gICAgICAgIHRpbGVEaXYuYXBwZW5kQ2hpbGQodGlsZS5jYW52YXMpO1xuICAgIH1cbn07XG5cbi8vIFNjYWxlIGEgR2VvSlNPTiBjb29yZGluYXRlICgyLWVsZW1lbnQgYXJyYXkpIGZyb20gW21pbiwgbWF4XSB0byB0aWxlIHBpeGVsc1xuLy8gcmV0dXJucyBhIGNvcHkgb2YgZ2VvbWV0cnkuY29vcmRpbmF0ZXMgdHJhbnNmb3JtZWQgaW50byBQb2ludHNcbkNhbnZhc1JlbmRlcmVyLnByb3RvdHlwZS5zY2FsZUdlb21ldHJ5VG9QaXhlbHMgPSBmdW5jdGlvbiBzY2FsZUdlb21ldHJ5VG9QaXhlbHMgKGdlb21ldHJ5KVxue1xuICAgIHZhciByZW5kZXJlciA9IHRoaXM7XG4gICAgcmV0dXJuIEdlby50cmFuc2Zvcm1HZW9tZXRyeShnZW9tZXRyeSwgZnVuY3Rpb24gKGNvb3JkaW5hdGVzKSB7XG4gICAgICAgIHJldHVybiBQb2ludChcbiAgICAgICAgICAgIC8vIE1hdGgucm91bmQoKGNvb3JkaW5hdGVzWzBdIC0gbWluLngpICogR2VvLnRpbGVfc2l6ZSAvIChtYXgueCAtIG1pbi54KSksIC8vIHJvdW5kaW5nIHJlbW92ZXMgc2VhbXMgYnV0IGNhdXNlcyBhbGlhc2luZ1xuICAgICAgICAgICAgLy8gTWF0aC5yb3VuZCgoY29vcmRpbmF0ZXNbMV0gLSBtaW4ueSkgKiBHZW8udGlsZV9zaXplIC8gKG1heC55IC0gbWluLnkpKVxuICAgICAgICAgICAgY29vcmRpbmF0ZXNbMF0gKiBHZW8udGlsZV9zaXplICogcmVuZGVyZXIuZGV2aWNlX3BpeGVsX3JhdGlvIC8gVmVjdG9yUmVuZGVyZXIudGlsZV9zY2FsZSxcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzWzFdICogR2VvLnRpbGVfc2l6ZSAqIHJlbmRlcmVyLmRldmljZV9waXhlbF9yYXRpbyAvIFZlY3RvclJlbmRlcmVyLnRpbGVfc2NhbGUgKiAtMSAvLyBhZGp1c3QgZm9yIGZsaXBwZWQgeS1jb29yZFxuICAgICAgICApO1xuICAgIH0pO1xufTtcblxuLy8gUmVuZGVycyBhIGxpbmUgZ2l2ZW4gYXMgYW4gYXJyYXkgb2YgUG9pbnRzXG4vLyBsaW5lID0gW1BvaW50LCBQb2ludCwgLi4uXVxuQ2FudmFzUmVuZGVyZXIucHJvdG90eXBlLnJlbmRlckxpbmUgPSBmdW5jdGlvbiByZW5kZXJMaW5lIChsaW5lLCBzdHlsZSwgY29udGV4dClcbntcbiAgICB2YXIgc2VnbWVudHMgPSBsaW5lO1xuICAgIHZhciBjb2xvciA9IHN0eWxlLmNvbG9yO1xuICAgIHZhciB3aWR0aCA9IHN0eWxlLndpZHRoO1xuICAgIHZhciBkYXNoID0gc3R5bGUuZGFzaDtcblxuICAgIHZhciBjID0gY29udGV4dDtcbiAgICBjLmJlZ2luUGF0aCgpO1xuICAgIGMuc3Ryb2tlU3R5bGUgPSB0aGlzLmNvbG9yVG9TdHJpbmcoY29sb3IpO1xuICAgIGMubGluZUNhcCA9ICdyb3VuZCc7XG4gICAgYy5saW5lV2lkdGggPSB3aWR0aDtcbiAgICBpZiAoYy5zZXRMaW5lRGFzaCkge1xuICAgICAgICBpZiAoZGFzaCkge1xuICAgICAgICAgICAgYy5zZXRMaW5lRGFzaChkYXNoLm1hcChmdW5jdGlvbiAoZCkgeyByZXR1cm4gZCAqIHdpZHRoOyB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjLnNldExpbmVEYXNoKFtdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIHI9MDsgciA8IHNlZ21lbnRzLmxlbmd0aCAtIDE7IHIgKyspIHtcbiAgICAgICAgdmFyIHNlZ21lbnQgPSBbXG4gICAgICAgICAgICBzZWdtZW50c1tyXS54LCBzZWdtZW50c1tyXS55LFxuICAgICAgICAgICAgc2VnbWVudHNbciArIDFdLngsIHNlZ21lbnRzW3IgKyAxXS55XG4gICAgICAgIF07XG5cbiAgICAgICAgYy5tb3ZlVG8oc2VnbWVudFswXSwgc2VnbWVudFsxXSk7XG4gICAgICAgIGMubGluZVRvKHNlZ21lbnRbMl0sIHNlZ21lbnRbM10pO1xuICAgIH07XG5cbiAgICBjLmNsb3NlUGF0aCgpO1xuICAgIGMuc3Ryb2tlKCk7XG59O1xuXG4vLyBSZW5kZXJzIGEgcG9seWdvbiBnaXZlbiBhcyBhbiBhcnJheSBvZiBQb2ludHNcbi8vIHBvbHlnb24gPSBbUG9pbnQsIFBvaW50LCAuLi5dXG5DYW52YXNSZW5kZXJlci5wcm90b3R5cGUucmVuZGVyUG9seWdvbiA9IGZ1bmN0aW9uIHJlbmRlclBvbHlnb24gKHBvbHlnb24sIHN0eWxlLCBjb250ZXh0KVxue1xuICAgIHZhciBzZWdtZW50cyA9IHBvbHlnb247XG4gICAgdmFyIGNvbG9yID0gc3R5bGUuY29sb3I7XG4gICAgdmFyIHdpZHRoID0gc3R5bGUud2lkdGg7XG4gICAgdmFyIG91dGxpbmVfY29sb3IgPSBzdHlsZS5vdXRsaW5lICYmIHN0eWxlLm91dGxpbmUuY29sb3I7XG4gICAgdmFyIG91dGxpbmVfd2lkdGggPSBzdHlsZS5vdXRsaW5lICYmIHN0eWxlLm91dGxpbmUud2lkdGg7XG4gICAgdmFyIG91dGxpbmVfZGFzaCA9IHN0eWxlLm91dGxpbmUgJiYgc3R5bGUub3V0bGluZS5kYXNoO1xuXG4gICAgdmFyIGMgPSBjb250ZXh0O1xuICAgIGMuYmVnaW5QYXRoKCk7XG4gICAgYy5maWxsU3R5bGUgPSB0aGlzLmNvbG9yVG9TdHJpbmcoY29sb3IpO1xuICAgIGMubW92ZVRvKHNlZ21lbnRzWzBdLngsIHNlZ21lbnRzWzBdLnkpO1xuXG4gICAgZm9yICh2YXIgcj0xOyByIDwgc2VnbWVudHMubGVuZ3RoOyByICsrKSB7XG4gICAgICAgIGMubGluZVRvKHNlZ21lbnRzW3JdLngsIHNlZ21lbnRzW3JdLnkpO1xuICAgIH07XG5cbiAgICBjLmNsb3NlUGF0aCgpO1xuICAgIGMuZmlsbCgpO1xuXG4gICAgLy8gT3V0bGluZVxuICAgIGlmIChvdXRsaW5lX2NvbG9yICYmIG91dGxpbmVfd2lkdGgpIHtcbiAgICAgICAgYy5zdHJva2VTdHlsZSA9IHRoaXMuY29sb3JUb1N0cmluZyhvdXRsaW5lX2NvbG9yKTtcbiAgICAgICAgYy5saW5lQ2FwID0gJ3JvdW5kJztcbiAgICAgICAgYy5saW5lV2lkdGggPSBvdXRsaW5lX3dpZHRoO1xuICAgICAgICBpZiAoYy5zZXRMaW5lRGFzaCkge1xuICAgICAgICAgICAgaWYgKG91dGxpbmVfZGFzaCkge1xuICAgICAgICAgICAgICAgIGMuc2V0TGluZURhc2gob3V0bGluZV9kYXNoLm1hcChmdW5jdGlvbiAoZCkgeyByZXR1cm4gZCAqIG91dGxpbmVfd2lkdGg7IH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGMuc2V0TGluZURhc2goW10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGMuc3Ryb2tlKCk7XG4gICAgfVxufTtcblxuLy8gUmVuZGVycyBhIHBvaW50IGdpdmVuIGFzIGEgUG9pbnQgb2JqZWN0XG5DYW52YXNSZW5kZXJlci5wcm90b3R5cGUucmVuZGVyUG9pbnQgPSBmdW5jdGlvbiByZW5kZXJQb2ludCAocG9pbnQsIHN0eWxlLCBjb250ZXh0KVxue1xuICAgIHZhciBjb2xvciA9IHN0eWxlLmNvbG9yO1xuICAgIHZhciBzaXplID0gc3R5bGUuc2l6ZTtcbiAgICB2YXIgb3V0bGluZV9jb2xvciA9IHN0eWxlLm91dGxpbmUgJiYgc3R5bGUub3V0bGluZS5jb2xvcjtcbiAgICB2YXIgb3V0bGluZV93aWR0aCA9IHN0eWxlLm91dGxpbmUgJiYgc3R5bGUub3V0bGluZS53aWR0aDtcbiAgICB2YXIgb3V0bGluZV9kYXNoID0gc3R5bGUub3V0bGluZSAmJiBzdHlsZS5vdXRsaW5lLmRhc2g7XG5cbiAgICB2YXIgYyA9IGNvbnRleHQ7XG4gICAgYy5maWxsU3R5bGUgPSB0aGlzLmNvbG9yVG9TdHJpbmcoY29sb3IpO1xuXG4gICAgYy5iZWdpblBhdGgoKTtcbiAgICBjLmFyYyhwb2ludC54LCBwb2ludC55LCBzaXplLCAwLCAyICogTWF0aC5QSSk7XG4gICAgYy5jbG9zZVBhdGgoKTtcbiAgICBjLmZpbGwoKTtcblxuICAgIC8vIE91dGxpbmVcbiAgICBpZiAob3V0bGluZV9jb2xvciAmJiBvdXRsaW5lX3dpZHRoKSB7XG4gICAgICAgIGMuc3Ryb2tlU3R5bGUgPSB0aGlzLmNvbG9yVG9TdHJpbmcob3V0bGluZV9jb2xvcik7XG4gICAgICAgIGMubGluZVdpZHRoID0gb3V0bGluZV93aWR0aDtcbiAgICAgICAgaWYgKGMuc2V0TGluZURhc2gpIHtcbiAgICAgICAgICAgIGlmIChvdXRsaW5lX2Rhc2gpIHtcbiAgICAgICAgICAgICAgICBjLnNldExpbmVEYXNoKG91dGxpbmVfZGFzaC5tYXAoZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQgKiBvdXRsaW5lX3dpZHRoOyB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjLnNldExpbmVEYXNoKFtdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjLnN0cm9rZSgpO1xuICAgIH1cbn07XG5cbkNhbnZhc1JlbmRlcmVyLnByb3RvdHlwZS5yZW5kZXJGZWF0dXJlID0gZnVuY3Rpb24gcmVuZGVyRmVhdHVyZSAoZmVhdHVyZSwgc3R5bGUsIGNvbnRleHQpXG57XG4gICAgdmFyIGcsIGgsIHBvbHlzO1xuICAgIHZhciBnZW9tZXRyeSA9IGZlYXR1cmUuZ2VvbWV0cnk7XG5cbiAgICBpZiAoZ2VvbWV0cnkudHlwZSA9PSAnTGluZVN0cmluZycpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJMaW5lKGdlb21ldHJ5LnBpeGVscywgc3R5bGUsIGNvbnRleHQpO1xuICAgIH1cbiAgICBlbHNlIGlmIChnZW9tZXRyeS50eXBlID09ICdNdWx0aUxpbmVTdHJpbmcnKSB7XG4gICAgICAgIGZvciAoZz0wOyBnIDwgZ2VvbWV0cnkucGl4ZWxzLmxlbmd0aDsgZysrKSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckxpbmUoZ2VvbWV0cnkucGl4ZWxzW2ddLCBzdHlsZSwgY29udGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoZ2VvbWV0cnkudHlwZSA9PSAnUG9seWdvbicgfHwgZ2VvbWV0cnkudHlwZSA9PSAnTXVsdGlQb2x5Z29uJykge1xuICAgICAgICBpZiAoZ2VvbWV0cnkudHlwZSA9PSAnUG9seWdvbicpIHtcbiAgICAgICAgICAgIHBvbHlzID0gW2dlb21ldHJ5LnBpeGVsc107IC8vIHRyZWF0IFBvbHlnb24gYXMgYSBkZWdlbmVyYXRlIE11bHRpUG9seWdvbiB0byBhdm9pZCBkdXBsaWNhdGluZyBjb2RlXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwb2x5cyA9IGdlb21ldHJ5LnBpeGVscztcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoZz0wOyBnIDwgcG9seXMubGVuZ3RoOyBnKyspIHtcbiAgICAgICAgICAgIC8vIFBvbHlnb25zIHdpdGggaG9sZXM6XG4gICAgICAgICAgICAvLyBSZW5kZXIgdG8gYSBzZXBhcmF0ZSBjYW52YXMsIHVzaW5nIGNvbXBvc2l0ZSBvcGVyYXRpb25zIHRvIGN1dCBob2xlcyBvdXQgb2YgcG9seWdvbiwgdGhlbiBjb3B5IGJhY2sgdG8gdGhlIG1haW4gY2FudmFzXG4gICAgICAgICAgICBpZiAocG9seXNbZ10ubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1dG91dF9jb250ZXh0LmNhbnZhcy53aWR0aCAhPSBjb250ZXh0LmNhbnZhcy53aWR0aCB8fCB0aGlzLmN1dG91dF9jb250ZXh0LmNhbnZhcy5oZWlnaHQgIT0gY29udGV4dC5jYW52YXMuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3V0b3V0X2NvbnRleHQuY2FudmFzLndpZHRoID0gY29udGV4dC5jYW52YXMud2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3V0b3V0X2NvbnRleHQuY2FudmFzLmhlaWdodCA9IGNvbnRleHQuY2FudmFzLmhlaWdodDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5jdXRvdXRfY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jdXRvdXRfY29udGV4dC5jYW52YXMud2lkdGgsIHRoaXMuY3V0b3V0X2NvbnRleHQuY2FudmFzLmhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmN1dG91dF9jb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdzb3VyY2Utb3Zlcic7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJQb2x5Z29uKHBvbHlzW2ddWzBdLCBzdHlsZSwgdGhpcy5jdXRvdXRfY29udGV4dCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmN1dG91dF9jb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdkZXN0aW5hdGlvbi1vdXQnO1xuICAgICAgICAgICAgICAgIGZvciAoaD0xOyBoIDwgcG9seXNbZ10ubGVuZ3RoOyBoKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJQb2x5Z29uKHBvbHlzW2ddW2hdLCBzdHlsZSwgdGhpcy5jdXRvdXRfY29udGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKHRoaXMuY3V0b3V0X2NvbnRleHQuY2FudmFzLCAwLCAwKTtcblxuICAgICAgICAgICAgICAgIC8vIEFmdGVyIGNvbXBvc2l0aW5nIGJhY2sgdG8gbWFpbiBjYW52YXMsIGRyYXcgb3V0bGluZXMgb24gaG9sZXNcbiAgICAgICAgICAgICAgICBpZiAoc3R5bGUub3V0bGluZSAmJiBzdHlsZS5vdXRsaW5lLmNvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaD0xOyBoIDwgcG9seXNbZ10ubGVuZ3RoOyBoKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyTGluZShwb2x5c1tnXVtoXSwgc3R5bGUub3V0bGluZSwgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBSZWd1bGFyIGNsb3NlZCBwb2x5Z29uc1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJQb2x5Z29uKHBvbHlzW2ddWzBdLCBzdHlsZSwgY29udGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoZ2VvbWV0cnkudHlwZSA9PSAnUG9pbnQnKSB7XG4gICAgICAgIHRoaXMucmVuZGVyUG9pbnQoZ2VvbWV0cnkucGl4ZWxzLCBzdHlsZSwgY29udGV4dCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGdlb21ldHJ5LnR5cGUgPT0gJ011bHRpUG9pbnQnKSB7XG4gICAgICAgIGZvciAoZz0wOyBnIDwgZ2VvbWV0cnkucGl4ZWxzLmxlbmd0aDsgZysrKSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlclBvaW50KGdlb21ldHJ5LnBpeGVsc1tnXSwgc3R5bGUsIGNvbnRleHQpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLy8gUmVuZGVyIGEgR2VvSlNPTiB0aWxlIG9udG8gY2FudmFzXG5DYW52YXNSZW5kZXJlci5wcm90b3R5cGUucmVuZGVyVGlsZSA9IGZ1bmN0aW9uIHJlbmRlclRpbGUgKHRpbGUsIGNvbnRleHQpXG57XG4gICAgdmFyIHJlbmRlcmVyID0gdGhpcztcbiAgICB2YXIgc3R5bGU7XG5cbiAgICAvLyBTZWxlY3Rpb24gcmVuZGVyaW5nIC0gb2ZmLXNjcmVlbiBjYW52YXMgdG8gcmVuZGVyIGEgY29sbGlzaW9uIG1hcCBmb3IgZmVhdHVyZSBzZWxlY3Rpb25cbiAgICBpZiAodGlsZS5zZWxlY3Rpb25fY2FudmFzID09IG51bGwpIHtcbiAgICAgICAgdGlsZS5zZWxlY3Rpb25fY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIHRpbGUuc2VsZWN0aW9uX2NvbnRleHQgPSB0aWxlLnNlbGVjdGlvbl9jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICB0aWxlLnNlbGVjdGlvbl9jYW52YXMuc3R5bGUud2lkdGggPSBHZW8udGlsZV9zaXplICsgJ3B4JztcbiAgICAgICAgdGlsZS5zZWxlY3Rpb25fY2FudmFzLnN0eWxlLndpZHRoID0gR2VvLnRpbGVfc2l6ZSArICdweCc7XG4gICAgICAgIHRpbGUuc2VsZWN0aW9uX2NhbnZhcy53aWR0aCA9IE1hdGgucm91bmQoR2VvLnRpbGVfc2l6ZSAqIHRoaXMuZGV2aWNlX3BpeGVsX3JhdGlvKTtcbiAgICAgICAgdGlsZS5zZWxlY3Rpb25fY2FudmFzLmhlaWdodCA9IE1hdGgucm91bmQoR2VvLnRpbGVfc2l6ZSAqIHRoaXMuZGV2aWNlX3BpeGVsX3JhdGlvKTtcbiAgICB9XG5cbiAgICB2YXIgc2VsZWN0aW9uID0geyBjb2xvcnM6IHt9IH07XG4gICAgdmFyIHNlbGVjdGlvbl9jb2xvcjtcbiAgICB2YXIgc2VsZWN0aW9uX2NvdW50ID0gMDtcblxuICAgIC8vIFJlbmRlciBsYXllcnNcbiAgICBmb3IgKHZhciB0IGluIHJlbmRlcmVyLmxheWVycykge1xuICAgICAgICB2YXIgbGF5ZXIgPSByZW5kZXJlci5sYXllcnNbdF07XG5cbiAgICAgICAgLy8gU2tpcCBsYXllcnMgd2l0aCBubyBzdHlsZXMgZGVmaW5lZCwgb3IgbGF5ZXJzIHNldCB0byBub3QgYmUgdmlzaWJsZVxuICAgICAgICBpZiAodGhpcy5zdHlsZXNbbGF5ZXIubmFtZV0gPT0gbnVsbCB8fCB0aGlzLnN0eWxlc1tsYXllci5uYW1lXS52aXNpYmxlID09IGZhbHNlKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRpbGUubGF5ZXJzW2xheWVyLm5hbWVdLmZlYXR1cmVzLmZvckVhY2goZnVuY3Rpb24oZmVhdHVyZSkge1xuICAgICAgICAgICAgLy8gU2NhbGUgbG9jYWwgY29vcmRzIHRvIHRpbGUgcGl4ZWxzXG4gICAgICAgICAgICBmZWF0dXJlLmdlb21ldHJ5LnBpeGVscyA9IHRoaXMuc2NhbGVHZW9tZXRyeVRvUGl4ZWxzKGZlYXR1cmUuZ2VvbWV0cnkpO1xuICAgICAgICAgICAgc3R5bGUgPSBWZWN0b3JSZW5kZXJlci5wYXJzZVN0eWxlRm9yRmVhdHVyZShmZWF0dXJlLCB0aGlzLnN0eWxlc1tsYXllci5uYW1lXSwgdGlsZSk7XG5cbiAgICAgICAgICAgIC8vIERyYXcgdmlzaWJsZSBnZW9tZXRyeVxuICAgICAgICAgICAgdGhpcy5yZW5kZXJGZWF0dXJlKGZlYXR1cmUsIHN0eWxlLCBjb250ZXh0KTtcblxuICAgICAgICAgICAgLy8gRHJhdyBtYXNrIGZvciBpbnRlcmFjdGl2aXR5XG4gICAgICAgICAgICAvLyBUT0RPOiBtb3ZlIHNlbGVjdGlvbiBmaWx0ZXIgbG9naWMgdG8gc3R5bGVzaGVldFxuICAgICAgICAgICAgLy8gVE9ETzogb25seSBhbHRlciBzdHlsZXMgdGhhdCBhcmUgZXhwbGljaXRseSBkaWZmZXJlbnQsIGRvbid0IG1hbnVhbGx5IGNvcHkgc3R5bGUgdmFsdWVzIGJ5IHByb3BlcnR5IG5hbWVcbiAgICAgICAgICAgIGlmIChsYXllci5zZWxlY3Rpb24gPT0gdHJ1ZSAmJiBmZWF0dXJlLnByb3BlcnRpZXMubmFtZSAhPSBudWxsICYmIGZlYXR1cmUucHJvcGVydGllcy5uYW1lICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uX2NvbG9yID0gdGhpcy5nZW5lcmF0ZUNvbG9yKHNlbGVjdGlvbi5jb2xvcnMpO1xuICAgICAgICAgICAgICAgIHNlbGVjdGlvbl9jb2xvci5wcm9wZXJ0aWVzID0gZmVhdHVyZS5wcm9wZXJ0aWVzO1xuICAgICAgICAgICAgICAgIHNlbGVjdGlvbl9jb3VudCsrO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyRmVhdHVyZShmZWF0dXJlLCB7IGNvbG9yOiBzZWxlY3Rpb25fY29sb3IuY29sb3IsIHdpZHRoOiBzdHlsZS53aWR0aCwgc2l6ZTogc3R5bGUuc2l6ZSB9LCB0aWxlLnNlbGVjdGlvbl9jb250ZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgZ2VvbWV0cnkgaXNuJ3QgaW50ZXJhY3RpdmUsIG1hc2sgaXQgb3V0IHNvIGdlb21ldHJ5IHVuZGVyIGl0IGRvZXNuJ3QgYXBwZWFyIHRvIHBvcCB0aHJvdWdoXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJGZWF0dXJlKGZlYXR1cmUsIHsgY29sb3I6IFswLCAwLCAwXSwgd2lkdGg6IHN0eWxlLndpZHRoLCBzaXplOiBzdHlsZS5zaXplIH0sIHRpbGUuc2VsZWN0aW9uX2NvbnRleHQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH1cblxuICAgIC8vIFNlbGVjdGlvbiBldmVudHNcbiAgICB2YXIgc2VsZWN0aW9uX2luZm8gPSB0aGlzLnNlbGVjdGlvbl9pbmZvO1xuICAgIGlmIChzZWxlY3Rpb25fY291bnQgPiAwKSB7XG4gICAgICAgIHRoaXMudGlsZXNbdGlsZS5rZXldLnNlbGVjdGlvbiA9IHNlbGVjdGlvbjtcblxuICAgICAgICBzZWxlY3Rpb24ucGl4ZWxzID0gbmV3IFVpbnQzMkFycmF5KHRpbGUuc2VsZWN0aW9uX2NvbnRleHQuZ2V0SW1hZ2VEYXRhKDAsIDAsIHRpbGUuc2VsZWN0aW9uX2NhbnZhcy53aWR0aCwgdGlsZS5zZWxlY3Rpb25fY2FudmFzLmhlaWdodCkuZGF0YS5idWZmZXIpO1xuXG4gICAgICAgIC8vIFRPRE86IGZpcmUgZXZlbnRzIG9uIHNlbGVjdGlvbiB0byBlbmFibGUgY3VzdG9tIGJlaGF2aW9yXG4gICAgICAgIGNvbnRleHQuY2FudmFzLm9ubW91c2Vtb3ZlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgaGl0ID0geyB4OiBldmVudC5vZmZzZXRYLCB5OiBldmVudC5vZmZzZXRZIH07IC8vIGxheWVyWC9ZXG4gICAgICAgICAgICB2YXIgb2ZmID0gKGhpdC55ICogcmVuZGVyZXIuZGV2aWNlX3BpeGVsX3JhdGlvKSAqIChHZW8udGlsZV9zaXplICogcmVuZGVyZXIuZGV2aWNlX3BpeGVsX3JhdGlvKSArIChoaXQueCAqIHJlbmRlcmVyLmRldmljZV9waXhlbF9yYXRpbyk7XG4gICAgICAgICAgICB2YXIgY29sb3IgPSBzZWxlY3Rpb24ucGl4ZWxzW29mZl07XG4gICAgICAgICAgICB2YXIgZmVhdHVyZSA9IHNlbGVjdGlvbi5jb2xvcnNbY29sb3JdO1xuICAgICAgICAgICAgaWYgKGZlYXR1cmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnRleHQuY2FudmFzLnN0eWxlLmN1cnNvciA9ICdjcm9zc2hhaXInO1xuICAgICAgICAgICAgICAgIHNlbGVjdGlvbl9pbmZvLnN0eWxlLmxlZnQgPSAoaGl0LnggKyA1KSArICdweCc7XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uX2luZm8uc3R5bGUudG9wID0gKGhpdC55ICsgNSkgKyAncHgnO1xuICAgICAgICAgICAgICAgIHNlbGVjdGlvbl9pbmZvLmlubmVySFRNTCA9ICc8c3BhbiBjbGFzcz1cImxhYmVsSW5uZXJcIj4nICsgZmVhdHVyZS5wcm9wZXJ0aWVzLm5hbWUgKyAvKicgWycgKyBmZWF0dXJlLnByb3BlcnRpZXMua2luZCArICddKi8nPC9zcGFuPic7XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uX2luZm8uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgY29udGV4dC5jYW52YXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChzZWxlY3Rpb25faW5mbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmNhbnZhcy5zdHlsZS5jdXJzb3IgPSBudWxsO1xuICAgICAgICAgICAgICAgIHNlbGVjdGlvbl9pbmZvLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvbl9pbmZvLnBhcmVudE5vZGUgPT0gY29udGV4dC5jYW52YXMucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmNhbnZhcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNlbGVjdGlvbl9pbmZvKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb250ZXh0LmNhbnZhcy5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgY29udGV4dC5jYW52YXMuc3R5bGUuY3Vyc29yID0gbnVsbDtcbiAgICAgICAgICAgIHNlbGVjdGlvbl9pbmZvLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBpZiAoc2VsZWN0aW9uX2luZm8ucGFyZW50Tm9kZSA9PSBjb250ZXh0LmNhbnZhcy5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC5jYW52YXMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzZWxlY3Rpb25faW5mbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufTtcblxuLyogQ29sb3IgaGVscGVycyAqL1xuXG4vLyBUcmFuc2Zvcm0gY29sb3IgY29tcG9uZW50cyBpbiAwLTEgcmFuZ2UgdG8gaHRtbCBSR0Igc3RyaW5nIGZvciBjYW52YXNcbkNhbnZhc1JlbmRlcmVyLnByb3RvdHlwZS5jb2xvclRvU3RyaW5nID0gZnVuY3Rpb24gKGNvbG9yKVxue1xuICAgIHJldHVybiAncmdiKCcgKyBjb2xvci5tYXAoZnVuY3Rpb24oYykgeyByZXR1cm4gfn4oYyAqIDI1Nik7IH0pLmpvaW4oJywnKSArICcpJztcbn07XG5cbi8vIEdlbmVyYXRlcyBhIHJhbmRvbSBjb2xvciBub3QgeWV0IHByZXNlbnQgaW4gdGhlIHByb3ZpZGVkIGhhc2ggb2YgY29sb3JzXG5DYW52YXNSZW5kZXJlci5wcm90b3R5cGUuZ2VuZXJhdGVDb2xvciA9IGZ1bmN0aW9uIGdlbmVyYXRlQ29sb3IgKGNvbG9yX21hcClcbntcbiAgICB2YXIgciwgZywgYiwgaXIsIGlnLCBpYiwga2V5O1xuICAgIGNvbG9yX21hcCA9IGNvbG9yX21hcCB8fCB7fTtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICByID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgZyA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgIGIgPSBNYXRoLnJhbmRvbSgpO1xuXG4gICAgICAgIGlyID0gfn4ociAqIDI1Nik7XG4gICAgICAgIGlnID0gfn4oZyAqIDI1Nik7XG4gICAgICAgIGliID0gfn4oYiAqIDI1Nik7XG4gICAgICAgIGtleSA9IChpciArIChpZyA8PCA4KSArIChpYiA8PCAxNikgKyAoMjU1IDw8IDI0KSkgPj4+IDA7IC8vIG5lZWQgdW5zaWduZWQgcmlnaHQgc2hpZnQgdG8gY29udmVydCB0byBwb3NpdGl2ZSAjXG5cbiAgICAgICAgaWYgKGNvbG9yX21hcFtrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbG9yX21hcFtrZXldID0geyBjb2xvcjogW3IsIGcsIGJdIH07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29sb3JfbWFwW2tleV07XG59O1xuXG5pZiAobW9kdWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IENhbnZhc1JlbmRlcmVyO1xufVxuIiwiLy8gTWlzY2VsbGFuZW91cyBnZW8gZnVuY3Rpb25zXG52YXIgUG9pbnQgPSByZXF1aXJlKCcuL3BvaW50LmpzJyk7XG5cbnZhciBHZW8gPSB7fTtcblxuLy8gUHJvamVjdGlvbiBjb25zdGFudHNcbkdlby50aWxlX3NpemUgPSAyNTY7XG5HZW8uaGFsZl9jaXJjdW1mZXJlbmNlX21ldGVycyA9IDIwMDM3NTA4LjM0Mjc4OTI0NDtcbkdlby5tYXBfb3JpZ2luX21ldGVycyA9IFBvaW50KC1HZW8uaGFsZl9jaXJjdW1mZXJlbmNlX21ldGVycywgR2VvLmhhbGZfY2lyY3VtZmVyZW5jZV9tZXRlcnMpO1xuR2VvLm1pbl96b29tX21ldGVyc19wZXJfcGl4ZWwgPSBHZW8uaGFsZl9jaXJjdW1mZXJlbmNlX21ldGVycyAqIDIgLyBHZW8udGlsZV9zaXplOyAvLyBtaW4gem9vbSBkcmF3cyB3b3JsZCBhcyAyIHRpbGVzIHdpZGVcbkdlby5tZXRlcnNfcGVyX3BpeGVsID0gW107XG5HZW8ubWF4X3pvb20gPSAyMDtcbmZvciAodmFyIHo9MDsgeiA8PSBHZW8ubWF4X3pvb207IHorKykge1xuICAgIEdlby5tZXRlcnNfcGVyX3BpeGVsW3pdID0gR2VvLm1pbl96b29tX21ldGVyc19wZXJfcGl4ZWwgLyBNYXRoLnBvdygyLCB6KTtcbn1cblxuLy8gQ29udmVyc2lvbiBmdW5jdGlvbnMgYmFzZWQgb24gYW4gZGVmaW5lZCB0aWxlIHNjYWxlXG5HZW8udW5pdHNfcGVyX21ldGVyID0gW107XG5HZW8uc2V0VGlsZVNjYWxlID0gZnVuY3Rpb24oc2NhbGUpXG57XG4gICAgR2VvLnRpbGVfc2NhbGUgPSBzY2FsZTtcbiAgICBHZW8udW5pdHNfcGVyX3BpeGVsID0gR2VvLnRpbGVfc2NhbGUgLyBHZW8udGlsZV9zaXplO1xuXG4gICAgZm9yICh2YXIgej0wOyB6IDw9IEdlby5tYXhfem9vbTsgeisrKSB7XG4gICAgICAgIEdlby51bml0c19wZXJfbWV0ZXJbel0gPSBHZW8udGlsZV9zY2FsZSAvIChHZW8udGlsZV9zaXplICogR2VvLm1ldGVyc19wZXJfcGl4ZWxbel0pO1xuICAgIH1cbn07XG5cbi8vIENvbnZlcnQgdGlsZSBsb2NhdGlvbiB0byBtZXJjYXRvciBtZXRlcnMgLSBtdWx0aXBseSBieSBwaXhlbHMgcGVyIHRpbGUsIHRoZW4gYnkgbWV0ZXJzIHBlciBwaXhlbCwgYWRqdXN0IGZvciBtYXAgb3JpZ2luXG5HZW8ubWV0ZXJzRm9yVGlsZSA9IGZ1bmN0aW9uICh0aWxlKVxue1xuICAgIHJldHVybiBQb2ludChcbiAgICAgICAgKHRpbGUueCAqIEdlby50aWxlX3NpemUgKiBHZW8ubWV0ZXJzX3Blcl9waXhlbFt0aWxlLnpdKSArIEdlby5tYXBfb3JpZ2luX21ldGVycy54LFxuICAgICAgICAoKHRpbGUueSAqIEdlby50aWxlX3NpemUgKiBHZW8ubWV0ZXJzX3Blcl9waXhlbFt0aWxlLnpdKSAqIC0xKSArIEdlby5tYXBfb3JpZ2luX21ldGVycy55XG4gICAgKTtcbn07XG5cbi8vIENvbnZlcnQgbWVyY2F0b3IgbWV0ZXJzIHRvIGxhdC1sbmdcbkdlby5tZXRlcnNUb0xhdExuZyA9IGZ1bmN0aW9uIChtZXRlcnMpXG57XG4gICAgdmFyIGMgPSBQb2ludC5jb3B5KG1ldGVycyk7XG5cbiAgICBjLnggLz0gR2VvLmhhbGZfY2lyY3VtZmVyZW5jZV9tZXRlcnM7XG4gICAgYy55IC89IEdlby5oYWxmX2NpcmN1bWZlcmVuY2VfbWV0ZXJzO1xuXG4gICAgYy55ID0gKDIgKiBNYXRoLmF0YW4oTWF0aC5leHAoYy55ICogTWF0aC5QSSkpIC0gKE1hdGguUEkgLyAyKSkgLyBNYXRoLlBJO1xuXG4gICAgYy54ICo9IDE4MDtcbiAgICBjLnkgKj0gMTgwO1xuXG4gICAgcmV0dXJuIGM7XG59O1xuXG4vLyBDb252ZXJ0IGxhdC1sbmcgdG8gbWVyY2F0b3IgbWV0ZXJzXG5HZW8ubGF0TG5nVG9NZXRlcnMgPSBmdW5jdGlvbihsYXRsbmcpXG57XG4gICAgdmFyIGMgPSBQb2ludC5jb3B5KGxhdGxuZyk7XG5cbiAgICAvLyBMYXRpdHVkZVxuICAgIGMueSA9IE1hdGgubG9nKE1hdGgudGFuKChjLnkgKyA5MCkgKiBNYXRoLlBJIC8gMzYwKSkgLyAoTWF0aC5QSSAvIDE4MCk7XG4gICAgYy55ID0gYy55ICogR2VvLmhhbGZfY2lyY3VtZmVyZW5jZV9tZXRlcnMgLyAxODA7XG5cbiAgICAvLyBMb25naXR1ZGVcbiAgICBjLnggPSBjLnggKiBHZW8uaGFsZl9jaXJjdW1mZXJlbmNlX21ldGVycyAvIDE4MDtcblxuICAgIHJldHVybiBjO1xufTtcblxuLy8gUnVuIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIG9uIGVhY2ggY29vb3JkaW5hdGUgaW4gYSBHZW9KU09OIGdlb21ldHJ5XG5HZW8udHJhbnNmb3JtR2VvbWV0cnkgPSBmdW5jdGlvbiAoZ2VvbWV0cnksIHRyYW5zZm9ybSlcbntcbiAgICBpZiAoZ2VvbWV0cnkudHlwZSA9PSAnUG9pbnQnKSB7XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm0oZ2VvbWV0cnkuY29vcmRpbmF0ZXMpO1xuICAgIH1cbiAgICBlbHNlIGlmIChnZW9tZXRyeS50eXBlID09ICdMaW5lU3RyaW5nJyB8fCBnZW9tZXRyeS50eXBlID09ICdNdWx0aVBvaW50Jykge1xuICAgICAgICByZXR1cm4gZ2VvbWV0cnkuY29vcmRpbmF0ZXMubWFwKHRyYW5zZm9ybSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGdlb21ldHJ5LnR5cGUgPT0gJ1BvbHlnb24nIHx8IGdlb21ldHJ5LnR5cGUgPT0gJ011bHRpTGluZVN0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGdlb21ldHJ5LmNvb3JkaW5hdGVzLm1hcChmdW5jdGlvbiAoY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBjb29yZGluYXRlcy5tYXAodHJhbnNmb3JtKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGdlb21ldHJ5LnR5cGUgPT0gJ011bHRpUG9seWdvbicpIHtcbiAgICAgICAgcmV0dXJuIGdlb21ldHJ5LmNvb3JkaW5hdGVzLm1hcChmdW5jdGlvbiAocG9seWdvbikge1xuICAgICAgICAgICAgcmV0dXJuIHBvbHlnb24ubWFwKGZ1bmN0aW9uIChjb29yZGluYXRlcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb29yZGluYXRlcy5tYXAodHJhbnNmb3JtKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gVE9ETzogc3VwcG9ydCBHZW9tZXRyeUNvbGxlY3Rpb25cbiAgICByZXR1cm4ge307XG59O1xuXG5HZW8uYm94SW50ZXJzZWN0ID0gZnVuY3Rpb24gKGIxLCBiMilcbntcbiAgICByZXR1cm4gIShcbiAgICAgICAgYjIuc3cueCA+IGIxLm5lLnggfHxcbiAgICAgICAgYjIubmUueCA8IGIxLnN3LnggfHxcbiAgICAgICAgYjIuc3cueSA+IGIxLm5lLnkgfHxcbiAgICAgICAgYjIubmUueSA8IGIxLnN3LnlcbiAgICApO1xufTtcblxuLy8gU3BsaXQgdGhlIGxpbmVzIG9mIGEgZmVhdHVyZSB3aGVyZXZlciB0d28gcG9pbnRzIGFyZSBmYXJ0aGVyIGFwYXJ0IHRoYW4gYSBnaXZlbiB0b2xlcmFuY2Vcbkdlby5zcGxpdEZlYXR1cmVMaW5lcyAgPSBmdW5jdGlvbiAoZmVhdHVyZSwgdG9sZXJhbmNlKSB7XG4gICAgdmFyIHRvbGVyYW5jZSA9IHRvbGVyYW5jZSB8fCAwLjAwMTtcbiAgICB2YXIgdG9sZXJhbmNlX3NxID0gdG9sZXJhbmNlICogdG9sZXJhbmNlO1xuICAgIHZhciBnZW9tID0gZmVhdHVyZS5nZW9tZXRyeTtcbiAgICB2YXIgbGluZXM7XG5cbiAgICBpZiAoZ2VvbS50eXBlID09ICdNdWx0aUxpbmVTdHJpbmcnKSB7XG4gICAgICAgIGxpbmVzID0gZ2VvbS5jb29yZGluYXRlcztcbiAgICB9XG4gICAgZWxzZSBpZiAoZ2VvbS50eXBlID09J0xpbmVTdHJpbmcnKSB7XG4gICAgICAgIGxpbmVzID0gW2dlb20uY29vcmRpbmF0ZXNdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZlYXR1cmU7XG4gICAgfVxuXG4gICAgdmFyIHNwbGl0X2xpbmVzID0gW107XG5cbiAgICBmb3IgKHZhciBzPTA7IHMgPCBsaW5lcy5sZW5ndGg7IHMrKykge1xuICAgICAgICB2YXIgc2VnID0gbGluZXNbc107XG4gICAgICAgIHZhciBzcGxpdF9zZWcgPSBbXTtcbiAgICAgICAgdmFyIGxhc3RfY29vcmQgPSBudWxsO1xuICAgICAgICB2YXIga2VlcDtcblxuICAgICAgICBmb3IgKHZhciBjPTA7IGMgPCBzZWcubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIHZhciBjb29yZCA9IHNlZ1tjXTtcbiAgICAgICAgICAgIGtlZXAgPSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAobGFzdF9jb29yZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3QgPSAoY29vcmRbMF0gLSBsYXN0X2Nvb3JkWzBdKSAqIChjb29yZFswXSAtIGxhc3RfY29vcmRbMF0pICsgKGNvb3JkWzFdIC0gbGFzdF9jb29yZFsxXSkgKiAoY29vcmRbMV0gLSBsYXN0X2Nvb3JkWzFdKTtcbiAgICAgICAgICAgICAgICBpZiAoZGlzdCA+IHRvbGVyYW5jZV9zcSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInNwbGl0IGxpbmVzIGF0IChcIiArIGNvb3JkWzBdICsgXCIsIFwiICsgY29vcmRbMV0gKyBcIiksIFwiICsgTWF0aC5zcXJ0KGRpc3QpICsgXCIgYXBhcnRcIik7XG4gICAgICAgICAgICAgICAgICAgIGtlZXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChrZWVwID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgc3BsaXRfbGluZXMucHVzaChzcGxpdF9zZWcpO1xuICAgICAgICAgICAgICAgIHNwbGl0X3NlZyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3BsaXRfc2VnLnB1c2goY29vcmQpO1xuXG4gICAgICAgICAgICBsYXN0X2Nvb3JkID0gY29vcmQ7XG4gICAgICAgIH1cblxuICAgICAgICBzcGxpdF9saW5lcy5wdXNoKHNwbGl0X3NlZyk7XG4gICAgICAgIHNwbGl0X3NlZyA9IFtdO1xuICAgIH1cblxuICAgIGlmIChzcGxpdF9saW5lcy5sZW5ndGggPT0gMSkge1xuICAgICAgICBnZW9tLnR5cGUgPSAnTGluZVN0cmluZyc7XG4gICAgICAgIGdlb20uY29vcmRpbmF0ZXMgPSBzcGxpdF9saW5lc1swXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGdlb20udHlwZSA9ICdNdWx0aUxpbmVTdHJpbmcnO1xuICAgICAgICBnZW9tLmNvb3JkaW5hdGVzID0gc3BsaXRfbGluZXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZlYXR1cmU7XG59O1xuXG5pZiAobW9kdWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEdlbztcbn1cbiIsIi8vIFdlYkdMIG1hbmFnZW1lbnQgYW5kIHJlbmRlcmluZyBmdW5jdGlvbnNcbnZhciBHTCA9IHt9O1xuXG4vLyBTZXR1cCBhIFdlYkdMIGNvbnRleHRcbi8vIElmIG5vIGNhbnZhcyBlbGVtZW50IGlzIHByb3ZpZGVkLCBvbmUgaXMgY3JlYXRlZCBhbmQgYWRkZWQgdG8gdGhlIGRvY3VtZW50IGJvZHlcbkdMLmdldENvbnRleHQgPSBmdW5jdGlvbiBnZXRDb250ZXh0IChjYW52YXMpXG57XG4gICAgdmFyIGNhbnZhcyA9IGNhbnZhcztcbiAgICB2YXIgZnVsbHNjcmVlbiA9IGZhbHNlO1xuICAgIGlmIChjYW52YXMgPT0gbnVsbCkge1xuICAgICAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgY2FudmFzLnN0eWxlLnRvcCA9IDA7XG4gICAgICAgIGNhbnZhcy5zdHlsZS5sZWZ0ID0gMDtcbiAgICAgICAgY2FudmFzLnN0eWxlLnpJbmRleCA9IC0xO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgICAgIGZ1bGxzY3JlZW4gPSB0cnVlO1xuICAgIH1cblxuICAgIGdsID0gY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcsIHsgLypwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRydWUqLyB9KTsgLy8gcHJlc2VydmVEcmF3aW5nQnVmZmVyIG5lZWRlZCBmb3IgZ2wucmVhZFBpeGVscyAoY291bGQgYmUgdXNlZCBmb3IgZmVhdHVyZSBzZWxlY3Rpb24pXG4gICAgaWYgKCFnbCkge1xuICAgICAgICBhbGVydChcIkNvdWxkbid0IGNyZWF0ZSBXZWJHTCBjb250ZXh0LiBZb3VyIGJyb3dzZXIgcHJvYmFibHkgZG9lc24ndCBzdXBwb3J0IFdlYkdMIG9yIGl0J3MgdHVybmVkIG9mZj9cIik7XG4gICAgICAgIHRocm93IFwiQ291bGRuJ3QgY3JlYXRlIFdlYkdMIGNvbnRleHRcIjtcbiAgICB9XG5cbiAgICBHTC5yZXNpemVDYW52YXMoZ2wsIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIGlmIChmdWxsc2NyZWVuID09IHRydWUpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIEdMLnJlc2l6ZUNhbnZhcyhnbCwgd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIEdMLlZlcnRleEFycmF5T2JqZWN0LmluaXQoZ2wpOyAvLyBUT0RPOiB0aGlzIHBhdHRlcm4gZG9lc24ndCBzdXBwb3J0IG11bHRpcGxlIGFjdGl2ZSBHTCBjb250ZXh0cywgc2hvdWxkIHRoYXQgZXZlbiBiZSBzdXBwb3J0ZWQ/XG5cbiAgICByZXR1cm4gZ2w7XG59O1xuXG5HTC5yZXNpemVDYW52YXMgPSBmdW5jdGlvbiAoZ2wsIHdpZHRoLCBoZWlnaHQpXG57XG4gICAgdmFyIGRldmljZV9waXhlbF9yYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG4gICAgZ2wuY2FudmFzLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuICAgIGdsLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xuICAgIGdsLmNhbnZhcy53aWR0aCA9IE1hdGgucm91bmQoZ2wuY2FudmFzLnN0eWxlLndpZHRoICogZGV2aWNlX3BpeGVsX3JhdGlvKTtcbiAgICBnbC5jYW52YXMuaGVpZ2h0ID0gTWF0aC5yb3VuZChnbC5jYW52YXMuc3R5bGUud2lkdGggKiBkZXZpY2VfcGl4ZWxfcmF0aW8pO1xuICAgIGdsLnZpZXdwb3J0KDAsIDAsIGdsLmNhbnZhcy53aWR0aCwgZ2wuY2FudmFzLmhlaWdodCk7XG59O1xuXG4vLyBDb21waWxlICYgbGluayBhIFdlYkdMIHByb2dyYW0gZnJvbSBwcm92aWRlZCB2ZXJ0ZXggYW5kIHNoYWRlciBzb3VyY2UgZWxlbWVudHNcbkdMLmNyZWF0ZVByb2dyYW1Gcm9tRWxlbWVudHMgPSBmdW5jdGlvbiBHTGNyZWF0ZVByb2dyYW1Gcm9tRWxlbWVudHMgKGdsLCB2ZXJ0ZXhfc2hhZGVyX2lkLCBmcmFnbWVudF9zaGFkZXJfaWQpXG57XG4gICAgdmFyIHZlcnRleF9zaGFkZXJfc291cmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodmVydGV4X3NoYWRlcl9pZCkudGV4dENvbnRlbnQ7XG4gICAgdmFyIGZyYWdtZW50X3NoYWRlcl9zb3VyY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChmcmFnbWVudF9zaGFkZXJfaWQpLnRleHRDb250ZW50O1xuICAgIHZhciBwcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuICAgIHJldHVybiBHTC51cGRhdGVQcm9ncmFtKGdsLCBwcm9ncmFtLCB2ZXJ0ZXhfc2hhZGVyX3NvdXJjZSwgZnJhZ21lbnRfc2hhZGVyX3NvdXJjZSk7XG59O1xuXG4vLyBDb21waWxlICYgbGluayBhIFdlYkdMIHByb2dyYW0gZnJvbSBwcm92aWRlZCB2ZXJ0ZXggYW5kIHNoYWRlciBzb3VyY2UgVVJMc1xuLy8gTk9URTogbG9hZHMgdmlhIHN5bmNocm9ub3VzIFhIUiBmb3Igc2ltcGxpY2l0eSwgY291bGQgYmUgbWFkZSBhc3luY1xuR0wuY3JlYXRlUHJvZ3JhbUZyb21VUkxzID0gZnVuY3Rpb24gR0xjcmVhdGVQcm9ncmFtRnJvbVVSTHMgKGdsLCB2ZXJ0ZXhfc2hhZGVyX3VybCwgZnJhZ21lbnRfc2hhZGVyX3VybClcbntcbiAgICB2YXIgcHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcbiAgICByZXR1cm4gR0wudXBkYXRlUHJvZ3JhbUZyb21VUkxzKGdsLCBwcm9ncmFtLCB2ZXJ0ZXhfc2hhZGVyX3VybCwgZnJhZ21lbnRfc2hhZGVyX3VybCk7XG59O1xuXG5HTC51cGRhdGVQcm9ncmFtRnJvbVVSTHMgPSBmdW5jdGlvbiBHTFVwZGF0ZVByb2dyYW1Gcm9tVVJMcyAoZ2wsIHByb2dyYW0sIHZlcnRleF9zaGFkZXJfdXJsLCBmcmFnbWVudF9zaGFkZXJfdXJsKVxue1xuICAgIHZhciB2ZXJ0ZXhfc2hhZGVyX3NvdXJjZSwgZnJhZ21lbnRfc2hhZGVyX3NvdXJjZTtcbiAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICByZXEub25sb2FkID0gZnVuY3Rpb24gKCkgeyB2ZXJ0ZXhfc2hhZGVyX3NvdXJjZSA9IHJlcS5yZXNwb25zZTsgfTtcbiAgICByZXEub3BlbignR0VUJywgdmVydGV4X3NoYWRlcl91cmwgKyAnPycgKyAoK25ldyBEYXRlKCkpLCBmYWxzZSAvKiBhc3luYyBmbGFnICovKTtcbiAgICByZXEuc2VuZCgpO1xuXG4gICAgcmVxLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHsgZnJhZ21lbnRfc2hhZGVyX3NvdXJjZSA9IHJlcS5yZXNwb25zZTsgfTtcbiAgICByZXEub3BlbignR0VUJywgZnJhZ21lbnRfc2hhZGVyX3VybCArICc/JyArICgrbmV3IERhdGUoKSksIGZhbHNlIC8qIGFzeW5jIGZsYWcgKi8pO1xuICAgIHJlcS5zZW5kKCk7XG5cbiAgICByZXR1cm4gR0wudXBkYXRlUHJvZ3JhbShnbCwgcHJvZ3JhbSwgdmVydGV4X3NoYWRlcl9zb3VyY2UsIGZyYWdtZW50X3NoYWRlcl9zb3VyY2UpO1xufTtcblxuLy8gQ29tcGlsZSAmIGxpbmsgYSBXZWJHTCBwcm9ncmFtIGZyb20gcHJvdmlkZWQgdmVydGV4IGFuZCBmcmFnbWVudCBzaGFkZXIgc291cmNlc1xuLy8gdXBkYXRlIGEgcHJvZ3JhbSBpZiBvbmUgaXMgcGFzc2VkIGluLiBDcmVhdGUgb25lIGlmIG5vdC4gQWxlcnQgYW5kIGRvbid0IHVwZGF0ZSBhbnl0aGluZyBpZiB0aGUgc2hhZGVycyBkb24ndCBjb21waWxlLlxuR0wudXBkYXRlUHJvZ3JhbSA9IGZ1bmN0aW9uIEdMdXBkYXRlUHJvZ3JhbSAoZ2wsIHByb2dyYW0sIHZlcnRleF9zaGFkZXJfc291cmNlLCBmcmFnbWVudF9zaGFkZXJfc291cmNlKVxue1xuICAgIHRyeSB7XG4gICAgICAgIHZhciB2ZXJ0ZXhfc2hhZGVyID0gR0wuY3JlYXRlU2hhZGVyKGdsLCB2ZXJ0ZXhfc2hhZGVyX3NvdXJjZSwgZ2wuVkVSVEVYX1NIQURFUik7XG4gICAgICAgIHZhciBmcmFnbWVudF9zaGFkZXIgPSBHTC5jcmVhdGVTaGFkZXIoZ2wsICcjaWZkZWYgR0xfRVNcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuI2VuZGlmXFxuXFxuJyArIGZyYWdtZW50X3NoYWRlcl9zb3VyY2UsIGdsLkZSQUdNRU5UX1NIQURFUik7XG4gICAgfVxuICAgIGNhdGNoKGVycilcbiAgICB7XG4gICAgICAgIGFsZXJ0KGVycik7XG4gICAgICAgIHJldHVybiBwcm9ncmFtO1xuICAgIH1cblxuICAgIGdsLnVzZVByb2dyYW0obnVsbCk7XG4gICAgaWYgKHByb2dyYW0gIT0gbnVsbCkge1xuICAgICAgICB2YXIgb2xkX3NoYWRlcnMgPSBnbC5nZXRBdHRhY2hlZFNoYWRlcnMocHJvZ3JhbSk7XG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBvbGRfc2hhZGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZ2wuZGV0YWNoU2hhZGVyKHByb2dyYW0sIG9sZF9zaGFkZXJzW2ldKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG4gICAgfVxuXG4gICAgaWYgKHZlcnRleF9zaGFkZXIgPT0gbnVsbCB8fCBmcmFnbWVudF9zaGFkZXIgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gcHJvZ3JhbTtcbiAgICB9XG5cbiAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgdmVydGV4X3NoYWRlcik7XG4gICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIGZyYWdtZW50X3NoYWRlcik7XG5cbiAgICBnbC5kZWxldGVTaGFkZXIodmVydGV4X3NoYWRlcik7XG4gICAgZ2wuZGVsZXRlU2hhZGVyKGZyYWdtZW50X3NoYWRlcik7XG5cbiAgICBnbC5saW5rUHJvZ3JhbShwcm9ncmFtKTtcblxuICAgIGlmICghZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtLCBnbC5MSU5LX1NUQVRVUykpIHtcbiAgICAgICAgdmFyIHByb2dyYW1fZXJyb3IgPVxuICAgICAgICAgICAgXCJXZWJHTCBwcm9ncmFtIGVycm9yOlxcblwiICtcbiAgICAgICAgICAgIFwiVkFMSURBVEVfU1RBVFVTOiBcIiArIGdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgZ2wuVkFMSURBVEVfU1RBVFVTKSArIFwiXFxuXCIgK1xuICAgICAgICAgICAgXCJFUlJPUjogXCIgKyBnbC5nZXRFcnJvcigpICsgXCJcXG5cXG5cIiArXG4gICAgICAgICAgICBcIi0tLSBWZXJ0ZXggU2hhZGVyIC0tLVxcblwiICsgdmVydGV4X3NoYWRlcl9zb3VyY2UgKyBcIlxcblxcblwiICtcbiAgICAgICAgICAgIFwiLS0tIEZyYWdtZW50IFNoYWRlciAtLS1cXG5cIiArIGZyYWdtZW50X3NoYWRlcl9zb3VyY2U7XG4gICAgICAgIHRocm93IHByb2dyYW1fZXJyb3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb2dyYW07XG59O1xuXG4vLyBDb21waWxlIGEgdmVydGV4IG9yIGZyYWdtZW50IHNoYWRlciBmcm9tIHByb3ZpZGVkIHNvdXJjZVxuR0wuY3JlYXRlU2hhZGVyID0gZnVuY3Rpb24gR0xjcmVhdGVTaGFkZXIgKGdsLCBzb3VyY2UsIHR5cGUpXG57XG4gICAgdmFyIHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0eXBlKTtcblxuICAgIGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XG4gICAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xuXG4gICAgaWYgKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUykpIHtcbiAgICAgICAgdmFyIHNoYWRlcl9lcnJvciA9XG4gICAgICAgICAgICBcIldlYkdMIHNoYWRlciBlcnJvcjpcXG5cIiArXG4gICAgICAgICAgICAodHlwZSA9PSBnbC5WRVJURVhfU0hBREVSID8gXCJWRVJURVhcIiA6IFwiRlJBR01FTlRcIikgKyBcIiBTSEFERVI6XFxuXCIgK1xuICAgICAgICAgICAgZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpO1xuICAgICAgICB0aHJvdyBzaGFkZXJfZXJyb3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNoYWRlcjtcbn07XG5cbi8vIFRoaW4gR0wgcHJvZ3JhbSBsYXllciB0byBjYWNoZSB1bmlmb3JtIGxvY2F0aW9ucy92YWx1ZXMsIGRvIGNvbXBpbGUtdGltZSBwcmUtcHJvY2Vzc2luZyAoaW5qZWN0aW5nICNkZWZpbmVzIGludG8gc2hhZGVycyksIGV0Yy5cbkdMLlByb2dyYW0gPSBmdW5jdGlvbiAoZ2wsIHZlcnRleF9zaGFkZXJfc291cmNlLCBmcmFnbWVudF9zaGFkZXJfc291cmNlLCBvcHRpb25zKVxue1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdGhpcy5nbCA9IGdsO1xuICAgIHRoaXMucHJvZ3JhbSA9IG51bGw7XG4gICAgdGhpcy5kZWZpbmVzID0gb3B0aW9ucy5kZWZpbmVzIHx8IHt9OyAvLyBrZXkvdmFsdWVzIGluc2VydGVkIGludG8gc2hhZGVycyBhdCBjb21waWxlLXRpbWVcbiAgICB0aGlzLnVuaWZvcm1zID0ge307IC8vIHByb2dyYW0gbG9jYXRpb25zIG9mIHVuaWZvcm1zLCBzZXQvdXBkYXRlZCBhdCBjb21waWxlLXRpbWVcbiAgICB0aGlzLmF0dHJpYnMgPSB7fTsgLy8gcHJvZ3JhbSBsb2NhdGlvbnMgb2YgdmVydGV4IGF0dHJpYnV0ZXNcbiAgICB0aGlzLnZlcnRleF9zaGFkZXJfc291cmNlID0gdmVydGV4X3NoYWRlcl9zb3VyY2U7XG4gICAgdGhpcy5mcmFnbWVudF9zaGFkZXJfc291cmNlID0gZnJhZ21lbnRfc2hhZGVyX3NvdXJjZTtcbiAgICB0aGlzLmNvbXBpbGUoKTtcbn07XG5cbi8vIENyZWF0ZXMgYSBwcm9ncmFtIHRoYXQgd2lsbCByZWZyZXNoIGZyb20gc291cmNlIFVSTHMgZWFjaCB0aW1lIGl0IGlzIGNvbXBpbGVkXG5HTC5Qcm9ncmFtLmNyZWF0ZVByb2dyYW1Gcm9tVVJMcyA9IGZ1bmN0aW9uIChnbCwgdmVydGV4X3NoYWRlcl91cmwsIGZyYWdtZW50X3NoYWRlcl91cmwsIG9wdGlvbnMpXG57XG4gICAgdmFyIHByb2dyYW0gPSBPYmplY3QuY3JlYXRlKEdMLlByb2dyYW0ucHJvdG90eXBlKTtcblxuICAgIHByb2dyYW0udmVydGV4X3NoYWRlcl91cmwgPSB2ZXJ0ZXhfc2hhZGVyX3VybDtcbiAgICBwcm9ncmFtLmZyYWdtZW50X3NoYWRlcl91cmwgPSBmcmFnbWVudF9zaGFkZXJfdXJsO1xuXG4gICAgcHJvZ3JhbS51cGRhdGVWZXJ0ZXhTaGFkZXJTb3VyY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzb3VyY2U7XG4gICAgICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgcmVxLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHsgc291cmNlID0gcmVxLnJlc3BvbnNlOyB9O1xuICAgICAgICByZXEub3BlbignR0VUJywgdGhpcy52ZXJ0ZXhfc2hhZGVyX3VybCArICc/JyArICgrbmV3IERhdGUoKSksIGZhbHNlIC8qIGFzeW5jIGZsYWcgKi8pO1xuICAgICAgICByZXEuc2VuZCgpO1xuICAgICAgICByZXR1cm4gc291cmNlO1xuICAgIH07XG5cbiAgICBwcm9ncmFtLnVwZGF0ZUZyYWdtZW50U2hhZGVyU291cmNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc291cmNlO1xuICAgICAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHJlcS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7IHNvdXJjZSA9IHJlcS5yZXNwb25zZTsgfTtcbiAgICAgICAgcmVxLm9wZW4oJ0dFVCcsIHRoaXMuZnJhZ21lbnRfc2hhZGVyX3VybCArICc/JyArICgrbmV3IERhdGUoKSksIGZhbHNlIC8qIGFzeW5jIGZsYWcgKi8pO1xuICAgICAgICByZXEuc2VuZCgpO1xuICAgICAgICByZXR1cm4gc291cmNlO1xuICAgIH07XG5cbiAgICBHTC5Qcm9ncmFtLmNhbGwocHJvZ3JhbSwgZ2wsIG51bGwsIG51bGwsIG9wdGlvbnMpO1xuICAgIHJldHVybiBwcm9ncmFtO1xufTtcblxuLy8gR2xvYmFsIGRlZmluZXMgYXBwbGllZCB0byBhbGwgcHJvZ3JhbXMgKGR1cGxpY2F0ZSBwcm9wZXJ0aWVzIGZvciBhIHNwZWNpZmljIHByb2dyYW0gd2lsbCB0YWtlIHByZWNlZGVuY2UpXG5HTC5Qcm9ncmFtLmRlZmluZXMgPSB7fTtcblxuR0wuUHJvZ3JhbS5wcm90b3R5cGUuY29tcGlsZSA9IGZ1bmN0aW9uICgpXG57XG4gICAgLy8gT3B0aW9uYWxseSB1cGRhdGUgc291cmNlc1xuICAgIGlmICh0eXBlb2YgdGhpcy51cGRhdGVWZXJ0ZXhTaGFkZXJTb3VyY2UgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLnZlcnRleF9zaGFkZXJfc291cmNlID0gdGhpcy51cGRhdGVWZXJ0ZXhTaGFkZXJTb3VyY2UoKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aGlzLnVwZGF0ZUZyYWdtZW50U2hhZGVyU291cmNlID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5mcmFnbWVudF9zaGFkZXJfc291cmNlID0gdGhpcy51cGRhdGVGcmFnbWVudFNoYWRlclNvdXJjZSgpO1xuICAgIH1cblxuICAgIC8vIEluamVjdCBkZWZpbmVzIChnbG9iYWwsIHRoZW4gcHJvZ3JhbS1zcGVjaWZpYylcbiAgICB2YXIgZGVmaW5lcyA9IHt9O1xuICAgIGZvciAodmFyIGQgaW4gR0wuUHJvZ3JhbS5kZWZpbmVzKSB7XG4gICAgICAgIGRlZmluZXNbZF0gPSBHTC5Qcm9ncmFtLmRlZmluZXNbZF07XG4gICAgfVxuICAgIGZvciAodmFyIGQgaW4gdGhpcy5kZWZpbmVzKSB7XG4gICAgICAgIGRlZmluZXNbZF0gPSB0aGlzLmRlZmluZXNbZF07XG4gICAgfVxuXG4gICAgdmFyIGRlZmluZV9zdHIgPSBcIlwiO1xuICAgIGZvciAodmFyIGQgaW4gZGVmaW5lcykge1xuICAgICAgICBpZiAoZGVmaW5lc1tkXSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGRlZmluZXNbZF0gPT0gJ2Jvb2xlYW4nICYmIGRlZmluZXNbZF0gPT0gdHJ1ZSkge1xuICAgICAgICAgICAgZGVmaW5lX3N0ciArPSBcIiNkZWZpbmUgXCIgKyBkICsgXCJcXG5cIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRlZmluZV9zdHIgKz0gXCIjZGVmaW5lIFwiICsgZCArIFwiIFwiICsgZGVmaW5lc1tkXSArIFwiXFxuXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wcm9jZXNzZWRfdmVydGV4X3NoYWRlcl9zb3VyY2UgPSBkZWZpbmVfc3RyICsgdGhpcy52ZXJ0ZXhfc2hhZGVyX3NvdXJjZTtcbiAgICB0aGlzLnByb2Nlc3NlZF9mcmFnbWVudF9zaGFkZXJfc291cmNlID0gZGVmaW5lX3N0ciArIHRoaXMuZnJhZ21lbnRfc2hhZGVyX3NvdXJjZTtcblxuICAgIC8vIENvbXBpbGUgJiBzZXQgdW5pZm9ybXMgdG8gY2FjaGVkIHZhbHVlc1xuICAgIHRoaXMucHJvZ3JhbSA9IEdMLnVwZGF0ZVByb2dyYW0odGhpcy5nbCwgdGhpcy5wcm9ncmFtLCB0aGlzLnByb2Nlc3NlZF92ZXJ0ZXhfc2hhZGVyX3NvdXJjZSwgdGhpcy5wcm9jZXNzZWRfZnJhZ21lbnRfc2hhZGVyX3NvdXJjZSk7XG4gICAgdGhpcy5nbC51c2VQcm9ncmFtKHRoaXMucHJvZ3JhbSk7XG4gICAgdGhpcy5yZWZyZXNoVW5pZm9ybXMoKTtcbiAgICB0aGlzLnJlZnJlc2hBdHRyaWJ1dGVzKCk7XG59O1xuXG4vLyBleDogcHJvZ3JhbS51bmlmb3JtKCczZicsICdwb3NpdGlvbicsIHgsIHksIHopO1xuR0wuUHJvZ3JhbS5wcm90b3R5cGUudW5pZm9ybSA9IGZ1bmN0aW9uIChtZXRob2QsIG5hbWUpIC8vIG1ldGhvZC1hcHByb3ByaWF0ZSBhcmd1bWVudHMgZm9sbG93XG57XG4gICAgdmFyIHVuaWZvcm0gPSAodGhpcy51bmlmb3Jtc1tuYW1lXSA9IHRoaXMudW5pZm9ybXNbbmFtZV0gfHwge30pO1xuICAgIHVuaWZvcm0ubmFtZSA9IG5hbWU7XG4gICAgdW5pZm9ybS5sb2NhdGlvbiA9IHVuaWZvcm0ubG9jYXRpb24gfHwgdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcm9ncmFtLCBuYW1lKTtcbiAgICB1bmlmb3JtLm1ldGhvZCA9ICd1bmlmb3JtJyArIG1ldGhvZDtcbiAgICB1bmlmb3JtLnZhbHVlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdGhpcy51cGRhdGVVbmlmb3JtKG5hbWUpO1xufTtcblxuLy8gU2V0IGEgc2luZ2xlIHVuaWZvcm1cbkdMLlByb2dyYW0ucHJvdG90eXBlLnVwZGF0ZVVuaWZvcm0gPSBmdW5jdGlvbiAobmFtZSlcbntcbiAgICB2YXIgdW5pZm9ybSA9IHRoaXMudW5pZm9ybXNbbmFtZV07XG4gICAgaWYgKHVuaWZvcm0gPT0gbnVsbCB8fCB1bmlmb3JtLmxvY2F0aW9uID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmdsW3VuaWZvcm0ubWV0aG9kXS5hcHBseSh0aGlzLmdsLCBbdW5pZm9ybS5sb2NhdGlvbl0uY29uY2F0KHVuaWZvcm0udmFsdWVzKSk7IC8vIGNhbGwgYXBwcm9wcmlhdGUgR0wgdW5pZm9ybSBtZXRob2QgYW5kIHBhc3MgdGhyb3VnaCBhcmd1bWVudHNcbn07XG5cbi8vIFJlZnJlc2ggdW5pZm9ybSBsb2NhdGlvbnMgYW5kIHNldCB0byBsYXN0IGNhY2hlZCB2YWx1ZXNcbkdMLlByb2dyYW0ucHJvdG90eXBlLnJlZnJlc2hVbmlmb3JtcyA9IGZ1bmN0aW9uICgpXG57XG4gICAgZm9yICh2YXIgdSBpbiB0aGlzLnVuaWZvcm1zKSB7XG4gICAgICAgIHRoaXMudW5pZm9ybXNbdV0ubG9jYXRpb24gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByb2dyYW0sIHUpO1xuICAgICAgICB0aGlzLnVwZGF0ZVVuaWZvcm0odSk7XG4gICAgfVxufTtcblxuR0wuUHJvZ3JhbS5wcm90b3R5cGUucmVmcmVzaEF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoKVxue1xuICAgIC8vIHZhciBsZW4gPSB0aGlzLmdsLmdldFByb2dyYW1QYXJhbWV0ZXIodGhpcy5wcm9ncmFtLCB0aGlzLmdsLkFDVElWRV9BVFRSSUJVVEVTKTtcbiAgICAvLyBmb3IgKHZhciBpPTA7IGkgPCBsZW47IGkrKykge1xuICAgIC8vICAgICB2YXIgYSA9IHRoaXMuZ2wuZ2V0QWN0aXZlQXR0cmliKHRoaXMucHJvZ3JhbSwgaSk7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKGEpO1xuICAgIC8vIH1cbiAgICB0aGlzLmF0dHJpYnMgPSB7fTtcbn07XG5cbi8vIEdldCB0aGUgbG9jYXRpb24gb2YgYSB2ZXJ0ZXggYXR0cmlidXRlXG5HTC5Qcm9ncmFtLnByb3RvdHlwZS5hdHRyaWJ1dGUgPSBmdW5jdGlvbiAobmFtZSlcbntcbiAgICB2YXIgYXR0cmliID0gKHRoaXMuYXR0cmlic1tuYW1lXSA9IHRoaXMuYXR0cmlic1tuYW1lXSB8fCB7fSk7XG4gICAgaWYgKGF0dHJpYi5sb2NhdGlvbiAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBhdHRyaWI7XG4gICAgfVxuXG4gICAgYXR0cmliLm5hbWUgPSBuYW1lO1xuICAgIGF0dHJpYi5sb2NhdGlvbiA9IHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5wcm9ncmFtLCBuYW1lKTtcblxuICAgIC8vIHZhciBpbmZvID0gdGhpcy5nbC5nZXRBY3RpdmVBdHRyaWIodGhpcy5wcm9ncmFtLCBhdHRyaWIubG9jYXRpb24pO1xuICAgIC8vIGF0dHJpYi50eXBlID0gaW5mby50eXBlO1xuICAgIC8vIGF0dHJpYi5zaXplID0gaW5mby5zaXplO1xuXG4gICAgcmV0dXJuIGF0dHJpYjtcbn07XG5cbi8vIFRyaWFuZ3VsYXRpb24gdXNpbmcgbGlidGVzcy5qcyBwb3J0IG9mIGdsdVRlc3NlbGF0b3Jcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9icmVuZGFua2VubnkvbGlidGVzcy5qc1xudHJ5IHtcbiAgICBHTC50ZXNzZWxhdG9yID0gKGZ1bmN0aW9uIGluaXRUZXNzZWxhdG9yKCkge1xuICAgICAgICAvLyBDYWxsZWQgZm9yIGVhY2ggdmVydGV4IG9mIHRlc3NlbGF0b3Igb3V0cHV0XG4gICAgICAgIGZ1bmN0aW9uIHZlcnRleENhbGxiYWNrKGRhdGEsIHBvbHlWZXJ0QXJyYXkpIHtcbiAgICAgICAgICAgIHBvbHlWZXJ0QXJyYXkucHVzaChbZGF0YVswXSwgZGF0YVsxXV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2FsbGVkIHdoZW4gc2VnbWVudHMgaW50ZXJzZWN0IGFuZCBtdXN0IGJlIHNwbGl0XG4gICAgICAgIGZ1bmN0aW9uIGNvbWJpbmVDYWxsYmFjayhjb29yZHMsIGRhdGEsIHdlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvb3JkcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENhbGxlZCB3aGVuIGEgdmVydGV4IHN0YXJ0cyBvciBzdG9wcyBhIGJvdW5kYXJ5IGVkZ2Ugb2YgYSBwb2x5Z29uXG4gICAgICAgIGZ1bmN0aW9uIGVkZ2VDYWxsYmFjayhmbGFnKSB7XG4gICAgICAgICAgICAvLyBOby1vcCBjYWxsYmFjayB0byBmb3JjZSBzaW1wbGUgdHJpYW5nbGUgcHJpbWl0aXZlcyAobm8gdHJpYW5nbGUgc3RyaXBzIG9yIGZhbnMpLlxuICAgICAgICAgICAgLy8gU2VlOiBodHRwOi8vd3d3LmdscHJvZ3JhbW1pbmcuY29tL3JlZC9jaGFwdGVyMTEuaHRtbFxuICAgICAgICAgICAgLy8gXCJTaW5jZSBlZGdlIGZsYWdzIG1ha2Ugbm8gc2Vuc2UgaW4gYSB0cmlhbmdsZSBmYW4gb3IgdHJpYW5nbGUgc3RyaXAsIGlmIHRoZXJlIGlzIGEgY2FsbGJhY2tcbiAgICAgICAgICAgIC8vIGFzc29jaWF0ZWQgd2l0aCBHTFVfVEVTU19FREdFX0ZMQUcgdGhhdCBlbmFibGVzIGVkZ2UgZmxhZ3MsIHRoZSBHTFVfVEVTU19CRUdJTiBjYWxsYmFjayBpc1xuICAgICAgICAgICAgLy8gY2FsbGVkIG9ubHkgd2l0aCBHTF9UUklBTkdMRVMuXCJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdHTC50ZXNzZWxhdG9yOiBlZGdlIGZsYWc6ICcgKyBmbGFnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0ZXNzZWxhdG9yID0gbmV3IGxpYnRlc3MuR2x1VGVzc2VsYXRvcigpO1xuICAgICAgICB0ZXNzZWxhdG9yLmdsdVRlc3NDYWxsYmFjayhsaWJ0ZXNzLmdsdUVudW0uR0xVX1RFU1NfVkVSVEVYX0RBVEEsIHZlcnRleENhbGxiYWNrKTtcbiAgICAgICAgdGVzc2VsYXRvci5nbHVUZXNzQ2FsbGJhY2sobGlidGVzcy5nbHVFbnVtLkdMVV9URVNTX0NPTUJJTkUsIGNvbWJpbmVDYWxsYmFjayk7XG4gICAgICAgIHRlc3NlbGF0b3IuZ2x1VGVzc0NhbGxiYWNrKGxpYnRlc3MuZ2x1RW51bS5HTFVfVEVTU19FREdFX0ZMQUcsIGVkZ2VDYWxsYmFjayk7XG5cbiAgICAgICAgLy8gQnJlbmRhbiBLZW5ueTpcbiAgICAgICAgLy8gbGlidGVzcyB3aWxsIHRha2UgM2QgdmVydHMgYW5kIGZsYXR0ZW4gdG8gYSBwbGFuZSBmb3IgdGVzc2VsYXRpb25cbiAgICAgICAgLy8gc2luY2Ugb25seSBkb2luZyAyZCB0ZXNzZWxhdGlvbiBoZXJlLCBwcm92aWRlIHo9MSBub3JtYWwgdG8gc2tpcFxuICAgICAgICAvLyBpdGVyYXRpbmcgb3ZlciB2ZXJ0cyBvbmx5IHRvIGdldCB0aGUgc2FtZSBhbnN3ZXIuXG4gICAgICAgIC8vIGNvbW1lbnQgb3V0IHRvIHRlc3Qgbm9ybWFsLWdlbmVyYXRpb24gY29kZVxuICAgICAgICB0ZXNzZWxhdG9yLmdsdVRlc3NOb3JtYWwoMCwgMCwgMSk7XG5cbiAgICAgICAgcmV0dXJuIHRlc3NlbGF0b3I7XG4gICAgfSkoKTtcblxuICAgIEdMLnRyaWFuZ3VsYXRlUG9seWdvbiA9IGZ1bmN0aW9uIEdMVHJpYW5ndWxhdGUgKGNvbnRvdXJzKVxuICAgIHtcbiAgICAgICAgdmFyIHRyaWFuZ2xlVmVydHMgPSBbXTtcbiAgICAgICAgR0wudGVzc2VsYXRvci5nbHVUZXNzQmVnaW5Qb2x5Z29uKHRyaWFuZ2xlVmVydHMpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29udG91cnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIEdMLnRlc3NlbGF0b3IuZ2x1VGVzc0JlZ2luQ29udG91cigpO1xuICAgICAgICAgICAgdmFyIGNvbnRvdXIgPSBjb250b3Vyc1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY29udG91ci5sZW5ndGg7IGogKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY29vcmRzID0gW2NvbnRvdXJbal1bMF0sIGNvbnRvdXJbal1bMV0sIDBdO1xuICAgICAgICAgICAgICAgIEdMLnRlc3NlbGF0b3IuZ2x1VGVzc1ZlcnRleChjb29yZHMsIGNvb3Jkcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBHTC50ZXNzZWxhdG9yLmdsdVRlc3NFbmRDb250b3VyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBHTC50ZXNzZWxhdG9yLmdsdVRlc3NFbmRQb2x5Z29uKCk7XG4gICAgICAgIHJldHVybiB0cmlhbmdsZVZlcnRzO1xuICAgIH07XG59XG5jYXRjaCAoZSkge1xuICAgIC8vIGNvbnNvbGUubG9nKFwibGlidGVzcyBub3QgZGVmaW5lZCFcIik7XG4gICAgLy8gc2tpcCBpZiBsaWJ0ZXNzIG5vdCBkZWZpbmVkXG59XG5cbi8vIEFkZCBvbmUgb3IgbW9yZSB2ZXJ0aWNlcyB0byBhbiBhcnJheSAoZGVzdGluZWQgdG8gYmUgdXNlZCBhcyBhIEdMIGJ1ZmZlciksICdzdHJpcGluZycgZWFjaCB2ZXJ0ZXggd2l0aCBjb25zdGFudCBkYXRhXG4vLyBVc2VkIGZvciBhZGRpbmcgdmFsdWVzIHRoYXQgYXJlIG9mdGVuIGNvbnN0YW50IHBlciBnZW9tZXRyeSBvciBwb2x5Z29uLCBsaWtlIGNvbG9ycywgbm9ybWFscyAoZm9yIHBvbHlzIHNpdHRpbmcgZmxhdCBvbiBtYXApLCBsYXllciBhbmQgbWF0ZXJpYWwgaW5mbywgZXRjLlxuR0wuYWRkVmVydGljZXMgPSBmdW5jdGlvbiAodmVydGljZXMsIHZlcnRleF9kYXRhLCB2ZXJ0ZXhfY29uc3RhbnRzKVxue1xuICAgIGlmICh2ZXJ0aWNlcyAhPSBudWxsICYmIHZlcnRpY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gQXJyYXkgb2YgdmVydGljZXNcbiAgICAgICAgaWYgKHR5cGVvZiB2ZXJ0aWNlc1swXSA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgZm9yICh2YXIgdj0wOyB2IDwgdmVydGljZXMubGVuZ3RoOyB2KyspIHtcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhfZGF0YS5wdXNoLmFwcGx5KHZlcnRleF9kYXRhLCB2ZXJ0aWNlc1t2XSk7XG4gICAgICAgICAgICAgICAgaWYgKHZlcnRleF9jb25zdGFudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmVydGV4X2RhdGEucHVzaC5hcHBseSh2ZXJ0ZXhfZGF0YSwgdmVydGV4X2NvbnN0YW50cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFNpbmdsZSB2ZXJ0ZXhcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2ZXJ0ZXhfZGF0YS5wdXNoLmFwcGx5KHZlcnRleF9kYXRhLCB2ZXJ0aWNlcyk7XG4gICAgICAgICAgICBpZiAodmVydGV4X2NvbnN0YW50cykge1xuICAgICAgICAgICAgICAgIHZlcnRleF9kYXRhLnB1c2guYXBwbHkodmVydGV4X2RhdGEsIHZlcnRleF9jb25zdGFudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2ZXJ0ZXhfZGF0YTtcbn07XG5cbi8vIENyZWF0ZXMgYSBWZXJ0ZXggQXJyYXkgT2JqZWN0IGlmIHRoZSBleHRlbnNpb24gaXMgYXZhaWxhYmxlLCBvciBmYWxscyBiYWNrIG9uIHN0YW5kYXJkIGF0dHJpYnV0ZSBjYWxsc1xuR0wuVmVydGV4QXJyYXlPYmplY3QgPSB7fTtcbkdMLlZlcnRleEFycmF5T2JqZWN0LmRpc2FibGVkID0gZmFsc2U7IC8vIHNldCB0byB0cnVlIHRvIGRpc2FibGUgVkFPcyBldmVuIGlmIGV4dGVuc2lvbiBpcyBhdmFpbGFibGVcbkdMLlZlcnRleEFycmF5T2JqZWN0LmJvdW5kX3ZhbyA9IG51bGw7IC8vIGN1cnJlbnRseSBib3VuZCBWQU9cblxuR0wuVmVydGV4QXJyYXlPYmplY3QuaW5pdCA9IGZ1bmN0aW9uIChnbClcbntcbiAgICBpZiAoR0wuVmVydGV4QXJyYXlPYmplY3QuZXh0ID09IG51bGwpIHtcbiAgICAgICAgaWYgKEdMLlZlcnRleEFycmF5T2JqZWN0LmRpc2FibGVkICE9IHRydWUpIHtcbiAgICAgICAgICAgIEdMLlZlcnRleEFycmF5T2JqZWN0LmV4dCA9IGdsLmdldEV4dGVuc2lvbihcIk9FU192ZXJ0ZXhfYXJyYXlfb2JqZWN0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEdMLlZlcnRleEFycmF5T2JqZWN0LmV4dCAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlZlcnRleCBBcnJheSBPYmplY3QgZXh0ZW5zaW9uIGF2YWlsYWJsZVwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChHTC5WZXJ0ZXhBcnJheU9iamVjdC5kaXNhYmxlZCAhPSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlZlcnRleCBBcnJheSBPYmplY3QgZXh0ZW5zaW9uIE5PVCBhdmFpbGFibGVcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlZlcnRleCBBcnJheSBPYmplY3QgZXh0ZW5zaW9uIGZvcmNlIGRpc2FibGVkXCIpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuR0wuVmVydGV4QXJyYXlPYmplY3QuY3JlYXRlID0gZnVuY3Rpb24gKHNldHVwLCB0ZWFyZG93bilcbntcbiAgICB2YXIgdmFvID0ge307XG4gICAgdmFvLnNldHVwID0gc2V0dXA7XG4gICAgdmFvLnRlYXJkb3duID0gdGVhcmRvd247XG5cbiAgICB2YXIgZXh0ID0gR0wuVmVydGV4QXJyYXlPYmplY3QuZXh0O1xuICAgIGlmIChleHQgIT0gbnVsbCkge1xuICAgICAgICB2YW8uX3ZhbyA9IGV4dC5jcmVhdGVWZXJ0ZXhBcnJheU9FUygpO1xuICAgICAgICBleHQuYmluZFZlcnRleEFycmF5T0VTKHZhby5fdmFvKTtcbiAgICAgICAgdmFvLnNldHVwKCk7XG4gICAgICAgIGV4dC5iaW5kVmVydGV4QXJyYXlPRVMobnVsbCk7XG4gICAgICAgIGlmICh0eXBlb2YgdmFvLnRlYXJkb3duID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhby50ZWFyZG93bigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YW8uc2V0dXAoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFvO1xufTtcblxuR0wuVmVydGV4QXJyYXlPYmplY3QuYmluZCA9IGZ1bmN0aW9uICh2YW8pXG57XG4gICAgdmFyIGV4dCA9IEdMLlZlcnRleEFycmF5T2JqZWN0LmV4dDtcbiAgICBpZiAodmFvICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGV4dCAhPSBudWxsICYmIHZhby5fdmFvICE9IG51bGwpIHtcbiAgICAgICAgICAgIGV4dC5iaW5kVmVydGV4QXJyYXlPRVModmFvLl92YW8pO1xuICAgICAgICAgICAgR0wuVmVydGV4QXJyYXlPYmplY3QuYm91bmRfdmFvID0gdmFvO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFvLnNldHVwKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChleHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgZXh0LmJpbmRWZXJ0ZXhBcnJheU9FUyhudWxsKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChHTC5WZXJ0ZXhBcnJheU9iamVjdC5ib3VuZF92YW8gIT0gbnVsbCAmJiB0eXBlb2YgR0wuVmVydGV4QXJyYXlPYmplY3QuYm91bmRfdmFvLnRlYXJkb3duID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIEdMLlZlcnRleEFycmF5T2JqZWN0LmJvdW5kX3Zhby50ZWFyZG93bigpO1xuICAgICAgICB9XG4gICAgICAgIEdMLlZlcnRleEFycmF5T2JqZWN0LmJvdW5kX3ZhbyA9IG51bGw7XG4gICAgfVxufTtcblxuaWYgKG1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBHTDtcbn1cbiIsInZhciBWZWN0b3IgPSByZXF1aXJlKCcuLi92ZWN0b3IuanMnKTtcbnZhciBQb2ludCA9IHJlcXVpcmUoJy4uL3BvaW50LmpzJyk7XG52YXIgR0wgPSByZXF1aXJlKCcuL2dsLmpzJyk7XG5cbnZhciBHTEJ1aWxkZXJzID0ge307XG5cbkdMQnVpbGRlcnMuZGVidWcgPSBmYWxzZTtcblxuLy8gVGVzc2VsYXRlIGEgZmxhdCAyRCBwb2x5Z29uIHdpdGggZml4ZWQgaGVpZ2h0IGFuZCBhZGQgdG8gR0wgdmVydGV4IGJ1ZmZlclxuR0xCdWlsZGVycy5idWlsZFBvbHlnb25zID0gZnVuY3Rpb24gR0xCdWlsZGVyc0J1aWxkUG9seWdvbnMgKHBvbHlnb25zLCB6LCB2ZXJ0ZXhfZGF0YSwgb3B0aW9ucylcbntcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHZhciB2ZXJ0ZXhfY29uc3RhbnRzID0gW3osIDAsIDAsIDFdOyAvLyBwcm92aWRlZCB6LCBhbmQgdXB3YXJkcy1mYWNpbmcgbm9ybWFsXG4gICAgaWYgKG9wdGlvbnMudmVydGV4X2NvbnN0YW50cykge1xuICAgICAgICB2ZXJ0ZXhfY29uc3RhbnRzLnB1c2guYXBwbHkodmVydGV4X2NvbnN0YW50cywgb3B0aW9ucy52ZXJ0ZXhfY29uc3RhbnRzKTtcbiAgICB9XG5cbiAgICB2YXIgbnVtX3BvbHlnb25zID0gcG9seWdvbnMubGVuZ3RoO1xuICAgIGZvciAodmFyIHA9MDsgcCA8IG51bV9wb2x5Z29uczsgcCsrKSB7XG4gICAgICAgIHZhciB2ZXJ0aWNlcyA9IEdMLnRyaWFuZ3VsYXRlUG9seWdvbihwb2x5Z29uc1twXSk7XG4gICAgICAgIEdMLmFkZFZlcnRpY2VzKHZlcnRpY2VzLCB2ZXJ0ZXhfZGF0YSwgdmVydGV4X2NvbnN0YW50cyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZlcnRleF9kYXRhO1xufTtcblxuLy8gVGVzc2VsYXRlIGFuZCBleHRydWRlIGEgZmxhdCAyRCBwb2x5Z29uIGludG8gYSBzaW1wbGUgM0QgbW9kZWwgd2l0aCBmaXhlZCBoZWlnaHQgYW5kIGFkZCB0byBHTCB2ZXJ0ZXggYnVmZmVyXG5HTEJ1aWxkZXJzLmJ1aWxkRXh0cnVkZWRQb2x5Z29ucyA9IGZ1bmN0aW9uIEdMQnVpbGRlcnNCdWlsZEV4dHJ1ZGVkUG9seWdvbiAocG9seWdvbnMsIHosIGhlaWdodCwgbWluX2hlaWdodCwgdmVydGV4X2RhdGEsIG9wdGlvbnMpXG57XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIG1pbl96ID0geiArIChtaW5faGVpZ2h0IHx8IDApO1xuICAgIHZhciBtYXhfeiA9IHogKyBoZWlnaHQ7XG5cbiAgICAvLyBUb3BcbiAgICBHTEJ1aWxkZXJzLmJ1aWxkUG9seWdvbnMocG9seWdvbnMsIG1heF96LCB2ZXJ0ZXhfZGF0YSwgeyB2ZXJ0ZXhfY29uc3RhbnRzOiBvcHRpb25zLnZlcnRleF9jb25zdGFudHMgfSk7XG5cbiAgICAvLyBXYWxsc1xuICAgIHZhciB3YWxsX3ZlcnRleF9jb25zdGFudHMgPSBbbnVsbCwgbnVsbCwgbnVsbF07IC8vIG5vcm1hbHMgd2lsbCBiZSBjYWxjdWxhdGVkIGJlbG93XG4gICAgaWYgKG9wdGlvbnMudmVydGV4X2NvbnN0YW50cykge1xuICAgICAgICB3YWxsX3ZlcnRleF9jb25zdGFudHMucHVzaC5hcHBseSh3YWxsX3ZlcnRleF9jb25zdGFudHMsIG9wdGlvbnMudmVydGV4X2NvbnN0YW50cyk7XG4gICAgfVxuXG4gICAgdmFyIG51bV9wb2x5Z29ucyA9IHBvbHlnb25zLmxlbmd0aDtcbiAgICBmb3IgKHZhciBwPTA7IHAgPCBudW1fcG9seWdvbnM7IHArKykge1xuICAgICAgICB2YXIgcG9seWdvbiA9IHBvbHlnb25zW3BdO1xuXG4gICAgICAgIGZvciAodmFyIHE9MDsgcSA8IHBvbHlnb24ubGVuZ3RoOyBxKyspIHtcbiAgICAgICAgICAgIHZhciBjb250b3VyID0gcG9seWdvbltxXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgdz0wOyB3IDwgY29udG91ci5sZW5ndGggLSAxOyB3KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgd2FsbF92ZXJ0aWNlcyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgLy8gVHdvIHRyaWFuZ2xlcyBmb3IgdGhlIHF1YWQgZm9ybWVkIGJ5IGVhY2ggdmVydGV4IHBhaXIsIGdvaW5nIGZyb20gYm90dG9tIHRvIHRvcCBoZWlnaHRcbiAgICAgICAgICAgICAgICB3YWxsX3ZlcnRpY2VzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIC8vIFRyaWFuZ2xlXG4gICAgICAgICAgICAgICAgICAgIFtjb250b3VyW3crMV1bMF0sIGNvbnRvdXJbdysxXVsxXSwgbWF4X3pdLFxuICAgICAgICAgICAgICAgICAgICBbY29udG91clt3KzFdWzBdLCBjb250b3VyW3crMV1bMV0sIG1pbl96XSxcbiAgICAgICAgICAgICAgICAgICAgW2NvbnRvdXJbd11bMF0sIGNvbnRvdXJbd11bMV0sIG1pbl96XSxcbiAgICAgICAgICAgICAgICAgICAgLy8gVHJpYW5nbGVcbiAgICAgICAgICAgICAgICAgICAgW2NvbnRvdXJbd11bMF0sIGNvbnRvdXJbd11bMV0sIG1pbl96XSxcbiAgICAgICAgICAgICAgICAgICAgW2NvbnRvdXJbd11bMF0sIGNvbnRvdXJbd11bMV0sIG1heF96XSxcbiAgICAgICAgICAgICAgICAgICAgW2NvbnRvdXJbdysxXVswXSwgY29udG91clt3KzFdWzFdLCBtYXhfel1cbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgLy8gQ2FsYyB0aGUgbm9ybWFsIG9mIHRoZSB3YWxsIGZyb20gdXAgdmVjdG9yIGFuZCBvbmUgc2VnbWVudCBvZiB0aGUgd2FsbCB0cmlhbmdsZXNcbiAgICAgICAgICAgICAgICB2YXIgbm9ybWFsID0gVmVjdG9yLmNyb3NzKFxuICAgICAgICAgICAgICAgICAgICBbMCwgMCwgMV0sXG4gICAgICAgICAgICAgICAgICAgIFZlY3Rvci5ub3JtYWxpemUoW2NvbnRvdXJbdysxXVswXSAtIGNvbnRvdXJbd11bMF0sIGNvbnRvdXJbdysxXVsxXSAtIGNvbnRvdXJbd11bMV0sIDBdKVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICB3YWxsX3ZlcnRleF9jb25zdGFudHNbMF0gPSBub3JtYWxbMF07XG4gICAgICAgICAgICAgICAgd2FsbF92ZXJ0ZXhfY29uc3RhbnRzWzFdID0gbm9ybWFsWzFdO1xuICAgICAgICAgICAgICAgIHdhbGxfdmVydGV4X2NvbnN0YW50c1syXSA9IG5vcm1hbFsyXTtcblxuICAgICAgICAgICAgICAgIEdMLmFkZFZlcnRpY2VzKHdhbGxfdmVydGljZXMsIHZlcnRleF9kYXRhLCB3YWxsX3ZlcnRleF9jb25zdGFudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZlcnRleF9kYXRhO1xufTtcblxuLy8gQnVpbGQgdGVzc2VsbGF0ZWQgdHJpYW5nbGVzIGZvciBhIHBvbHlsaW5lXG4vLyBCYXNpY2FsbHkgZm9sbG93aW5nIHRoZSBtZXRob2QgZGVzY3JpYmVkIGhlcmUgZm9yIG1pdGVyIGpvaW50czpcbi8vIGh0dHA6Ly9hcnRncmFtbWVyLmJsb2dzcG90LmNvLnVrLzIwMTEvMDcvZHJhd2luZy1wb2x5bGluZXMtYnktdGVzc2VsbGF0aW9uLmh0bWxcbkdMQnVpbGRlcnMuYnVpbGRQb2x5bGluZXMgPSBmdW5jdGlvbiBHTEJ1aWxkZXJzQnVpbGRQb2x5bGluZXMgKGxpbmVzLCB6LCB3aWR0aCwgdmVydGV4X2RhdGEsIG9wdGlvbnMpXG57XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgb3B0aW9ucy5jbG9zZWRfcG9seWdvbiA9IG9wdGlvbnMuY2xvc2VkX3BvbHlnb24gfHwgZmFsc2U7XG4gICAgb3B0aW9ucy5yZW1vdmVfdGlsZV9lZGdlcyA9IG9wdGlvbnMucmVtb3ZlX3RpbGVfZWRnZXMgfHwgZmFsc2U7XG5cbiAgICB2YXIgdmVydGV4X2NvbnN0YW50cyA9IFt6LCAwLCAwLCAxXTsgLy8gcHJvdmlkZWQgeiwgYW5kIHVwd2FyZHMtZmFjaW5nIG5vcm1hbFxuICAgIGlmIChvcHRpb25zLnZlcnRleF9jb25zdGFudHMpIHtcbiAgICAgICAgdmVydGV4X2NvbnN0YW50cy5wdXNoLmFwcGx5KHZlcnRleF9jb25zdGFudHMsIG9wdGlvbnMudmVydGV4X2NvbnN0YW50cyk7XG4gICAgfVxuXG4gICAgLy8gTGluZSBjZW50ZXIgLSBkZWJ1Z2dpbmdcbiAgICBpZiAoR0xCdWlsZGVycy5kZWJ1ZyAmJiBvcHRpb25zLnZlcnRleF9saW5lcykge1xuICAgICAgICB2YXIgbnVtX2xpbmVzID0gbGluZXMubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBsbj0wOyBsbiA8IG51bV9saW5lczsgbG4rKykge1xuICAgICAgICAgICAgdmFyIGxpbmUgPSBsaW5lc1tsbl07XG5cbiAgICAgICAgICAgIGZvciAodmFyIHA9MDsgcCA8IGxpbmUubGVuZ3RoIC0gMTsgcCsrKSB7XG4gICAgICAgICAgICAgICAgLy8gUG9pbnQgQSB0byBCXG4gICAgICAgICAgICAgICAgdmFyIHBhID0gbGluZVtwXTtcbiAgICAgICAgICAgICAgICB2YXIgcGIgPSBsaW5lW3ArMV07XG5cbiAgICAgICAgICAgICAgICBvcHRpb25zLnZlcnRleF9saW5lcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICBwYVswXSwgcGFbMV0sIHogKyAwLjAwMSwgMCwgMCwgMSwgMS4wLCAwLCAwLFxuICAgICAgICAgICAgICAgICAgICBwYlswXSwgcGJbMV0sIHogKyAwLjAwMSwgMCwgMCwgMSwgMS4wLCAwLCAwXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBCdWlsZCB0cmlhbmdsZXNcbiAgICB2YXIgdmVydGljZXMgPSBbXTtcbiAgICB2YXIgbnVtX2xpbmVzID0gbGluZXMubGVuZ3RoO1xuICAgIGZvciAodmFyIGxuPTA7IGxuIDwgbnVtX2xpbmVzOyBsbisrKSB7XG4gICAgICAgIHZhciBsaW5lID0gbGluZXNbbG5dO1xuICAgICAgICAvLyBNdWx0aXBsZSBsaW5lIHNlZ21lbnRzXG4gICAgICAgIGlmIChsaW5lLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgIC8vIEJ1aWxkIGFuY2hvcnMgZm9yIGxpbmUgc2VnbWVudHM6XG4gICAgICAgICAgICAvLyBhbmNob3JzIGFyZSAzIHBvaW50cywgZWFjaCBjb25uZWN0aW5nIDIgbGluZSBzZWdtZW50cyB0aGF0IHNoYXJlIGEgam9pbnQgKHN0YXJ0IHBvaW50LCBqb2ludCBwb2ludCwgZW5kIHBvaW50KVxuXG4gICAgICAgICAgICB2YXIgYW5jaG9ycyA9IFtdO1xuXG4gICAgICAgICAgICBpZiAobGluZS5sZW5ndGggPiAzKSB7XG4gICAgICAgICAgICAgICAgLy8gRmluZCBtaWRwb2ludHMgb2YgZWFjaCBsaW5lIHNlZ21lbnRcbiAgICAgICAgICAgICAgICAvLyBGb3IgY2xvc2VkIHBvbHlnb25zLCBjYWxjdWxhdGUgYWxsIG1pZHBvaW50cyBzaW5jZSBzZWdtZW50cyB3aWxsIHdyYXAgYXJvdW5kIHRvIGZpcnN0IG1pZHBvaW50XG4gICAgICAgICAgICAgICAgdmFyIG1pZCA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBwLCBwbWF4O1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmNsb3NlZF9wb2x5Z29uID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcCA9IDA7IC8vIHN0YXJ0IG9uIGZpcnN0IHBvaW50XG4gICAgICAgICAgICAgICAgICAgIHBtYXggPSBsaW5lLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIEZvciBvcGVuIHBvbHlnb25zLCBza2lwIGZpcnN0IG1pZHBvaW50IGFuZCB1c2UgbGluZSBzdGFydCBpbnN0ZWFkXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHAgPSAxOyAvLyBzdGFydCBvbiBzZWNvbmQgcG9pbnRcbiAgICAgICAgICAgICAgICAgICAgcG1heCA9IGxpbmUubGVuZ3RoIC0gMjtcbiAgICAgICAgICAgICAgICAgICAgbWlkLnB1c2gobGluZVswXSk7IC8vIHVzZSBsaW5lIHN0YXJ0IGluc3RlYWQgb2YgZmlyc3QgbWlkcG9pbnRcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBDYWxjIG1pZHBvaW50c1xuICAgICAgICAgICAgICAgIGZvciAoOyBwIDwgcG1heDsgcCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYSA9IGxpbmVbcF07XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYiA9IGxpbmVbcCsxXTtcbiAgICAgICAgICAgICAgICAgICAgbWlkLnB1c2goWyhwYVswXSArIHBiWzBdKSAvIDIsIChwYVsxXSArIHBiWzFdKSAvIDJdKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBTYW1lIGNsb3NlZC9vcGVuIHBvbHlnb24gbG9naWMgYXMgYWJvdmU6IGtlZXAgbGFzdCBtaWRwb2ludCBmb3IgY2xvc2VkLCBza2lwIGZvciBvcGVuXG4gICAgICAgICAgICAgICAgdmFyIG1tYXg7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuY2xvc2VkX3BvbHlnb24gPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBtbWF4ID0gbWlkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG1pZC5wdXNoKGxpbmVbbGluZS5sZW5ndGgtMV0pOyAvLyB1c2UgbGluZSBlbmQgaW5zdGVhZCBvZiBsYXN0IG1pZHBvaW50XG4gICAgICAgICAgICAgICAgICAgIG1tYXggPSBtaWQubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBNYWtlIGFuY2hvcnMgYnkgY29ubmVjdGluZyBtaWRwb2ludHMgdG8gbGluZSBqb2ludHNcbiAgICAgICAgICAgICAgICBmb3IgKHA9MDsgcCA8IG1tYXg7IHArKykgIHtcbiAgICAgICAgICAgICAgICAgICAgYW5jaG9ycy5wdXNoKFttaWRbcF0sIGxpbmVbKHArMSkgJSBsaW5lLmxlbmd0aF0sIG1pZFsocCsxKSAlIG1pZC5sZW5ndGhdXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gRGVnZW5lcmF0ZSBjYXNlLCBhIDMtcG9pbnQgbGluZSBpcyBqdXN0IGEgc2luZ2xlIGFuY2hvclxuICAgICAgICAgICAgICAgIGFuY2hvcnMgPSBbW2xpbmVbMF0sIGxpbmVbMV0sIGxpbmVbMl1dXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgcD0wOyBwIDwgYW5jaG9ycy5sZW5ndGg7IHArKykge1xuICAgICAgICAgICAgICAgIGlmICghb3B0aW9ucy5yZW1vdmVfdGlsZV9lZGdlcykge1xuICAgICAgICAgICAgICAgICAgICBidWlsZEFuY2hvcihhbmNob3JzW3BdWzBdLCBhbmNob3JzW3BdWzFdLCBhbmNob3JzW3BdWzJdKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gYnVpbGRTZWdtZW50KGFuY2hvcnNbcF1bMF0sIGFuY2hvcnNbcF1bMV0pOyAvLyB1c2UgdGhlc2UgdG8gZHJhdyBleHRydWRlZCBzZWdtZW50cyB3L28gam9pbiwgZm9yIGRlYnVnZ2luZ1xuICAgICAgICAgICAgICAgICAgICAvLyBidWlsZFNlZ21lbnQoYW5jaG9yc1twXVsxXSwgYW5jaG9yc1twXVsyXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWRnZTEgPSBHTEJ1aWxkZXJzLmlzT25UaWxlRWRnZShhbmNob3JzW3BdWzBdLCBhbmNob3JzW3BdWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVkZ2UyID0gR0xCdWlsZGVycy5pc09uVGlsZUVkZ2UoYW5jaG9yc1twXVsxXSwgYW5jaG9yc1twXVsyXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZWRnZTEgJiYgIWVkZ2UyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBidWlsZEFuY2hvcihhbmNob3JzW3BdWzBdLCBhbmNob3JzW3BdWzFdLCBhbmNob3JzW3BdWzJdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICghZWRnZTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkU2VnbWVudChhbmNob3JzW3BdWzBdLCBhbmNob3JzW3BdWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICghZWRnZTIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkU2VnbWVudChhbmNob3JzW3BdWzFdLCBhbmNob3JzW3BdWzJdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBTaW5nbGUgMi1wb2ludCBzZWdtZW50XG4gICAgICAgIGVsc2UgaWYgKGxpbmUubGVuZ3RoID09IDIpIHtcbiAgICAgICAgICAgIGJ1aWxkU2VnbWVudChsaW5lWzBdLCBsaW5lWzFdKTsgLy8gVE9ETzogcmVwbGFjZSBidWlsZFNlZ21lbnQgd2l0aCBhIGRlZ2VuZXJhdGUgZm9ybSBvZiBidWlsZEFuY2hvcj8gYnVpbGRTZWdtZW50IGlzIHN0aWxsIHVzZWZ1bCBmb3IgZGVidWdnaW5nXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgR0wuYWRkVmVydGljZXModmVydGljZXMsIHZlcnRleF9kYXRhLCB2ZXJ0ZXhfY29uc3RhbnRzKTtcblxuICAgIC8vIEJ1aWxkIHRyaWFuZ2xlcyBmb3IgYSBzaW5nbGUgbGluZSBzZWdtZW50LCBleHRydWRlZCBieSB0aGUgcHJvdmlkZWQgd2lkdGhcbiAgICBmdW5jdGlvbiBidWlsZFNlZ21lbnQgKHBhLCBwYikge1xuICAgICAgICB2YXIgc2xvcGUgPSBWZWN0b3Iubm9ybWFsaXplKFsocGJbMV0gLSBwYVsxXSkgKiAtMSwgcGJbMF0gLSBwYVswXV0pO1xuXG4gICAgICAgIHZhciBwYV9vdXRlciA9IFtwYVswXSArIHNsb3BlWzBdICogd2lkdGgvMiwgcGFbMV0gKyBzbG9wZVsxXSAqIHdpZHRoLzJdO1xuICAgICAgICB2YXIgcGFfaW5uZXIgPSBbcGFbMF0gLSBzbG9wZVswXSAqIHdpZHRoLzIsIHBhWzFdIC0gc2xvcGVbMV0gKiB3aWR0aC8yXTtcblxuICAgICAgICB2YXIgcGJfb3V0ZXIgPSBbcGJbMF0gKyBzbG9wZVswXSAqIHdpZHRoLzIsIHBiWzFdICsgc2xvcGVbMV0gKiB3aWR0aC8yXTtcbiAgICAgICAgdmFyIHBiX2lubmVyID0gW3BiWzBdIC0gc2xvcGVbMF0gKiB3aWR0aC8yLCBwYlsxXSAtIHNsb3BlWzFdICogd2lkdGgvMl07XG5cbiAgICAgICAgdmVydGljZXMucHVzaChcbiAgICAgICAgICAgIHBiX2lubmVyLCBwYl9vdXRlciwgcGFfaW5uZXIsXG4gICAgICAgICAgICBwYV9pbm5lciwgcGJfb3V0ZXIsIHBhX291dGVyXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gQnVpbGQgdHJpYW5nbGVzIGZvciBhIDMtcG9pbnQgJ2FuY2hvcicgc2hhcGUsIGNvbnNpc3Rpbmcgb2YgdHdvIGxpbmUgc2VnbWVudHMgd2l0aCBhIGpvaW50XG4gICAgLy8gVE9ETzogbW92ZSB0aGVzZSBmdW5jdGlvbnMgb3V0IG9mIGNsb3N1cmVzP1xuICAgIGZ1bmN0aW9uIGJ1aWxkQW5jaG9yIChwYSwgam9pbnQsIHBiKSB7XG4gICAgICAgIC8vIElubmVyIGFuZCBvdXRlciBsaW5lIHNlZ21lbnRzIGZvciBbcGEsIGpvaW50XSBhbmQgW2pvaW50LCBwYl1cbiAgICAgICAgdmFyIHBhX3Nsb3BlID0gVmVjdG9yLm5vcm1hbGl6ZShbKGpvaW50WzFdIC0gcGFbMV0pICogLTEsIGpvaW50WzBdIC0gcGFbMF1dKTtcbiAgICAgICAgdmFyIHBhX291dGVyID0gW1xuICAgICAgICAgICAgW3BhWzBdICsgcGFfc2xvcGVbMF0gKiB3aWR0aC8yLCBwYVsxXSArIHBhX3Nsb3BlWzFdICogd2lkdGgvMl0sXG4gICAgICAgICAgICBbam9pbnRbMF0gKyBwYV9zbG9wZVswXSAqIHdpZHRoLzIsIGpvaW50WzFdICsgcGFfc2xvcGVbMV0gKiB3aWR0aC8yXVxuICAgICAgICBdO1xuICAgICAgICB2YXIgcGFfaW5uZXIgPSBbXG4gICAgICAgICAgICBbcGFbMF0gLSBwYV9zbG9wZVswXSAqIHdpZHRoLzIsIHBhWzFdIC0gcGFfc2xvcGVbMV0gKiB3aWR0aC8yXSxcbiAgICAgICAgICAgIFtqb2ludFswXSAtIHBhX3Nsb3BlWzBdICogd2lkdGgvMiwgam9pbnRbMV0gLSBwYV9zbG9wZVsxXSAqIHdpZHRoLzJdXG4gICAgICAgIF07XG5cbiAgICAgICAgdmFyIHBiX3Nsb3BlID0gVmVjdG9yLm5vcm1hbGl6ZShbKHBiWzFdIC0gam9pbnRbMV0pICogLTEsIHBiWzBdIC0gam9pbnRbMF1dKTtcbiAgICAgICAgdmFyIHBiX291dGVyID0gW1xuICAgICAgICAgICAgW2pvaW50WzBdICsgcGJfc2xvcGVbMF0gKiB3aWR0aC8yLCBqb2ludFsxXSArIHBiX3Nsb3BlWzFdICogd2lkdGgvMl0sXG4gICAgICAgICAgICBbcGJbMF0gKyBwYl9zbG9wZVswXSAqIHdpZHRoLzIsIHBiWzFdICsgcGJfc2xvcGVbMV0gKiB3aWR0aC8yXVxuICAgICAgICBdO1xuICAgICAgICB2YXIgcGJfaW5uZXIgPSBbXG4gICAgICAgICAgICBbam9pbnRbMF0gLSBwYl9zbG9wZVswXSAqIHdpZHRoLzIsIGpvaW50WzFdIC0gcGJfc2xvcGVbMV0gKiB3aWR0aC8yXSxcbiAgICAgICAgICAgIFtwYlswXSAtIHBiX3Nsb3BlWzBdICogd2lkdGgvMiwgcGJbMV0gLSBwYl9zbG9wZVsxXSAqIHdpZHRoLzJdXG4gICAgICAgIF07XG5cbiAgICAgICAgLy8gTWl0ZXIgam9pbiAtIHNvbHZlIGZvciB0aGUgaW50ZXJzZWN0aW9uIGJldHdlZW4gdGhlIHR3byBvdXRlciBsaW5lIHNlZ21lbnRzXG4gICAgICAgIHZhciBpbnRlcnNlY3Rpb24gPSBWZWN0b3IubGluZUludGVyc2VjdGlvbihwYV9vdXRlclswXSwgcGFfb3V0ZXJbMV0sIHBiX291dGVyWzBdLCBwYl9vdXRlclsxXSk7XG4gICAgICAgIHZhciBsaW5lX2RlYnVnID0gbnVsbDtcbiAgICAgICAgaWYgKGludGVyc2VjdGlvbiAhPSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgaW50ZXJzZWN0X291dGVyID0gaW50ZXJzZWN0aW9uO1xuXG4gICAgICAgICAgICAvLyBDYXAgdGhlIGludGVyc2VjdGlvbiBwb2ludCB0byBhIHJlYXNvbmFibGUgZGlzdGFuY2UgKGFzIGpvaW4gYW5nbGUgYmVjb21lcyBzaGFycGVyLCBtaXRlciBqb2ludCBkaXN0YW5jZSB3b3VsZCBhcHByb2FjaCBpbmZpbml0eSlcbiAgICAgICAgICAgIHZhciBsZW5fc3EgPSBWZWN0b3IubGVuZ3RoU3EoW2ludGVyc2VjdF9vdXRlclswXSAtIGpvaW50WzBdLCBpbnRlcnNlY3Rfb3V0ZXJbMV0gLSBqb2ludFsxXV0pO1xuICAgICAgICAgICAgdmFyIG1pdGVyX2xlbl9tYXggPSAzOyAvLyBtdWx0aXBsaWVyIG9uIGxpbmUgd2lkdGggZm9yIG1heCBkaXN0YW5jZSBtaXRlciBqb2luIGNhbiBiZSBmcm9tIGpvaW50XG4gICAgICAgICAgICBpZiAobGVuX3NxID4gKHdpZHRoICogd2lkdGggKiBtaXRlcl9sZW5fbWF4ICogbWl0ZXJfbGVuX21heCkpIHtcbiAgICAgICAgICAgICAgICBsaW5lX2RlYnVnID0gJ2Rpc3RhbmNlJztcbiAgICAgICAgICAgICAgICBpbnRlcnNlY3Rfb3V0ZXIgPSBWZWN0b3Iubm9ybWFsaXplKFtpbnRlcnNlY3Rfb3V0ZXJbMF0gLSBqb2ludFswXSwgaW50ZXJzZWN0X291dGVyWzFdIC0gam9pbnRbMV1dKTtcbiAgICAgICAgICAgICAgICBpbnRlcnNlY3Rfb3V0ZXIgPSBbXG4gICAgICAgICAgICAgICAgICAgIGpvaW50WzBdICsgaW50ZXJzZWN0X291dGVyWzBdICogbWl0ZXJfbGVuX21heCxcbiAgICAgICAgICAgICAgICAgICAgam9pbnRbMV0gKyBpbnRlcnNlY3Rfb3V0ZXJbMV0gKiBtaXRlcl9sZW5fbWF4XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaW50ZXJzZWN0X2lubmVyID0gW1xuICAgICAgICAgICAgICAgIChqb2ludFswXSAtIGludGVyc2VjdF9vdXRlclswXSkgKyBqb2ludFswXSxcbiAgICAgICAgICAgICAgICAoam9pbnRbMV0gLSBpbnRlcnNlY3Rfb3V0ZXJbMV0pICsgam9pbnRbMV1cbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIHZlcnRpY2VzLnB1c2goXG4gICAgICAgICAgICAgICAgaW50ZXJzZWN0X2lubmVyLCBpbnRlcnNlY3Rfb3V0ZXIsIHBhX2lubmVyWzBdLFxuICAgICAgICAgICAgICAgIHBhX2lubmVyWzBdLCBpbnRlcnNlY3Rfb3V0ZXIsIHBhX291dGVyWzBdLFxuXG4gICAgICAgICAgICAgICAgcGJfaW5uZXJbMV0sIHBiX291dGVyWzFdLCBpbnRlcnNlY3RfaW5uZXIsXG4gICAgICAgICAgICAgICAgaW50ZXJzZWN0X2lubmVyLCBwYl9vdXRlclsxXSwgaW50ZXJzZWN0X291dGVyXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gTGluZSBzZWdtZW50cyBhcmUgcGFyYWxsZWwsIHVzZSB0aGUgZmlyc3Qgb3V0ZXIgbGluZSBzZWdtZW50IGFzIGpvaW4gaW5zdGVhZFxuICAgICAgICAgICAgbGluZV9kZWJ1ZyA9ICdwYXJhbGxlbCc7XG4gICAgICAgICAgICBwYV9pbm5lclsxXSA9IHBiX2lubmVyWzBdO1xuICAgICAgICAgICAgcGFfb3V0ZXJbMV0gPSBwYl9vdXRlclswXTtcblxuICAgICAgICAgICAgdmVydGljZXMucHVzaChcbiAgICAgICAgICAgICAgICBwYV9pbm5lclsxXSwgcGFfb3V0ZXJbMV0sIHBhX2lubmVyWzBdLFxuICAgICAgICAgICAgICAgIHBhX2lubmVyWzBdLCBwYV9vdXRlclsxXSwgcGFfb3V0ZXJbMF0sXG5cbiAgICAgICAgICAgICAgICBwYl9pbm5lclsxXSwgcGJfb3V0ZXJbMV0sIHBiX2lubmVyWzBdLFxuICAgICAgICAgICAgICAgIHBiX2lubmVyWzBdLCBwYl9vdXRlclsxXSwgcGJfb3V0ZXJbMF1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBFeHRydWRlZCBpbm5lci9vdXRlciBlZGdlcyAtIGRlYnVnZ2luZ1xuICAgICAgICBpZiAoR0xCdWlsZGVycy5kZWJ1ZyAmJiBvcHRpb25zLnZlcnRleF9saW5lcykge1xuICAgICAgICAgICAgb3B0aW9ucy52ZXJ0ZXhfbGluZXMucHVzaChcbiAgICAgICAgICAgICAgICBwYV9pbm5lclswXVswXSwgcGFfaW5uZXJbMF1bMV0sIHogKyAwLjAwMSwgMCwgMCwgMSwgMCwgMS4wLCAwLFxuICAgICAgICAgICAgICAgIHBhX2lubmVyWzFdWzBdLCBwYV9pbm5lclsxXVsxXSwgeiArIDAuMDAxLCAwLCAwLCAxLCAwLCAxLjAsIDAsXG5cbiAgICAgICAgICAgICAgICBwYl9pbm5lclswXVswXSwgcGJfaW5uZXJbMF1bMV0sIHogKyAwLjAwMSwgMCwgMCwgMSwgMCwgMS4wLCAwLFxuICAgICAgICAgICAgICAgIHBiX2lubmVyWzFdWzBdLCBwYl9pbm5lclsxXVsxXSwgeiArIDAuMDAxLCAwLCAwLCAxLCAwLCAxLjAsIDAsXG5cbiAgICAgICAgICAgICAgICBwYV9vdXRlclswXVswXSwgcGFfb3V0ZXJbMF1bMV0sIHogKyAwLjAwMSwgMCwgMCwgMSwgMCwgMS4wLCAwLFxuICAgICAgICAgICAgICAgIHBhX291dGVyWzFdWzBdLCBwYV9vdXRlclsxXVsxXSwgeiArIDAuMDAxLCAwLCAwLCAxLCAwLCAxLjAsIDAsXG5cbiAgICAgICAgICAgICAgICBwYl9vdXRlclswXVswXSwgcGJfb3V0ZXJbMF1bMV0sIHogKyAwLjAwMSwgMCwgMCwgMSwgMCwgMS4wLCAwLFxuICAgICAgICAgICAgICAgIHBiX291dGVyWzFdWzBdLCBwYl9vdXRlclsxXVsxXSwgeiArIDAuMDAxLCAwLCAwLCAxLCAwLCAxLjAsIDAsXG5cbiAgICAgICAgICAgICAgICBwYV9pbm5lclswXVswXSwgcGFfaW5uZXJbMF1bMV0sIHogKyAwLjAwMSwgMCwgMCwgMSwgMCwgMS4wLCAwLFxuICAgICAgICAgICAgICAgIHBhX291dGVyWzBdWzBdLCBwYV9vdXRlclswXVsxXSwgeiArIDAuMDAxLCAwLCAwLCAxLCAwLCAxLjAsIDAsXG5cbiAgICAgICAgICAgICAgICBwYV9pbm5lclsxXVswXSwgcGFfaW5uZXJbMV1bMV0sIHogKyAwLjAwMSwgMCwgMCwgMSwgMCwgMS4wLCAwLFxuICAgICAgICAgICAgICAgIHBhX291dGVyWzFdWzBdLCBwYV9vdXRlclsxXVsxXSwgeiArIDAuMDAxLCAwLCAwLCAxLCAwLCAxLjAsIDAsXG5cbiAgICAgICAgICAgICAgICBwYl9pbm5lclswXVswXSwgcGJfaW5uZXJbMF1bMV0sIHogKyAwLjAwMSwgMCwgMCwgMSwgMCwgMS4wLCAwLFxuICAgICAgICAgICAgICAgIHBiX291dGVyWzBdWzBdLCBwYl9vdXRlclswXVsxXSwgeiArIDAuMDAxLCAwLCAwLCAxLCAwLCAxLjAsIDAsXG5cbiAgICAgICAgICAgICAgICBwYl9pbm5lclsxXVswXSwgcGJfaW5uZXJbMV1bMV0sIHogKyAwLjAwMSwgMCwgMCwgMSwgMCwgMS4wLCAwLFxuICAgICAgICAgICAgICAgIHBiX291dGVyWzFdWzBdLCBwYl9vdXRlclsxXVsxXSwgeiArIDAuMDAxLCAwLCAwLCAxLCAwLCAxLjAsIDBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoR0xCdWlsZGVycy5kZWJ1ZyAmJiBsaW5lX2RlYnVnICYmIG9wdGlvbnMudmVydGV4X2xpbmVzKSB7XG4gICAgICAgICAgICB2YXIgZGNvbG9yO1xuICAgICAgICAgICAgaWYgKGxpbmVfZGVidWcgPT0gJ3BhcmFsbGVsJykge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiISEhIGxpbmVzIGFyZSBwYXJhbGxlbCAhISFcIik7XG4gICAgICAgICAgICAgICAgZGNvbG9yID0gWzAsIDEsIDBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobGluZV9kZWJ1ZyA9PSAnZGlzdGFuY2UnKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCIhISEgbWl0ZXIgaW50ZXJzZWN0aW9uIHBvaW50IGV4Y2VlZGVkIGFsbG93ZWQgZGlzdGFuY2UgZnJvbSBqb2ludCAhISFcIik7XG4gICAgICAgICAgICAgICAgZGNvbG9yID0gWzEsIDAsIDBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ09TTSBpZDogJyArIGZlYXR1cmUuaWQpOyAvLyBUT0RPOiBpZiB0aGlzIGZ1bmN0aW9uIGlzIG1vdmVkIG91dCBvZiBhIGNsb3N1cmUsIHRoaXMgZmVhdHVyZSBkZWJ1ZyBpbmZvIHdvbid0IGJlIGF2YWlsYWJsZVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coW3BhLCBqb2ludCwgcGJdKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGZlYXR1cmUpO1xuICAgICAgICAgICAgb3B0aW9ucy52ZXJ0ZXhfbGluZXMucHVzaChcbiAgICAgICAgICAgICAgICBwYVswXSwgcGFbMV0sIHogKyAwLjAwMixcbiAgICAgICAgICAgICAgICAwLCAwLCAxLCBkY29sb3JbMF0sIGRjb2xvclsxXSwgZGNvbG9yWzJdLFxuICAgICAgICAgICAgICAgIGpvaW50WzBdLCBqb2ludFsxXSwgeiArIDAuMDAyLFxuICAgICAgICAgICAgICAgIDAsIDAsIDEsIGRjb2xvclswXSwgZGNvbG9yWzFdLCBkY29sb3JbMl0sXG4gICAgICAgICAgICAgICAgam9pbnRbMF0sIGpvaW50WzFdLCB6ICsgMC4wMDIsXG4gICAgICAgICAgICAgICAgMCwgMCwgMSwgZGNvbG9yWzBdLCBkY29sb3JbMV0sIGRjb2xvclsyXSxcbiAgICAgICAgICAgICAgICBwYlswXSwgcGJbMV0sIHogKyAwLjAwMixcbiAgICAgICAgICAgICAgICAwLCAwLCAxLCBkY29sb3JbMF0sIGRjb2xvclsxXSwgZGNvbG9yWzJdXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB2YXIgbnVtX2xpbmVzID0gbGluZXMubGVuZ3RoO1xuICAgICAgICAgICAgZm9yICh2YXIgbG49MDsgbG4gPCBudW1fbGluZXM7IGxuKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbGluZTIgPSBsaW5lc1tsbl07XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwPTA7IHAgPCBsaW5lMi5sZW5ndGggLSAxOyBwKyspIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUG9pbnQgQSB0byBCXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYSA9IGxpbmUyW3BdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGIgPSBsaW5lMltwKzFdO1xuXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudmVydGV4X2xpbmVzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICBwYVswXSwgcGFbMV0sIHogKyAwLjAwMDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAwLCAwLCAxLCAwLCAwLCAxLjAsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYlswXSwgcGJbMV0sIHogKyAwLjAwMDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAwLCAwLCAxLCAwLCAwLCAxLjBcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHZlcnRleF9kYXRhO1xufTtcblxuLy8gQnVpbGQgYSBxdWFkIGNlbnRlcmVkIG9uIGEgcG9pbnRcbkdMQnVpbGRlcnMuYnVpbGRRdWFkcyA9IGZ1bmN0aW9uIEdMQnVpbGRlcnNCdWlsZFF1YWRzIChwb2ludHMsIHdpZHRoLCBoZWlnaHQsIGFkZEdlb21ldHJ5LCBvcHRpb25zKVxue1xuICAgIHZhciBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHZhciBudW1fcG9pbnRzID0gcG9pbnRzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBwPTA7IHAgPCBudW1fcG9pbnRzOyBwKyspIHtcbiAgICAgICAgdmFyIHBvaW50ID0gcG9pbnRzW3BdO1xuXG4gICAgICAgIHZhciBwb3NpdGlvbnMgPSBbXG4gICAgICAgICAgICBbcG9pbnRbMF0gLSB3aWR0aC8yLCBwb2ludFsxXSAtIGhlaWdodC8yXSxcbiAgICAgICAgICAgIFtwb2ludFswXSArIHdpZHRoLzIsIHBvaW50WzFdIC0gaGVpZ2h0LzJdLFxuICAgICAgICAgICAgW3BvaW50WzBdICsgd2lkdGgvMiwgcG9pbnRbMV0gKyBoZWlnaHQvMl0sXG5cbiAgICAgICAgICAgIFtwb2ludFswXSAtIHdpZHRoLzIsIHBvaW50WzFdIC0gaGVpZ2h0LzJdLFxuICAgICAgICAgICAgW3BvaW50WzBdICsgd2lkdGgvMiwgcG9pbnRbMV0gKyBoZWlnaHQvMl0sXG4gICAgICAgICAgICBbcG9pbnRbMF0gLSB3aWR0aC8yLCBwb2ludFsxXSArIGhlaWdodC8yXSxcbiAgICAgICAgXTtcblxuICAgICAgICBpZiAob3B0aW9ucy50ZXhjb29yZHMgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdmFyIHRleGNvb3JkcyA9IFtcbiAgICAgICAgICAgICAgICBbLTEsIC0xXSxcbiAgICAgICAgICAgICAgICBbMSwgLTFdLFxuICAgICAgICAgICAgICAgIFsxLCAxXSxcblxuICAgICAgICAgICAgICAgIFstMSwgLTFdLFxuICAgICAgICAgICAgICAgIFsxLCAxXSxcbiAgICAgICAgICAgICAgICBbLTEsIDFdXG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHZlcnRpY2VzID0ge1xuICAgICAgICAgICAgcG9zaXRpb25zOiBwb3NpdGlvbnMsXG4gICAgICAgICAgICB0ZXhjb29yZHM6IChvcHRpb25zLnRleGNvb3JkcyAmJiB0ZXhjb29yZHMpXG4gICAgICAgIH07XG4gICAgICAgIGFkZEdlb21ldHJ5KHZlcnRpY2VzKTtcbiAgICB9XG59O1xuXG4vLyBCdWlsZCBuYXRpdmUgR0wgbGluZXMgZm9yIGEgcG9seWxpbmVcbkdMQnVpbGRlcnMuYnVpbGRMaW5lcyA9IGZ1bmN0aW9uIEdMQnVpbGRlcnNCdWlsZExpbmVzIChsaW5lcywgZmVhdHVyZSwgbGF5ZXIsIHN0eWxlLCB0aWxlLCB6LCB2ZXJ0ZXhfZGF0YSwgb3B0aW9ucylcbntcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHZhciBjb2xvciA9IHN0eWxlLmNvbG9yO1xuICAgIHZhciB3aWR0aCA9IHN0eWxlLndpZHRoO1xuXG4gICAgdmFyIG51bV9saW5lcyA9IGxpbmVzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBsbj0wOyBsbiA8IG51bV9saW5lczsgbG4rKykge1xuICAgICAgICB2YXIgbGluZSA9IGxpbmVzW2xuXTtcblxuICAgICAgICBmb3IgKHZhciBwPTA7IHAgPCBsaW5lLmxlbmd0aCAtIDE7IHArKykge1xuICAgICAgICAgICAgLy8gUG9pbnQgQSB0byBCXG4gICAgICAgICAgICB2YXIgcGEgPSBsaW5lW3BdO1xuICAgICAgICAgICAgdmFyIHBiID0gbGluZVtwKzFdO1xuXG4gICAgICAgICAgICB2ZXJ0ZXhfZGF0YS5wdXNoKFxuICAgICAgICAgICAgICAgIC8vIFBvaW50IEFcbiAgICAgICAgICAgICAgICBwYVswXSwgcGFbMV0sIHosXG4gICAgICAgICAgICAgICAgMCwgMCwgMSwgLy8gZmxhdCBzdXJmYWNlcyBwb2ludCBzdHJhaWdodCB1cFxuICAgICAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sXG4gICAgICAgICAgICAgICAgLy8gUG9pbnQgQlxuICAgICAgICAgICAgICAgIHBiWzBdLCBwYlsxXSwgeixcbiAgICAgICAgICAgICAgICAwLCAwLCAxLCAvLyBmbGF0IHN1cmZhY2VzIHBvaW50IHN0cmFpZ2h0IHVwXG4gICAgICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gdmVydGV4X2RhdGE7XG59O1xuXG4vKiBVdGlsaXR5IGZ1bmN0aW9ucyAqL1xuXG4vLyBUZXN0cyBpZiBhIGxpbmUgc2VnbWVudCAoZnJvbSBwb2ludCBBIHRvIEIpIGlzIG5lYXJseSBjb2luY2lkZW50IHdpdGggdGhlIGVkZ2Ugb2YgYSB0aWxlXG5HTEJ1aWxkZXJzLmlzT25UaWxlRWRnZSA9IGZ1bmN0aW9uIChwYSwgcGIsIG9wdGlvbnMpXG57XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICB2YXIgdG9sZXJhbmNlX2Z1bmN0aW9uID0gb3B0aW9ucy50b2xlcmFuY2VfZnVuY3Rpb24gfHwgR0xCdWlsZGVycy52YWx1ZXNXaXRoaW5Ub2xlcmFuY2U7XG4gICAgdmFyIHRvbGVyYW5jZSA9IG9wdGlvbnMudG9sZXJhbmNlIHx8IDE7IC8vIHR3ZWFrIHRoaXMgYWRqdXN0IGlmIGNhdGNoaW5nIHRvbyBmZXcvbWFueSBsaW5lIHNlZ21lbnRzIG5lYXIgdGlsZSBlZGdlc1xuICAgIHZhciB0aWxlX21pbiA9IEdMQnVpbGRlcnMudGlsZV9ib3VuZHNbMF07XG4gICAgdmFyIHRpbGVfbWF4ID0gR0xCdWlsZGVycy50aWxlX2JvdW5kc1sxXTtcbiAgICB2YXIgZWRnZSA9IG51bGw7XG5cbiAgICBpZiAodG9sZXJhbmNlX2Z1bmN0aW9uKHBhWzBdLCB0aWxlX21pbi54LCB0b2xlcmFuY2UpICYmIHRvbGVyYW5jZV9mdW5jdGlvbihwYlswXSwgdGlsZV9taW4ueCwgdG9sZXJhbmNlKSkge1xuICAgICAgICBlZGdlID0gJ2xlZnQnO1xuICAgIH1cbiAgICBlbHNlIGlmICh0b2xlcmFuY2VfZnVuY3Rpb24ocGFbMF0sIHRpbGVfbWF4LngsIHRvbGVyYW5jZSkgJiYgdG9sZXJhbmNlX2Z1bmN0aW9uKHBiWzBdLCB0aWxlX21heC54LCB0b2xlcmFuY2UpKSB7XG4gICAgICAgIGVkZ2UgPSAncmlnaHQnO1xuICAgIH1cbiAgICBlbHNlIGlmICh0b2xlcmFuY2VfZnVuY3Rpb24ocGFbMV0sIHRpbGVfbWluLnksIHRvbGVyYW5jZSkgJiYgdG9sZXJhbmNlX2Z1bmN0aW9uKHBiWzFdLCB0aWxlX21pbi55LCB0b2xlcmFuY2UpKSB7XG4gICAgICAgIGVkZ2UgPSAndG9wJztcbiAgICB9XG4gICAgZWxzZSBpZiAodG9sZXJhbmNlX2Z1bmN0aW9uKHBhWzFdLCB0aWxlX21heC55LCB0b2xlcmFuY2UpICYmIHRvbGVyYW5jZV9mdW5jdGlvbihwYlsxXSwgdGlsZV9tYXgueSwgdG9sZXJhbmNlKSkge1xuICAgICAgICBlZGdlID0gJ2JvdHRvbSc7XG4gICAgfVxuICAgIHJldHVybiBlZGdlO1xufTtcblxuR0xCdWlsZGVycy5zZXRUaWxlU2NhbGUgPSBmdW5jdGlvbiAoc2NhbGUpXG57XG4gICAgR0xCdWlsZGVycy50aWxlX2JvdW5kcyA9IFtcbiAgICAgICAgUG9pbnQoMCwgMCksXG4gICAgICAgIFBvaW50KHNjYWxlLCAtc2NhbGUpIC8vIFRPRE86IGNvcnJlY3QgZm9yIGZsaXBwZWQgeS1heGlzP1xuICAgIF07XG59O1xuXG5HTEJ1aWxkZXJzLnZhbHVlc1dpdGhpblRvbGVyYW5jZSA9IGZ1bmN0aW9uIChhLCBiLCB0b2xlcmFuY2UpXG57XG4gICAgdG9sZXJhbmNlID0gdG9sZXJhbmNlIHx8IDE7XG4gICAgcmV0dXJuIChNYXRoLmFicyhhIC0gYikgPCB0b2xlcmFuY2UpO1xufTtcblxuLy8gQnVpbGQgYSB6aWd6YWcgbGluZSBwYXR0ZXJuIGZvciB0ZXN0aW5nIGpvaW5zIGFuZCBjYXBzXG5HTEJ1aWxkZXJzLmJ1aWxkWmlnemFnTGluZVRlc3RQYXR0ZXJuID0gZnVuY3Rpb24gKClcbntcbiAgICB2YXIgbWluID0gUG9pbnQoMCwgMCk7IC8vIHRpbGUubWluO1xuICAgIHZhciBtYXggPSBQb2ludCg0MDk2LCA0MDk2KTsgLy8gdGlsZS5tYXg7XG4gICAgdmFyIGcgPSB7XG4gICAgICAgIGlkOiAxMjMsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgICAgICAgICBjb29yZGluYXRlczogW1xuICAgICAgICAgICAgICAgIFttaW4ueCAqIDAuNzUgKyBtYXgueCAqIDAuMjUsIG1pbi55ICogMC43NSArIG1heC55ICogMC4yNV0sXG4gICAgICAgICAgICAgICAgW21pbi54ICogMC43NSArIG1heC54ICogMC4yNSwgbWluLnkgKiAwLjUgKyBtYXgueSAqIDAuNV0sXG4gICAgICAgICAgICAgICAgW21pbi54ICogMC4yNSArIG1heC54ICogMC43NSwgbWluLnkgKiAwLjc1ICsgbWF4LnkgKiAwLjI1XSxcbiAgICAgICAgICAgICAgICBbbWluLnggKiAwLjI1ICsgbWF4LnggKiAwLjc1LCBtaW4ueSAqIDAuMjUgKyBtYXgueSAqIDAuNzVdLFxuICAgICAgICAgICAgICAgIFttaW4ueCAqIDAuNCArIG1heC54ICogMC42LCBtaW4ueSAqIDAuNSArIG1heC55ICogMC41XSxcbiAgICAgICAgICAgICAgICBbbWluLnggKiAwLjUgKyBtYXgueCAqIDAuNSwgbWluLnkgKiAwLjI1ICsgbWF4LnkgKiAwLjc1XSxcbiAgICAgICAgICAgICAgICBbbWluLnggKiAwLjc1ICsgbWF4LnggKiAwLjI1LCBtaW4ueSAqIDAuMjUgKyBtYXgueSAqIDAuNzVdLFxuICAgICAgICAgICAgICAgIFttaW4ueCAqIDAuNzUgKyBtYXgueCAqIDAuMjUsIG1pbi55ICogMC40ICsgbWF4LnkgKiAwLjZdXG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIGtpbmQ6ICdkZWJ1ZydcbiAgICAgICAgfVxuICAgIH07XG4gICAgLy8gY29uc29sZS5sb2coZy5nZW9tZXRyeS5jb29yZGluYXRlcyk7XG4gICAgcmV0dXJuIGc7XG59O1xuXG5pZiAobW9kdWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEdMQnVpbGRlcnM7XG59XG4iLCIvKioqIE1hbmFnZSByZW5kZXJpbmcgZm9yIHByaW1pdGl2ZXMgKioqL1xudmFyIEdMID0gcmVxdWlyZSgnLi9nbC5qcycpO1xuXG4vLyBBdHRyaWJzIGFyZSBhbiBhcnJheSwgaW4gbGF5b3V0IG9yZGVyLCBvZjogbmFtZSwgc2l6ZSwgdHlwZSwgbm9ybWFsaXplZFxuLy8gZXg6IHsgbmFtZTogJ3Bvc2l0aW9uJywgc2l6ZTogMywgdHlwZTogZ2wuRkxPQVQsIG5vcm1hbGl6ZWQ6IGZhbHNlIH1cbmZ1bmN0aW9uIEdMR2VvbWV0cnkgKGdsLCBnbF9wcm9ncmFtLCB2ZXJ0ZXhfZGF0YSwgYXR0cmlicywgb3B0aW9ucylcbntcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHRoaXMuZ2wgPSBnbDtcbiAgICB0aGlzLmdsX3Byb2dyYW0gPSBnbF9wcm9ncmFtO1xuICAgIHRoaXMuYXR0cmlicyA9IGF0dHJpYnM7XG4gICAgdGhpcy52ZXJ0ZXhfZGF0YSA9IHZlcnRleF9kYXRhOyAvLyBGbG9hdDMyQXJyYXlcbiAgICB0aGlzLmJ1ZmZlciA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgdGhpcy5kcmF3X21vZGUgPSBvcHRpb25zLmRyYXdfbW9kZSB8fCB0aGlzLmdsLlRSSUFOR0xFUztcbiAgICB0aGlzLmRhdGFfdXNhZ2UgPSBvcHRpb25zLmRhdGFfdXNhZ2UgfHwgdGhpcy5nbC5TVEFUSUNfRFJBVztcblxuICAgIC8vIENhbGMgdmVydGV4IHN0cmlkZVxuICAgIHRoaXMudmVydGV4X3N0cmlkZSA9IDA7XG4gICAgZm9yICh2YXIgYT0wOyBhIDwgdGhpcy5hdHRyaWJzLmxlbmd0aDsgYSsrKSB7XG4gICAgICAgIHZhciBhdHRyaWIgPSB0aGlzLmF0dHJpYnNbYV07XG5cbiAgICAgICAgYXR0cmliLmxvY2F0aW9uID0gdGhpcy5nbF9wcm9ncmFtLmF0dHJpYnV0ZShhdHRyaWIubmFtZSkubG9jYXRpb247XG4gICAgICAgIGF0dHJpYi5ieXRlX3NpemUgPSBhdHRyaWIuc2l6ZTtcblxuICAgICAgICBzd2l0Y2ggKGF0dHJpYi50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIHRoaXMuZ2wuRkxPQVQ6XG4gICAgICAgICAgICBjYXNlIHRoaXMuZ2wuSU5UOlxuICAgICAgICAgICAgY2FzZSB0aGlzLmdsLlVOU0lHTkVEX0lOVDpcbiAgICAgICAgICAgICAgICBhdHRyaWIuYnl0ZV9zaXplICo9IDQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHRoaXMuZ2wuU0hPUlQ6XG4gICAgICAgICAgICBjYXNlIHRoaXMuZ2wuVU5TSUdORURfU0hPUlQ6XG4gICAgICAgICAgICAgICAgYXR0cmliLmJ5dGVfc2l6ZSAqPSAyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgYXR0cmliLm9mZnNldCA9IHRoaXMudmVydGV4X3N0cmlkZTtcbiAgICAgICAgdGhpcy52ZXJ0ZXhfc3RyaWRlICs9IGF0dHJpYi5ieXRlX3NpemU7XG4gICAgfVxuXG4gICAgdGhpcy52ZXJ0ZXhfY291bnQgPSB0aGlzLnZlcnRleF9kYXRhLmJ5dGVMZW5ndGggLyB0aGlzLnZlcnRleF9zdHJpZGU7XG5cbiAgICB0aGlzLnZhbyA9IEdMLlZlcnRleEFycmF5T2JqZWN0LmNyZWF0ZShmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmJ1ZmZlcik7XG4gICAgICAgIHRoaXMuc2V0dXAoKTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLnZlcnRleF9kYXRhLCB0aGlzLmRhdGFfdXNhZ2UpO1xufVxuXG5HTEdlb21ldHJ5LnByb3RvdHlwZS5zZXR1cCA9IGZ1bmN0aW9uICgpXG57XG4gICAgZm9yICh2YXIgYT0wOyBhIDwgdGhpcy5hdHRyaWJzLmxlbmd0aDsgYSsrKSB7XG4gICAgICAgIHZhciBhdHRyaWIgPSB0aGlzLmF0dHJpYnNbYV07XG4gICAgICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoYXR0cmliLmxvY2F0aW9uKTtcbiAgICAgICAgdGhpcy5nbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dHJpYi5sb2NhdGlvbiwgYXR0cmliLnNpemUsIGF0dHJpYi50eXBlLCBhdHRyaWIubm9ybWFsaXplZCwgdGhpcy52ZXJ0ZXhfc3RyaWRlLCBhdHRyaWIub2Zmc2V0KTtcbiAgICB9XG59O1xuXG5HTEdlb21ldHJ5LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKVxue1xuICAgIHRoaXMuZ2wudXNlUHJvZ3JhbSh0aGlzLmdsX3Byb2dyYW0ucHJvZ3JhbSk7XG4gICAgR0wuVmVydGV4QXJyYXlPYmplY3QuYmluZCh0aGlzLnZhbyk7XG5cbiAgICBpZiAodHlwZW9mIHRoaXMuX3JlbmRlciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlcigpO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHN1cHBvcnQgZWxlbWVudCBhcnJheSBtb2RlXG4gICAgdGhpcy5nbC5kcmF3QXJyYXlzKHRoaXMuZHJhd19tb2RlLCAwLCB0aGlzLnZlcnRleF9jb3VudCk7XG4gICAgR0wuVmVydGV4QXJyYXlPYmplY3QuYmluZChudWxsKTtcbn07XG5cbkdMR2VvbWV0cnkucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKVxue1xuICAgIGNvbnNvbGUubG9nKFwiR0xHZW9tZXRyeS5kZXN0cm95OiBkZWxldGUgYnVmZmVyIG9mIHNpemUgXCIgKyB0aGlzLnZlcnRleF9kYXRhLmJ5dGVMZW5ndGgpO1xuICAgIHRoaXMuZ2wuZGVsZXRlQnVmZmVyKHRoaXMuYnVmZmVyKTtcbiAgICBkZWxldGUgdGhpcy52ZXJ0ZXhfZGF0YTtcbn07XG5cbi8vIERyYXdzIGEgc2V0IG9mIHRyaWFuZ2xlc1xuR0xUcmlhbmdsZXMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHTEdlb21ldHJ5LnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIEdMVHJpYW5nbGVzIChnbCwgZ2xfcHJvZ3JhbSwgdmVydGV4X2RhdGEpXG57XG4gICAgR0xHZW9tZXRyeS5jYWxsKHRoaXMsIGdsLCBnbF9wcm9ncmFtLCB2ZXJ0ZXhfZGF0YSwgW1xuICAgICAgICB7IG5hbWU6ICdhX3Bvc2l0aW9uJywgc2l6ZTogMywgdHlwZTogZ2wuRkxPQVQsIG5vcm1hbGl6ZWQ6IGZhbHNlIH0sXG4gICAgICAgIHsgbmFtZTogJ2Ffbm9ybWFsJywgc2l6ZTogMywgdHlwZTogZ2wuRkxPQVQsIG5vcm1hbGl6ZWQ6IGZhbHNlIH0sXG4gICAgICAgIHsgbmFtZTogJ2FfY29sb3InLCBzaXplOiAzLCB0eXBlOiBnbC5GTE9BVCwgbm9ybWFsaXplZDogZmFsc2UgfSxcbiAgICAgICAgeyBuYW1lOiAnYV9sYXllcicsIHNpemU6IDEsIHR5cGU6IGdsLkZMT0FULCBub3JtYWxpemVkOiBmYWxzZSB9XG4gICAgXSk7XG4gICAgdGhpcy5nZW9tZXRyeV9jb3VudCA9IHRoaXMudmVydGV4X2NvdW50IC8gMztcbn1cblxuLy8gRHJhd3MgYSBzZXQgb2YgcG9pbnRzIGFzIHF1YWRzLCBpbnRlbmRlZCB0byBiZSByZW5kZXJlZCBhcyBkaXN0YW5jZSBmaWVsZHNcbkdMUG9seVBvaW50cy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdMR2VvbWV0cnkucHJvdG90eXBlKTtcblxuZnVuY3Rpb24gR0xQb2x5UG9pbnRzIChnbCwgZ2xfcHJvZ3JhbSwgdmVydGV4X2RhdGEpXG57XG4gICAgR0xHZW9tZXRyeS5jYWxsKHRoaXMsIGdsLCBnbF9wcm9ncmFtLCB2ZXJ0ZXhfZGF0YSwgW1xuICAgICAgICB7IG5hbWU6ICdhX3Bvc2l0aW9uJywgc2l6ZTogMywgdHlwZTogZ2wuRkxPQVQsIG5vcm1hbGl6ZWQ6IGZhbHNlIH0sXG4gICAgICAgIHsgbmFtZTogJ2FfdGV4Y29vcmQnLCBzaXplOiAyLCB0eXBlOiBnbC5GTE9BVCwgbm9ybWFsaXplZDogZmFsc2UgfSxcbiAgICAgICAgeyBuYW1lOiAnYV9jb2xvcicsIHNpemU6IDMsIHR5cGU6IGdsLkZMT0FULCBub3JtYWxpemVkOiBmYWxzZSB9LFxuICAgICAgICB7IG5hbWU6ICdhX2xheWVyJywgc2l6ZTogMSwgdHlwZTogZ2wuRkxPQVQsIG5vcm1hbGl6ZWQ6IGZhbHNlIH1cbiAgICBdKTtcbiAgICB0aGlzLmdlb21ldHJ5X2NvdW50ID0gdGhpcy52ZXJ0ZXhfY291bnQgLyAzO1xufVxuXG4vLyBEcmF3cyBhIHNldCBvZiBsaW5lc1xuLy8gU2hhcmVzIGFsbCBjaGFyYWN0ZXJpc3RpY3Mgd2l0aCB0cmlhbmdsZXMgZXhjZXB0IGZvciBkcmF3IG1vZGVcbkdMTGluZXMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHTFRyaWFuZ2xlcy5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBHTExpbmVzIChnbCwgZ2xfcHJvZ3JhbSwgdmVydGV4X2RhdGEsIG9wdGlvbnMpXG57XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgR0xUcmlhbmdsZXMuY2FsbCh0aGlzLCBnbCwgcHJvZ3JhbSwgdmVydGV4X2RhdGEpO1xuICAgIHRoaXMuZHJhd19tb2RlID0gdGhpcy5nbC5MSU5FUztcbiAgICB0aGlzLmxpbmVfd2lkdGggPSBvcHRpb25zLmxpbmVfd2lkdGggfHwgMjtcbiAgICB0aGlzLmdlb21ldHJ5X2NvdW50ID0gdGhpcy52ZXJ0ZXhfY291bnQgLyAyO1xufVxuXG5HTExpbmVzLnByb3RvdHlwZS5fcmVuZGVyID0gZnVuY3Rpb24gKClcbntcbiAgICB0aGlzLmdsLmxpbmVXaWR0aCh0aGlzLmxpbmVfd2lkdGgpO1xuICAgIGlmICh0eXBlb2YgR0xUcmlhbmdsZXMucHJvdG90eXBlLl9yZW5kZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBHTFRyaWFuZ2xlcy5wcm90b3R5cGUuX3JlbmRlci5jYWxsKHRoaXMpO1xuICAgIH1cbn07XG5cbmlmIChtb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuICAgIG1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgICBHTEdlb21ldHJ5OiBHTEdlb21ldHJ5LFxuICAgICAgICBHTFRyaWFuZ2xlczogR0xUcmlhbmdsZXMsXG4gICAgICAgIEdMUG9seVBvaW50czogR0xQb2x5UG9pbnRzLFxuICAgICAgICBHTExpbmVzOiBHTExpbmVzXG4gICAgfTtcbn1cbiIsInZhciBQb2ludCA9IHJlcXVpcmUoJy4uL3BvaW50LmpzJyk7XG52YXIgR2VvID0gcmVxdWlyZSgnLi4vZ2VvLmpzJyk7XG52YXIgVmVjdG9yUmVuZGVyZXIgPSByZXF1aXJlKCcuLi92ZWN0b3JfcmVuZGVyZXIuanMnKTtcblxudmFyIEdMID0gcmVxdWlyZSgnLi9nbC5qcycpO1xudmFyIEdMQnVpbGRlcnMgPSByZXF1aXJlKCcuL2dsX2J1aWxkZXJzLmpzJyk7XG52YXIgR0xHZW9tZXRyeSA9IHJlcXVpcmUoJy4vZ2xfZ2VvbS5qcycpLkdMR2VvbWV0cnk7XG52YXIgR0xUcmlhbmdsZXMgPSByZXF1aXJlKCcuL2dsX2dlb20uanMnKS5HTFRyaWFuZ2xlcztcbnZhciBHTFBvbHlQb2ludHMgPSByZXF1aXJlKCcuL2dsX2dlb20uanMnKS5HTFBvbHlQb2ludHM7XG52YXIgR0xMaW5lcyA9IHJlcXVpcmUoJy4vZ2xfZ2VvbS5qcycpLkdMTGluZXM7XG5cbnZhciBtYXQ0ID0gcmVxdWlyZSgnZ2wtbWF0cml4JykubWF0NDtcbnZhciB2ZWMzID0gcmVxdWlyZSgnZ2wtbWF0cml4JykudmVjMztcblxuVmVjdG9yUmVuZGVyZXIuR0xSZW5kZXJlciA9IEdMUmVuZGVyZXI7XG5HTFJlbmRlcmVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVmVjdG9yUmVuZGVyZXIucHJvdG90eXBlKTtcbkdMUmVuZGVyZXIuZGVidWcgPSBmYWxzZTtcblxuR0xSZW5kZXJlci5zaGFkZXJfc291cmNlcyA9IHJlcXVpcmUoJy4vZ2xfc2hhZGVycy5qcycpO1xuXG5mdW5jdGlvbiBHTFJlbmRlcmVyICh0aWxlX3NvdXJjZSwgbGF5ZXJzLCBzdHlsZXMsIG9wdGlvbnMpXG57XG4gICAgdmFyIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgVmVjdG9yUmVuZGVyZXIuY2FsbCh0aGlzLCAnR0xSZW5kZXJlcicsIHRpbGVfc291cmNlLCBsYXllcnMsIHN0eWxlcywgb3B0aW9ucyk7XG5cbiAgICBHTEJ1aWxkZXJzLnNldFRpbGVTY2FsZShWZWN0b3JSZW5kZXJlci50aWxlX3NjYWxlKTtcbiAgICBHTC5Qcm9ncmFtLmRlZmluZXMuVElMRV9TQ0FMRSA9IFZlY3RvclJlbmRlcmVyLnRpbGVfc2NhbGUgKyAnLjAnO1xuXG4gICAgdGhpcy5jb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lcjtcbiAgICB0aGlzLmNvbnRpbnVvdXNfYW5pbWF0aW9uID0gZmFsc2U7IC8vIHJlcXVlc3QgcmVkcmF3IGV2ZXJ5IGZyYW1lXG59XG5cbkdMUmVuZGVyZXIucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24gR0xSZW5kZXJlckluaXQgKClcbntcbiAgICB0aGlzLmNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyIHx8IGRvY3VtZW50LmJvZHk7XG4gICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICB0aGlzLmNhbnZhcy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgdGhpcy5jYW52YXMuc3R5bGUudG9wID0gMDtcbiAgICB0aGlzLmNhbnZhcy5zdHlsZS5sZWZ0ID0gMDtcbiAgICB0aGlzLmNhbnZhcy5zdHlsZS56SW5kZXggPSAtMTtcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cbiAgICB0aGlzLmdsID0gR0wuZ2V0Q29udGV4dCh0aGlzLmNhbnZhcyk7XG5cbiAgICB2YXIgcmVuZGVyZXIgPSB0aGlzO1xuXG4gICAgdGhpcy5yZW5kZXJfbW9kZXMgPSB7XG4gICAgICAgICdwb2x5Z29ucyc6IHtcbiAgICAgICAgICAgIGdsX3Byb2dyYW06IG5ldyBHTC5Qcm9ncmFtKHRoaXMuZ2wsIEdMUmVuZGVyZXIuc2hhZGVyX3NvdXJjZXNbJ3BvbHlnb25fdmVydGV4J10sIEdMUmVuZGVyZXIuc2hhZGVyX3NvdXJjZXNbJ3BvbHlnb25fZnJhZ21lbnQnXSksXG4gICAgICAgICAgICBtYWtlR0xHZW9tZXRyeTogZnVuY3Rpb24gKHZlcnRleF9kYXRhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBHTFRyaWFuZ2xlcyhyZW5kZXJlci5nbCwgdGhpcy5nbF9wcm9ncmFtLCB2ZXJ0ZXhfZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgICdwb2x5Z29uc19ub2lzZSc6IHtcbiAgICAgICAgICAgIGdsX3Byb2dyYW06IG5ldyBHTC5Qcm9ncmFtKHRoaXMuZ2wsIEdMUmVuZGVyZXIuc2hhZGVyX3NvdXJjZXNbJ3BvbHlnb25fdmVydGV4J10sIEdMUmVuZGVyZXIuc2hhZGVyX3NvdXJjZXNbJ3BvbHlnb25fZnJhZ21lbnQnXSwgeyBkZWZpbmVzOiB7ICdFRkZFQ1RfTk9JU0VfVEVYVFVSRSc6IHRydWUsICdFRkZFQ1RfTk9JU0VfQU5JTUFUQUJMRSc6IHRydWUgfSB9KSxcbiAgICAgICAgICAgIG1ha2VHTEdlb21ldHJ5OiBmdW5jdGlvbiAodmVydGV4X2RhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEdMVHJpYW5nbGVzKHJlbmRlcmVyLmdsLCB0aGlzLmdsX3Byb2dyYW0sIHZlcnRleF9kYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ3BvaW50cyc6IHtcbiAgICAgICAgICAgIC8vIFRPRE86IHJlcGxhY2UgcmVsYXRpdmUgc2hhZGVyIHBhdGhzIHdpdGggYSBiZXR0ZXIgYXV0by1wYXRoaW5nIHN5c3RlbVxuICAgICAgICAgICAgLy8gZ2xfcHJvZ3JhbTogbmV3IEdMLlByb2dyYW0uY3JlYXRlUHJvZ3JhbUZyb21VUkxzKHRoaXMuZ2wsIFZlY3RvclJlbmRlcmVyLmxpYnJhcnlfYmFzZV91cmwgKyAnLi4vc2hhZGVycy9wb2ludF92ZXJ0ZXguZ2xzbCcsIFZlY3RvclJlbmRlcmVyLmxpYnJhcnlfYmFzZV91cmwgKyAnLi4vc2hhZGVycy9wb2ludF9mcmFnbWVudC5nbHNsJywgeyBkZWZpbmVzOiB7ICdFRkZFQ1RfU0NSRUVOX0NPTE9SJzogdHJ1ZSB9IH0pLFxuICAgICAgICAgICAgZ2xfcHJvZ3JhbTogbmV3IEdMLlByb2dyYW0odGhpcy5nbCwgR0xSZW5kZXJlci5zaGFkZXJfc291cmNlc1sncG9pbnRfdmVydGV4J10sIEdMUmVuZGVyZXIuc2hhZGVyX3NvdXJjZXNbJ3BvaW50X2ZyYWdtZW50J10sIHsgZGVmaW5lczogeyAnRUZGRUNUX1NDUkVFTl9DT0xPUic6IHRydWUgfSB9KSxcbiAgICAgICAgICAgIG1ha2VHTEdlb21ldHJ5OiBmdW5jdGlvbiAodmVydGV4X2RhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEdMUG9seVBvaW50cyhyZW5kZXJlci5nbCwgdGhpcy5nbF9wcm9ncmFtLCB2ZXJ0ZXhfZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5yZXNpemVNYXAodGhpcy5jb250YWluZXIuY2xpZW50V2lkdGgsIHRoaXMuY29udGFpbmVyLmNsaWVudEhlaWdodCk7XG5cbiAgICAvLyB0aGlzLnpvb21fc3RlcCA9IDAuMDI7IC8vIGZvciBmcmFjdGlvbmFsIHpvb20gdXNlciBhZGp1c3RtZW50XG4gICAgdGhpcy5zdGFydF90aW1lID0gK25ldyBEYXRlKCk7XG4gICAgdGhpcy5sYXN0X3JlbmRlcl9jb3VudCA9IG51bGw7XG4gICAgdGhpcy5pbml0SW5wdXRIYW5kbGVycygpO1xufTtcblxuLy8gRGV0ZXJtaW5lIGEgWiB2YWx1ZSB0aGF0IHdpbGwgc3RhY2sgZmVhdHVyZXMgaW4gYSBcInBhaW50ZXIncyBhbGdvcml0aG1cIiBzdHlsZSwgZmlyc3QgYnkgbGF5ZXIsIHRoZW4gYnkgZHJhdyBvcmRlciB3aXRoaW4gbGF5ZXJcbi8vIEZlYXR1cmVzIGFyZSBhc3N1bWVkIHRvIGJlIGFscmVhZHkgc29ydGVkIGluIGRlc2lyZWQgZHJhdyBvcmRlciBieSB0aGUgbGF5ZXIgcHJlLXByb2Nlc3NvclxuR0xSZW5kZXJlci5jYWxjdWxhdGVaID0gZnVuY3Rpb24gKGxheWVyLCB0aWxlLCBsYXllcl9vZmZzZXQsIGZlYXR1cmVfb2Zmc2V0KVxue1xuICAgIC8vIHZhciBsYXllcl9vZmZzZXQgPSBsYXllcl9vZmZzZXQgfHwgMDtcbiAgICAvLyB2YXIgZmVhdHVyZV9vZmZzZXQgPSBmZWF0dXJlX29mZnNldCB8fCAwO1xuICAgIHZhciB6ID0gMDsgLy8gVE9ETzogbWFkZSB0aGlzIGEgbm8tb3AgdW50aWwgcmV2aXNpdGluZyB3aGVyZSBpdCBzaG91bGQgbGl2ZSAtIG9uZS10aW1lIGNhbGMgaGVyZSwgaW4gdmVydGV4IGxheW91dC9zaGFkZXIsIGV0Yy5cbiAgICByZXR1cm4gejtcbn07XG5cbi8vIFByb2Nlc3MgZ2VvbWV0cnkgZm9yIHRpbGUgLSBjYWxsZWQgYnkgd2ViIHdvcmtlclxuR0xSZW5kZXJlci5hZGRUaWxlID0gZnVuY3Rpb24gKHRpbGUsIGxheWVycywgc3R5bGVzKVxue1xuICAgIHZhciBsYXllciwgc3R5bGUsIGZlYXR1cmUsIHosIG1vZGU7XG4gICAgdmFyIHZlcnRleF9kYXRhID0ge307XG5cbiAgICAvLyBKb2luIGxpbmUgdGVzdCBwYXR0ZXJuXG4gICAgLy8gaWYgKEdMUmVuZGVyZXIuZGVidWcpIHtcbiAgICAvLyAgICAgdGlsZS5sYXllcnNbJ3JvYWRzJ10uZmVhdHVyZXMucHVzaChHTFJlbmRlcmVyLmJ1aWxkWmlnemFnTGluZVRlc3RQYXR0ZXJuKCkpO1xuICAgIC8vIH1cblxuICAgIC8vIEJ1aWxkIHJhdyBnZW9tZXRyeSBhcnJheXNcbiAgICB0aWxlLmRlYnVnLmZlYXR1cmVzID0gMDtcbiAgICBmb3IgKHZhciBsbj0wOyBsbiA8IGxheWVycy5sZW5ndGg7IGxuKyspIHtcbiAgICAgICAgbGF5ZXIgPSBsYXllcnNbbG5dO1xuXG4gICAgICAgIC8vIFNraXAgbGF5ZXJzIHdpdGggbm8gc3R5bGVzIGRlZmluZWQsIG9yIGxheWVycyBzZXQgdG8gbm90IGJlIHZpc2libGVcbiAgICAgICAgaWYgKHN0eWxlc1tsYXllci5uYW1lXSA9PSBudWxsIHx8IHN0eWxlc1tsYXllci5uYW1lXS52aXNpYmxlID09IGZhbHNlKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aWxlLmxheWVyc1tsYXllci5uYW1lXSAhPSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgbnVtX2ZlYXR1cmVzID0gdGlsZS5sYXllcnNbbGF5ZXIubmFtZV0uZmVhdHVyZXMubGVuZ3RoO1xuXG4gICAgICAgICAgICAvLyBSZW5kZXJpbmcgcmV2ZXJzZSBvcmRlciBha2EgdG9wIHRvIGJvdHRvbVxuICAgICAgICAgICAgZm9yICh2YXIgZiA9IG51bV9mZWF0dXJlcy0xOyBmID49IDA7IGYtLSkge1xuICAgICAgICAgICAgICAgIGZlYXR1cmUgPSB0aWxlLmxheWVyc1tsYXllci5uYW1lXS5mZWF0dXJlc1tmXTtcbiAgICAgICAgICAgICAgICBzdHlsZSA9IFZlY3RvclJlbmRlcmVyLnBhcnNlU3R5bGVGb3JGZWF0dXJlKGZlYXR1cmUsIHN0eWxlc1tsYXllci5uYW1lXSwgdGlsZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBTa2lwIGZlYXR1cmU/XG4gICAgICAgICAgICAgICAgaWYgKHN0eWxlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgeiA9IEdMUmVuZGVyZXIuY2FsY3VsYXRlWihsYXllciwgdGlsZSkgKyBzdHlsZS56O1xuXG4gICAgICAgICAgICAgICAgLy8gRmlyc3QgZmVhdHVyZSBpbiB0aGlzIHJlbmRlciBtb2RlP1xuICAgICAgICAgICAgICAgIG1vZGUgPSBzdHlsZS5yZW5kZXJfbW9kZTtcbiAgICAgICAgICAgICAgICBpZiAodmVydGV4X2RhdGFbbW9kZV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhfZGF0YVttb2RlXSA9IFtdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIERFQlVHR0lORyBsaW5lL3RpbGUgaW50ZXJzZWN0aW9ucyByZXR1cm5lZCBhcyBwb2ludHNcbiAgICAgICAgICAgICAgICAvLyAjbWFwemVuLDQwLjc0NzMzMDExNTg5NjE3LC03My45NzUzNTE0NTI4Mjc0NywxN1xuICAgICAgICAgICAgICAgIC8vIGlmIChmZWF0dXJlLmlkID09IDE1Nzk2NDgxMyAmJiBmZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT0gJ1BvaW50Jykge1xuICAgICAgICAgICAgICAgIC8vICAgICBzdHlsZS5jb2xvciA9IFsxLCAxLCAwXTtcbiAgICAgICAgICAgICAgICAvLyAgICAgc3R5bGUuc2l6ZSA9IFN0eWxlLndpZHRoLnBpeGVscygxMCwgdGlsZSk7XG4gICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgdmFyIHZlcnRleF9jb25zdGFudHMgPSBbXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlLmNvbG9yWzBdLCBzdHlsZS5jb2xvclsxXSwgc3R5bGUuY29sb3JbMl0sXG4gICAgICAgICAgICAgICAgICAgIGxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IGFkZCBtYXRlcmlhbCBpbmZvLCBldGMuXG4gICAgICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgICAgIGlmIChzdHlsZS5vdXRsaW5lLmNvbG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvdXRsaW5lX3ZlcnRleF9jb25zdGFudHMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZS5vdXRsaW5lLmNvbG9yWzBdLCBzdHlsZS5vdXRsaW5lLmNvbG9yWzFdLCBzdHlsZS5vdXRsaW5lLmNvbG9yWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbG4gLSAwLjUgLy8gb3V0bGluZXMgc2l0IGJldHdlZW4gbGF5ZXJzLCB1bmRlcm5lYXRoIGN1cnJlbnQgbGF5ZXIgYnV0IGFib3ZlIHRoZSBvbmUgYmVsb3dcbiAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgcG9pbnRzID0gbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgbGluZXMgPSBudWxsLFxuICAgICAgICAgICAgICAgICAgICBwb2x5Z29ucyA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICBpZiAoZmVhdHVyZS5nZW9tZXRyeS50eXBlID09ICdQb2x5Z29uJykge1xuICAgICAgICAgICAgICAgICAgICBwb2x5Z29ucyA9IFtmZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZmVhdHVyZS5nZW9tZXRyeS50eXBlID09ICdNdWx0aVBvbHlnb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvbHlnb25zID0gZmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZmVhdHVyZS5nZW9tZXRyeS50eXBlID09ICdMaW5lU3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICBsaW5lcyA9IFtmZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZmVhdHVyZS5nZW9tZXRyeS50eXBlID09ICdNdWx0aUxpbmVTdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpbmVzID0gZmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZmVhdHVyZS5nZW9tZXRyeS50eXBlID09ICdQb2ludCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzID0gW2ZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXNdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChmZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT0gJ011bHRpUG9pbnQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvaW50cyA9IGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHBvbHlnb25zICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRXh0cnVkZWQgcG9seWdvbnMgKGUuZy4gM0QgYnVpbGRpbmdzKVxuICAgICAgICAgICAgICAgICAgICBpZiAoc3R5bGUuZXh0cnVkZSAmJiBzdHlsZS5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdMQnVpbGRlcnMuYnVpbGRFeHRydWRlZFBvbHlnb25zKHBvbHlnb25zLCB6LCBzdHlsZS5oZWlnaHQsIHN0eWxlLm1pbl9oZWlnaHQsIHZlcnRleF9kYXRhW21vZGVdLCB7IHZlcnRleF9jb25zdGFudHM6IHZlcnRleF9jb25zdGFudHMgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gUmVndWxhciBwb2x5Z29uc1xuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdMQnVpbGRlcnMuYnVpbGRQb2x5Z29ucyhwb2x5Z29ucywgeiwgdmVydGV4X2RhdGFbbW9kZV0sIHsgdmVydGV4X2NvbnN0YW50czogdmVydGV4X2NvbnN0YW50cyB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIHBvbHlnb25fdmVydGV4X2NvbnN0YW50cyA9IFt6LCAwLCAwLCAxXS5jb25jYXQodmVydGV4X2NvbnN0YW50cyk7IC8vIHVwd2FyZHMtZmFjaW5nIG5vcm1hbFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gR0xCdWlsZGVycy5idWlsZFBvbHlnb25zMihcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBwb2x5Z29ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBmdW5jdGlvbiAodmVydGljZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgR0wuYWRkVmVydGljZXModmVydGljZXMucG9zaXRpb25zLCB2ZXJ0ZXhfZGF0YVttb2RlXSwgcG9seWdvbl92ZXJ0ZXhfY29uc3RhbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyApO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUG9seWdvbiBvdXRsaW5lc1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3R5bGUub3V0bGluZS5jb2xvciAmJiBzdHlsZS5vdXRsaW5lLndpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBtcGM9MDsgbXBjIDwgcG9seWdvbnMubGVuZ3RoOyBtcGMrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdMQnVpbGRlcnMuYnVpbGRQb2x5bGluZXMocG9seWdvbnNbbXBjXSwgR0xSZW5kZXJlci5jYWxjdWxhdGVaKGxheWVyLCB0aWxlLCAtMC41KSwgc3R5bGUub3V0bGluZS53aWR0aCwgdmVydGV4X2RhdGFbbW9kZV0sIHsgY2xvc2VkX3BvbHlnb246IHRydWUsIHJlbW92ZV90aWxlX2VkZ2VzOiB0cnVlLCB2ZXJ0ZXhfY29uc3RhbnRzOiBvdXRsaW5lX3ZlcnRleF9jb25zdGFudHMgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobGluZXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBHTEJ1aWxkZXJzLmJ1aWxkUG9seWxpbmVzKGxpbmVzLCB6LCBzdHlsZS53aWR0aCwgdmVydGV4X2RhdGFbbW9kZV0sIHsgdmVydGV4X2NvbnN0YW50czogdmVydGV4X2NvbnN0YW50cyB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBMaW5lIG91dGxpbmVzXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdHlsZS5vdXRsaW5lLmNvbG9yICYmIHN0eWxlLm91dGxpbmUud2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEdMQnVpbGRlcnMuYnVpbGRQb2x5bGluZXMobGluZXMsIEdMUmVuZGVyZXIuY2FsY3VsYXRlWihsYXllciwgdGlsZSwgLTAuNSksIHN0eWxlLndpZHRoICsgMiAqIHN0eWxlLm91dGxpbmUud2lkdGgsIHZlcnRleF9kYXRhW21vZGVdLCB7IHZlcnRleF9jb25zdGFudHM6IG91dGxpbmVfdmVydGV4X2NvbnN0YW50cyB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChwb2ludHMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShmZWF0dXJlKSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IGFkZGluZyB0byB6IHRvIGV4cGVyaW1lbnQgd2l0aCBcImZsb2F0aW5nXCIgUE9Jc1xuICAgICAgICAgICAgICAgICAgICB2YXIgcG9pbnRfdmVydGV4X2NvbnN0YW50cyA9IFt6ICsgMSwgMCwgMCwgMV0uY29uY2F0KHZlcnRleF9jb25zdGFudHMpOyAvLyB1cHdhcmRzLWZhY2luZyBub3JtYWxcbiAgICAgICAgICAgICAgICAgICAgR0xCdWlsZGVycy5idWlsZFF1YWRzKFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzLCBzdHlsZS5zaXplICogMiwgc3R5bGUuc2l6ZSAqIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmVydGljZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdnMgPSB2ZXJ0aWNlcy5wb3NpdGlvbnM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBbHRlcm5hdGUgdmVydGV4IGxheW91dCBmb3IgJ3BvaW50cycgc2hhZGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1vZGUgPT0gJ3BvaW50cycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRfdmVydGV4X2NvbnN0YW50cyA9IHZlcnRleF9jb25zdGFudHM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgdiBpbiB2ZXJ0aWNlcy5wb3NpdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZzW3ZdID0gdmVydGljZXMucG9zaXRpb25zW3ZdLmNvbmNhdCh6KyAxLCB2ZXJ0aWNlcy50ZXhjb29yZHNbdl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR0wuYWRkVmVydGljZXModmVydGljZXMucG9zaXRpb25zLCB2ZXJ0ZXhfZGF0YVttb2RlXSwgcG9pbnRfdmVydGV4X2NvbnN0YW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgR0wuYWRkVmVydGljZXModnMsIHZlcnRleF9kYXRhW21vZGVdLCBwb2ludF92ZXJ0ZXhfY29uc3RhbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHRleGNvb3JkczogKG1vZGUgPT0gJ3BvaW50cycpIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aWxlLmRlYnVnLmZlYXR1cmVzKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aWxlLnZlcnRleF9kYXRhID0ge307XG4gICAgZm9yICh2YXIgcyBpbiB2ZXJ0ZXhfZGF0YSkge1xuICAgICAgICB0aWxlLnZlcnRleF9kYXRhW3NdID0gbmV3IEZsb2F0MzJBcnJheSh2ZXJ0ZXhfZGF0YVtzXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRpbGU7XG59O1xuXG4vLyBDYWxsZWQgb24gbWFpbiB0aHJlYWQgd2hlbiBhIHdlYiB3b3JrZXIgY29tcGxldGVzIHByb2Nlc3NpbmcgZm9yIGEgc2luZ2xlIHRpbGVcbkdMUmVuZGVyZXIucHJvdG90eXBlLl90aWxlV29ya2VyQ29tcGxldGVkID0gZnVuY3Rpb24gKHRpbGUpXG57XG4gICAgdmFyIHZlcnRleF9kYXRhID0gdGlsZS52ZXJ0ZXhfZGF0YTtcblxuICAgIC8vIENsZWFudXAgZXhpc3RpbmcgR0wgZ2VvbWV0cnkgb2JqZWN0c1xuICAgIHRoaXMuZnJlZVRpbGVSZXNvdXJjZXModGlsZSk7XG4gICAgdGlsZS5nbF9nZW9tZXRyeSA9IHt9O1xuXG4gICAgLy8gQ3JlYXRlIEdMIGdlb21ldHJ5IG9iamVjdHNcbiAgICBmb3IgKHZhciBzIGluIHZlcnRleF9kYXRhKSB7XG4gICAgICAgIHRpbGUuZ2xfZ2VvbWV0cnlbc10gPSB0aGlzLnJlbmRlcl9tb2Rlc1tzXS5tYWtlR0xHZW9tZXRyeSh2ZXJ0ZXhfZGF0YVtzXSk7XG4gICAgfVxuXG4gICAgdGlsZS5kZWJ1Zy5nZW9tZXRyaWVzID0gMDtcbiAgICB0aWxlLmRlYnVnLmJ1ZmZlcl9zaXplID0gMDtcbiAgICBmb3IgKHZhciBwIGluIHRpbGUuZ2xfZ2VvbWV0cnkpIHtcbiAgICAgICAgdGlsZS5kZWJ1Zy5nZW9tZXRyaWVzICs9IHRpbGUuZ2xfZ2VvbWV0cnlbcF0uZ2VvbWV0cnlfY291bnQ7XG4gICAgICAgIHRpbGUuZGVidWcuYnVmZmVyX3NpemUgKz0gdGlsZS5nbF9nZW9tZXRyeVtwXS52ZXJ0ZXhfZGF0YS5ieXRlTGVuZ3RoO1xuICAgIH1cblxuICAgIHRpbGUuZGVidWcuZ2VvbV9yYXRpbyA9ICh0aWxlLmRlYnVnLmdlb21ldHJpZXMgLyB0aWxlLmRlYnVnLmZlYXR1cmVzKS50b0ZpeGVkKDEpO1xuXG4gICAgLy8gU2VsZWN0aW9uIC0gZXhwZXJpbWVudGFsL2Z1dHVyZVxuICAgIC8vIHZhciBnbF9yZW5kZXJlciA9IHRoaXM7XG4gICAgLy8gdmFyIHBpeGVsID0gbmV3IFVpbnQ4QXJyYXkoNCk7XG4gICAgLy8gdGlsZURpdi5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIC8vICAgICAvLyBjb25zb2xlLmxvZyhldmVudC5vZmZzZXRYICsgJywgJyArIGV2ZW50Lm9mZnNldFkgKyAnIHwgJyArIHBhcnNlSW50KHRpbGVEaXYuc3R5bGUubGVmdCkgKyAnLCAnICsgcGFyc2VJbnRcbiAgICAvLyAgICAgdmFyIHAgPSBQb2ludChcbiAgICAvLyAgICAgICAgIGV2ZW50Lm9mZnNldFggKyBwYXJzZUludCh0aWxlRGl2LnN0eWxlLmxlZnQpLFxuICAgIC8vICAgICAgICAgZXZlbnQub2Zmc2V0WSArIHBhcnNlSW50KHRpbGVEaXYuc3R5bGUudG9wKVxuICAgIC8vICAgICApO1xuICAgIC8vICAgICBnbF9yZW5kZXJlci5nbC5yZWFkUGl4ZWxzKHAueCwgcC55LCAxLCAxLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBwaXhlbCk7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKHAueCArICcsICcgKyBwLnkgKyAnOiAoJyArIHBpeGVsWzBdICsgJywgJyArIHBpeGVsWzFdICsgJywgJyArIHBpeGVsWzJdICsgJywgJyArIHBpeGVsWzNdICsgJyknKVxuICAgIC8vIH07XG5cbiAgICBkZWxldGUgdGlsZS52ZXJ0ZXhfZGF0YTsgLy8gVE9ETzogbWlnaHQgd2FudCB0byBwcmVzZXJ2ZSB0aGlzIGZvciByZWJ1aWxkaW5nIGdlb21ldHJpZXMgd2hlbiBzdHlsZXMvZXRjLiBjaGFuZ2U/XG59O1xuXG5HTFJlbmRlcmVyLnByb3RvdHlwZS5yZW1vdmVUaWxlID0gZnVuY3Rpb24gR0xSZW5kZXJlclJlbW92ZVRpbGUgKGtleSlcbntcbiAgICBpZiAodGhpcy5tYXBfem9vbWluZyA9PSB0cnVlKSB7XG4gICAgICAgIHJldHVybjsgLy8gc2hvcnQgY2lyY3VpdCB0aWxlIHJlbW92YWwsIEdMIHJlbmRlcmVyIHdpbGwgc3dlZXAgb3V0IHRpbGVzIGJ5IHpvb20gbGV2ZWwgd2hlbiB6b29tIGVuZHNcbiAgICB9XG5cbiAgICB0aGlzLmZyZWVUaWxlUmVzb3VyY2VzKHRoaXMudGlsZXNba2V5XSk7XG4gICAgVmVjdG9yUmVuZGVyZXIucHJvdG90eXBlLnJlbW92ZVRpbGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5cbi8vIEZyZWUgYW55IEdMIC8gb3duZWQgcmVzb3VyY2VzXG5HTFJlbmRlcmVyLnByb3RvdHlwZS5mcmVlVGlsZVJlc291cmNlcyA9IGZ1bmN0aW9uICh0aWxlKVxue1xuICAgIGlmICh0aWxlICE9IG51bGwgJiYgdGlsZS5nbF9nZW9tZXRyeSAhPSBudWxsKSB7XG4gICAgICAgIGZvciAodmFyIHAgaW4gdGlsZS5nbF9nZW9tZXRyeSkge1xuICAgICAgICAgICAgdGlsZS5nbF9nZW9tZXRyeVtwXS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGlsZS5nbF9nZW9tZXRyeSA9IG51bGw7XG4gICAgfVxufTtcblxuR0xSZW5kZXJlci5wcm90b3R5cGUucHJlc2VydmVfdGlsZXNfd2l0aGluX3pvb20gPSAyO1xuR0xSZW5kZXJlci5wcm90b3R5cGUuc2V0Wm9vbSA9IGZ1bmN0aW9uICh6b29tKVxue1xuICAgIC8vIFNjaGVkdWxlIEdMIHRpbGVzIGZvciByZW1vdmFsIG9uIHpvb21cbiAgICBjb25zb2xlLmxvZyhcInJlbmRlcmVyLm1hcF9sYXN0X3pvb206IFwiICsgdGhpcy5tYXBfbGFzdF96b29tKTtcblxuICAgIHRoaXMubWFwX3pvb21pbmcgPSBmYWxzZTtcbiAgICB0aGlzLnpvb20gPSB6b29tO1xuICAgIHZhciBiZWxvdyA9IHRoaXMuem9vbTtcbiAgICB2YXIgYWJvdmUgPSB0aGlzLnpvb207XG4gICAgaWYgKE1hdGguYWJzKHRoaXMuem9vbSAtIHRoaXMubWFwX2xhc3Rfem9vbSkgPD0gdGhpcy5wcmVzZXJ2ZV90aWxlc193aXRoaW5fem9vbSkge1xuICAgICAgICBpZiAodGhpcy56b29tID4gdGhpcy5tYXBfbGFzdF96b29tKSB7XG4gICAgICAgICAgICBiZWxvdyA9IHRoaXMuem9vbSAtIHRoaXMucHJlc2VydmVfdGlsZXNfd2l0aGluX3pvb207XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhYm92ZSA9IHRoaXMuem9vbSArIHRoaXMucHJlc2VydmVfdGlsZXNfd2l0aGluX3pvb207XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5yZW1vdmVUaWxlc091dHNpZGVab29tUmFuZ2UoYmVsb3csIGFib3ZlKTtcbiAgICB0aGlzLm1hcF9sYXN0X3pvb20gPSB0aGlzLnpvb207XG4gICAgdGhpcy5kaXJ0eSA9IHRydWU7IC8vIGNhbGxpbmcgYmVjYXVzZSB0aGlzIGlzIGEgZnVsbCBvdmVycmlkZSBvZiB0aGUgcGFyZW50IGNsYXNzXG59O1xuXG5HTFJlbmRlcmVyLnByb3RvdHlwZS5yZW1vdmVUaWxlc091dHNpZGVab29tUmFuZ2UgPSBmdW5jdGlvbiAoYmVsb3csIGFib3ZlKVxue1xuICAgIGJlbG93ID0gTWF0aC5taW4oYmVsb3csIHRoaXMudGlsZV9zb3VyY2UubWF4X3pvb20gfHwgYmVsb3cpO1xuICAgIGFib3ZlID0gTWF0aC5taW4oYWJvdmUsIHRoaXMudGlsZV9zb3VyY2UubWF4X3pvb20gfHwgYWJvdmUpO1xuXG4gICAgY29uc29sZS5sb2coXCJyZW1vdmVUaWxlc091dHNpZGVab29tUmFuZ2UgW1wiICsgYmVsb3cgKyBcIiwgXCIgKyBhYm92ZSArIFwiXSlcIik7XG4gICAgdmFyIHJlbW92ZV90aWxlcyA9IFtdO1xuICAgIGZvciAodmFyIHQgaW4gdGhpcy50aWxlcykge1xuICAgICAgICB2YXIgdGlsZSA9IHRoaXMudGlsZXNbdF07XG4gICAgICAgIGlmICh0aWxlLmNvb3Jkcy56IDwgYmVsb3cgfHwgdGlsZS5jb29yZHMueiA+IGFib3ZlKSB7XG4gICAgICAgICAgICByZW1vdmVfdGlsZXMucHVzaCh0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciByPTA7IHIgPCByZW1vdmVfdGlsZXMubGVuZ3RoOyByKyspIHtcbiAgICAgICAgdmFyIGtleSA9IHJlbW92ZV90aWxlc1tyXTtcbiAgICAgICAgY29uc29sZS5sb2coXCJyZW1vdmVkIFwiICsga2V5ICsgXCIgKG91dHNpZGUgcmFuZ2UgW1wiICsgYmVsb3cgKyBcIiwgXCIgKyBhYm92ZSArIFwiXSlcIik7XG4gICAgICAgIHRoaXMucmVtb3ZlVGlsZShrZXkpO1xuICAgIH1cbn07XG5cbi8vIE92ZXJyaWRlcyBiYXNlIGNsYXNzIG1ldGhvZCAoYSBubyBvcClcbkdMUmVuZGVyZXIucHJvdG90eXBlLnJlc2l6ZU1hcCA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0KVxue1xuICAgIFZlY3RvclJlbmRlcmVyLnByb3RvdHlwZS5yZXNpemVNYXAuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHRoaXMuY3NzX3NpemUgPSB7IHdpZHRoOiB3aWR0aCwgaGVpZ2h0OiBoZWlnaHQgfTtcbiAgICB0aGlzLmRldmljZV9zaXplID0geyB3aWR0aDogTWF0aC5yb3VuZCh0aGlzLmNzc19zaXplLndpZHRoICogdGhpcy5kZXZpY2VfcGl4ZWxfcmF0aW8pLCBoZWlnaHQ6IE1hdGgucm91bmQodGhpcy5jc3Nfc2l6ZS5oZWlnaHQgKiB0aGlzLmRldmljZV9waXhlbF9yYXRpbykgfTtcblxuICAgIHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gdGhpcy5jc3Nfc2l6ZS53aWR0aCArICdweCc7XG4gICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gdGhpcy5jc3Nfc2l6ZS5oZWlnaHQgKyAncHgnO1xuICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5kZXZpY2Vfc2l6ZS53aWR0aDtcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmRldmljZV9zaXplLmhlaWdodDtcbiAgICB0aGlzLmdsLnZpZXdwb3J0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xufTtcblxuR0xSZW5kZXJlci5wcm90b3R5cGUuX3JlbmRlciA9IGZ1bmN0aW9uIEdMUmVuZGVyZXJSZW5kZXIgKClcbntcbiAgICB2YXIgZ2wgPSB0aGlzLmdsO1xuXG4gICAgdGhpcy5pbnB1dCgpO1xuXG4gICAgLy8gUmVzZXQgZnJhbWUgc3RhdGVcbiAgICBnbC5jbGVhckNvbG9yKDAuMCwgMC4wLCAwLjAsIDEuMCk7XG4gICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQpO1xuICAgIGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKTtcbiAgICBnbC5kZXB0aEZ1bmMoZ2wuTEVTUyk7XG4gICAgZ2wuZW5hYmxlKGdsLkNVTExfRkFDRSk7XG4gICAgZ2wuY3VsbEZhY2UoZ2wuQkFDSyk7XG5cbiAgICAvLyBSZW5kZXIgdGlsZXMgZ3JvdXBlZCBieSByZW5kZXJnIG1vZGUgKEdMIHByb2dyYW0pXG4gICAgdmFyIHJlbmRlcl9jb3VudCA9IDA7XG4gICAgZm9yICh2YXIgbW9kZSBpbiB0aGlzLnJlbmRlcl9tb2Rlcykge1xuICAgICAgICB2YXIgZ2xfcHJvZ3JhbSA9IHRoaXMucmVuZGVyX21vZGVzW21vZGVdLmdsX3Byb2dyYW07XG5cbiAgICAgICAgZ2wudXNlUHJvZ3JhbShnbF9wcm9ncmFtLnByb2dyYW0pO1xuXG4gICAgICAgIC8vIFRPRE86IHNldCB0aGVzZSBvbmNlIHBlciBwcm9ncmFtLCBkb24ndCBzZXQgd2hlbiB0aGV5IGhhdmVuJ3QgY2hhbmdlZFxuICAgICAgICBnbF9wcm9ncmFtLnVuaWZvcm0oJzJmJywgJ3VfcmVzb2x1dGlvbicsIHRoaXMuZGV2aWNlX3NpemUud2lkdGgsIHRoaXMuZGV2aWNlX3NpemUuaGVpZ2h0KTtcbiAgICAgICAgZ2xfcHJvZ3JhbS51bmlmb3JtKCcyZicsICd1X2FzcGVjdCcsIHRoaXMuZGV2aWNlX3NpemUud2lkdGggLyB0aGlzLmRldmljZV9zaXplLmhlaWdodCwgMS4wKTtcbiAgICAgICAgZ2xfcHJvZ3JhbS51bmlmb3JtKCcxZicsICd1X3RpbWUnLCAoKCtuZXcgRGF0ZSgpKSAtIHRoaXMuc3RhcnRfdGltZSkgLyAxMDAwKTtcblxuICAgICAgICB2YXIgY2VudGVyID0gR2VvLmxhdExuZ1RvTWV0ZXJzKFBvaW50KHRoaXMuY2VudGVyLmxuZywgdGhpcy5jZW50ZXIubGF0KSk7XG4gICAgICAgIC8vIGdsX3Byb2dyYW0udW5pZm9ybSgnMmYnLCAndV9tYXBfY2VudGVyJywgY2VudGVyLngsIGNlbnRlci55KTtcbiAgICAgICAgZ2xfcHJvZ3JhbS51bmlmb3JtKCcxZicsICd1X21hcF96b29tJywgdGhpcy56b29tKTsgLy8gTWF0aC5mbG9vcih0aGlzLnpvb20pICsgKE1hdGgubG9nKCh0aGlzLnpvb20gJSAxKSArIDEpIC8gTWF0aC5MTjIgLy8gc2NhbGUgZnJhY3Rpb25hbCB6b29tIGJ5IGxvZ1xuICAgICAgICBnbF9wcm9ncmFtLnVuaWZvcm0oJzFmJywgJ3VfbnVtX2xheWVycycsIHRoaXMubGF5ZXJzLmxlbmd0aCk7XG5cbiAgICAgICAgdmFyIG1ldGVyc19wZXJfcGl4ZWwgPSBHZW8ubWluX3pvb21fbWV0ZXJzX3Blcl9waXhlbCAvIE1hdGgucG93KDIsIHRoaXMuem9vbSk7XG4gICAgICAgIGdsX3Byb2dyYW0udW5pZm9ybSgnMWYnLCAndV9tZXRlcnNfcGVyX3BpeGVsJywgbWV0ZXJzX3Blcl9waXhlbCk7XG5cbiAgICAgICAgdmFyIG1ldGVyX3pvb20gPSBQb2ludCh0aGlzLmNzc19zaXplLndpZHRoIC8gMiAqIG1ldGVyc19wZXJfcGl4ZWwsIHRoaXMuY3NzX3NpemUuaGVpZ2h0IC8gMiAqIG1ldGVyc19wZXJfcGl4ZWwpO1xuICAgICAgICAvLyBnbF9wcm9ncmFtLnVuaWZvcm0oJzJmJywgJ3VfbWV0ZXJfem9vbScsIG1ldGVyX3pvb20ueCwgbWV0ZXJfem9vbS55KTtcblxuICAgICAgICAvLyBNYXRyaXggdHJhbnNmb3Jtc1xuICAgICAgICB2YXIgdGlsZV92aWV3X21hdCA9IG1hdDQuY3JlYXRlKCk7XG4gICAgICAgIHZhciB0aWxlX3dvcmxkX21hdCA9IG1hdDQuY3JlYXRlKCk7XG4gICAgICAgIHZhciBtZXRlcl92aWV3X21hdCA9IG1hdDQuY3JlYXRlKCk7XG5cbiAgICAgICAgLy8gQ29udmVydCBtZXJjYXRvciBtZXRlcnMgdG8gc2NyZWVuIHNwYWNlXG4gICAgICAgIG1hdDQuc2NhbGUobWV0ZXJfdmlld19tYXQsIG1ldGVyX3ZpZXdfbWF0LCB2ZWMzLmZyb21WYWx1ZXMoMSAvIG1ldGVyX3pvb20ueCwgMSAvIG1ldGVyX3pvb20ueSwgMSAvIG1ldGVyX3pvb20ueSkpO1xuICAgICAgICBnbF9wcm9ncmFtLnVuaWZvcm0oJ01hdHJpeDRmdicsICd1X21ldGVyX3ZpZXcnLCBnbC5GQUxTRSwgbWV0ZXJfdmlld19tYXQpO1xuXG4gICAgICAgIC8vIFRPRE86IG1ha2UgYSBsaXN0IG9mIHJlbmRlcmFibGUgdGlsZXMgb25jZSBwZXIgZnJhbWUsIG91dHNpZGUgdGhpcyBsb29wXG4gICAgICAgIC8vIFJlbmRlciB0aWxlIEdMIGdlb21ldHJpZXNcbiAgICAgICAgdmFyIGNhcHBlZF96b29tID0gTWF0aC5taW4ofn50aGlzLnpvb20sIHRoaXMudGlsZV9zb3VyY2UubWF4X3pvb20gfHwgfn50aGlzLnpvb20pO1xuICAgICAgICBmb3IgKHZhciB0IGluIHRoaXMudGlsZXMpIHtcbiAgICAgICAgICAgIHZhciB0aWxlID0gdGhpcy50aWxlc1t0XTtcbiAgICAgICAgICAgIGlmICh0aWxlLmxvYWRlZCA9PSB0cnVlICYmXG4gICAgICAgICAgICAgICAgdGlsZS52aXNpYmxlID09IHRydWUgJiZcbiAgICAgICAgICAgICAgICBNYXRoLm1pbih0aWxlLmNvb3Jkcy56LCB0aGlzLnRpbGVfc291cmNlLm1heF96b29tIHx8IHRpbGUuY29vcmRzLnopID09IGNhcHBlZF96b29tKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAodGlsZS5nbF9nZW9tZXRyeVttb2RlXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGdsX3Byb2dyYW0udW5pZm9ybSgnMmYnLCAndV90aWxlX21pbicsIHRpbGUubWluLngsIHRpbGUubWluLnkpO1xuICAgICAgICAgICAgICAgICAgICAvLyBnbF9wcm9ncmFtLnVuaWZvcm0oJzJmJywgJ3VfdGlsZV9tYXgnLCB0aWxlLm1heC54LCB0aWxlLm1heC55KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBUaWxlIHZpZXcgbWF0cml4IC0gdHJhbnNmb3JtIHRpbGUgc3BhY2UgaW50byB2aWV3IHNwYWNlIChtZXRlcnMsIHJlbGF0aXZlIHRvIGNhbWVyYSlcbiAgICAgICAgICAgICAgICAgICAgbWF0NC5pZGVudGl0eSh0aWxlX3ZpZXdfbWF0KTtcbiAgICAgICAgICAgICAgICAgICAgbWF0NC50cmFuc2xhdGUodGlsZV92aWV3X21hdCwgdGlsZV92aWV3X21hdCwgdmVjMy5mcm9tVmFsdWVzKHRpbGUubWluLnggLSBjZW50ZXIueCwgdGlsZS5taW4ueSAtIGNlbnRlci55LCAwKSk7IC8vIGFkanVzdCBmb3IgdGlsZSBvcmlnaW4gJiBtYXAgY2VudGVyXG4gICAgICAgICAgICAgICAgICAgIG1hdDQuc2NhbGUodGlsZV92aWV3X21hdCwgdGlsZV92aWV3X21hdCwgdmVjMy5mcm9tVmFsdWVzKCh0aWxlLm1heC54IC0gdGlsZS5taW4ueCkgLyBWZWN0b3JSZW5kZXJlci50aWxlX3NjYWxlLCAtMSAqICh0aWxlLm1heC55IC0gdGlsZS5taW4ueSkgLyBWZWN0b3JSZW5kZXJlci50aWxlX3NjYWxlLCAxKSk7IC8vIHNjYWxlIHRpbGUgbG9jYWwgY29vcmRzIHRvIG1ldGVyc1xuICAgICAgICAgICAgICAgICAgICBnbF9wcm9ncmFtLnVuaWZvcm0oJ01hdHJpeDRmdicsICd1X3RpbGVfdmlldycsIGdsLkZBTFNFLCB0aWxlX3ZpZXdfbWF0KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBUaWxlIHdvcmxkIG1hdHJpeCAtIHRyYW5zZm9ybSB0aWxlIHNwYWNlIGludG8gd29ybGQgc3BhY2UgKG1ldGVycywgYWJzb2x1dGUgbWVyY2F0b3IgcG9zaXRpb24pXG4gICAgICAgICAgICAgICAgICAgIG1hdDQuaWRlbnRpdHkodGlsZV93b3JsZF9tYXQpO1xuICAgICAgICAgICAgICAgICAgICBtYXQ0LnRyYW5zbGF0ZSh0aWxlX3dvcmxkX21hdCwgdGlsZV93b3JsZF9tYXQsIHZlYzMuZnJvbVZhbHVlcyh0aWxlLm1pbi54LCB0aWxlLm1pbi55LCAwKSk7XG4gICAgICAgICAgICAgICAgICAgIG1hdDQuc2NhbGUodGlsZV93b3JsZF9tYXQsIHRpbGVfd29ybGRfbWF0LCB2ZWMzLmZyb21WYWx1ZXMoKHRpbGUubWF4LnggLSB0aWxlLm1pbi54KSAvIFZlY3RvclJlbmRlcmVyLnRpbGVfc2NhbGUsIC0xICogKHRpbGUubWF4LnkgLSB0aWxlLm1pbi55KSAvIFZlY3RvclJlbmRlcmVyLnRpbGVfc2NhbGUsIDEpKTsgLy8gc2NhbGUgdGlsZSBsb2NhbCBjb29yZHMgdG8gbWV0ZXJzXG4gICAgICAgICAgICAgICAgICAgIGdsX3Byb2dyYW0udW5pZm9ybSgnTWF0cml4NGZ2JywgJ3VfdGlsZV93b3JsZCcsIGdsLkZBTFNFLCB0aWxlX3dvcmxkX21hdCk7XG5cblxuICAgICAgICAgICAgICAgICAgICB0aWxlLmdsX2dlb21ldHJ5W21vZGVdLnJlbmRlcigpO1xuICAgICAgICAgICAgICAgICAgICByZW5kZXJfY291bnQgKz0gdGlsZS5nbF9nZW9tZXRyeVttb2RlXS5nZW9tZXRyeV9jb3VudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmVuZGVyX2NvdW50ICE9IHRoaXMubGFzdF9yZW5kZXJfY291bnQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJyZW5kZXJlZCBcIiArIHJlbmRlcl9jb3VudCArIFwiIHByaW1pdGl2ZXNcIik7XG4gICAgfVxuICAgIHRoaXMubGFzdF9yZW5kZXJfY291bnQgPSByZW5kZXJfY291bnQ7XG5cbiAgICBpZiAodGhpcy5jb250aW51b3VzX2FuaW1hdGlvbiA9PSB0cnVlKSB7XG4gICAgICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufTtcblxuLy8gU3VtIG9mIGEgZGVidWcgcHJvcGVydHkgYWNyb3NzIHRpbGVzXG5HTFJlbmRlcmVyLnByb3RvdHlwZS5nZXREZWJ1Z1N1bSA9IGZ1bmN0aW9uIChwcm9wLCBmaWx0ZXIpXG57XG4gICAgdmFyIHN1bSA9IDA7XG4gICAgZm9yICh2YXIgdCBpbiB0aGlzLnRpbGVzKSB7XG4gICAgICAgIGlmICh0aGlzLnRpbGVzW3RdLmRlYnVnW3Byb3BdICE9IG51bGwgJiYgKHR5cGVvZiBmaWx0ZXIgIT0gJ2Z1bmN0aW9uJyB8fCBmaWx0ZXIodGhpcy50aWxlc1t0XSkgPT0gdHJ1ZSkpIHtcbiAgICAgICAgICAgIHN1bSArPSB0aGlzLnRpbGVzW3RdLmRlYnVnW3Byb3BdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdW07XG59O1xuXG4vLyBBdmVyYWdlIG9mIGEgZGVidWcgcHJvcGVydHkgYWNyb3NzIHRpbGVzXG5HTFJlbmRlcmVyLnByb3RvdHlwZS5nZXREZWJ1Z0F2ZXJhZ2UgPSBmdW5jdGlvbiAocHJvcCwgZmlsdGVyKVxue1xuICAgIHJldHVybiB0aGlzLmdldERlYnVnU3VtKHByb3AsIGZpbHRlcikgLyBPYmplY3Qua2V5cyh0aGlzLnRpbGVzKS5sZW5ndGg7XG59O1xuXG4vLyBVc2VyIGlucHV0XG4vLyBUT0RPOiByZXN0b3JlIGZyYWN0aW9uYWwgem9vbSBzdXBwb3J0IG9uY2UgbGVhZmxldCBhbmltYXRpb24gcmVmYWN0b3IgcHVsbCByZXF1ZXN0IGlzIG1lcmdlZFxuXG5HTFJlbmRlcmVyLnByb3RvdHlwZS5pbml0SW5wdXRIYW5kbGVycyA9IGZ1bmN0aW9uIEdMUmVuZGVyZXJJbml0SW5wdXRIYW5kbGVycyAoKVxue1xuICAgIHZhciBnbF9yZW5kZXJlciA9IHRoaXM7XG4gICAgZ2xfcmVuZGVyZXIua2V5ID0gbnVsbDtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT0gMzcpIHtcbiAgICAgICAgICAgIGdsX3JlbmRlcmVyLmtleSA9ICdsZWZ0JztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChldmVudC5rZXlDb2RlID09IDM5KSB7XG4gICAgICAgICAgICBnbF9yZW5kZXJlci5rZXkgPSAncmlnaHQnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT0gMzgpIHtcbiAgICAgICAgICAgIGdsX3JlbmRlcmVyLmtleSA9ICd1cCc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PSA0MCkge1xuICAgICAgICAgICAgZ2xfcmVuZGVyZXIua2V5ID0gJ2Rvd24nO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT0gODMpIHsgLy8gc1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZWxvYWRpbmcgc2hhZGVyc1wiKTtcbiAgICAgICAgICAgIGZvciAodmFyIG1vZGUgaW4gdGhpcy5yZW5kZXJfbW9kZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcl9tb2Rlc1ttb2RlXS5nbF9wcm9ncmFtLmNvbXBpbGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdsX3JlbmRlcmVyLmRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZ2xfcmVuZGVyZXIua2V5ID0gbnVsbDtcbiAgICB9KTtcbn07XG5cbkdMUmVuZGVyZXIucHJvdG90eXBlLmlucHV0ID0gZnVuY3Rpb24gR0xSZW5kZXJlcklucHV0ICgpXG57XG4gICAgLy8gLy8gRnJhY3Rpb25hbCB6b29tIHNjYWxpbmdcbiAgICAvLyBpZiAodGhpcy5rZXkgPT0gJ3VwJykge1xuICAgIC8vICAgICB0aGlzLnNldFpvb20odGhpcy56b29tICsgdGhpcy56b29tX3N0ZXApO1xuICAgIC8vIH1cbiAgICAvLyBlbHNlIGlmICh0aGlzLmtleSA9PSAnZG93bicpIHtcbiAgICAvLyAgICAgdGhpcy5zZXRab29tKHRoaXMuem9vbSAtIHRoaXMuem9vbV9zdGVwKTtcbiAgICAvLyB9XG59O1xuXG5pZiAobW9kdWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEdMUmVuZGVyZXI7XG59XG4iLCIvLyBHZW5lcmF0ZWQgZnJvbSBHTFNMIGZpbGVzLCBkb24ndCBlZGl0IVxudmFyIHNoYWRlcl9zb3VyY2VzID0ge307XG5cbnNoYWRlcl9zb3VyY2VzWydwb2ludF9mcmFnbWVudCddID1cblwiXFxuXCIgK1xuXCIjZGVmaW5lIEdMU0xJRlkgMVxcblwiICtcblwiXFxuXCIgK1xuXCJ1bmlmb3JtIHZlYzIgdV9yZXNvbHV0aW9uO1xcblwiICtcblwidmFyeWluZyB2ZWMzIHZfY29sb3I7XFxuXCIgK1xuXCJ2YXJ5aW5nIHZlYzIgdl90ZXhjb29yZDtcXG5cIiArXG5cInZvaWQgbWFpbih2b2lkKSB7XFxuXCIgK1xuXCIgIHZlYzMgY29sb3IgPSB2X2NvbG9yO1xcblwiICtcblwiICBmbG9hdCBsZW4gPSBsZW5ndGgodl90ZXhjb29yZCk7XFxuXCIgK1xuXCIgIGlmKGxlbiA+IDEuKSB7XFxuXCIgK1xuXCIgICAgZGlzY2FyZDtcXG5cIiArXG5cIiAgfVxcblwiICtcblwiICBjb2xvciAqPSAoMS4gLSBzbW9vdGhzdGVwKC4yNSwgMS4sIGxlbikpICsgMC41O1xcblwiICtcblwiICAjaWYgZGVmaW5lZChFRkZFQ1RfU0NSRUVOX0NPTE9SKVxcblwiICtcblwiICBjb2xvciArPSB2ZWMzKGdsX0ZyYWdDb29yZC54IC8gdV9yZXNvbHV0aW9uLngsIDAuMCwgZ2xfRnJhZ0Nvb3JkLnkgLyB1X3Jlc29sdXRpb24ueSk7XFxuXCIgK1xuXCIgICNlbmRpZlxcblwiICtcblwiICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yLCAxLik7XFxuXCIgK1xuXCJ9XFxuXCIgK1xuXCJcIjtcblxuc2hhZGVyX3NvdXJjZXNbJ3BvaW50X3ZlcnRleCddID1cblwiXFxuXCIgK1xuXCIjZGVmaW5lIEdMU0xJRlkgMVxcblwiICtcblwiXFxuXCIgK1xuXCJ1bmlmb3JtIG1hdDQgdV90aWxlX3ZpZXc7XFxuXCIgK1xuXCJ1bmlmb3JtIG1hdDQgdV9tZXRlcl92aWV3O1xcblwiICtcblwidW5pZm9ybSBmbG9hdCB1X251bV9sYXllcnM7XFxuXCIgK1xuXCJhdHRyaWJ1dGUgdmVjMyBhX3Bvc2l0aW9uO1xcblwiICtcblwiYXR0cmlidXRlIHZlYzIgYV90ZXhjb29yZDtcXG5cIiArXG5cImF0dHJpYnV0ZSB2ZWMzIGFfY29sb3I7XFxuXCIgK1xuXCJhdHRyaWJ1dGUgZmxvYXQgYV9sYXllcjtcXG5cIiArXG5cInZhcnlpbmcgdmVjMyB2X2NvbG9yO1xcblwiICtcblwidmFyeWluZyB2ZWMyIHZfdGV4Y29vcmQ7XFxuXCIgK1xuXCJmbG9hdCBhX3hfY2FsY3VsYXRlWihmbG9hdCB6LCBmbG9hdCBsYXllciwgY29uc3QgZmxvYXQgbnVtX2xheWVycywgY29uc3QgZmxvYXQgel9sYXllcl9zY2FsZSkge1xcblwiICtcblwiICBmbG9hdCB6X2xheWVyX3JhbmdlID0gKG51bV9sYXllcnMgKyAxLikgKiB6X2xheWVyX3NjYWxlO1xcblwiICtcblwiICBmbG9hdCB6X2xheWVyID0gKGxheWVyICsgMS4pICogel9sYXllcl9zY2FsZTtcXG5cIiArXG5cIiAgeiA9IHpfbGF5ZXIgKyBjbGFtcCh6LCAwLiwgel9sYXllcl9zY2FsZSk7XFxuXCIgK1xuXCIgIHogPSAoel9sYXllcl9yYW5nZSAtIHopIC8gel9sYXllcl9yYW5nZTtcXG5cIiArXG5cIiAgcmV0dXJuIHo7XFxuXCIgK1xuXCJ9XFxuXCIgK1xuXCJ2b2lkIG1haW4oKSB7XFxuXCIgK1xuXCIgIHZlYzQgcG9zaXRpb24gPSB1X21ldGVyX3ZpZXcgKiB1X3RpbGVfdmlldyAqIHZlYzQoYV9wb3NpdGlvbiwgMS4pO1xcblwiICtcblwiICB2X2NvbG9yID0gYV9jb2xvcjtcXG5cIiArXG5cIiAgdl90ZXhjb29yZCA9IGFfdGV4Y29vcmQ7XFxuXCIgK1xuXCIgIHBvc2l0aW9uLnogPSBhX3hfY2FsY3VsYXRlWihwb3NpdGlvbi56LCBhX2xheWVyLCB1X251bV9sYXllcnMsIDI1Ni4pO1xcblwiICtcblwiICBnbF9Qb3NpdGlvbiA9IHBvc2l0aW9uO1xcblwiICtcblwifVxcblwiICtcblwiXCI7XG5cbnNoYWRlcl9zb3VyY2VzWydwb2x5Z29uX2ZyYWdtZW50J10gPVxuXCJcXG5cIiArXG5cIiNkZWZpbmUgR0xTTElGWSAxXFxuXCIgK1xuXCJcXG5cIiArXG5cInVuaWZvcm0gdmVjMiB1X3Jlc29sdXRpb247XFxuXCIgK1xuXCJ1bmlmb3JtIHZlYzIgdV9hc3BlY3Q7XFxuXCIgK1xuXCJ1bmlmb3JtIG1hdDQgdV9tZXRlcl92aWV3O1xcblwiICtcblwidW5pZm9ybSBmbG9hdCB1X21ldGVyc19wZXJfcGl4ZWw7XFxuXCIgK1xuXCJ1bmlmb3JtIGZsb2F0IHVfdGltZTtcXG5cIiArXG5cInZhcnlpbmcgdmVjMyB2X2NvbG9yO1xcblwiICtcblwiI2lmICFkZWZpbmVkKExJR0hUSU5HX1ZFUlRFWClcXG5cIiArXG5cIlxcblwiICtcblwidmFyeWluZyB2ZWM0IHZfcG9zaXRpb247XFxuXCIgK1xuXCJ2YXJ5aW5nIHZlYzMgdl9ub3JtYWw7XFxuXCIgK1xuXCIjZW5kaWZcXG5cIiArXG5cIlxcblwiICtcblwiI2lmIGRlZmluZWQoRUZGRUNUX05PSVNFX1RFWFRVUkUpXFxuXCIgK1xuXCJcXG5cIiArXG5cInZhcnlpbmcgdmVjNCB2X3Bvc2l0aW9uX3dvcmxkO1xcblwiICtcblwidmVjMyBhX3hfbW9kMjg5KHZlYzMgeCkge1xcblwiICtcblwiICByZXR1cm4geCAtIGZsb29yKHggKiAoMS4wIC8gMjg5LjApKSAqIDI4OS4wO1xcblwiICtcblwifVxcblwiICtcblwidmVjNCBhX3hfbW9kMjg5KHZlYzQgeCkge1xcblwiICtcblwiICByZXR1cm4geCAtIGZsb29yKHggKiAoMS4wIC8gMjg5LjApKSAqIDI4OS4wO1xcblwiICtcblwifVxcblwiICtcblwidmVjNCBhX3hfcGVybXV0ZSh2ZWM0IHgpIHtcXG5cIiArXG5cIiAgcmV0dXJuIGFfeF9tb2QyODkoKCh4ICogMzQuMCkgKyAxLjApICogeCk7XFxuXCIgK1xuXCJ9XFxuXCIgK1xuXCJ2ZWM0IGFfeF90YXlsb3JJbnZTcXJ0KHZlYzQgcikge1xcblwiICtcblwiICByZXR1cm4gMS43OTI4NDI5MTQwMDE1OSAtIDAuODUzNzM0NzIwOTUzMTQgKiByO1xcblwiICtcblwifVxcblwiICtcblwidmVjMyBhX3hfZmFkZSh2ZWMzIHQpIHtcXG5cIiArXG5cIiAgcmV0dXJuIHQgKiB0ICogdCAqICh0ICogKHQgKiA2LjAgLSAxNS4wKSArIDEwLjApO1xcblwiICtcblwifVxcblwiICtcblwiZmxvYXQgYV94X2Nub2lzZSh2ZWMzIFApIHtcXG5cIiArXG5cIiAgdmVjMyBQaTAgPSBmbG9vcihQKTtcXG5cIiArXG5cIiAgdmVjMyBQaTEgPSBQaTAgKyB2ZWMzKDEuMCk7XFxuXCIgK1xuXCIgIFBpMCA9IGFfeF9tb2QyODkoUGkwKTtcXG5cIiArXG5cIiAgUGkxID0gYV94X21vZDI4OShQaTEpO1xcblwiICtcblwiICB2ZWMzIFBmMCA9IGZyYWN0KFApO1xcblwiICtcblwiICB2ZWMzIFBmMSA9IFBmMCAtIHZlYzMoMS4wKTtcXG5cIiArXG5cIiAgdmVjNCBpeCA9IHZlYzQoUGkwLngsIFBpMS54LCBQaTAueCwgUGkxLngpO1xcblwiICtcblwiICB2ZWM0IGl5ID0gdmVjNChQaTAueXksIFBpMS55eSk7XFxuXCIgK1xuXCIgIHZlYzQgaXowID0gUGkwLnp6eno7XFxuXCIgK1xuXCIgIHZlYzQgaXoxID0gUGkxLnp6eno7XFxuXCIgK1xuXCIgIHZlYzQgaXh5ID0gYV94X3Blcm11dGUoYV94X3Blcm11dGUoaXgpICsgaXkpO1xcblwiICtcblwiICB2ZWM0IGl4eTAgPSBhX3hfcGVybXV0ZShpeHkgKyBpejApO1xcblwiICtcblwiICB2ZWM0IGl4eTEgPSBhX3hfcGVybXV0ZShpeHkgKyBpejEpO1xcblwiICtcblwiICB2ZWM0IGd4MCA9IGl4eTAgKiAoMS4wIC8gNy4wKTtcXG5cIiArXG5cIiAgdmVjNCBneTAgPSBmcmFjdChmbG9vcihneDApICogKDEuMCAvIDcuMCkpIC0gMC41O1xcblwiICtcblwiICBneDAgPSBmcmFjdChneDApO1xcblwiICtcblwiICB2ZWM0IGd6MCA9IHZlYzQoMC41KSAtIGFicyhneDApIC0gYWJzKGd5MCk7XFxuXCIgK1xuXCIgIHZlYzQgc3owID0gc3RlcChnejAsIHZlYzQoMC4wKSk7XFxuXCIgK1xuXCIgIGd4MCAtPSBzejAgKiAoc3RlcCgwLjAsIGd4MCkgLSAwLjUpO1xcblwiICtcblwiICBneTAgLT0gc3owICogKHN0ZXAoMC4wLCBneTApIC0gMC41KTtcXG5cIiArXG5cIiAgdmVjNCBneDEgPSBpeHkxICogKDEuMCAvIDcuMCk7XFxuXCIgK1xuXCIgIHZlYzQgZ3kxID0gZnJhY3QoZmxvb3IoZ3gxKSAqICgxLjAgLyA3LjApKSAtIDAuNTtcXG5cIiArXG5cIiAgZ3gxID0gZnJhY3QoZ3gxKTtcXG5cIiArXG5cIiAgdmVjNCBnejEgPSB2ZWM0KDAuNSkgLSBhYnMoZ3gxKSAtIGFicyhneTEpO1xcblwiICtcblwiICB2ZWM0IHN6MSA9IHN0ZXAoZ3oxLCB2ZWM0KDAuMCkpO1xcblwiICtcblwiICBneDEgLT0gc3oxICogKHN0ZXAoMC4wLCBneDEpIC0gMC41KTtcXG5cIiArXG5cIiAgZ3kxIC09IHN6MSAqIChzdGVwKDAuMCwgZ3kxKSAtIDAuNSk7XFxuXCIgK1xuXCIgIHZlYzMgZzAwMCA9IHZlYzMoZ3gwLngsIGd5MC54LCBnejAueCk7XFxuXCIgK1xuXCIgIHZlYzMgZzEwMCA9IHZlYzMoZ3gwLnksIGd5MC55LCBnejAueSk7XFxuXCIgK1xuXCIgIHZlYzMgZzAxMCA9IHZlYzMoZ3gwLnosIGd5MC56LCBnejAueik7XFxuXCIgK1xuXCIgIHZlYzMgZzExMCA9IHZlYzMoZ3gwLncsIGd5MC53LCBnejAudyk7XFxuXCIgK1xuXCIgIHZlYzMgZzAwMSA9IHZlYzMoZ3gxLngsIGd5MS54LCBnejEueCk7XFxuXCIgK1xuXCIgIHZlYzMgZzEwMSA9IHZlYzMoZ3gxLnksIGd5MS55LCBnejEueSk7XFxuXCIgK1xuXCIgIHZlYzMgZzAxMSA9IHZlYzMoZ3gxLnosIGd5MS56LCBnejEueik7XFxuXCIgK1xuXCIgIHZlYzMgZzExMSA9IHZlYzMoZ3gxLncsIGd5MS53LCBnejEudyk7XFxuXCIgK1xuXCIgIHZlYzQgbm9ybTAgPSBhX3hfdGF5bG9ySW52U3FydCh2ZWM0KGRvdChnMDAwLCBnMDAwKSwgZG90KGcwMTAsIGcwMTApLCBkb3QoZzEwMCwgZzEwMCksIGRvdChnMTEwLCBnMTEwKSkpO1xcblwiICtcblwiICBnMDAwICo9IG5vcm0wLng7XFxuXCIgK1xuXCIgIGcwMTAgKj0gbm9ybTAueTtcXG5cIiArXG5cIiAgZzEwMCAqPSBub3JtMC56O1xcblwiICtcblwiICBnMTEwICo9IG5vcm0wLnc7XFxuXCIgK1xuXCIgIHZlYzQgbm9ybTEgPSBhX3hfdGF5bG9ySW52U3FydCh2ZWM0KGRvdChnMDAxLCBnMDAxKSwgZG90KGcwMTEsIGcwMTEpLCBkb3QoZzEwMSwgZzEwMSksIGRvdChnMTExLCBnMTExKSkpO1xcblwiICtcblwiICBnMDAxICo9IG5vcm0xLng7XFxuXCIgK1xuXCIgIGcwMTEgKj0gbm9ybTEueTtcXG5cIiArXG5cIiAgZzEwMSAqPSBub3JtMS56O1xcblwiICtcblwiICBnMTExICo9IG5vcm0xLnc7XFxuXCIgK1xuXCIgIGZsb2F0IG4wMDAgPSBkb3QoZzAwMCwgUGYwKTtcXG5cIiArXG5cIiAgZmxvYXQgbjEwMCA9IGRvdChnMTAwLCB2ZWMzKFBmMS54LCBQZjAueXopKTtcXG5cIiArXG5cIiAgZmxvYXQgbjAxMCA9IGRvdChnMDEwLCB2ZWMzKFBmMC54LCBQZjEueSwgUGYwLnopKTtcXG5cIiArXG5cIiAgZmxvYXQgbjExMCA9IGRvdChnMTEwLCB2ZWMzKFBmMS54eSwgUGYwLnopKTtcXG5cIiArXG5cIiAgZmxvYXQgbjAwMSA9IGRvdChnMDAxLCB2ZWMzKFBmMC54eSwgUGYxLnopKTtcXG5cIiArXG5cIiAgZmxvYXQgbjEwMSA9IGRvdChnMTAxLCB2ZWMzKFBmMS54LCBQZjAueSwgUGYxLnopKTtcXG5cIiArXG5cIiAgZmxvYXQgbjAxMSA9IGRvdChnMDExLCB2ZWMzKFBmMC54LCBQZjEueXopKTtcXG5cIiArXG5cIiAgZmxvYXQgbjExMSA9IGRvdChnMTExLCBQZjEpO1xcblwiICtcblwiICB2ZWMzIGZhZGVfeHl6ID0gYV94X2ZhZGUoUGYwKTtcXG5cIiArXG5cIiAgdmVjNCBuX3ogPSBtaXgodmVjNChuMDAwLCBuMTAwLCBuMDEwLCBuMTEwKSwgdmVjNChuMDAxLCBuMTAxLCBuMDExLCBuMTExKSwgZmFkZV94eXoueik7XFxuXCIgK1xuXCIgIHZlYzIgbl95eiA9IG1peChuX3oueHksIG5fei56dywgZmFkZV94eXoueSk7XFxuXCIgK1xuXCIgIGZsb2F0IG5feHl6ID0gbWl4KG5feXoueCwgbl95ei55LCBmYWRlX3h5ei54KTtcXG5cIiArXG5cIiAgcmV0dXJuIDIuMiAqIG5feHl6O1xcblwiICtcblwifVxcblwiICtcblwiI2VuZGlmXFxuXCIgK1xuXCJcXG5cIiArXG5cImNvbnN0IGZsb2F0IGxpZ2h0X2FtYmllbnQgPSAwLjU7XFxuXCIgK1xuXCJ2ZWMzIGNfeF9wb2ludExpZ2h0KHZlYzQgcG9zaXRpb24sIHZlYzMgbm9ybWFsLCB2ZWMzIGNvbG9yLCB2ZWM0IGxpZ2h0X3BvcywgZmxvYXQgbGlnaHRfYW1iaWVudCwgY29uc3QgYm9vbCBiYWNrbGlnaHQpIHtcXG5cIiArXG5cIiAgdmVjMyBsaWdodF9kaXIgPSBub3JtYWxpemUocG9zaXRpb24ueHl6IC0gbGlnaHRfcG9zLnh5eik7XFxuXCIgK1xuXCIgIGNvbG9yICo9IGFicyhtYXgoZmxvYXQoYmFja2xpZ2h0KSAqIC0xLiwgZG90KG5vcm1hbCwgbGlnaHRfZGlyICogLTEuMCkpKSArIGxpZ2h0X2FtYmllbnQ7XFxuXCIgK1xuXCIgIHJldHVybiBjb2xvcjtcXG5cIiArXG5cIn1cXG5cIiArXG5cInZlYzMgZF94X2RpcmVjdGlvbmFsTGlnaHQodmVjMyBub3JtYWwsIHZlYzMgY29sb3IsIHZlYzMgbGlnaHRfZGlyLCBmbG9hdCBsaWdodF9hbWJpZW50KSB7XFxuXCIgK1xuXCIgIGxpZ2h0X2RpciA9IG5vcm1hbGl6ZShsaWdodF9kaXIpO1xcblwiICtcblwiICBjb2xvciAqPSBkb3Qobm9ybWFsLCBsaWdodF9kaXIgKiAtMS4wKSArIGxpZ2h0X2FtYmllbnQ7XFxuXCIgK1xuXCIgIHJldHVybiBjb2xvcjtcXG5cIiArXG5cIn1cXG5cIiArXG5cInZlYzMgYl94X2xpZ2h0aW5nKHZlYzQgcG9zaXRpb24sIHZlYzMgbm9ybWFsLCB2ZWMzIGNvbG9yLCB2ZWM0IGxpZ2h0X3BvcywgdmVjNCBuaWdodF9saWdodF9wb3MsIHZlYzMgbGlnaHRfZGlyLCBmbG9hdCBsaWdodF9hbWJpZW50KSB7XFxuXCIgK1xuXCIgIFxcblwiICtcblwiICAjaWYgZGVmaW5lZChMSUdIVElOR19QT0lOVClcXG5cIiArXG5cIiAgY29sb3IgPSBjX3hfcG9pbnRMaWdodChwb3NpdGlvbiwgbm9ybWFsLCBjb2xvciwgbGlnaHRfcG9zLCBsaWdodF9hbWJpZW50LCB0cnVlKTtcXG5cIiArXG5cIiAgI2VsaWYgZGVmaW5lZChMSUdIVElOR19OSUdIVClcXG5cIiArXG5cIiAgY29sb3IgPSBjX3hfcG9pbnRMaWdodChwb3NpdGlvbiwgbm9ybWFsLCBjb2xvciwgbmlnaHRfbGlnaHRfcG9zLCAwLiwgZmFsc2UpO1xcblwiICtcblwiICAjZWxpZiBkZWZpbmVkKExJR0hUSU5HX0RJUkVDVElPTilcXG5cIiArXG5cIiAgY29sb3IgPSBkX3hfZGlyZWN0aW9uYWxMaWdodChub3JtYWwsIGNvbG9yLCBsaWdodF9kaXIsIGxpZ2h0X2FtYmllbnQpO1xcblwiICtcblwiICAjZWxzZVxcblwiICtcblwiICBjb2xvciA9IGNvbG9yO1xcblwiICtcblwiICAjZW5kaWZcXG5cIiArXG5cIiAgcmV0dXJuIGNvbG9yO1xcblwiICtcblwifVxcblwiICtcblwidm9pZCBtYWluKHZvaWQpIHtcXG5cIiArXG5cIiAgdmVjMyBjb2xvcjtcXG5cIiArXG5cIiAgI2lmICFkZWZpbmVkKExJR0hUSU5HX1ZFUlRFWCkgLy8gZGVmYXVsdCB0byBwZXItcGl4ZWwgbGlnaHRpbmdcXG5cIiArXG5cIiAgY29sb3IgPSBiX3hfbGlnaHRpbmcodl9wb3NpdGlvbiwgdl9ub3JtYWwsIHZfY29sb3IsIHZlYzQoMC4sIDAuLCAxNTAuICogdV9tZXRlcnNfcGVyX3BpeGVsLCAxLiksIHZlYzQoMC4sIDAuLCA1MC4gKiB1X21ldGVyc19wZXJfcGl4ZWwsIDEuKSwgdmVjMygwLjIsIDAuNywgLTAuNSksIGxpZ2h0X2FtYmllbnQpO1xcblwiICtcblwiICAjZWxzZVxcblwiICtcblwiICBjb2xvciA9IHZfY29sb3I7XFxuXCIgK1xuXCIgICNlbmRpZlxcblwiICtcblwiICBcXG5cIiArXG5cIiAgI2lmIGRlZmluZWQoRUZGRUNUX1NQT1RMSUdIVClcXG5cIiArXG5cIiAgdmVjMiBwb3NpdGlvbiA9IGdsX0ZyYWdDb29yZC54eSAvIHVfcmVzb2x1dGlvbi54eTtcXG5cIiArXG5cIiAgcG9zaXRpb24gPSBwb3NpdGlvbiAqIDIuMCAtIDEuMDtcXG5cIiArXG5cIiAgcG9zaXRpb24gKj0gdV9hc3BlY3Q7XFxuXCIgK1xuXCIgIGNvbG9yICo9IG1heCgxLjAgLSBkaXN0YW5jZShwb3NpdGlvbiwgdmVjMigwLjAsIDAuMCkpLCAwLjIpO1xcblwiICtcblwiICAjZW5kaWZcXG5cIiArXG5cIiAgXFxuXCIgK1xuXCIgICNpZiBkZWZpbmVkKEVGRkVDVF9DT0xPUl9CTEVFRClcXG5cIiArXG5cIiAgY29sb3IgKz0gdmVjMyhnbF9GcmFnQ29vcmQueCAvIHVfcmVzb2x1dGlvbi54LCAwLjAsIGdsX0ZyYWdDb29yZC55IC8gdV9yZXNvbHV0aW9uLnkpO1xcblwiICtcblwiICBjb2xvci5yICs9IHNpbih1X3RpbWUgLyAzLjApO1xcblwiICtcblwiICAjZW5kaWZcXG5cIiArXG5cIiAgXFxuXCIgK1xuXCIgICNpZiBkZWZpbmVkIChFRkZFQ1RfTk9JU0VfVEVYVFVSRSlcXG5cIiArXG5cIiAgXFxuXCIgK1xuXCIgICNpZiBkZWZpbmVkKEVGRkVDVF9OT0lTRV9BTklNQVRBQkxFKSAmJiBkZWZpbmVkKEVGRkVDVF9OT0lTRV9BTklNQVRFRClcXG5cIiArXG5cIiAgY29sb3IgKj0gKGFicyhhX3hfY25vaXNlKCh2X3Bvc2l0aW9uX3dvcmxkLnh5eiArIHZlYzModV90aW1lICogNS4sIHVfdGltZSAqIDcuNSwgdV90aW1lICogMTAuKSkgLyAxMC4wKSkgLyA0LjApICsgMC43NTtcXG5cIiArXG5cIiAgI2VuZGlmXFxuXCIgK1xuXCIgIFxcblwiICtcblwiICAjaWZuZGVmIEVGRkVDVF9OT0lTRV9BTklNQVRBQkxFXFxuXCIgK1xuXCIgIGNvbG9yICo9IChhYnMoYV94X2Nub2lzZSh2X3Bvc2l0aW9uX3dvcmxkLnh5eiAvIDEwLjApKSAvIDQuMCkgKyAwLjc1O1xcblwiICtcblwiICAjZW5kaWZcXG5cIiArXG5cIiAgXFxuXCIgK1xuXCIgICNlbmRpZlxcblwiICtcblwiICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yLCAxLjApO1xcblwiICtcblwifVxcblwiICtcblwiXCI7XG5cbnNoYWRlcl9zb3VyY2VzWydwb2x5Z29uX3ZlcnRleCddID1cblwiXFxuXCIgK1xuXCIjZGVmaW5lIEdMU0xJRlkgMVxcblwiICtcblwiXFxuXCIgK1xuXCJ1bmlmb3JtIHZlYzIgdV9yZXNvbHV0aW9uO1xcblwiICtcblwidW5pZm9ybSB2ZWMyIHVfYXNwZWN0O1xcblwiICtcblwidW5pZm9ybSBmbG9hdCB1X3RpbWU7XFxuXCIgK1xuXCJ1bmlmb3JtIG1hdDQgdV90aWxlX3dvcmxkO1xcblwiICtcblwidW5pZm9ybSBtYXQ0IHVfdGlsZV92aWV3O1xcblwiICtcblwidW5pZm9ybSBtYXQ0IHVfbWV0ZXJfdmlldztcXG5cIiArXG5cInVuaWZvcm0gZmxvYXQgdV9tZXRlcnNfcGVyX3BpeGVsO1xcblwiICtcblwidW5pZm9ybSBmbG9hdCB1X251bV9sYXllcnM7XFxuXCIgK1xuXCJhdHRyaWJ1dGUgdmVjMyBhX3Bvc2l0aW9uO1xcblwiICtcblwiYXR0cmlidXRlIHZlYzMgYV9ub3JtYWw7XFxuXCIgK1xuXCJhdHRyaWJ1dGUgdmVjMyBhX2NvbG9yO1xcblwiICtcblwiYXR0cmlidXRlIGZsb2F0IGFfbGF5ZXI7XFxuXCIgK1xuXCJ2YXJ5aW5nIHZlYzMgdl9jb2xvcjtcXG5cIiArXG5cIiNpZiAhZGVmaW5lZChMSUdIVElOR19WRVJURVgpXFxuXCIgK1xuXCJcXG5cIiArXG5cInZhcnlpbmcgdmVjNCB2X3Bvc2l0aW9uO1xcblwiICtcblwidmFyeWluZyB2ZWMzIHZfbm9ybWFsO1xcblwiICtcblwiI2VuZGlmXFxuXCIgK1xuXCJcXG5cIiArXG5cIiNpZiBkZWZpbmVkKEVGRkVDVF9OT0lTRV9URVhUVVJFKVxcblwiICtcblwiXFxuXCIgK1xuXCJ2YXJ5aW5nIHZlYzQgdl9wb3NpdGlvbl93b3JsZDtcXG5cIiArXG5cIiNlbmRpZlxcblwiICtcblwiXFxuXCIgK1xuXCJjb25zdCBmbG9hdCBsaWdodF9hbWJpZW50ID0gMC41O1xcblwiICtcblwidmVjNCBhX3hfcGVyc3BlY3RpdmUodmVjNCBwb3NpdGlvbiwgY29uc3QgdmVjMiBwZXJzcGVjdGl2ZV9vZmZzZXQsIGNvbnN0IHZlYzIgcGVyc3BlY3RpdmVfZmFjdG9yKSB7XFxuXCIgK1xuXCIgIHBvc2l0aW9uLnh5ICs9IHBvc2l0aW9uLnogKiBwZXJzcGVjdGl2ZV9mYWN0b3IgKiAocG9zaXRpb24ueHkgLSBwZXJzcGVjdGl2ZV9vZmZzZXQpO1xcblwiICtcblwiICByZXR1cm4gcG9zaXRpb247XFxuXCIgK1xuXCJ9XFxuXCIgK1xuXCJ2ZWM0IGJfeF9pc29tZXRyaWModmVjNCBwb3NpdGlvbiwgY29uc3QgdmVjMiBheGlzLCBjb25zdCBmbG9hdCBtdWx0aXBsaWVyKSB7XFxuXCIgK1xuXCIgIHBvc2l0aW9uLnh5ICs9IHBvc2l0aW9uLnogKiBheGlzICogbXVsdGlwbGllciAvIHVfYXNwZWN0O1xcblwiICtcblwiICByZXR1cm4gcG9zaXRpb247XFxuXCIgK1xuXCJ9XFxuXCIgK1xuXCJ2ZWM0IGNfeF9wb3B1cCh2ZWM0IHBvc2l0aW9uLCBjb25zdCB2ZWMyIGNlbnRlciwgY29uc3QgZmxvYXQgcmFkaXVzKSB7XFxuXCIgK1xuXCIgIGlmKHBvc2l0aW9uLnogPiAwLikge1xcblwiICtcblwiICAgIGZsb2F0IGNkID0gZGlzdGFuY2UocG9zaXRpb24ueHksIGNlbnRlcik7XFxuXCIgK1xuXCIgICAgZmxvYXQgcG9wdXBfZmFkZV9pbm5lciA9IHJhZGl1cyAqIDIuIC8gMy47XFxuXCIgK1xuXCIgICAgZmxvYXQgcG9wdXBfZmFkZV9vdXRlciA9IHJhZGl1cztcXG5cIiArXG5cIiAgICBpZihjZCA+IHBvcHVwX2ZhZGVfaW5uZXIpIHtcXG5cIiArXG5cIiAgICAgIHBvc2l0aW9uLnogKj0gMS4wIC0gc21vb3Roc3RlcChwb3B1cF9mYWRlX2lubmVyLCBwb3B1cF9mYWRlX291dGVyLCBjZCk7XFxuXCIgK1xuXCIgICAgfVxcblwiICtcblwiICB9XFxuXCIgK1xuXCIgIHJldHVybiBwb3NpdGlvbjtcXG5cIiArXG5cIn1cXG5cIiArXG5cImZsb2F0IGRfeF9jYWxjdWxhdGVaKGZsb2F0IHosIGZsb2F0IGxheWVyLCBjb25zdCBmbG9hdCBudW1fbGF5ZXJzLCBjb25zdCBmbG9hdCB6X2xheWVyX3NjYWxlKSB7XFxuXCIgK1xuXCIgIGZsb2F0IHpfbGF5ZXJfcmFuZ2UgPSAobnVtX2xheWVycyArIDEuKSAqIHpfbGF5ZXJfc2NhbGU7XFxuXCIgK1xuXCIgIGZsb2F0IHpfbGF5ZXIgPSAobGF5ZXIgKyAxLikgKiB6X2xheWVyX3NjYWxlO1xcblwiICtcblwiICB6ID0gel9sYXllciArIGNsYW1wKHosIDAuLCB6X2xheWVyX3NjYWxlKTtcXG5cIiArXG5cIiAgeiA9ICh6X2xheWVyX3JhbmdlIC0geikgLyB6X2xheWVyX3JhbmdlO1xcblwiICtcblwiICByZXR1cm4gejtcXG5cIiArXG5cIn1cXG5cIiArXG5cInZlYzMgZl94X3BvaW50TGlnaHQodmVjNCBwb3NpdGlvbiwgdmVjMyBub3JtYWwsIHZlYzMgY29sb3IsIHZlYzQgbGlnaHRfcG9zLCBmbG9hdCBsaWdodF9hbWJpZW50LCBjb25zdCBib29sIGJhY2tsaWdodCkge1xcblwiICtcblwiICB2ZWMzIGxpZ2h0X2RpciA9IG5vcm1hbGl6ZShwb3NpdGlvbi54eXogLSBsaWdodF9wb3MueHl6KTtcXG5cIiArXG5cIiAgY29sb3IgKj0gYWJzKG1heChmbG9hdChiYWNrbGlnaHQpICogLTEuLCBkb3Qobm9ybWFsLCBsaWdodF9kaXIgKiAtMS4wKSkpICsgbGlnaHRfYW1iaWVudDtcXG5cIiArXG5cIiAgcmV0dXJuIGNvbG9yO1xcblwiICtcblwifVxcblwiICtcblwidmVjMyBnX3hfZGlyZWN0aW9uYWxMaWdodCh2ZWMzIG5vcm1hbCwgdmVjMyBjb2xvciwgdmVjMyBsaWdodF9kaXIsIGZsb2F0IGxpZ2h0X2FtYmllbnQpIHtcXG5cIiArXG5cIiAgbGlnaHRfZGlyID0gbm9ybWFsaXplKGxpZ2h0X2Rpcik7XFxuXCIgK1xuXCIgIGNvbG9yICo9IGRvdChub3JtYWwsIGxpZ2h0X2RpciAqIC0xLjApICsgbGlnaHRfYW1iaWVudDtcXG5cIiArXG5cIiAgcmV0dXJuIGNvbG9yO1xcblwiICtcblwifVxcblwiICtcblwidmVjMyBlX3hfbGlnaHRpbmcodmVjNCBwb3NpdGlvbiwgdmVjMyBub3JtYWwsIHZlYzMgY29sb3IsIHZlYzQgbGlnaHRfcG9zLCB2ZWM0IG5pZ2h0X2xpZ2h0X3BvcywgdmVjMyBsaWdodF9kaXIsIGZsb2F0IGxpZ2h0X2FtYmllbnQpIHtcXG5cIiArXG5cIiAgXFxuXCIgK1xuXCIgICNpZiBkZWZpbmVkKExJR0hUSU5HX1BPSU5UKVxcblwiICtcblwiICBjb2xvciA9IGZfeF9wb2ludExpZ2h0KHBvc2l0aW9uLCBub3JtYWwsIGNvbG9yLCBsaWdodF9wb3MsIGxpZ2h0X2FtYmllbnQsIHRydWUpO1xcblwiICtcblwiICAjZWxpZiBkZWZpbmVkKExJR0hUSU5HX05JR0hUKVxcblwiICtcblwiICBjb2xvciA9IGZfeF9wb2ludExpZ2h0KHBvc2l0aW9uLCBub3JtYWwsIGNvbG9yLCBuaWdodF9saWdodF9wb3MsIDAuLCBmYWxzZSk7XFxuXCIgK1xuXCIgICNlbGlmIGRlZmluZWQoTElHSFRJTkdfRElSRUNUSU9OKVxcblwiICtcblwiICBjb2xvciA9IGdfeF9kaXJlY3Rpb25hbExpZ2h0KG5vcm1hbCwgY29sb3IsIGxpZ2h0X2RpciwgbGlnaHRfYW1iaWVudCk7XFxuXCIgK1xuXCIgICNlbHNlXFxuXCIgK1xuXCIgIGNvbG9yID0gY29sb3I7XFxuXCIgK1xuXCIgICNlbmRpZlxcblwiICtcblwiICByZXR1cm4gY29sb3I7XFxuXCIgK1xuXCJ9XFxuXCIgK1xuXCJ2b2lkIG1haW4oKSB7XFxuXCIgK1xuXCIgIHZlYzQgcG9zaXRpb24gPSB1X3RpbGVfdmlldyAqIHZlYzQoYV9wb3NpdGlvbiwgMS4pO1xcblwiICtcblwiICB2ZWM0IHBvc2l0aW9uX3dvcmxkID0gdV90aWxlX3dvcmxkICogdmVjNChhX3Bvc2l0aW9uLCAxLik7XFxuXCIgK1xuXCIgIGlmKHBvc2l0aW9uX3dvcmxkLnogPiAwLikge1xcblwiICtcblwiICAgIFxcblwiICtcblwiICAgICNpZiBkZWZpbmVkKEFOSU1BVElPTl9FTEVWQVRPUilcXG5cIiArXG5cIiAgICBwb3NpdGlvbi56ICo9IG1heCgoc2luKHBvc2l0aW9uX3dvcmxkLnogKyB1X3RpbWUpICsgMS4wKSAvIDIuMCwgMC4wNSk7XFxuXCIgK1xuXCIgICAgI2VsaWYgZGVmaW5lZChBTklNQVRJT05fV0FWRSlcXG5cIiArXG5cIiAgICBwb3NpdGlvbi56ICo9IG1heCgoc2luKHBvc2l0aW9uX3dvcmxkLnggLyAxMDAuMCArIHVfdGltZSkgKyAxLjApIC8gMi4wLCAwLjA1KTtcXG5cIiArXG5cIiAgICAjZW5kaWZcXG5cIiArXG5cIiAgICBcXG5cIiArXG5cIiAgfVxcblwiICtcblwiICAjaWYgZGVmaW5lZChQUk9KRUNUSU9OX1BPUFVQKVxcblwiICtcblwiICBwb3NpdGlvbi56ICo9IDEuMTtcXG5cIiArXG5cIiAgcG9zaXRpb24gPSBjX3hfcG9wdXAocG9zaXRpb24sIHZlYzIoMC4sIDAuKSwgMjI1LiAqIHVfbWV0ZXJzX3Blcl9waXhlbCk7XFxuXCIgK1xuXCIgICNlbmRpZlxcblwiICtcblwiICBcXG5cIiArXG5cIiAgI2lmIGRlZmluZWQoRUZGRUNUX05PSVNFX1RFWFRVUkUpXFxuXCIgK1xuXCIgIHZfcG9zaXRpb25fd29ybGQgPSBwb3NpdGlvbl93b3JsZDtcXG5cIiArXG5cIiAgI2VuZGlmXFxuXCIgK1xuXCIgIFxcblwiICtcblwiICAjaWYgZGVmaW5lZChMSUdIVElOR19WRVJURVgpXFxuXCIgK1xuXCIgIHZfY29sb3IgPSBlX3hfbGlnaHRpbmcocG9zaXRpb24sIGFfbm9ybWFsLCBhX2NvbG9yLCB2ZWM0KDAuLCAwLiwgMTUwLiAqIHVfbWV0ZXJzX3Blcl9waXhlbCwgMS4pLCB2ZWM0KDAuLCAwLiwgNTAuICogdV9tZXRlcnNfcGVyX3BpeGVsLCAxLiksIHZlYzMoMC4yLCAwLjcsIC0wLjUpLCBsaWdodF9hbWJpZW50KTtcXG5cIiArXG5cIiAgI2Vsc2VcXG5cIiArXG5cIiAgdl9wb3NpdGlvbiA9IHBvc2l0aW9uO1xcblwiICtcblwiICB2X25vcm1hbCA9IGFfbm9ybWFsO1xcblwiICtcblwiICB2X2NvbG9yID0gYV9jb2xvcjtcXG5cIiArXG5cIiAgI2VuZGlmXFxuXCIgK1xuXCIgIHBvc2l0aW9uID0gdV9tZXRlcl92aWV3ICogcG9zaXRpb247XFxuXCIgK1xuXCIgICNpZiBkZWZpbmVkKFBST0pFQ1RJT05fUEVSU1BFQ1RJVkUpXFxuXCIgK1xuXCIgIHBvc2l0aW9uID0gYV94X3BlcnNwZWN0aXZlKHBvc2l0aW9uLCB2ZWMyKC0wLjI1LCAtMC4yNSksIHZlYzIoMC42LCAwLjYpKTtcXG5cIiArXG5cIiAgI2VsaWYgZGVmaW5lZChQUk9KRUNUSU9OX0lTT01FVFJJQykgfHwgZGVmaW5lZChQUk9KRUNUSU9OX1BPUFVQKVxcblwiICtcblwiICBwb3NpdGlvbiA9IGJfeF9pc29tZXRyaWMocG9zaXRpb24sIHZlYzIoMC4sIDEuKSwgMS4pO1xcblwiICtcblwiICAjZW5kaWZcXG5cIiArXG5cIiAgcG9zaXRpb24ueiA9IGRfeF9jYWxjdWxhdGVaKHBvc2l0aW9uLnosIGFfbGF5ZXIsIHVfbnVtX2xheWVycywgNDA5Ni4pO1xcblwiICtcblwiICBnbF9Qb3NpdGlvbiA9IHBvc2l0aW9uO1xcblwiICtcblwifVxcblwiICtcblwiXCI7XG5cbmlmIChtb2R1bGUuZXhwb3J0cyAhPT0gdW5kZWZpbmVkKSB7IG1vZHVsZS5leHBvcnRzID0gc2hhZGVyX3NvdXJjZXM7IH1cblxuIiwidmFyIFZlY3RvclJlbmRlcmVyID0gcmVxdWlyZSgnLi92ZWN0b3JfcmVuZGVyZXIuanMnKTtcblxudmFyIExlYWZsZXRMYXllciA9IEwuR3JpZExheWVyLmV4dGVuZCh7XG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICBMLnNldE9wdGlvbnModGhpcywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMub3B0aW9ucy52ZWN0b3JSZW5kZXJlciA9IHRoaXMub3B0aW9ucy52ZWN0b3JSZW5kZXJlciB8fCAnR0xSZW5kZXJlcic7XG4gICAgICAgIHRoaXMucmVuZGVyZXIgPSBWZWN0b3JSZW5kZXJlci5jcmVhdGUodGhpcy5vcHRpb25zLnZlY3RvclJlbmRlcmVyLCB0aGlzLm9wdGlvbnMudmVjdG9yVGlsZVNvdXJjZSwgdGhpcy5vcHRpb25zLnZlY3RvckxheWVycywgdGhpcy5vcHRpb25zLnZlY3RvclN0eWxlcywgeyBudW1fd29ya2VyczogdGhpcy5vcHRpb25zLm51bVdvcmtlcnMgfSk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuZGVidWcgPSB0aGlzLm9wdGlvbnMuZGVidWc7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuY29udGludW91c19hbmltYXRpb24gPSBmYWxzZTsgLy8gc2V0IHRvIHRydWUgZm9yIGFuaW1hdGlub3MsIGV0Yy4gKGV2ZW50dWFsbHkgd2lsbCBiZSBhdXRvbWF0ZWQpXG4gICAgfSxcblxuICAgIC8vIEZpbmlzaCBpbml0aWFsaXppbmcgcmVuZGVyZXIgYW5kIHNldHVwIGV2ZW50cyB3aGVuIGxheWVyIGlzIGFkZGVkIHRvIG1hcFxuICAgIG9uQWRkOiBmdW5jdGlvbiAobWFwKSB7XG4gICAgICAgIHZhciBsYXllciA9IHRoaXM7XG5cbiAgICAgICAgbGF5ZXIub24oJ3RpbGV1bmxvYWQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciB0aWxlID0gZXZlbnQudGlsZTtcbiAgICAgICAgICAgIHZhciBrZXkgPSB0aWxlLmdldEF0dHJpYnV0ZSgnZGF0YS10aWxlLWtleScpO1xuICAgICAgICAgICAgbGF5ZXIucmVuZGVyZXIucmVtb3ZlVGlsZShrZXkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBsYXllci5fbWFwLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2l6ZSA9IGxheWVyLl9tYXAuZ2V0U2l6ZSgpO1xuICAgICAgICAgICAgbGF5ZXIucmVuZGVyZXIucmVzaXplTWFwKHNpemUueCwgc2l6ZS55KTtcbiAgICAgICAgICAgIGxheWVyLnVwZGF0ZUJvdW5kcygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBsYXllci5fbWFwLm9uKCdtb3ZlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNlbnRlciA9IGxheWVyLl9tYXAuZ2V0Q2VudGVyKCk7XG4gICAgICAgICAgICBsYXllci5yZW5kZXJlci5zZXRDZW50ZXIoY2VudGVyLmxuZywgY2VudGVyLmxhdCk7XG4gICAgICAgICAgICBsYXllci51cGRhdGVCb3VuZHMoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGF5ZXIuX21hcC5vbignem9vbXN0YXJ0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJtYXAuem9vbXN0YXJ0IFwiICsgbGF5ZXIuX21hcC5nZXRab29tKCkpO1xuICAgICAgICAgICAgbGF5ZXIucmVuZGVyZXIuc3RhcnRab29tKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxheWVyLl9tYXAub24oJ3pvb21lbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm1hcC56b29tZW5kIFwiICsgbGF5ZXIuX21hcC5nZXRab29tKCkpO1xuICAgICAgICAgICAgbGF5ZXIucmVuZGVyZXIuc2V0Wm9vbShsYXllci5fbWFwLmdldFpvb20oKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIENhbnZhcyBlbGVtZW50IHdpbGwgYmUgaW5zZXJ0ZWQgYWZ0ZXIgbWFwIGNvbnRhaW5lciAobGVhZmxldCB0cmFuc2Zvcm1zIHNob3VsZG4ndCBiZSBhcHBsaWVkIHRvIHRoZSBHTCBjYW52YXMpXG4gICAgICAgIC8vIFRPRE86IGZpbmQgYSBiZXR0ZXIgd2F5IHRvIGRlYWwgd2l0aCB0aGlzPyByaWdodCBub3cgR0wgbWFwIG9ubHkgcmVuZGVycyBjb3JyZWN0bHkgYXMgdGhlIGJvdHRvbSBsYXllclxuICAgICAgICBsYXllci5yZW5kZXJlci5jb250YWluZXIgPSBsYXllci5fbWFwLmdldENvbnRhaW5lcigpO1xuXG4gICAgICAgIHZhciBjZW50ZXIgPSBsYXllci5fbWFwLmdldENlbnRlcigpO1xuICAgICAgICBsYXllci5yZW5kZXJlci5zZXRDZW50ZXIoY2VudGVyLmxuZywgY2VudGVyLmxhdCk7XG4gICAgICAgIGxheWVyLnJlbmRlcmVyLnNldFpvb20obGF5ZXIuX21hcC5nZXRab29tKCkpO1xuICAgICAgICBsYXllci51cGRhdGVCb3VuZHMoKTtcblxuICAgICAgICBMLkdyaWRMYXllci5wcm90b3R5cGUub25BZGQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgbGF5ZXIucmVuZGVyZXIuaW5pdCgpO1xuICAgIH0sXG5cbiAgICBvblJlbW92ZTogZnVuY3Rpb24gKG1hcCkge1xuICAgICAgICBMLkdyaWRMYXllci5wcm90b3R5cGUub25SZW1vdmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgLy8gVE9ETzogcmVtb3ZlIGV2ZW50IGhhbmRsZXJzLCBkZXN0cm95IG1hcFxuICAgIH0sXG5cbiAgICBjcmVhdGVUaWxlOiBmdW5jdGlvbiAoY29vcmRzLCBkb25lKSB7XG4gICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5sb2FkVGlsZShjb29yZHMsIGRpdiwgZG9uZSk7XG4gICAgICAgIHJldHVybiBkaXY7XG4gICAgfSxcblxuICAgIHVwZGF0ZUJvdW5kczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbGF5ZXIgPSB0aGlzO1xuICAgICAgICB2YXIgYm91bmRzID0gbGF5ZXIuX21hcC5nZXRCb3VuZHMoKTtcbiAgICAgICAgbGF5ZXIucmVuZGVyZXIuc2V0Qm91bmRzKGJvdW5kcy5nZXRTb3V0aFdlc3QoKSwgYm91bmRzLmdldE5vcnRoRWFzdCgpKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKCk7XG4gICAgfVxuXG59KTtcblxudmFyIGxlYWZsZXRMYXllciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBMZWFmbGV0TGF5ZXIob3B0aW9ucyk7XG59O1xuXG5pZiAobW9kdWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgTGVhZmxldExheWVyOiBMZWFmbGV0TGF5ZXIsXG4gICAgICAgIGxlYWZsZXRMYXllcjogbGVhZmxldExheWVyXG4gICAgfTtcbn1cbiIsIi8vIE1vZHVsZXMgYW5kIGRlcGVuZGVuY2llcyB0byBleHBvc2UgaW4gdGhlIHB1YmxpYyBUYW5ncmFtIG1vZHVsZVxuXG4vLyBUaGUgbGVhZmxldCBsYXllciBwbHVnaW4gaXMgY3VycmVudGx5IHRoZSBwcmltYXJ5IG1lYW5zIG9mIHVzaW5nIHRoZSBsaWJyYXJ5XG52YXIgTGVhZmxldCA9IHJlcXVpcmUoJy4vbGVhZmxldF9sYXllci5qcycpO1xuXG4vLyBSZW5kZXJlciBtb2R1bGVzIG5lZWQgdG8gYmUgZXhwbGljaXRseSBpbmNsdWRlZCBzaW5jZSB0aGV5IGFyZSBub3Qgb3RoZXJ3aXNlIHJlZmVyZW5jZWRcbnJlcXVpcmUoJy4vZ2wvZ2xfcmVuZGVyZXIuanMnKTtcbnJlcXVpcmUoJy4vY2FudmFzL2NhbnZhc19yZW5kZXJlci5qcycpO1xuXG4vLyBHTCBmdW5jdGlvbnMgaW5jbHVkZWQgZm9yIGVhc2llciBkZWJ1Z2dpbmcgLyBkaXJlY3QgYWNjZXNzIHRvIHNldHRpbmcgZ2xvYmFsIGRlZmluZXMsIHJlbG9hZGluZyBwcm9ncmFtcywgZXRjLlxudmFyIEdMID0gcmVxdWlyZSgnLi9nbC9nbC5qcycpO1xuXG5pZiAobW9kdWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgTGVhZmxldExheWVyOiBMZWFmbGV0LkxlYWZsZXRMYXllcixcbiAgICAgICAgbGVhZmxldExheWVyOiBMZWFmbGV0LmxlYWZsZXRMYXllcixcbiAgICAgICAgR0w6IEdMXG4gICAgfTtcbn1cbiIsIi8vIFBvaW50XG5mdW5jdGlvbiBQb2ludCAoeCwgeSlcbntcbiAgICByZXR1cm4geyB4OiB4LCB5OiB5IH07XG59XG5cblBvaW50LmNvcHkgPSBmdW5jdGlvbiAocClcbntcbiAgICBpZiAocCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4geyB4OiBwLngsIHk6IHAueSB9O1xufTtcblxuaWYgKG1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBQb2ludDtcbn1cbiIsIi8qKiogU3R5bGUgaGVscGVycyAqKiovXG52YXIgR2VvID0gcmVxdWlyZSgnLi9nZW8uanMnKTtcblxudmFyIFN0eWxlID0ge307XG5cblN0eWxlLmNvbG9yID0ge1xuICAgIHBzZXVkb1JhbmRvbUdyYXlzY2FsZTogZnVuY3Rpb24gKGYpIHsgdmFyIGMgPSBNYXRoLm1heCgocGFyc2VJbnQoZi5pZCwgMTYpICUgMTAwKSAvIDEwMCwgMC40KTsgcmV0dXJuIFswLjcgKiBjLCAwLjcgKiBjLCAwLjcgKiBjXTsgfSwgLy8gcHNldWRvLXJhbmRvbSBncmF5c2NhbGUgYnkgZ2VvbWV0cnkgaWRcbiAgICBwc2V1ZG9SYW5kb21Db2xvcjogZnVuY3Rpb24gKGYpIHsgcmV0dXJuIFswLjcgKiAocGFyc2VJbnQoZi5pZCwgMTYpIC8gMTAwICUgMSksIDAuNyAqIChwYXJzZUludChmLmlkLCAxNikgLyAxMDAwMCAlIDEpLCAwLjcgKiAocGFyc2VJbnQoZi5pZCwgMTYpIC8gMTAwMDAwMCAlIDEpXTsgfSwgLy8gcHNldWRvLXJhbmRvbSBjb2xvciBieSBnZW9tZXRyeSBpZFxuICAgIHJhbmRvbUNvbG9yOiBmdW5jdGlvbiAoZikgeyByZXR1cm4gWzAuNyAqIE1hdGgucmFuZG9tKCksIDAuNyAqIE1hdGgucmFuZG9tKCksIDAuNyAqIE1hdGgucmFuZG9tKCldOyB9IC8vIHJhbmRvbSBjb2xvclxufTtcblxuLy8gUmV0dXJucyBhIGZ1bmN0aW9uICh0aGF0IGNhbiBiZSB1c2VkIGFzIGEgZHluYW1pYyBzdHlsZSkgdGhhdCBjb252ZXJ0cyBwaXhlbHMgdG8gbWV0ZXJzIGZvciB0aGUgY3VycmVudCB6b29tIGxldmVsLlxuLy8gVGhlIHByb3ZpZGVkIHBpeGVsIHZhbHVlICgncCcpIGNhbiBpdHNlbGYgYmUgYSBmdW5jdGlvbiwgaW4gd2hpY2ggY2FzZSBpdCBpcyB3cmFwcGVkIGJ5IHRoaXMgb25lLlxuU3R5bGUucGl4ZWxzID0gZnVuY3Rpb24gKHAsIHopIHtcbiAgICB2YXIgZjtcbiAgICBldmFsKCdmID0gZnVuY3Rpb24oZiwgdCwgaCkgeyByZXR1cm4gJyArICh0eXBlb2YgcCA9PSAnZnVuY3Rpb24nID8gJygnICsgKHAudG9TdHJpbmcoKSArICcoZiwgdCwgaCkpJykgOiBwKSArICcgKiBoLkdlby5tZXRlcnNfcGVyX3BpeGVsW2guem9vbV07IH0nKTtcbiAgICByZXR1cm4gZjtcbn07XG5cbmlmIChtb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gU3R5bGU7XG59XG4iLCIvLyBNaXNjZWxsYW5lb3VzIHV0aWxpdGllc1xuXG4vLyBTdHJpbmdpZnkgYW4gb2JqZWN0IGludG8gSlNPTiwgYnV0IGNvbnZlcnQgZnVuY3Rpb25zIHRvIHN0cmluZ3NcbmZ1bmN0aW9uIHNlcmlhbGl6ZVdpdGhGdW5jdGlvbnMgKG9iailcbntcbiAgICB2YXIgc2VyaWFsaXplZCA9IEpTT04uc3RyaW5naWZ5KG9iaiwgZnVuY3Rpb24oaywgdikge1xuICAgICAgICAvLyBDb252ZXJ0IGZ1bmN0aW9ucyB0byBzdHJpbmdzXG4gICAgICAgIGlmICh0eXBlb2YgdiA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gdi50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNlcmlhbGl6ZWQ7XG59O1xuXG4vLyBQYXJzZSBhIEpTT04gc3RyaW5nLCBidXQgY29udmVydCBmdW5jdGlvbi1saWtlIHN0cmluZ3MgYmFjayBpbnRvIGZ1bmN0aW9uc1xuZnVuY3Rpb24gZGVzZXJpYWxpemVXaXRoRnVuY3Rpb25zIChzZXJpYWxpemVkKSB7XG4gICAgdmFyIG9iaiA9IEpTT04ucGFyc2Uoc2VyaWFsaXplZCk7XG4gICAgb2JqID0gc3RyaW5nc1RvRnVuY3Rpb25zKG9iaik7XG5cbiAgICByZXR1cm4gb2JqO1xufTtcblxuLy8gUmVjdXJzaXZlbHkgcGFyc2UgYW4gb2JqZWN0LCBhdHRlbXB0aW5nIHRvIGNvbnZlcnQgc3RyaW5nIHByb3BlcnRpZXMgdGhhdCBsb29rIGxpa2UgZnVuY3Rpb25zIGJhY2sgaW50byBmdW5jdGlvbnNcbmZ1bmN0aW9uIHN0cmluZ3NUb0Z1bmN0aW9ucyAob2JqKSB7XG4gICAgZm9yICh2YXIgcCBpbiBvYmopIHtcbiAgICAgICAgdmFyIHZhbCA9IG9ialtwXTtcblxuICAgICAgICAvLyBMb29wIHRocm91Z2ggb2JqZWN0IHByb3BlcnRpZXNcbiAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIG9ialtwXSA9IHN0cmluZ3NUb0Z1bmN0aW9ucyh2YWwpO1xuICAgICAgICB9XG4gICAgICAgIC8vIENvbnZlcnQgc3RyaW5ncyBiYWNrIGludG8gZnVuY3Rpb25zXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWwgPT0gJ3N0cmluZycgJiYgdmFsLm1hdGNoKC9eZnVuY3Rpb24uKlxcKC4qXFwpLykgIT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIGY7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGV2YWwoJ2YgPSAnICsgdmFsKTtcbiAgICAgICAgICAgICAgICBvYmpbcF0gPSBmO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAvLyBmYWxsLWJhY2sgdG8gb3JpZ2luYWwgdmFsdWUgaWYgcGFyc2luZyBmYWlsZWRcbiAgICAgICAgICAgICAgICBvYmpbcF0gPSB2YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xufTtcblxuaWYgKG1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICAgIHNlcmlhbGl6ZVdpdGhGdW5jdGlvbnM6IHNlcmlhbGl6ZVdpdGhGdW5jdGlvbnMsXG4gICAgICAgIGRlc2VyaWFsaXplV2l0aEZ1bmN0aW9uczogZGVzZXJpYWxpemVXaXRoRnVuY3Rpb25zXG4gICAgfTtcbn1cbiIsIi8qKiogVmVjdG9yIGZ1bmN0aW9ucyAtIHZlY3RvcnMgcHJvdmlkZWQgYXMgW3gsIHksIHpdIGFycmF5cyAqKiovXG5cbnZhciBWZWN0b3IgPSB7fTtcblxuLy8gVmVjdG9yIGxlbmd0aCBzcXVhcmVkXG5WZWN0b3IubGVuZ3RoU3EgPSBmdW5jdGlvbiAodilcbntcbiAgICBpZiAodi5sZW5ndGggPT0gMikge1xuICAgICAgICByZXR1cm4gKHZbMF0qdlswXSArIHZbMV0qdlsxXSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gKHZbMF0qdlswXSArIHZbMV0qdlsxXSArIHZbMl0qdlsyXSk7XG4gICAgfVxufTtcblxuLy8gVmVjdG9yIGxlbmd0aFxuVmVjdG9yLmxlbmd0aCA9IGZ1bmN0aW9uICh2KVxue1xuICAgIHJldHVybiBNYXRoLnNxcnQoVmVjdG9yLmxlbmd0aFNxKHYpKTtcbn07XG5cbi8vIE5vcm1hbGl6ZSBhIHZlY3RvclxuVmVjdG9yLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uICh2KVxue1xuICAgIHZhciBkO1xuICAgIGlmICh2Lmxlbmd0aCA9PSAyKSB7XG4gICAgICAgIGQgPSB2WzBdKnZbMF0gKyB2WzFdKnZbMV07XG4gICAgICAgIGQgPSBNYXRoLnNxcnQoZCk7XG5cbiAgICAgICAgaWYgKGQgIT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFt2WzBdIC8gZCwgdlsxXSAvIGRdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbMCwgMF07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgZCA9IHZbMF0qdlswXSArIHZbMV0qdlsxXSArIHZbMl0qdlsyXTtcbiAgICAgICAgZCA9IE1hdGguc3FydChkKTtcblxuICAgICAgICBpZiAoZCAhPSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gW3ZbMF0gLyBkLCB2WzFdIC8gZCwgdlsyXSAvIGRdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbMCwgMCwgMF07XG4gICAgfVxufTtcblxuLy8gQ3Jvc3MgcHJvZHVjdCBvZiB0d28gdmVjdG9yc1xuVmVjdG9yLmNyb3NzICA9IGZ1bmN0aW9uICh2MSwgdjIpXG57XG4gICAgcmV0dXJuIFtcbiAgICAgICAgKHYxWzFdICogdjJbMl0pIC0gKHYxWzJdICogdjJbMV0pLFxuICAgICAgICAodjFbMl0gKiB2MlswXSkgLSAodjFbMF0gKiB2MlsyXSksXG4gICAgICAgICh2MVswXSAqIHYyWzFdKSAtICh2MVsxXSAqIHYyWzBdKVxuICAgIF07XG59O1xuXG4vLyBGaW5kIHRoZSBpbnRlcnNlY3Rpb24gb2YgdHdvIGxpbmVzIHNwZWNpZmllZCBhcyBzZWdtZW50cyBmcm9tIHBvaW50cyAocDEsIHAyKSBhbmQgKHAzLCBwNClcbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGluZS1saW5lX2ludGVyc2VjdGlvblxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9DcmFtZXInc19ydWxlXG5WZWN0b3IubGluZUludGVyc2VjdGlvbiA9IGZ1bmN0aW9uIChwMSwgcDIsIHAzLCBwNCwgcGFyYWxsZWxfdG9sZXJhbmNlKVxue1xuICAgIHZhciBwYXJhbGxlbF90b2xlcmFuY2UgPSBwYXJhbGxlbF90b2xlcmFuY2UgfHwgMC4wMTtcblxuICAgIC8vIGExKnggKyBiMSp5ID0gYzEgZm9yIGxpbmUgKHgxLCB5MSkgdG8gKHgyLCB5MilcbiAgICAvLyBhMip4ICsgYjIqeSA9IGMyIGZvciBsaW5lICh4MywgeTMpIHRvICh4NCwgeTQpXG4gICAgdmFyIGExID0gcDFbMV0gLSBwMlsxXTsgLy8geTEgLSB5MlxuICAgIHZhciBiMSA9IHAxWzBdIC0gcDJbMF07IC8vIHgxIC0geDJcbiAgICB2YXIgYTIgPSBwM1sxXSAtIHA0WzFdOyAvLyB5MyAtIHk0XG4gICAgdmFyIGIyID0gcDNbMF0gLSBwNFswXTsgLy8geDMgLSB4NFxuICAgIHZhciBjMSA9IChwMVswXSAqIHAyWzFdKSAtIChwMVsxXSAqIHAyWzBdKTsgLy8geDEqeTIgLSB5MSp4MlxuICAgIHZhciBjMiA9IChwM1swXSAqIHA0WzFdKSAtIChwM1sxXSAqIHA0WzBdKTsgLy8geDMqeTQgLSB5Myp4NFxuICAgIHZhciBkZW5vbSA9IChiMSAqIGEyKSAtIChhMSAqIGIyKTtcblxuICAgIGlmIChNYXRoLmFicyhkZW5vbSkgPiBwYXJhbGxlbF90b2xlcmFuY2UpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICgoYzEgKiBiMikgLSAoYjEgKiBjMikpIC8gZGVub20sXG4gICAgICAgICAgICAoKGMxICogYTIpIC0gKGExICogYzIpKSAvIGRlbm9tXG4gICAgICAgIF07XG4gICAgfVxuICAgIHJldHVybiBudWxsOyAvLyByZXR1cm4gbnVsbCBpZiBsaW5lcyBhcmUgKGNsb3NlIHRvKSBwYXJhbGxlbFxufTtcblxuaWYgKG1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBWZWN0b3I7XG59XG4iLCJ2YXIgUG9pbnQgPSByZXF1aXJlKCcuL3BvaW50LmpzJyk7XG52YXIgR2VvID0gcmVxdWlyZSgnLi9nZW8uanMnKTtcbnZhciBTdHlsZSA9IHJlcXVpcmUoJy4vc3R5bGUuanMnKTtcbnZhciBVdGlscyA9IHJlcXVpcmUoJy4vdXRpbHMuanMnKTtcblxuLy8gR2xvYmFsIHNldHVwXG5maW5kQmFzZUxpYnJhcnlVUkwoKTtcblZlY3RvclJlbmRlcmVyLnRpbGVfc2NhbGUgPSA0MDk2OyAvLyBjb29yZGluYXRlcyBhcmUgbG9jYWxseSBzY2FsZWQgdG8gdGhlIHJhbmdlIFswLCB0aWxlX3NjYWxlXVxuR2VvLnNldFRpbGVTY2FsZShWZWN0b3JSZW5kZXJlci50aWxlX3NjYWxlKTtcblxuLy8gTGF5ZXJzICYgc3R5bGVzOiBwYXNzIGFuIG9iamVjdCBkaXJlY3RseSwgb3IgYSBVUkwgYXMgc3RyaW5nIHRvIGxvYWQgcmVtb3RlbHlcbmZ1bmN0aW9uIFZlY3RvclJlbmRlcmVyICh0eXBlLCB0aWxlX3NvdXJjZSwgbGF5ZXJzLCBzdHlsZXMsIG9wdGlvbnMpXG57XG4gICAgdmFyIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy50aWxlX3NvdXJjZSA9IHRpbGVfc291cmNlO1xuICAgIHRoaXMudGlsZXMgPSB7fTtcbiAgICB0aGlzLm51bV93b3JrZXJzID0gb3B0aW9ucy5udW1fd29ya2VycyB8fCAxO1xuXG4gICAgaWYgKHR5cGVvZihsYXllcnMpID09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMubGF5ZXJfc291cmNlID0gVmVjdG9yUmVuZGVyZXIudXJsRm9yUGF0aChsYXllcnMpO1xuICAgICAgICB0aGlzLmxheWVycyA9IFZlY3RvclJlbmRlcmVyLmxvYWRMYXllcnModGhpcy5sYXllcl9zb3VyY2UpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5sYXllcnMgPSBsYXllcnM7XG4gICAgfVxuICAgIHRoaXMubGF5ZXJzX3NlcmlhbGl6ZWQgPSBVdGlscy5zZXJpYWxpemVXaXRoRnVuY3Rpb25zKHRoaXMubGF5ZXJzKTtcblxuICAgIGlmICh0eXBlb2Yoc3R5bGVzKSA9PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLnN0eWxlX3NvdXJjZSA9IFZlY3RvclJlbmRlcmVyLnVybEZvclBhdGgoc3R5bGVzKTtcbiAgICAgICAgdGhpcy5zdHlsZXMgPSBWZWN0b3JSZW5kZXJlci5sb2FkU3R5bGVzKHRoaXMuc3R5bGVfc291cmNlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMuc3R5bGVzID0gc3R5bGVzO1xuICAgIH1cbiAgICB0aGlzLnN0eWxlc19zZXJpYWxpemVkID0gVXRpbHMuc2VyaWFsaXplV2l0aEZ1bmN0aW9ucyh0aGlzLnN0eWxlcyk7XG5cbiAgICB0aGlzLmNyZWF0ZVdvcmtlcnMoKTtcblxuICAgIHRoaXMuem9vbSA9IG51bGw7XG4gICAgdGhpcy5jZW50ZXIgPSBudWxsO1xuICAgIHRoaXMuZGV2aWNlX3BpeGVsX3JhdGlvID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgICB0aGlzLmRpcnR5ID0gdHJ1ZTsgLy8gcmVxdWVzdCBhIHJlZHJhd1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbn1cblxuVmVjdG9yUmVuZGVyZXIuY3JlYXRlID0gZnVuY3Rpb24gKHR5cGUsIHRpbGVfc291cmNlLCBsYXllcnMsIHN0eWxlcywgb3B0aW9ucylcbntcbiAgICByZXR1cm4gbmV3IFZlY3RvclJlbmRlcmVyW3R5cGVdKHRpbGVfc291cmNlLCBsYXllcnMsIHN0eWxlcywgb3B0aW9ucyk7XG59O1xuXG5WZWN0b3JSZW5kZXJlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpXG57XG4gICAgLy8gQ2hpbGQgY2xhc3Mtc3BlY2lmaWMgaW5pdGlhbGl6YXRpb24gKGUuZy4gR0wgY29udGV4dCBjcmVhdGlvbilcbiAgICBpZiAodHlwZW9mKHRoaXMuX2luaXQpID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5faW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIHZhciByZW5kZXJlciA9IHRoaXM7XG4gICAgdGhpcy53b3JrZXJzLmZvckVhY2goZnVuY3Rpb24od29ya2VyKSB7XG4gICAgICAgIHdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgcmVuZGVyZXIud29ya2VyQnVpbGRUaWxlQ29tcGxldGVkLmJpbmQocmVuZGVyZXIpKTtcbiAgICB9KTtcblxuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xufTtcblxuLy8gV2ViIHdvcmtlcnMgaGFuZGxlIGhlYXZ5IGR1dHkgZ2VvbWV0cnkgcHJvY2Vzc2luZ1xuVmVjdG9yUmVuZGVyZXIucHJvdG90eXBlLmNyZWF0ZVdvcmtlcnMgPSBmdW5jdGlvbiAoKVxue1xuICAgIHZhciByZW5kZXJlciA9IHRoaXM7XG4gICAgdmFyIHVybCA9IFZlY3RvclJlbmRlcmVyLmxpYnJhcnlfYmFzZV91cmwgKyAndmVjdG9yLW1hcC13b3JrZXIubWluLmpzJyArICc/JyArICgrbmV3IERhdGUoKSk7XG5cbiAgICAvLyBUbyBhbGxvdyB3b3JrZXJzIHRvIGJlIGxvYWRlZCBjcm9zcy1kb21haW4sIGZpcnN0IGxvYWQgd29ya2VyIHNvdXJjZSB2aWEgWEhSLCB0aGVuIGNyZWF0ZSBhIGxvY2FsIFVSTCB2aWEgYSBibG9iXG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB3b3JrZXJfbG9jYWxfdXJsID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW3JlcS5yZXNwb25zZV0sIHsgdHlwZTogJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQnIH0pKTtcblxuICAgICAgICByZW5kZXJlci53b3JrZXJzID0gW107XG4gICAgICAgIGZvciAodmFyIHc9MDsgdyA8IHJlbmRlcmVyLm51bV93b3JrZXJzOyB3KyspIHtcbiAgICAgICAgICAgIHJlbmRlcmVyLndvcmtlcnMucHVzaChuZXcgV29ya2VyKHdvcmtlcl9sb2NhbF91cmwpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmVxLm9wZW4oJ0dFVCcsIHVybCwgZmFsc2UgLyogYXN5bmMgZmxhZyAqLyk7XG4gICAgcmVxLnNlbmQoKTtcblxuICAgIC8vIEFsdGVybmF0ZSBmb3IgZGVidWdnaW5nIC0gdHJhZHRpb25hbCBtZXRob2Qgb2YgbG9hZGluZyBmcm9tIHJlbW90ZSBVUkwgaW5zdGVhZCBvZiBYSFItdG8tbG9jYWwtYmxvYlxuICAgIC8vIHJlbmRlcmVyLndvcmtlcnMgPSBbXTtcbiAgICAvLyBmb3IgKHZhciB3PTA7IHcgPCByZW5kZXJlci5udW1fd29ya2VyczsgdysrKSB7XG4gICAgLy8gICAgIHJlbmRlcmVyLndvcmtlcnMucHVzaChuZXcgV29ya2VyKHVybCkpO1xuICAgIC8vIH1cblxuICAgIHRoaXMubmV4dF93b3JrZXIgPSAwO1xufTtcblxuLy8gUG9zdCBhIG1lc3NhZ2UgYWJvdXQgYSB0aWxlIHRvIHRoZSBuZXh0IHdvcmtlciAocm91bmQgcm9iYmluKVxuVmVjdG9yUmVuZGVyZXIucHJvdG90eXBlLndvcmtlclBvc3RNZXNzYWdlRm9yVGlsZSA9IGZ1bmN0aW9uICh0aWxlLCBtZXNzYWdlKVxue1xuICAgIHRpbGUud29ya2VyID0gdGhpcy5uZXh0X3dvcmtlcjtcbiAgICB0aGlzLndvcmtlcnNbdGlsZS53b3JrZXJdLnBvc3RNZXNzYWdlKG1lc3NhZ2UpO1xuICAgIHRoaXMubmV4dF93b3JrZXIgPSAodGlsZS53b3JrZXIgKyAxKSAlIHRoaXMud29ya2Vycy5sZW5ndGg7XG59O1xuXG5WZWN0b3JSZW5kZXJlci5wcm90b3R5cGUuc2V0Q2VudGVyID0gZnVuY3Rpb24gKGxuZywgbGF0KVxue1xuICAgIHRoaXMuY2VudGVyID0geyBsbmc6IGxuZywgbGF0OiBsYXQgfTtcbiAgICB0aGlzLmRpcnR5ID0gdHJ1ZTtcbn07XG5cblZlY3RvclJlbmRlcmVyLnByb3RvdHlwZS5zZXRab29tID0gZnVuY3Rpb24gKHpvb20pXG57XG4gICAgdGhpcy5tYXBfbGFzdF96b29tID0gdGhpcy56b29tO1xuICAgIHRoaXMuem9vbSA9IHpvb207XG4gICAgdGhpcy5tYXBfem9vbWluZyA9IGZhbHNlO1xuICAgIHRoaXMuZGlydHkgPSB0cnVlO1xufTtcblxuVmVjdG9yUmVuZGVyZXIucHJvdG90eXBlLnN0YXJ0Wm9vbSA9IGZ1bmN0aW9uICgpXG57XG4gICAgdGhpcy5tYXBfbGFzdF96b29tID0gdGhpcy56b29tO1xuICAgIHRoaXMubWFwX3pvb21pbmcgPSB0cnVlO1xufTtcblxuVmVjdG9yUmVuZGVyZXIucHJvdG90eXBlLnNldEJvdW5kcyA9IGZ1bmN0aW9uIChzdywgbmUpXG57XG4gICAgdGhpcy5ib3VuZHMgPSB7XG4gICAgICAgIHN3OiB7IGxuZzogc3cubG5nLCBsYXQ6IHN3LmxhdCB9LFxuICAgICAgICBuZTogeyBsbmc6IG5lLmxuZywgbGF0OiBuZS5sYXQgfVxuICAgIH07XG5cbiAgICB2YXIgYnVmZmVyID0gMjAwICogR2VvLm1ldGVyc19wZXJfcGl4ZWxbfn50aGlzLnpvb21dOyAvLyBwaXhlbHMgLT4gbWV0ZXJzXG4gICAgdGhpcy5idWZmZXJlZF9tZXRlcl9ib3VuZHMgPSB7XG4gICAgICAgIHN3OiBHZW8ubGF0TG5nVG9NZXRlcnMoUG9pbnQodGhpcy5ib3VuZHMuc3cubG5nLCB0aGlzLmJvdW5kcy5zdy5sYXQpKSxcbiAgICAgICAgbmU6IEdlby5sYXRMbmdUb01ldGVycyhQb2ludCh0aGlzLmJvdW5kcy5uZS5sbmcsIHRoaXMuYm91bmRzLm5lLmxhdCkpXG4gICAgfTtcbiAgICB0aGlzLmJ1ZmZlcmVkX21ldGVyX2JvdW5kcy5zdy54IC09IGJ1ZmZlcjtcbiAgICB0aGlzLmJ1ZmZlcmVkX21ldGVyX2JvdW5kcy5zdy55IC09IGJ1ZmZlcjtcbiAgICB0aGlzLmJ1ZmZlcmVkX21ldGVyX2JvdW5kcy5uZS54ICs9IGJ1ZmZlcjtcbiAgICB0aGlzLmJ1ZmZlcmVkX21ldGVyX2JvdW5kcy5uZS55ICs9IGJ1ZmZlcjtcblxuICAgIHRoaXMuY2VudGVyX21ldGVycyA9IFBvaW50KFxuICAgICAgICAodGhpcy5idWZmZXJlZF9tZXRlcl9ib3VuZHMuc3cueCArIHRoaXMuYnVmZmVyZWRfbWV0ZXJfYm91bmRzLm5lLngpIC8gMixcbiAgICAgICAgKHRoaXMuYnVmZmVyZWRfbWV0ZXJfYm91bmRzLnN3LnkgKyB0aGlzLmJ1ZmZlcmVkX21ldGVyX2JvdW5kcy5uZS55KSAvIDJcbiAgICApO1xuXG4gICAgLy8gY29uc29sZS5sb2coXCJzZXQgcmVuZGVyZXIgYm91bmRzIHRvIFwiICsgSlNPTi5zdHJpbmdpZnkodGhpcy5ib3VuZHMpKTtcblxuICAgIC8vIE1hcmsgdGlsZXMgYXMgdmlzaWJsZS9pbnZpc2libGVcbiAgICBmb3IgKHZhciB0IGluIHRoaXMudGlsZXMpIHtcbiAgICAgICAgdGhpcy51cGRhdGVWaXNpYmlsaXR5Rm9yVGlsZSh0aGlzLnRpbGVzW3RdKTtcbiAgICB9XG5cbiAgICB0aGlzLmRpcnR5ID0gdHJ1ZTtcbn07XG5cblZlY3RvclJlbmRlcmVyLnByb3RvdHlwZS51cGRhdGVWaXNpYmlsaXR5Rm9yVGlsZSA9IGZ1bmN0aW9uICh0aWxlKVxue1xuICAgIHRpbGUudmlzaWJsZSA9IEdlby5ib3hJbnRlcnNlY3QodGlsZS5ib3VuZHMsIHRoaXMuYnVmZmVyZWRfbWV0ZXJfYm91bmRzKTtcbiAgICB0aWxlLmNlbnRlcl9kaXN0ID0gTWF0aC5hYnModGhpcy5jZW50ZXJfbWV0ZXJzLnggLSB0aWxlLm1pbi54KSArIE1hdGguYWJzKHRoaXMuY2VudGVyX21ldGVycy55IC0gdGlsZS5taW4ueSk7XG4gICAgcmV0dXJuIHRpbGUudmlzaWJsZTtcbn07XG5cblZlY3RvclJlbmRlcmVyLnByb3RvdHlwZS5yZXNpemVNYXAgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodClcbntcbiAgICB0aGlzLmRpcnR5ID0gdHJ1ZTtcbn07XG5cblZlY3RvclJlbmRlcmVyLnByb3RvdHlwZS5yZXF1ZXN0UmVkcmF3ID0gZnVuY3Rpb24gKClcbntcbiAgICB0aGlzLmRpcnR5ID0gdHJ1ZTtcbn07XG5cblZlY3RvclJlbmRlcmVyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKVxue1xuICAgIGlmICh0aGlzLmRpcnR5ID09IGZhbHNlIHx8IHRoaXMuaW5pdGlhbGl6ZWQgPT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLmRpcnR5ID0gZmFsc2U7IC8vIHN1YmNsYXNzZXMgY2FuIHNldCB0aGlzIGJhY2sgdG8gdHJ1ZSB3aGVuIGFuaW1hdGlvbiBpcyBuZWVkZWRcblxuICAgIC8vIENoaWxkIGNsYXNzLXNwZWNpZmljIHJlbmRlcmluZyAoZS5nLiBHTCBkcmF3IGNhbGxzKVxuICAgIGlmICh0eXBlb2YodGhpcy5fcmVuZGVyKSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKFwicmVuZGVyIG1hcFwiKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8vIExvYWQgYSBzaW5nbGUgdGlsZVxuVmVjdG9yUmVuZGVyZXIucHJvdG90eXBlLmxvYWRUaWxlID0gZnVuY3Rpb24gKGNvb3JkcywgZGl2LCBjYWxsYmFjaylcbntcbiAgICAvLyBPdmVyem9vbT9cbiAgICBpZiAoY29vcmRzLnogPiB0aGlzLnRpbGVfc291cmNlLm1heF96b29tKSB7XG4gICAgICAgIHZhciB6Z2FwID0gY29vcmRzLnogLSB0aGlzLnRpbGVfc291cmNlLm1heF96b29tO1xuICAgICAgICAvLyB2YXIgb3JpZ2luYWxfdGlsZSA9IFtjb29yZHMueCwgY29vcmRzLnksIGNvb3Jkcy56XS5qb2luKCcvJyk7XG4gICAgICAgIGNvb3Jkcy54ID0gfn4oY29vcmRzLnggLyBNYXRoLnBvdygyLCB6Z2FwKSk7XG4gICAgICAgIGNvb3Jkcy55ID0gfn4oY29vcmRzLnkgLyBNYXRoLnBvdygyLCB6Z2FwKSk7XG4gICAgICAgIGNvb3Jkcy5kaXNwbGF5X3ogPSBjb29yZHMuejsgLy8geiB3aXRob3V0IG92ZXJ6b29tXG4gICAgICAgIGNvb3Jkcy56IC09IHpnYXA7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiYWRqdXN0ZWQgZm9yIG92ZXJ6b29tLCB0aWxlIFwiICsgb3JpZ2luYWxfdGlsZSArIFwiIC0+IFwiICsgW2Nvb3Jkcy54LCBjb29yZHMueSwgY29vcmRzLnpdLmpvaW4oJy8nKSk7XG4gICAgfVxuXG4gICAgdGhpcy50cmFja1RpbGVTZXRMb2FkU3RhcnQoKTtcblxuICAgIHZhciBrZXkgPSBbY29vcmRzLngsIGNvb3Jkcy55LCBjb29yZHMuel0uam9pbignLycpO1xuXG4gICAgLy8gQWxyZWFkeSBsb2FkaW5nL2xvYWRlZD9cbiAgICBpZiAodGhpcy50aWxlc1trZXldKSB7XG4gICAgICAgIC8vIGlmICh0aGlzLnRpbGVzW2tleV0ubG9hZGVkID09IHRydWUpIHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwidXNlIGxvYWRlZCB0aWxlIFwiICsga2V5ICsgXCIgZnJvbSBjYWNoZVwiKTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBpZiAodGhpcy50aWxlc1trZXldLmxvYWRpbmcgPT0gdHJ1ZSkge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJhbHJlYWR5IGxvYWRpbmcgdGlsZSBcIiArIGtleSArIFwiLCBza2lwXCIpO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBkaXYpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgdGlsZSA9IHRoaXMudGlsZXNba2V5XSA9IHt9O1xuICAgIHRpbGUua2V5ID0ga2V5O1xuICAgIHRpbGUuY29vcmRzID0gY29vcmRzO1xuICAgIHRpbGUubWluID0gR2VvLm1ldGVyc0ZvclRpbGUodGlsZS5jb29yZHMpO1xuICAgIHRpbGUubWF4ID0gR2VvLm1ldGVyc0ZvclRpbGUoeyB4OiB0aWxlLmNvb3Jkcy54ICsgMSwgeTogdGlsZS5jb29yZHMueSArIDEsIHo6IHRpbGUuY29vcmRzLnogfSk7XG4gICAgdGlsZS5ib3VuZHMgPSB7IHN3OiB7IHg6IHRpbGUubWluLngsIHk6IHRpbGUubWF4LnkgfSwgbmU6IHsgeDogdGlsZS5tYXgueCwgeTogdGlsZS5taW4ueSB9IH07XG4gICAgdGlsZS5kZWJ1ZyA9IHt9O1xuICAgIHRpbGUubG9hZGluZyA9IHRydWU7XG4gICAgdGlsZS5sb2FkZWQgPSBmYWxzZTtcbiAgICB0aGlzLnVwZGF0ZVZpc2liaWxpdHlGb3JUaWxlKHRpbGUpO1xuXG4gICAgdGhpcy53b3JrZXJQb3N0TWVzc2FnZUZvclRpbGUodGlsZSwge1xuICAgICAgICB0eXBlOiAnYnVpbGRUaWxlJyxcbiAgICAgICAgdGlsZToge1xuICAgICAgICAgICAga2V5OiB0aWxlLmtleSxcbiAgICAgICAgICAgIGNvb3JkczogdGlsZS5jb29yZHMsIC8vIHVzZWQgYnkgc3R5bGUgaGVscGVyc1xuICAgICAgICAgICAgbWluOiB0aWxlLm1pbiwgLy8gdXNlZCBieSBUaWxlU291cmNlIHRvIHNjYWxlIHRpbGUgdG8gbG9jYWwgZXh0ZW50c1xuICAgICAgICAgICAgbWF4OiB0aWxlLm1heCwgLy8gdXNlZCBieSBUaWxlU291cmNlIHRvIHNjYWxlIHRpbGUgdG8gbG9jYWwgZXh0ZW50c1xuICAgICAgICAgICAgZGVidWc6IHRpbGUuZGVidWdcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyZXJfdHlwZTogdGhpcy50eXBlLFxuICAgICAgICB0aWxlX3NvdXJjZTogdGhpcy50aWxlX3NvdXJjZSxcbiAgICAgICAgbGF5ZXJzOiB0aGlzLmxheWVyc19zZXJpYWxpemVkLFxuICAgICAgICBzdHlsZXM6IHRoaXMuc3R5bGVzX3NlcmlhbGl6ZWRcbiAgICB9KTtcblxuICAgIHRoaXMudXBkYXRlVGlsZUVsZW1lbnQodGlsZSwgZGl2KTtcblxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayhudWxsLCBkaXYpO1xuICAgIH1cbn07XG5cbi8vIFJlYnVpbGQgYWxsIHRpbGVzXG5WZWN0b3JSZW5kZXJlci5wcm90b3R5cGUucmVidWlsZFRpbGVzID0gZnVuY3Rpb24gKClcbntcbiAgICAvLyBUZWxsIHdvcmtlcnMgd2UncmUgYWJvdXQgdG8gcmVidWlsZCAoc28gdGhleSBjYW4gcmVmcmVzaCBzdHlsZXMsIGV0Yy4pXG4gICAgY29uc29sZS5sb2coXCJub3RpZnkgd29ya2Vyc1wiKTtcbiAgICB0aGlzLndvcmtlcnMuZm9yRWFjaChmdW5jdGlvbih3b3JrZXIpIHtcbiAgICAgICAgd29ya2VyLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIHR5cGU6ICdtYXJrRm9yUmVidWlsZCdcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBVcGRhdGUgbGF5ZXJzICYgc3R5bGVzXG4gICAgdGhpcy5sYXllcnNfc2VyaWFsaXplZCA9IFV0aWxzLnNlcmlhbGl6ZVdpdGhGdW5jdGlvbnModGhpcy5sYXllcnMpO1xuICAgIHRoaXMuc3R5bGVzX3NlcmlhbGl6ZWQgPSBVdGlscy5zZXJpYWxpemVXaXRoRnVuY3Rpb25zKHRoaXMuc3R5bGVzKTtcblxuICAgIC8vIFJlYnVpbGQgdmlzaWJsZSB0aWxlcyBmaXJzdCwgZnJvbSBjZW50ZXIgb3V0XG4gICAgLy8gY29uc29sZS5sb2coXCJmaW5kIHZpc2libGVcIik7XG4gICAgdmFyIHZpc2libGUgPSBbXSwgaW52aXNpYmxlID0gW107XG4gICAgZm9yICh2YXIgdCBpbiB0aGlzLnRpbGVzKSB7XG4gICAgICAgIGlmICh0aGlzLnRpbGVzW3RdLnZpc2libGUgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdmlzaWJsZS5wdXNoKHQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaW52aXNpYmxlLnB1c2godCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZyhcInNvcnQgdmlzaWJsZSBkaXN0YW5jZVwiKTtcbiAgICB2aXNpYmxlLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAvLyB2YXIgYWQgPSBNYXRoLmFicyh0aGlzLmNlbnRlcl9tZXRlcnMueCAtIHRoaXMudGlsZXNbYl0ubWluLngpICsgTWF0aC5hYnModGhpcy5jZW50ZXJfbWV0ZXJzLnkgLSB0aGlzLnRpbGVzW2JdLm1pbi55KTtcbiAgICAgICAgLy8gdmFyIGJkID0gTWF0aC5hYnModGhpcy5jZW50ZXJfbWV0ZXJzLnggLSB0aGlzLnRpbGVzW2FdLm1pbi54KSArIE1hdGguYWJzKHRoaXMuY2VudGVyX21ldGVycy55IC0gdGhpcy50aWxlc1thXS5taW4ueSk7XG4gICAgICAgIHZhciBhZCA9IHRoaXMudGlsZXNbYV0uY2VudGVyX2Rpc3Q7XG4gICAgICAgIHZhciBiZCA9IHRoaXMudGlsZXNbYl0uY2VudGVyX2Rpc3Q7XG4gICAgICAgIHJldHVybiAoYmQgPiBhZCA/IC0xIDogKGJkID09IGFkID8gMCA6IDEpKTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgLy8gY29uc29sZS5sb2coXCJidWlsZCB2aXNpYmxlXCIpO1xuICAgIGZvciAodmFyIHQgaW4gdmlzaWJsZSkge1xuICAgICAgICB0aGlzLmJ1aWxkVGlsZSh2aXNpYmxlW3RdKTtcbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZyhcImJ1aWxkIGludmlzaWJsZVwiKTtcbiAgICBmb3IgKHZhciB0IGluIGludmlzaWJsZSkge1xuICAgICAgICB0aGlzLmJ1aWxkVGlsZShpbnZpc2libGVbdF0pO1xuICAgICAgICAvLyB0aGlzLnJlbW92ZVRpbGUoaW52aXNpYmxlW3RdKTtcbiAgICB9XG59O1xuXG5WZWN0b3JSZW5kZXJlci5wcm90b3R5cGUuYnVpbGRUaWxlID0gZnVuY3Rpb24oa2V5KVxue1xuICAgIHZhciB0aWxlID0gdGhpcy50aWxlc1trZXldO1xuXG4gICAgdGhpcy53b3JrZXJQb3N0TWVzc2FnZUZvclRpbGUodGlsZSwge1xuICAgICAgICB0eXBlOiAnYnVpbGRUaWxlJyxcbiAgICAgICAgdGlsZToge1xuICAgICAgICAgICAga2V5OiB0aWxlLmtleSxcbiAgICAgICAgICAgIGNvb3JkczogdGlsZS5jb29yZHMsIC8vIHVzZWQgYnkgc3R5bGUgaGVscGVyc1xuICAgICAgICAgICAgbGF5ZXJzOiB0aWxlLmxheWVycyxcbiAgICAgICAgICAgIGRlYnVnOiB0aWxlLmRlYnVnXG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcmVyX3R5cGU6IHRoaXMudHlwZSxcbiAgICAgICAgbGF5ZXJzOiB0aGlzLmxheWVyc19zZXJpYWxpemVkLFxuICAgICAgICBzdHlsZXM6IHRoaXMuc3R5bGVzX3NlcmlhbGl6ZWRcbiAgICB9KTtcbn07XG5cbi8vIENhbGxlZCBvbiBtYWluIHRocmVhZCB3aGVuIGEgd2ViIHdvcmtlciBjb21wbGV0ZXMgcHJvY2Vzc2luZyBmb3IgYSBzaW5nbGUgdGlsZSAoaW5pdGlhbCBsb2FkLCBvciByZWJ1aWxkKVxuVmVjdG9yUmVuZGVyZXIucHJvdG90eXBlLndvcmtlckJ1aWxkVGlsZUNvbXBsZXRlZCA9IGZ1bmN0aW9uIChldmVudClcbntcbiAgICBpZiAoZXZlbnQuZGF0YS50eXBlICE9ICdidWlsZFRpbGVDb21wbGV0ZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgdGlsZSA9IGV2ZW50LmRhdGEudGlsZTtcblxuICAgIC8vIFJlbW92ZWQgdGhpcyB0aWxlIGR1cmluZyBsb2FkP1xuICAgIGlmICh0aGlzLnRpbGVzW3RpbGUua2V5XSA9PSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZGlzY2FyZGVkIHRpbGUgXCIgKyB0aWxlLmtleSArIFwiIGluIFZlY3RvclJlbmRlcmVyLnRpbGVXb3JrZXJDb21wbGV0ZWQgYmVjYXVzZSBwcmV2aW91c2x5IHJlbW92ZWRcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgdGlsZSB3aXRoIHByb3BlcnRpZXMgZnJvbSB3b3JrZXJcbiAgICB0aWxlID0gdGhpcy5tZXJnZVRpbGUodGlsZS5rZXksIHRpbGUpO1xuXG4gICAgLy8gQ2hpbGQgY2xhc3Mtc3BlY2lmaWMgdGlsZSBwcm9jZXNzaW5nXG4gICAgaWYgKHR5cGVvZih0aGlzLl90aWxlV29ya2VyQ29tcGxldGVkKSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMuX3RpbGVXb3JrZXJDb21wbGV0ZWQodGlsZSk7XG4gICAgfVxuXG4gICAgLy8gTk9URTogd2FzIHByZXZpb3VzbHkgZGVsZXRpbmcgc291cmNlIGRhdGEgdG8gc2F2ZSBtZW1vcnksIGJ1dCBub3cgbmVlZCB0byBzYXZlIGZvciByZS1idWlsZGluZyBnZW9tZXRyeVxuICAgIC8vIGRlbGV0ZSB0aWxlLmxheWVycztcblxuICAgIHRoaXMuZGlydHkgPSB0cnVlO1xuICAgIHRoaXMudHJhY2tUaWxlU2V0TG9hZEVuZCgpO1xuICAgIHRoaXMucHJpbnREZWJ1Z0ZvclRpbGUodGlsZSk7XG59O1xuXG5WZWN0b3JSZW5kZXJlci5wcm90b3R5cGUucmVtb3ZlVGlsZSA9IGZ1bmN0aW9uIChrZXkpXG57XG4gICAgY29uc29sZS5sb2coXCJ0aWxlIHVubG9hZCBmb3IgXCIgKyBrZXkpO1xuICAgIHZhciB0aWxlID0gdGhpcy50aWxlc1trZXldO1xuICAgIGlmICh0aWxlICE9IG51bGwgJiYgdGlsZS5sb2FkaW5nID09IHRydWUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJjYW5jZWwgdGlsZSBsb2FkIGZvciBcIiArIGtleSk7XG5cbiAgICAgICAgLy8gV2ViIHdvcmtlciB3aWxsIGNhbmNlbCBYSFIgcmVxdWVzdHNcbiAgICAgICAgaWYgKHRpbGUud29ya2VyICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMud29ya2Vyc1t0aWxlLndvcmtlcl0ucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdyZW1vdmVUaWxlJyxcbiAgICAgICAgICAgICAgICBrZXk6IHRpbGUua2V5XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlbGV0ZSB0aGlzLnRpbGVzW2tleV07XG4gICAgdGhpcy5kaXJ0eSA9IHRydWU7XG59O1xuXG4vLyBBdHRhY2hlcyB0cmFja2luZyBhbmQgZGVidWcgaW50byB0byB0aGUgcHJvdmlkZWQgdGlsZSBET00gZWxlbWVudFxuVmVjdG9yUmVuZGVyZXIucHJvdG90eXBlLnVwZGF0ZVRpbGVFbGVtZW50ID0gZnVuY3Rpb24gKHRpbGUsIGRpdilcbntcbiAgICAvLyBEZWJ1ZyBpbmZvXG4gICAgZGl2LnNldEF0dHJpYnV0ZSgnZGF0YS10aWxlLWtleScsIHRpbGUua2V5KTtcbiAgICBkaXYuc3R5bGUud2lkdGggPSAnMjU2cHgnO1xuICAgIGRpdi5zdHlsZS5oZWlnaHQgPSAnMjU2cHgnO1xuXG4gICAgaWYgKHRoaXMuZGVidWcpIHtcbiAgICAgICAgdmFyIGRlYnVnX292ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGVidWdfb3ZlcmxheS50ZXh0Q29udGVudCA9IHRpbGUua2V5O1xuICAgICAgICBkZWJ1Z19vdmVybGF5LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgZGVidWdfb3ZlcmxheS5zdHlsZS5sZWZ0ID0gMDtcbiAgICAgICAgZGVidWdfb3ZlcmxheS5zdHlsZS50b3AgPSAwO1xuICAgICAgICBkZWJ1Z19vdmVybGF5LnN0eWxlLmNvbG9yID0gJ3doaXRlJztcbiAgICAgICAgZGVidWdfb3ZlcmxheS5zdHlsZS5mb250U2l6ZSA9ICcxNnB4JztcbiAgICAgICAgLy8gZGVidWdfb3ZlcmxheS5zdHlsZS50ZXh0T3V0bGluZSA9ICcxcHggIzAwMDAwMCc7XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChkZWJ1Z19vdmVybGF5KTtcblxuICAgICAgICBkaXYuc3R5bGUuYm9yZGVyU3R5bGUgPSAnc29saWQnO1xuICAgICAgICBkaXYuc3R5bGUuYm9yZGVyQ29sb3IgPSAnd2hpdGUnO1xuICAgICAgICBkaXYuc3R5bGUuYm9yZGVyV2lkdGggPSAnMXB4JztcbiAgICB9XG59O1xuXG4vLyBNZXJnZSBwcm9wZXJ0aWVzIGZyb20gYSBwcm92aWRlZCB0aWxlIG9iamVjdCBpbnRvIHRoZSBtYWluIHRpbGUgc3RvcmUuIFNoYWxsb3cgbWVyZ2UgKGp1c3QgY29waWVzIHRvcC1sZXZlbCBwcm9wZXJ0aWVzKSFcbi8vIFVzZWQgZm9yIHNlbGVjdGl2ZWx5IHVwZGF0aW5nIHByb3BlcnRpZXMgb2YgdGlsZXMgcGFzc2VkIGJldHdlZW4gbWFpbiB0aHJlYWQgYW5kIHdvcmtlclxuLy8gKHNvIHdlIGRvbid0IGhhdmUgdG8gcGFzcyB0aGUgd2hvbGUgdGlsZSwgaW5jbHVkaW5nIHNvbWUgcHJvcGVydGllcyB3aGljaCBjYW5ub3QgYmUgY2xvbmVkIGZvciBhIHdvcmtlcikuXG5WZWN0b3JSZW5kZXJlci5wcm90b3R5cGUubWVyZ2VUaWxlID0gZnVuY3Rpb24gKGtleSwgc291cmNlX3RpbGUpXG57XG4gICAgdmFyIHRpbGUgPSB0aGlzLnRpbGVzW2tleV07XG5cbiAgICBpZiAodGlsZSA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMudGlsZXNba2V5XSA9IHNvdXJjZV90aWxlO1xuICAgICAgICByZXR1cm4gdGhpcy50aWxlc1trZXldO1xuICAgIH1cblxuICAgIGZvciAodmFyIHAgaW4gc291cmNlX3RpbGUpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJtZXJnaW5nIFwiICsgcCArIFwiOiBcIiArIHNvdXJjZV90aWxlW3BdKTtcbiAgICAgICAgdGlsZVtwXSA9IHNvdXJjZV90aWxlW3BdO1xuICAgIH1cblxuICAgIHJldHVybiB0aWxlO1xufTtcblxuLy8gUmVsb2FkIGxheWVycyBhbmQgc3R5bGVzIChvbmx5IGlmIHRoZXkgd2VyZSBvcmlnaW5hbGx5IGxvYWRlZCBieSBVUkwpLiBNb3N0bHkgdXNlZnVsIGZvciB0ZXN0aW5nLlxuVmVjdG9yUmVuZGVyZXIucHJvdG90eXBlLnJlbG9hZENvbmZpZyA9IGZ1bmN0aW9uICgpXG57XG4gICAgaWYgKHRoaXMubGF5ZXJfc291cmNlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5sYXllcnMgPSBWZWN0b3JSZW5kZXJlci5sb2FkTGF5ZXJzKHRoaXMubGF5ZXJfc291cmNlKTtcbiAgICAgICAgdGhpcy5sYXllcnNfc2VyaWFsaXplZCA9IFV0aWxzLnNlcmlhbGl6ZVdpdGhGdW5jdGlvbnModGhpcy5sYXllcnMpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnN0eWxlX3NvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuc3R5bGVzID0gVmVjdG9yUmVuZGVyZXIubG9hZFN0eWxlcyh0aGlzLnN0eWxlX3NvdXJjZSk7XG4gICAgICAgIHRoaXMuc3R5bGVzX3NlcmlhbGl6ZWQgPSBVdGlscy5zZXJpYWxpemVXaXRoRnVuY3Rpb25zKHRoaXMuc3R5bGVzKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5sYXllcl9zb3VyY2UgIT0gbnVsbCB8fCB0aGlzLnN0eWxlX3NvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMucmVidWlsZFRpbGVzKCk7XG4gICAgfVxufTtcblxuLy8gUHJvZmlsaW5nIG1ldGhvZHMgdXNlZCB0byB0cmFjayB3aGVuIHNldHMgb2YgdGlsZXMgc3RhcnQvc3RvcCBsb2FkaW5nIHRvZ2V0aGVyXG4vLyBlLmcuIGluaXRpYWwgcGFnZSBsb2FkIGlzIG9uZSBzZXQgb2YgdGlsZXMsIG5ldyBzZXRzIG9mIHRpbGUgbG9hZHMgYXJlIHRoZW4gaW5pdGlhdGVkIGJ5IGEgbWFwIHBhbiBvciB6b29tXG5WZWN0b3JSZW5kZXJlci5wcm90b3R5cGUudHJhY2tUaWxlU2V0TG9hZFN0YXJ0ID0gZnVuY3Rpb24gKClcbntcbiAgICAvLyBTdGFydCB0cmFja2luZyBuZXcgdGlsZSBzZXQgaWYgbm8gb3RoZXIgdGlsZXMgYWxyZWFkeSBsb2FkaW5nXG4gICAgaWYgKHRoaXMudGlsZV9zZXRfbG9hZGluZyA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMudGlsZV9zZXRfbG9hZGluZyA9ICtuZXcgRGF0ZSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcInRpbGUgc2V0IGxvYWQgU1RBUlRcIik7XG4gICAgfVxufTtcblxuVmVjdG9yUmVuZGVyZXIucHJvdG90eXBlLnRyYWNrVGlsZVNldExvYWRFbmQgPSBmdW5jdGlvbiAoKVxue1xuICAgIC8vIE5vIG1vcmUgdGlsZXMgYWN0aXZlbHkgbG9hZGluZz9cbiAgICBpZiAodGhpcy50aWxlX3NldF9sb2FkaW5nICE9IG51bGwpIHtcbiAgICAgICAgdmFyIGVuZF90aWxlX3NldCA9IHRydWU7XG4gICAgICAgIGZvciAodmFyIHQgaW4gdGhpcy50aWxlcykge1xuICAgICAgICAgICAgaWYgKHRoaXMudGlsZXNbdF0ubG9hZGluZyA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgZW5kX3RpbGVfc2V0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW5kX3RpbGVfc2V0ID09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMubGFzdF90aWxlX3NldF9sb2FkID0gKCtuZXcgRGF0ZSgpKSAtIHRoaXMudGlsZV9zZXRfbG9hZGluZztcbiAgICAgICAgICAgIHRoaXMudGlsZV9zZXRfbG9hZGluZyA9IG51bGw7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInRpbGUgc2V0IGxvYWQgRklOSVNIRUQgaW46IFwiICsgdGhpcy5sYXN0X3RpbGVfc2V0X2xvYWQpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuVmVjdG9yUmVuZGVyZXIucHJvdG90eXBlLnByaW50RGVidWdGb3JUaWxlID0gZnVuY3Rpb24gKHRpbGUpXG57XG4gICAgY29uc29sZS5sb2coXG4gICAgICAgIFwiZGVidWcgZm9yIFwiICsgdGlsZS5rZXkgKyAnOiBbICcgK1xuICAgICAgICBPYmplY3Qua2V5cyh0aWxlLmRlYnVnKS5tYXAoZnVuY3Rpb24gKHQpIHsgcmV0dXJuIHQgKyAnOiAnICsgdGlsZS5kZWJ1Z1t0XTsgfSkuam9pbignLCAnKSArICcgXSdcbiAgICApO1xufTtcblxuXG4vKioqIENsYXNzIG1ldGhvZHMgKHN0YXRlbGVzcykgKioqL1xuXG4vLyBTaW1wbGlzdGljIGRldGVjdGlvbiBvZiByZWxhdGl2ZSBwYXRocywgYXBwZW5kIGJhc2UgaWYgbmVjZXNzYXJ5XG5WZWN0b3JSZW5kZXJlci51cmxGb3JQYXRoID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgICB2YXIgcHJvdG9jb2wgPSBwYXRoLnRvTG93ZXJDYXNlKCkuc3Vic3RyKDAsIDQpO1xuICAgIGlmICghKHByb3RvY29sID09ICdodHRwJyB8fCBwcm90b2NvbCA9PSAnZmlsZScpKSB7XG4gICAgICAgIHBhdGggPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgcGF0aDtcbiAgICB9XG4gICAgcmV0dXJuIHBhdGg7XG59O1xuXG5WZWN0b3JSZW5kZXJlci5sb2FkTGF5ZXJzID0gZnVuY3Rpb24gKHVybClcbntcbiAgICB2YXIgbGF5ZXJzO1xuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub25sb2FkID0gZnVuY3Rpb24gKCkgeyBldmFsKCdsYXllcnMgPSAnICsgcmVxLnJlc3BvbnNlKTsgfTsgLy8gVE9ETzogc2VjdXJpdHkhXG4gICAgcmVxLm9wZW4oJ0dFVCcsIHVybCArICc/JyArICgrbmV3IERhdGUoKSksIGZhbHNlIC8qIGFzeW5jIGZsYWcgKi8pO1xuICAgIHJlcS5zZW5kKCk7XG4gICAgcmV0dXJuIGxheWVycztcbn07XG5cblZlY3RvclJlbmRlcmVyLmxvYWRTdHlsZXMgPSBmdW5jdGlvbiAodXJsKVxue1xuICAgIHZhciBzdHlsZXM7XG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7IGV2YWwoJ3N0eWxlcyA9ICcgKyByZXEucmVzcG9uc2UpOyB9OyAvLyBUT0RPOiBzZWN1cml0eSFcbiAgICByZXEub3BlbignR0VUJywgdXJsICsgJz8nICsgKCtuZXcgRGF0ZSgpKSwgZmFsc2UgLyogYXN5bmMgZmxhZyAqLyk7XG4gICAgcmVxLnNlbmQoKTtcbiAgICByZXR1cm4gc3R5bGVzO1xufTtcblxuLy8gUHJvY2Vzc2VzIHRoZSB0aWxlIHJlc3BvbnNlIHRvIGNyZWF0ZSBsYXllcnMgYXMgZGVmaW5lZCBieSB0aGlzIHJlbmRlcmVyXG4vLyBDYW4gaW5jbHVkZSBwb3N0LXByb2Nlc3NpbmcgdG8gcGFydGlhbGx5IGZpbHRlciBvciByZS1hcnJhbmdlIGRhdGEsIGUuZy4gb25seSBpbmNsdWRpbmcgUE9JcyB0aGF0IGhhdmUgbmFtZXNcblZlY3RvclJlbmRlcmVyLnByb2Nlc3NMYXllcnNGb3JUaWxlID0gZnVuY3Rpb24gKGxheWVycywgdGlsZSlcbntcbiAgICB2YXIgdGlsZV9sYXllcnMgPSB7fTtcbiAgICBmb3IgKHZhciB0PTA7IHQgPCBsYXllcnMubGVuZ3RoOyB0KyspIHtcbiAgICAgICAgbGF5ZXJzW3RdLm51bWJlciA9IHQ7XG5cbiAgICAgICAgaWYgKGxheWVyc1t0XSAhPSBudWxsKSB7XG4gICAgICAgICAgICAvLyBKdXN0IHBhc3MgdGhyb3VnaCBkYXRhIHVudG91Y2hlZCBpZiBubyBkYXRhIHRyYW5zZm9ybSBmdW5jdGlvbiBkZWZpbmVkXG4gICAgICAgICAgICBpZiAobGF5ZXJzW3RdLmRhdGEgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRpbGVfbGF5ZXJzW2xheWVyc1t0XS5uYW1lXSA9IHRpbGUubGF5ZXJzW2xheWVyc1t0XS5uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFBhc3MgdGhyb3VnaCBkYXRhIGJ1dCB3aXRoIGRpZmZlcmVudCBsYXllciBuYW1lIGluIHRpbGUgc291cmNlIGRhdGFcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBsYXllcnNbdF0uZGF0YSA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHRpbGVfbGF5ZXJzW2xheWVyc1t0XS5uYW1lXSA9IHRpbGUubGF5ZXJzW2xheWVyc1t0XS5kYXRhXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEFwcGx5IHRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gZm9yIHBvc3QtcHJvY2Vzc2luZ1xuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGxheWVyc1t0XS5kYXRhID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0aWxlX2xheWVyc1tsYXllcnNbdF0ubmFtZV0gPSBsYXllcnNbdF0uZGF0YSh0aWxlLmxheWVycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBIYW5kbGUgY2FzZXMgd2hlcmUgbm8gZGF0YSB3YXMgZm91bmQgaW4gdGlsZSBvciByZXR1cm5lZCBieSBwb3N0LXByb2Nlc3NvclxuICAgICAgICB0aWxlX2xheWVyc1tsYXllcnNbdF0ubmFtZV0gPSB0aWxlX2xheWVyc1tsYXllcnNbdF0ubmFtZV0gfHwgeyB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLCBmZWF0dXJlczogW10gfTtcbiAgICB9XG4gICAgdGlsZS5sYXllcnMgPSB0aWxlX2xheWVycztcbiAgICByZXR1cm4gdGlsZV9sYXllcnM7XG59O1xuXG5cbi8qKiogU3R5bGUgcGFyc2luZyAmIGRlZmF1bHRzICoqKi9cblxuLy8gRGV0ZXJtaW5lIGZpbmFsIHN0eWxlIHByb3BlcnRpZXMgKGNvbG9yLCB3aWR0aCwgZXRjLilcblZlY3RvclJlbmRlcmVyLnN0eWxlX2RlZmF1bHRzID0ge1xuICAgIGNvbG9yOiBbMS4wLCAwLCAwXSxcbiAgICB3aWR0aDogMSxcbiAgICBzaXplOiAxLFxuICAgIGV4dHJ1ZGU6IGZhbHNlLFxuICAgIGhlaWdodDogMjAsXG4gICAgbWluX2hlaWdodDogMCxcbiAgICBvdXRsaW5lOiB7XG4gICAgICAgIC8vIGNvbG9yOiBbMS4wLCAwLCAwXSxcbiAgICAgICAgLy8gd2lkdGg6IDEsXG4gICAgICAgIC8vIGRhc2g6IG51bGxcbiAgICB9LFxuICAgIC8vIHJlbmRlcl9tb2RlOiB7XG4gICAgLy8gICAgIG5hbWU6ICdwb2x5Z29ucydcbiAgICAvLyB9XG4gICAgcmVuZGVyX21vZGU6ICdwb2x5Z29ucydcbn07XG5cblZlY3RvclJlbmRlcmVyLnBhcnNlU3R5bGVGb3JGZWF0dXJlID0gZnVuY3Rpb24gKGZlYXR1cmUsIGxheWVyX3N0eWxlLCB0aWxlKVxue1xuICAgIHZhciBsYXllcl9zdHlsZSA9IGxheWVyX3N0eWxlIHx8IHt9O1xuICAgIHZhciBzdHlsZSA9IHt9O1xuXG4gICAgLy8gaGVscGVyIGZ1bmN0aW9ucyBwYXNzZWQgdG8gZHluYW1pYyBzdHlsZSBmdW5jdGlvbnNcbiAgICB2YXIgaGVscGVycyA9IHtcbiAgICAgICAgU3R5bGU6IFN0eWxlLFxuICAgICAgICBHZW86IEdlbyxcbiAgICAgICAgem9vbTogdGlsZS5jb29yZHMuelxuICAgIH07XG5cbiAgICAvLyBUZXN0IHdoZXRoZXIgZmVhdHVyZXMgc2hvdWxkIGJlIHJlbmRlcmVkIGF0IGFsbFxuICAgIGlmICh0eXBlb2YgbGF5ZXJfc3R5bGUuZmlsdGVyID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaWYgKGxheWVyX3N0eWxlLmZpbHRlcihmZWF0dXJlLCB0aWxlLCBoZWxwZXJzKSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBQYXJzZSBzdHlsZXNcbiAgICBzdHlsZS5jb2xvciA9IChsYXllcl9zdHlsZS5jb2xvciAmJiAobGF5ZXJfc3R5bGUuY29sb3JbZmVhdHVyZS5wcm9wZXJ0aWVzLmtpbmRdIHx8IGxheWVyX3N0eWxlLmNvbG9yLmRlZmF1bHQpKSB8fCBWZWN0b3JSZW5kZXJlci5zdHlsZV9kZWZhdWx0cy5jb2xvcjtcbiAgICBpZiAodHlwZW9mIHN0eWxlLmNvbG9yID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgc3R5bGUuY29sb3IgPSBzdHlsZS5jb2xvcihmZWF0dXJlLCB0aWxlLCBoZWxwZXJzKTtcbiAgICB9XG5cbiAgICBzdHlsZS53aWR0aCA9IChsYXllcl9zdHlsZS53aWR0aCAmJiAobGF5ZXJfc3R5bGUud2lkdGhbZmVhdHVyZS5wcm9wZXJ0aWVzLmtpbmRdIHx8IGxheWVyX3N0eWxlLndpZHRoLmRlZmF1bHQpKSB8fCBWZWN0b3JSZW5kZXJlci5zdHlsZV9kZWZhdWx0cy53aWR0aDtcbiAgICBpZiAodHlwZW9mIHN0eWxlLndpZHRoID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgc3R5bGUud2lkdGggPSBzdHlsZS53aWR0aChmZWF0dXJlLCB0aWxlLCBoZWxwZXJzKTtcbiAgICB9XG4gICAgc3R5bGUud2lkdGggKj0gR2VvLnVuaXRzX3Blcl9tZXRlclt0aWxlLmNvb3Jkcy56XTtcblxuICAgIHN0eWxlLnNpemUgPSAobGF5ZXJfc3R5bGUuc2l6ZSAmJiAobGF5ZXJfc3R5bGUuc2l6ZVtmZWF0dXJlLnByb3BlcnRpZXMua2luZF0gfHwgbGF5ZXJfc3R5bGUuc2l6ZS5kZWZhdWx0KSkgfHwgVmVjdG9yUmVuZGVyZXIuc3R5bGVfZGVmYXVsdHMuc2l6ZTtcbiAgICBpZiAodHlwZW9mIHN0eWxlLnNpemUgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBzdHlsZS5zaXplID0gc3R5bGUuc2l6ZShmZWF0dXJlLCB0aWxlLCBoZWxwZXJzKTtcbiAgICB9XG4gICAgc3R5bGUuc2l6ZSAqPSBHZW8udW5pdHNfcGVyX21ldGVyW3RpbGUuY29vcmRzLnpdO1xuXG4gICAgc3R5bGUuZXh0cnVkZSA9IChsYXllcl9zdHlsZS5leHRydWRlICYmIChsYXllcl9zdHlsZS5leHRydWRlW2ZlYXR1cmUucHJvcGVydGllcy5raW5kXSB8fCBsYXllcl9zdHlsZS5leHRydWRlLmRlZmF1bHQpKSB8fCBWZWN0b3JSZW5kZXJlci5zdHlsZV9kZWZhdWx0cy5leHRydWRlO1xuICAgIGlmICh0eXBlb2Ygc3R5bGUuZXh0cnVkZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIHJldHVybmluZyBhIGJvb2xlYW4gd2lsbCBleHRydWRlIHdpdGggdGhlIGZlYXR1cmUncyBoZWlnaHQsIGEgbnVtYmVyIHdpbGwgb3ZlcnJpZGUgdGhlIGZlYXR1cmUgaGVpZ2h0IChzZWUgYmVsb3cpXG4gICAgICAgIHN0eWxlLmV4dHJ1ZGUgPSBzdHlsZS5leHRydWRlKGZlYXR1cmUsIHRpbGUsIGhlbHBlcnMpO1xuICAgIH1cblxuICAgIHN0eWxlLmhlaWdodCA9IChmZWF0dXJlLnByb3BlcnRpZXMgJiYgZmVhdHVyZS5wcm9wZXJ0aWVzLmhlaWdodCkgfHwgVmVjdG9yUmVuZGVyZXIuc3R5bGVfZGVmYXVsdHMuaGVpZ2h0O1xuICAgIHN0eWxlLm1pbl9oZWlnaHQgPSAoZmVhdHVyZS5wcm9wZXJ0aWVzICYmIGZlYXR1cmUucHJvcGVydGllcy5taW5faGVpZ2h0KSB8fCBWZWN0b3JSZW5kZXJlci5zdHlsZV9kZWZhdWx0cy5taW5faGVpZ2h0O1xuXG4gICAgLy8gaGVpZ2h0IGRlZmF1bHRzIHRvIGZlYXR1cmUgaGVpZ2h0LCBidXQgZXh0cnVkZSBzdHlsZSBjYW4gZHluYW1pY2FsbHkgYWRqdXN0IGhlaWdodCBieSByZXR1cm5pbmcgYSBudW1iZXIgb3IgYXJyYXkgKGluc3RlYWQgb2YgYSBib29sZWFuKVxuICAgIGlmIChzdHlsZS5leHRydWRlKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3R5bGUuZXh0cnVkZSA9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgc3R5bGUuaGVpZ2h0ID0gc3R5bGUuZXh0cnVkZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygc3R5bGUuZXh0cnVkZSA9PSAnb2JqZWN0JyAmJiBzdHlsZS5leHRydWRlLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICBzdHlsZS5taW5faGVpZ2h0ID0gc3R5bGUuZXh0cnVkZVswXTtcbiAgICAgICAgICAgIHN0eWxlLmhlaWdodCA9IHN0eWxlLmV4dHJ1ZGVbMV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdHlsZS56ID0gKGxheWVyX3N0eWxlLnogJiYgKGxheWVyX3N0eWxlLnpbZmVhdHVyZS5wcm9wZXJ0aWVzLmtpbmRdIHx8IGxheWVyX3N0eWxlLnouZGVmYXVsdCkpIHx8IFZlY3RvclJlbmRlcmVyLnN0eWxlX2RlZmF1bHRzLnogfHwgMDtcbiAgICBpZiAodHlwZW9mIHN0eWxlLnogPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBzdHlsZS56ID0gc3R5bGUueihmZWF0dXJlLCB0aWxlLCBoZWxwZXJzKTtcbiAgICB9XG5cbiAgICBzdHlsZS5vdXRsaW5lID0ge307XG4gICAgbGF5ZXJfc3R5bGUub3V0bGluZSA9IGxheWVyX3N0eWxlLm91dGxpbmUgfHwge307XG4gICAgc3R5bGUub3V0bGluZS5jb2xvciA9IChsYXllcl9zdHlsZS5vdXRsaW5lLmNvbG9yICYmIChsYXllcl9zdHlsZS5vdXRsaW5lLmNvbG9yW2ZlYXR1cmUucHJvcGVydGllcy5raW5kXSB8fCBsYXllcl9zdHlsZS5vdXRsaW5lLmNvbG9yLmRlZmF1bHQpKSB8fCBWZWN0b3JSZW5kZXJlci5zdHlsZV9kZWZhdWx0cy5vdXRsaW5lLmNvbG9yO1xuICAgIGlmICh0eXBlb2Ygc3R5bGUub3V0bGluZS5jb2xvciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHN0eWxlLm91dGxpbmUuY29sb3IgPSBzdHlsZS5vdXRsaW5lLmNvbG9yKGZlYXR1cmUsIHRpbGUsIGhlbHBlcnMpO1xuICAgIH1cblxuICAgIHN0eWxlLm91dGxpbmUud2lkdGggPSAobGF5ZXJfc3R5bGUub3V0bGluZS53aWR0aCAmJiAobGF5ZXJfc3R5bGUub3V0bGluZS53aWR0aFtmZWF0dXJlLnByb3BlcnRpZXMua2luZF0gfHwgbGF5ZXJfc3R5bGUub3V0bGluZS53aWR0aC5kZWZhdWx0KSkgfHwgVmVjdG9yUmVuZGVyZXIuc3R5bGVfZGVmYXVsdHMub3V0bGluZS53aWR0aDtcbiAgICBpZiAodHlwZW9mIHN0eWxlLm91dGxpbmUud2lkdGggPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBzdHlsZS5vdXRsaW5lLndpZHRoID0gc3R5bGUub3V0bGluZS53aWR0aChmZWF0dXJlLCB0aWxlLCBoZWxwZXJzKTtcbiAgICB9XG4gICAgc3R5bGUub3V0bGluZS53aWR0aCAqPSBHZW8udW5pdHNfcGVyX21ldGVyW3RpbGUuY29vcmRzLnpdO1xuXG4gICAgc3R5bGUub3V0bGluZS5kYXNoID0gKGxheWVyX3N0eWxlLm91dGxpbmUuZGFzaCAmJiAobGF5ZXJfc3R5bGUub3V0bGluZS5kYXNoW2ZlYXR1cmUucHJvcGVydGllcy5raW5kXSB8fCBsYXllcl9zdHlsZS5vdXRsaW5lLmRhc2guZGVmYXVsdCkpIHx8IFZlY3RvclJlbmRlcmVyLnN0eWxlX2RlZmF1bHRzLm91dGxpbmUuZGFzaDtcbiAgICBpZiAodHlwZW9mIHN0eWxlLm91dGxpbmUuZGFzaCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHN0eWxlLm91dGxpbmUuZGFzaCA9IHN0eWxlLm91dGxpbmUuZGFzaChmZWF0dXJlLCB0aWxlLCBoZWxwZXJzKTtcbiAgICB9XG5cbiAgICBzdHlsZS5yZW5kZXJfbW9kZSA9IGxheWVyX3N0eWxlLnJlbmRlcl9tb2RlIHx8IFZlY3RvclJlbmRlcmVyLnN0eWxlX2RlZmF1bHRzLnJlbmRlcl9tb2RlO1xuICAgIC8vIHN0eWxlLnJlbmRlcl9tb2RlID0ge307XG4gICAgLy8gc3R5bGUucmVuZGVyX21vZGUubmFtZSA9IChsYXllcl9zdHlsZS5yZW5kZXJfbW9kZSAmJiBsYXllcl9zdHlsZS5yZW5kZXJfbW9kZS5uYW1lKSB8fCBWZWN0b3JSZW5kZXJlci5zdHlsZV9kZWZhdWx0cy5yZW5kZXJfbW9kZS5uYW1lO1xuXG4gICAgcmV0dXJuIHN0eWxlO1xufTtcblxuLy8gUHJpdmF0ZS9pbnRlcm5hbFxuLy8gR2V0IGJhc2UgVVJMIGZyb20gd2hpY2ggdGhlIGxpYnJhcnkgd2FzIGxvYWRlZFxuLy8gVXNlZCB0byBsb2FkIGFkZGl0aW9uYWwgcmVzb3VyY2VzIGxpa2Ugc2hhZGVycywgdGV4dHVyZXMsIGV0Yy4gaW4gY2FzZXMgd2hlcmUgbGlicmFyeSB3YXMgbG9hZGVkIGZyb20gYSByZWxhdGl2ZSBwYXRoXG5mdW5jdGlvbiBmaW5kQmFzZUxpYnJhcnlVUkwgKClcbntcbiAgICB0cnkge1xuICAgICAgICBWZWN0b3JSZW5kZXJlci5saWJyYXJ5X2Jhc2VfdXJsID0gJyc7XG4gICAgICAgIHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpOyAvLyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHRbc3JjKj1cIi5qc1wiXScpO1xuICAgICAgICBmb3IgKHZhciBzPTA7IHMgPCBzY3JpcHRzLmxlbmd0aDsgcysrKSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSBzY3JpcHRzW3NdLnNyYy5pbmRleE9mKCd2ZWN0b3ItbWFwLmRlYnVnLmpzJyk7XG4gICAgICAgICAgICBpZiAobWF0Y2ggPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBtYXRjaCA9IHNjcmlwdHNbc10uc3JjLmluZGV4T2YoJ3ZlY3Rvci1tYXAubWluLmpzJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF0Y2ggPj0gMCkge1xuICAgICAgICAgICAgICAgIFZlY3RvclJlbmRlcmVyLmxpYnJhcnlfYmFzZV91cmwgPSBzY3JpcHRzW3NdLnNyYy5zdWJzdHIoMCwgbWF0Y2gpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIC8vIHNraXAgaW4gd2ViIHdvcmtlclxuICAgIH1cbn07XG5cbmlmIChtb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gVmVjdG9yUmVuZGVyZXI7XG59XG4iXX0=
(10)
});
