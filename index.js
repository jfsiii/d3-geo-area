(function() {
    !function() {
        var d3 = {
            version: "3.4.4"
        };
        function d3_noop() {}
        function d3_adder() {}
        d3_adder.prototype = {
            s: 0,
            t: 0,
            add: function(y) {
                d3_adderSum(y, this.t, d3_adderTemp);
                d3_adderSum(d3_adderTemp.s, this.s, this);
                if (this.s) this.t += d3_adderTemp.t; else this.s = d3_adderTemp.t;
            },
            reset: function() {
                this.s = this.t = 0;
            },
            valueOf: function() {
                return this.s;
            }
        };
        var d3_adderTemp = new d3_adder();
        function d3_adderSum(a, b, o) {
            var x = o.s = a + b, bv = x - a, av = x - bv;
            o.t = a - av + (b - bv);
        }
        var π = Math.PI, τ = 2 * π, halfπ = π / 2, ε = 1e-6, ε2 = ε * ε, d3_radians = π / 180, d3_degrees = 180 / π;
        function d3_sgn(x) {
            return x > 0 ? 1 : x < 0 ? -1 : 0;
        }
        function d3_cross2d(a, b, c) {
            return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
        }
        function d3_acos(x) {
            return x > 1 ? 0 : x < -1 ? π : Math.acos(x);
        }
        function d3_asin(x) {
            return x > 1 ? halfπ : x < -1 ? -halfπ : Math.asin(x);
        }
        function d3_sinh(x) {
            return ((x = Math.exp(x)) - 1 / x) / 2;
        }
        function d3_cosh(x) {
            return ((x = Math.exp(x)) + 1 / x) / 2;
        }
        function d3_tanh(x) {
            return ((x = Math.exp(2 * x)) - 1) / (x + 1);
        }
        function d3_haversin(x) {
            return (x = Math.sin(x / 2)) * x;
        }
        d3.geo = {};
        d3.geo.stream = function(object, listener) {
            if (object && d3_geo_streamObjectType.hasOwnProperty(object.type)) {
                d3_geo_streamObjectType[object.type](object, listener);
            } else {
                d3_geo_streamGeometry(object, listener);
            }
        };
        function d3_geo_streamGeometry(geometry, listener) {
            if (geometry && d3_geo_streamGeometryType.hasOwnProperty(geometry.type)) {
                d3_geo_streamGeometryType[geometry.type](geometry, listener);
            }
        }
        var d3_geo_streamObjectType = {
            Feature: function(feature, listener) {
                d3_geo_streamGeometry(feature.geometry, listener);
            },
            FeatureCollection: function(object, listener) {
                var features = object.features, i = -1, n = features.length;
                while (++i < n) d3_geo_streamGeometry(features[i].geometry, listener);
            }
        };
        var d3_geo_streamGeometryType = {
            Sphere: function(object, listener) {
                listener.sphere();
            },
            Point: function(object, listener) {
                object = object.coordinates;
                listener.point(object[0], object[1], object[2]);
            },
            MultiPoint: function(object, listener) {
                var coordinates = object.coordinates, i = -1, n = coordinates.length;
                while (++i < n) object = coordinates[i], listener.point(object[0], object[1], object[2]);
            },
            LineString: function(object, listener) {
                d3_geo_streamLine(object.coordinates, listener, 0);
            },
            MultiLineString: function(object, listener) {
                var coordinates = object.coordinates, i = -1, n = coordinates.length;
                while (++i < n) d3_geo_streamLine(coordinates[i], listener, 0);
            },
            Polygon: function(object, listener) {
                d3_geo_streamPolygon(object.coordinates, listener);
            },
            MultiPolygon: function(object, listener) {
                var coordinates = object.coordinates, i = -1, n = coordinates.length;
                while (++i < n) d3_geo_streamPolygon(coordinates[i], listener);
            },
            GeometryCollection: function(object, listener) {
                var geometries = object.geometries, i = -1, n = geometries.length;
                while (++i < n) d3_geo_streamGeometry(geometries[i], listener);
            }
        };
        function d3_geo_streamLine(coordinates, listener, closed) {
            var i = -1, n = coordinates.length - closed, coordinate;
            listener.lineStart();
            while (++i < n) coordinate = coordinates[i], listener.point(coordinate[0], coordinate[1], coordinate[2]);
            listener.lineEnd();
        }
        function d3_geo_streamPolygon(coordinates, listener) {
            var i = -1, n = coordinates.length;
            listener.polygonStart();
            while (++i < n) d3_geo_streamLine(coordinates[i], listener, 1);
            listener.polygonEnd();
        }
        d3.geo.area = function(object) {
            d3_geo_areaSum = 0;
            d3.geo.stream(object, d3_geo_area);
            return d3_geo_areaSum;
        };
        var d3_geo_areaSum, d3_geo_areaRingSum = new d3_adder();
        var d3_geo_area = {
            sphere: function() {
                d3_geo_areaSum += 4 * π;
            },
            point: d3_noop,
            lineStart: d3_noop,
            lineEnd: d3_noop,
            polygonStart: function() {
                d3_geo_areaRingSum.reset();
                d3_geo_area.lineStart = d3_geo_areaRingStart;
            },
            polygonEnd: function() {
                var area = 2 * d3_geo_areaRingSum;
                d3_geo_areaSum += area < 0 ? 4 * π + area : area;
                d3_geo_area.lineStart = d3_geo_area.lineEnd = d3_geo_area.point = d3_noop;
            }
        };
        function d3_geo_areaRingStart() {
            var λ00, φ00, λ0, cosφ0, sinφ0;
            d3_geo_area.point = function(λ, φ) {
                d3_geo_area.point = nextPoint;
                λ0 = (λ00 = λ) * d3_radians, cosφ0 = Math.cos(φ = (φ00 = φ) * d3_radians / 2 + π / 4), 
                sinφ0 = Math.sin(φ);
            };
            function nextPoint(λ, φ) {
                λ *= d3_radians;
                φ = φ * d3_radians / 2 + π / 4;
                var dλ = λ - λ0, sdλ = dλ >= 0 ? 1 : -1, adλ = sdλ * dλ, cosφ = Math.cos(φ), sinφ = Math.sin(φ), k = sinφ0 * sinφ, u = cosφ0 * cosφ + k * Math.cos(adλ), v = k * sdλ * Math.sin(adλ);
                d3_geo_areaRingSum.add(Math.atan2(v, u));
                λ0 = λ, cosφ0 = cosφ, sinφ0 = sinφ;
            }
            d3_geo_area.lineEnd = function() {
                nextPoint(λ00, φ00);
            };
        }
        if (typeof define === "function" && define.amd) {
            define(d3);
        } else if (typeof module === "object" && module.exports) {
            module.exports = d3;
        } else {
            this.d3 = d3;
        }
    }();
})();