// import turf from 'turf'
var computeVertexNormals = (function () {
	'use strict'
	function n(t) {
		var e = t.indices,
			i = t.attributes,
			n = e.length
		if (i.position) {
			var o = i.position.values
			if (void 0 === i.normal)
				i.normal = new Cesium.GeometryAttribute({
					componentDatatype: Cesium.ComponentDatatype.FLOAT,
					componentsPerAttribute: 3,
					values: new Float32Array(o.length),
				})
			else for (var a = i.normal.values, s = 0; s < n; s++) a[s] = 0
			for (
				var u,
					l,
					h,
					d = i.normal.values,
					m = new Cesium.Cartesian3(),
					f = new Cesium.Cartesian3(),
					p = new Cesium.Cartesian3(),
					c = new Cesium.Cartesian3(),
					_ = new Cesium.Cartesian3(),
					s = 0;
				s < n;
				s += 3
			)
				(u = 3 * e[s + 0]),
					(l = 3 * e[s + 1]),
					(h = 3 * e[s + 2]),
					Cesium.Cartesian3.fromArray(o, u, m),
					Cesium.Cartesian3.fromArray(o, l, f),
					Cesium.Cartesian3.fromArray(o, h, p),
					Cesium.Cartesian3.subtract(p, f, c),
					Cesium.Cartesian3.subtract(m, f, _),
					Cesium.Cartesian3.cross(c, _, c),
					(d[u] += c.x),
					(d[u + 1] += c.y),
					(d[u + 2] += c.z),
					(d[l] += c.x),
					(d[l + 1] += c.y),
					(d[l + 2] += c.z),
					(d[h] += c.x),
					(d[h + 1] += c.y),
					(d[h + 2] += c.z)
			r(t), (i.normal.needsUpdate = !0)
		}
		return t
	}
	function r(t) {
		for (
			var e, i, n, r, o = t.attributes.normal.values, a = 0;
			a < o.length;
			a += 3
		)
			(e = o[a]),
				(i = o[a + 1]),
				(n = o[a + 2]),
				(r = 1 / Math.sqrt(e * e + i * i + n * n)),
				(o[a] = e * r),
				(o[a + 1] = i * r),
				(o[a + 2] = n * r)
	}
	return n
})()

var extend2Earth = (function () {
	var a = new Cesium.Cartesian3(),
		s = (new Cesium.Ray(), new Cesium.Cartographic())
	function o(t, e, i, n) {
		;(n = n || Cesium.Ellipsoid.WGS84),
			Cesium.Matrix4.multiplyByPoint(e, t, a),
			Cesium.Cartesian3.subtract(a, i.origin, i.direction),
			Cesium.Cartesian3.normalize(i.direction, i.direction)
		var r = Cesium.IntersectionTests.rayEllipsoid(i, n),
			o = null
		if ((r && (o = Cesium.Ray.getPoint(i, r.start)), o))
			try {
				Cesium.Cartographic.fromCartesian(o, null, s)
			} catch (t) {
				return null
			}
		return o
	}
	return o
})()

var FourPrismGeometry = (function () {
	'use strict'
	function n(t) {
		;(this._bottomWidth = t.bottomWidth),
			(this._bottomHeight = t.bottomHeight),
			(this._topWidth = t.topWidth),
			(this._topHeight = t.topHeight),
			(this._length = t.length),
			(this._zReverse = t.zReverse),
			(this._slices = t.slices ? t.slices : 8)
	}
	var s = new Cesium.Cartesian3(),
		u = new Cesium.Ray()
	;(n._createGeometry = function (t) {
		for (
			var e = t._bottomWidth,
				i = t._bottomHeight,
				n = t._topWidth,
				r = t._topHeight,
				a = t._zReverse,
				s = (a ? -1 : 1) * t._length,
				u = new Float32Array(24),
				l = [],
				h = [],
				d = [0, s],
				m = [e, n],
				f = [i, r],
				p = 0,
				c = 0;
			c < 2;
			c++
		)
			(u[3 * p] = -m[c] / 2),
				(u[3 * p + 1] = -f[c] / 2),
				(u[3 * p + 2] = d[c]),
				(h[2 * p] = c),
				(h[2 * p + 1] = 0),
				p++,
				(u[3 * p] = -m[c] / 2),
				(u[3 * p + 1] = f[c] / 2),
				(u[3 * p + 2] = d[c]),
				(h[2 * p] = c),
				(h[2 * p + 1] = 0),
				p++,
				(u[3 * p] = m[c] / 2),
				(u[3 * p + 1] = f[c] / 2),
				(u[3 * p + 2] = d[c]),
				(h[2 * p] = c),
				(h[2 * p + 1] = 0),
				p++,
				(u[3 * p] = m[c] / 2),
				(u[3 * p + 1] = -f[c] / 2),
				(u[3 * p + 2] = d[c]),
				(h[2 * p] = c),
				(h[2 * p + 1] = 0),
				p++
		l.push(0, 1, 3),
			l.push(1, 2, 3),
			l.push(0, 4, 5),
			l.push(0, 5, 1),
			l.push(1, 2, 6),
			l.push(1, 6, 5),
			l.push(2, 3, 7),
			l.push(7, 6, 2),
			l.push(0, 3, 7),
			l.push(7, 4, 0),
			l.push(4, 5, 6),
			l.push(6, 7, 4),
			(l = new Int16Array(l)),
			(h = new Float32Array(h))
		var _ = {
				position: new Cesium.GeometryAttribute({
					componentDatatype: Cesium.ComponentDatatype.DOUBLE,
					componentsPerAttribute: 3,
					values: u,
				}),
				st: new Cesium.GeometryAttribute({
					componentDatatype: Cesium.ComponentDatatype.FLOAT,
					componentsPerAttribute: 2,
					values: h,
				}),
			},
			g = Cesium.BoundingSphere.fromVertices(u),
			v = new Cesium.Geometry({
				attributes: _,
				indices: l,
				primitiveType: Cesium.PrimitiveType.TRIANGLES,
				boundingSphere: g,
			})
		return (v = Cesium.GeometryPipeline.computeNormal(v)), (u = []), (l = []), v
	}),
		(n.createGeometry = function (t, e) {
			if (!e) return n._createGeometry(cylinderGeometry)
			Cesium.Matrix4.multiplyByPoint(e, Cesium.Cartesian3.ZERO, s),
				s.clone(u.origin)
			var i = t._slices,
				r = (t._bottomWidth, t._bottomHeight, t._topWidth),
				l = t._topHeight,
				h = t._zReverse,
				d = (h ? -1 : 1) * t._length,
				m = [],
				f = [],
				p = [],
				c = r / 2,
				_ = l / 2,
				g = i,
				v = i,
				y = 0
			m.push(0, 0, 0), p.push(1, 1), y++
			for (var C = new Cesium.Cartesian3(), w = [], x = -v; x < v; x++) {
				for (var A = [], b = -g; b < g; b++) {
					var M = (_ * x) / v,
						P = (c * b) / g
					;(C.x = P), (C.y = M), (C.z = d)
					var S = (0, extend2Earth)(C, e, u)
					S
						? (m.push(P, M, d), p.push(1, 1), A.push(y), y++)
						: (A.push(-1), (S = s))
				}
				w.push(A)
			}
			for (var F, E, T = [0, w.length - 1], R = 0; R < T.length; R++)
				for (var x = T[R], b = 1; b < w[x].length; b++)
					(F = w[x][b - 1]), (E = w[x][b]), F >= 0 && E >= 0 && f.push(0, F, E)
			for (var G = [0, w[0].length - 1], V = 0; V < G.length; V++)
				for (var b = G[V], x = 1; x < w.length; x++)
					(F = w[x - 1][b]), (E = w[x][b]), F >= 0 && E >= 0 && f.push(0, F, E)
			;(m = new Float32Array(m)),
				(f = new Int32Array(f)),
				(p = new Float32Array(p))
			var D = {
					position: new Cesium.GeometryAttribute({
						componentDatatype: Cesium.ComponentDatatype.DOUBLE,
						componentsPerAttribute: 3,
						values: m,
					}),
					st: new Cesium.GeometryAttribute({
						componentDatatype: Cesium.ComponentDatatype.FLOAT,
						componentsPerAttribute: 2,
						values: p,
					}),
				},
				L = Cesium.BoundingSphere.fromVertices(m),
				O = new Cesium.Geometry({
					attributes: D,
					indices: f,
					primitiveType: Cesium.PrimitiveType.TRIANGLES,
					boundingSphere: L,
				})
			return (0, computeVertexNormals)(O), (m = []), (f = []), O
		}),
		(n.createOutlineGeometry = function (t) {
			for (
				var e = t._bottomWidth,
					i = t._bottomHeight,
					n = t._topWidth,
					r = t._topHeight,
					a = t._zReverse,
					s = (a ? -1 : 1) * t._length,
					u = new Float32Array(24),
					l = [],
					h = [],
					d = [0, s],
					m = [e, n],
					f = [i, r],
					p = 0,
					c = 0;
				c < 2;
				c++
			)
				(u[3 * p] = -m[c] / 2),
					(u[3 * p + 1] = -f[c] / 2),
					(u[3 * p + 2] = d[c]),
					(h[2 * p] = c),
					(h[2 * p + 1] = 0),
					p++,
					(u[3 * p] = -m[c] / 2),
					(u[3 * p + 1] = f[c] / 2),
					(u[3 * p + 2] = d[c]),
					(h[2 * p] = c),
					(h[2 * p + 1] = 0),
					p++,
					(u[3 * p] = m[c] / 2),
					(u[3 * p + 1] = f[c] / 2),
					(u[3 * p + 2] = d[c]),
					(h[2 * p] = c),
					(h[2 * p + 1] = 0),
					p++,
					(u[3 * p] = m[c] / 2),
					(u[3 * p + 1] = -f[c] / 2),
					(u[3 * p + 2] = d[c]),
					(h[2 * p] = c),
					(h[2 * p + 1] = 0),
					p++
			l.push(0, 1, 1, 2),
				l.push(2, 3, 3, 0),
				l.push(0, 4),
				l.push(1, 5),
				l.push(2, 6),
				l.push(3, 7),
				l.push(4, 5, 5, 6),
				l.push(6, 7, 7, 4),
				(l = new Int16Array(l)),
				(h = new Float32Array(h))
			var _ = {
					position: new Cesium.GeometryAttribute({
						componentDatatype: Cesium.ComponentDatatype.DOUBLE,
						componentsPerAttribute: 3,
						values: u,
					}),
					st: new Cesium.GeometryAttribute({
						componentDatatype: Cesium.ComponentDatatype.FLOAT,
						componentsPerAttribute: 2,
						values: h,
					}),
				},
				g = Cesium.BoundingSphere.fromVertices(u),
				v = new Cesium.Geometry({
					attributes: _,
					indices: l,
					primitiveType: Cesium.PrimitiveType.LINES,
					boundingSphere: g,
				})
			return (u = []), (l = []), v
		}),
		(n.createOutlineGeometry2 = function (t) {
			var e = (t._bottomWidth, t._bottomHeight, t._topWidth),
				i = t._topHeight,
				n = t._zReverse,
				r = (n ? -1 : 1) * t._length,
				s = [],
				u = [],
				l = [],
				h = e / 2,
				d = i / 2,
				m = 0
			s.push(0, 0, 0), l.push(1, 1), m++
			for (var f = [], p = -16; p < 16; p++) {
				for (var c = [], _ = -16; _ < 16; _++) {
					c.push(m)
					var g = (d * p) / 16,
						v = (h * _) / 16
					s.push(v, g, r), l.push(1, 1), m++
				}
				f.push(c)
			}
			for (var y, C, w = [0, f.length - 1], x = 0; x < w.length; x++)
				for (var p = w[x], _ = 1; _ < f[p].length; _++)
					(y = f[p][_ - 1]), (C = f[p][_]), u.push(0, y, C)
			for (var A = [0, f[0].length - 1], b = 0; b < A.length; b++)
				for (var _ = A[b], p = 1; p < f.length; p++)
					(y = f[p - 1][_]), (C = f[p][_]), u.push(0, y, C)
			;(s = new Float32Array(s)),
				(u = new Int16Array(u)),
				(l = new Float32Array(l))
			var M = {
					position: new Cesium.GeometryAttribute({
						componentDatatype: Cesium.ComponentDatatype.DOUBLE,
						componentsPerAttribute: 3,
						values: s,
					}),
					st: new Cesium.GeometryAttribute({
						componentDatatype: Cesium.ComponentDatatype.FLOAT,
						componentsPerAttribute: 2,
						values: l,
					}),
				},
				P = Cesium.BoundingSphere.fromVertices(s),
				S = new Cesium.Geometry({
					attributes: M,
					indices: u,
					primitiveType: Cesium.PrimitiveType.TRIANGLES,
					boundingSphere: P,
				})
			return (
				(0, computeVertexNormals)(S),
				Cesium.GeometryPipeline.toWireframe(S),
				(s = []),
				(u = []),
				S
			)
		}),
		(n.fromAnglesLength = function (t, e, i, r) {
			var a = {
				length: i,
				zReverse: r,
				bottomHeight: i,
				bottomWidth: i,
				topHeight: i,
				topWidth: i,
			}
			return (
				(t = Cesium.Math.toRadians(t)),
				(e = Cesium.Math.toRadians(e)),
				r
					? ((a.bottomHeight = 0),
					  (a.bottomWidth = 0),
					  (a.topHeight = i * Math.tan(t)),
					  (a.topWidth = i * Math.tan(e)))
					: ((a.topHeight = 0),
					  (a.topWidth = 0),
					  (a.bottomHeight = i * Math.tan(t)),
					  (a.bottomWidth = i * Math.tan(e))),
				new n(a)
			)
		})
	return n
})()

var CylinderGeometry = (function () {
	'use strict'
	function n(t) {
		;(this.length = t.length),
			(this.topRadius = t.topRadius),
			(this.bottomRadius = t.bottomRadius),
			(this.slices = t.slices ? t.slices : 64),
			(this.zReverse = t.zReverse)
	}
	var s = new Cesium.Cartesian2(),
		u = new Cesium.Cartesian3(),
		l = new Cesium.Ray()
	;(n._createGeometry = function (t) {
		var e = t.length,
			i = t.topRadius,
			n = t.bottomRadius,
			r = t.slices,
			a = (2 * Math.PI) / (r - 1),
			u = t.zReverse,
			l = [],
			h = [],
			d = [],
			m = [],
			f = [n, i],
			p = [0, u ? -e : e],
			c = 0,
			_ = Math.atan2(n - i, e),
			g = s
		g.z = Math.sin(_)
		for (var v = Math.cos(_), y = 0; y < p.length; y++) {
			m[y] = []
			for (var C = f[y], w = 0; w < r; w++) {
				m[y].push(c++)
				var x = a * w,
					A = C * Math.cos(x),
					b = C * Math.sin(x)
				l.push(A, b, p[y]),
					(A = v * Math.cos(x)),
					(b = v * Math.sin(x)),
					h.push(A, b, g.z),
					d.push(y / (p.length - 1), 0)
			}
		}
		for (var M = [], y = 1; y < p.length; y++)
			for (var w = 1; w < r; w++) {
				var P = m[y - 1][w - 1],
					S = m[y][w - 1],
					F = m[y][w],
					E = m[y - 1][w]
				M.push(F),
					M.push(E),
					M.push(P),
					M.push(F),
					M.push(P),
					M.push(S),
					w == m[y].length - 1 &&
						((P = m[y - 1][w]),
						(S = m[y][w]),
						(F = m[y][0]),
						(E = m[y - 1][0]),
						M.push(F),
						M.push(E),
						M.push(P),
						M.push(F),
						M.push(P),
						M.push(S))
			}
		;(M = new Int16Array(M)),
			(l = new Float32Array(l)),
			(h = new Float32Array(h)),
			(d = new Float32Array(d))
		var T = {
				position: new Cesium.GeometryAttribute({
					componentDatatype: Cesium.ComponentDatatype.DOUBLE,
					componentsPerAttribute: 3,
					values: l,
				}),
				normal: new Cesium.GeometryAttribute({
					componentDatatype: Cesium.ComponentDatatype.FLOAT,
					componentsPerAttribute: 3,
					values: h,
				}),
				st: new Cesium.GeometryAttribute({
					componentDatatype: Cesium.ComponentDatatype.FLOAT,
					componentsPerAttribute: 2,
					values: d,
				}),
			},
			R = Cesium.BoundingSphere.fromVertices(l),
			G = new Cesium.Geometry({
				attributes: T,
				indices: M,
				primitiveType: Cesium.PrimitiveType.TRIANGLES,
				boundingSphere: R,
			})
		return (l = []), (M = []), (d = []), G
	}),
		(n.createGeometry = function (t, e) {
			if (!e) return n._createGeometry(t)
			Cesium.Matrix4.multiplyByPoint(e, Cesium.Cartesian3.ZERO, u),
				u.clone(l.origin)
			var i = t.length,
				r = t.topRadius,
				s = (t.bottomRadius, t.slices),
				h = (2 * Math.PI) / (s - 1),
				d = t.zReverse,
				m = [],
				f = [],
				p = [],
				c = [],
				_ = [0, d ? -i : i],
				g = 0,
				g = 0
			m.push(0, 0, 0), f.push(1, 1), g++
			for (var v = new Cesium.Cartesian3(), y = r / 15, C = 0; C < 16; C++) {
				for (var w = y * C, x = [], A = 0; A < s; A++) {
					var b = h * A,
						M = w * Math.cos(b),
						P = w * Math.sin(b)
					;(v.x = M), (v.y = P), (v.z = _[1])
					var S = (0, extend2Earth)(v, e, l)
					S
						? (x.push(g), m.push(M, P, _[1]), f.push(C / 15, 1), g++)
						: ((S = u), x.push(-1))
				}
				c.push(x)
			}
			for (var F, E, T = [0, c.length - 1], R = 0; R < T.length; R++)
				for (var C = T[R], A = 1; A < c[C].length; A++)
					(F = c[C][A - 1]), (E = c[C][A]), F >= 0 && E >= 0 && p.push(0, F, E)
			;(m = new Float32Array(m)),
				(p = new Int32Array(p)),
				(f = new Float32Array(f))
			var G = {
					position: new Cesium.GeometryAttribute({
						componentDatatype: Cesium.ComponentDatatype.DOUBLE,
						componentsPerAttribute: 3,
						values: m,
					}),
					st: new Cesium.GeometryAttribute({
						componentDatatype: Cesium.ComponentDatatype.FLOAT,
						componentsPerAttribute: 2,
						values: f,
					}),
				},
				V = Cesium.BoundingSphere.fromVertices(m),
				D = new Cesium.Geometry({
					attributes: G,
					indices: p,
					primitiveType: Cesium.PrimitiveType.TRIANGLES,
					boundingSphere: V,
				})
			return (0, computeVertexNormals)(D), (m = []), (p = []), D
		}),
		(n.createOutlineGeometry = function (t) {
			var e = t.length,
				i = t.topRadius,
				n = t.bottomRadius,
				r = t.slices,
				a = (2 * Math.PI) / (r - 1),
				u = t.zReverse,
				l = [],
				h = [],
				d = [],
				m = [],
				f = [n, i],
				p = [0, u ? -e : e],
				c = 0,
				_ = Math.atan2(n - i, e),
				g = s
			g.z = Math.sin(_)
			for (var v = Math.cos(_), y = 0; y < p.length; y++) {
				m[y] = []
				for (var C = f[y], w = 0; w < r; w++) {
					m[y].push(c++)
					var x = a * w,
						A = C * Math.cos(x),
						b = C * Math.sin(x)
					l.push(A, b, p[y]),
						(A = v * Math.cos(x)),
						(b = v * Math.sin(x)),
						h.push(A, b, g.z),
						d.push(y / (p.length - 1), 0)
				}
			}
			for (var M = [], y = 1; y < p.length; y++)
				for (var w = 1; w < r; w += 1) {
					var P = m[y - 1][w - 1],
						S = m[y][w - 1]
					m[y][w], m[y - 1][w]
					w % 8 == 1 && M.push(P, S)
				}
			;(M = new Int16Array(M)),
				(l = new Float32Array(l)),
				(h = new Float32Array(h)),
				(d = new Float32Array(d))
			var F = {
					position: new Cesium.GeometryAttribute({
						componentDatatype: Cesium.ComponentDatatype.DOUBLE,
						componentsPerAttribute: 3,
						values: l,
					}),
					normal: new Cesium.GeometryAttribute({
						componentDatatype: Cesium.ComponentDatatype.FLOAT,
						componentsPerAttribute: 3,
						values: h,
					}),
					st: new Cesium.GeometryAttribute({
						componentDatatype: Cesium.ComponentDatatype.FLOAT,
						componentsPerAttribute: 2,
						values: d,
					}),
				},
				E = Cesium.BoundingSphere.fromVertices(l),
				T = new Cesium.Geometry({
					attributes: F,
					indices: M,
					primitiveType: Cesium.PrimitiveType.LINES,
					boundingSphere: E,
				})
			return (l = []), (M = []), (d = []), T
		}),
		(n.fromAngleAndLength = function (t, e, i) {
			return (
				(t = Cesium.Math.toRadians(t)),
				new n({
					topRadius: (Math.tan(t) * e) / 2,
					bottomRadius: 0,
					length: e,
					zReverse: i,
				})
			)
		})
	return n
})()
// Cesium.Matrix4.getHeadingPitchRollByOrientation
var getHeadingPitchRollByOrientation = (function () {
	function a(e, t) {
		return n(
			e,
			Cesium.Matrix4.fromRotationTranslation(
				Cesium.Matrix3.fromQuaternion(t, h),
				e,
				f
			)
		)
	}
	function n(e, t) {
		var i = Cesium.Transforms.eastNorthUpToFixedFrame(
				e,
				Cesium.Ellipsoid.WGS84,
				new Cesium.Matrix4()
			),
			a = Cesium.Matrix4.multiply(
				Cesium.Matrix4.inverse(i, new Cesium.Matrix4()),
				t,
				new Cesium.Matrix4()
			),
			n = Cesium.Matrix4.getMatrix3(a, new Cesium.Matrix3()),
			r = Cesium.Quaternion.fromRotationMatrix(n)
		return Cesium.HeadingPitchRoll.fromQuaternion(r)
	}
	return a
})()

var SatelliteCoverageSimulation = (function () {
	'use strict'
	function n(t, e) {
		;(e = e || {}),
			(a = t.scene.globe.ellipsoid),
			(this._geometry = null),
			(this._areaType = e.areaType ? e.areaType : n.AreaType.FourPrism),
			(this._angle1 = e.angle1 ? e.angle1 : 10),
			(this._angle2 = e.angle2 ? e.angle2 : 10),
			(this._length = e.length ? e.length : 1e6),
			(this._position = e.position),
			(this.autoAngle = e.autoAngle),
			(this._rotation = e.rotation
				? e.rotation
				: {
						heading: 0,
						pitch: 0,
						roll: 0,
				  }),
			(this._show = Cesium.defaultValue(e.show, !0)),
			(this._outline = Cesium.defaultValue(e.outline, !1)),
			(this._groundArea = Cesium.defaultValue(e.groundArea, !1)),
			(this._groundOutLine = Cesium.defaultValue(e.groundOutLine, !1)),
			(this.defaultColor = e.color ? e.color : Cesium.Color.YELLOW),
			(this.defaultLineColor = e.lineColor),
			(this._groundAreaColor = e.groundAreaColor),
			(this._groundOutLineColor = e.groundOutLineColor),
			(this._modelMatrix = Cesium.Matrix4.clone(Cesium.Matrix4.IDENTITY)),
			(this._quaternion = new Cesium.Quaternion()),
			(this._translation = new Cesium.Cartesian3()),
			(this._scale = new Cesium.Cartesian3(1, 1, 1)),
			(this._matrix = new Cesium.Matrix4()),
			(this._inverseMatrix = new Cesium.Matrix4()),
			(this._positionCartographic = new Cesium.Cartographic()),
			(this._positionCartesian = null),
			(this._drawCommands = []),
			(this._outlinePositions = []),
			(this._imagingAreaPositions = []),
			(this._trackedEntity = e.trackedEntity),
			(this._trackPositions = []),
			(this._trackGeometries = []),
			(this._track = {
				geometry: null,
				needsUpdate: !1,
				lastestFrame: null,
			}),
			(this.viewer = t),
			this.viewer.scene.primitives.add(this),
			this.addGroundAreaEntity(this._groundArea || this._groundOutLine)
	}
	function r(t) {
		var e = []
		for (var i in t.attributes)
			t.attributes.hasOwnProperty(i) && t.attributes[i] && e.push(i)
		return e
	}
	function o(t, e, i, n, r, o, a) {
		;(r = r || Cesium.Ellipsoid.WGS84),
			o || (o = []),
			Cesium.Matrix4.inverse(e, m),
			Cesium.Matrix4.multiplyByPoint(e, Cesium.Cartesian3.ZERO, p),
			p.clone(c.origin)
		var s = 0
		n = Math.min(t?.length, i + n)
		for (var l = i; l < n; l += 3) {
			Cesium.Cartesian3.unpack(t, l, f),
				Cesium.Matrix4.multiplyByPoint(e, f, p),
				Cesium.Cartesian3.subtract(p, c.origin, c.direction),
				Cesium.Cartesian3.normalize(c.direction, c.direction)
			var h = Cesium.IntersectionTests.rayEllipsoid(c, r),
				d = null
			h && (d = Cesium.Ray.getPoint(c, h.start)),
				d
					? (d.clone(p),
					  (o[s] = p.clone(o[s])),
					  a &&
							a instanceof Float32Array &&
							(Cesium.Matrix4.multiplyByPoint(m, p, p),
							(a[i + 3 * s] = p.x),
							(a[i + 3 * s + 1] = p.y),
							(a[i + 3 * s + 2] = p.z)),
					  s++)
					: s++
		}
		return o
	}
	Object.defineProperty(Cesium, '__esModule', {
		value: !0,
	}),
		(SatelliteCoverageSimulation = void 0)
	var a,
		m = new Cesium.Matrix4(),
		f = new Cesium.Cartesian3(),
		p = new Cesium.Cartesian3(),
		c = new Cesium.Ray(),
		_ = new Cesium.Cartographic()
	;(n.AreaType = {
		Cone: 1,
		FourPrism: 2,
	}),
		Object.defineProperties(n.prototype, {
			color: {
				get: function () {
					return this.defaultColor
				},
				set: function (t) {
					this.defaultColor = t
				},
			},
			lineColor: {
				get: function () {
					return this.defaultLineColor
				},
				set: function (t) {
					this.defaultLineColor = t
				},
			},
			trackedEntity: {
				get: function () {
					return this._trackedEntity
				},
				set: function (t) {
					t != this._trackedEntity && (this.position = t.position),
						(this._trackedEntity = t)
				},
			},
			show: {
				get: function () {
					return this._show
				},
				set: function (t) {
					this._show = t
				},
			},
			outline: {
				get: function () {
					return this._outline
				},
				set: function (t) {
					this._outline = t
				},
			},
			angle1: {
				get: function () {
					return this._angle1
				},
				set: function (t) {
					;(this._angle1 = t), this.clearCommands(), (this._geometry = null)
				},
			},
			angle2: {
				get: function () {
					return this._angle2
				},
				set: function (t) {
					;(this._angle2 = t), this.clearCommands(), (this._geometry = null)
				},
			},
			areaType: {
				get: function () {
					return this._areaType
				},
				set: function (t) {
					;(this._areaType = t), this.clearCommands(), (this._geometry = null)
				},
			},
			rotation: {
				get: function () {
					return this._rotation
				},
				set: function (t) {
					;(this._rotation = t), this.clearCommands(), (this._geometry = null)
				},
			},
			heading: {
				get: function () {
					return this._rotation.heading
				},
				set: function (t) {
					;(this._rotation.heading = t),
						this.clearCommands(),
						(this._geometry = null)
				},
			},
			pitch: {
				get: function () {
					return this._rotation.pitch
				},
				set: function (t) {
					;(this._rotation.pitch = t),
						this.clearCommands(),
						(this._geometry = null)
				},
			},
			roll: {
				get: function () {
					return this._rotation.roll
				},
				set: function (t) {
					;(this._rotation.roll = t),
						this.clearCommands(),
						(this._geometry = null)
				},
			},
			position: {
				get: function () {
					return this._position
				},
				set: function (t) {
					;(this._position = t),
						(this._geometry = null),
						(this._drawCommands = [])
				},
			},
		}),
		(n.prototype.addGroundAreaEntity = function (t) {
			if (t && !this.groundAreaEntity) {
				var e = this,
					i = new Cesium.PolygonHierarchy()
				this.groundAreaEntity = this.viewer.entities.add({
					polygon: {
						show: this._groundArea,
						material: this._groundAreaColor || this.defaultColor,
						hierarchy: new Cesium.CallbackProperty(function (t) {
							return (i.positions = e._imagingAreaPositions), i
						}, !1),
					},
					polyline: {
						show: this._groundOutLine,
						material:
							this._groundOutLineColor ||
							this._groundAreaColor ||
							this.defaultColor,
						width: 1.5,
						positions: new Cesium.CallbackProperty(function (t) {
							return e._imagingAreaPositions
						}, !1),
					},
				})
			}
		}),
		(n.prototype.clearCommands = function () {
			this._drawCommands.forEach(function (t) {
				t.vertexArray.destroy()
			}),
				(this._drawCommands = [])
		}),
		(n.prototype.mergeGeometries = function (t, e) {
			if (!t || !t.length) throw new Error('缺少geometries参数')
			for (
				var i = [], n = !1, o = !1, a = t[0].primitiveType, s = 0;
				s < t.length;
				s++
			) {
				if (((i[s] = r(t[s])), s > 0)) {
					if (a != t[s].primitiveType) {
						o = !0
						break
					}
					var l = i[s - 1]
					if (!(n = l.length != i[s].length))
						for (var h = 0; h < l.length; h++)
							if (l[h] != i[s][h]) {
								n = !0
								break
							}
				}
				if (((a = t[s].primitiveType), n || o)) break
			}
			if (o) throw new Error('待合并的几何体中primitiveType属性不完全一致')
			if (n) throw new Error('待合并的几何体中属性数量和和名称不完全一致')
			for (var d = {}, m = i[0], s = 0; s < m.length; s++) {
				var f = m[s],
					p = t[0]
				d[f] = {}
				for (var c in p.attributes[f])
					p.attributes[f].hasOwnProperty(c) && (d[f][c] = p.attributes[f][c])
				for (var _ = Array.from(d[f].values), h = 1; h < t.length; h++) {
					p = t[h]
					for (var g = 0; g < p.attributes[f].values.length; g++)
						_.push(p.attributes[f].values[g])
				}
				d[f].values = new d[f].values.constructor(_)
			}
			for (var v = [], y = 0, h = 0; h < t.length; h++) {
				for (var p = t[0], s = 0; s < p.indices.length; s++)
					v.push(p.indices[s] + y)
				y += p.attributes.position.values.length / 3
			}
			var C = Cesium.BoundingSphere.fromVertices(d.position.values)
			return new Cesium.Geometry({
				attributes: d,
				indices: new Int32Array(v),
				primitiveType: t[0].primitiveType,
				boundingSphere: C,
			})
		}),
		(n.prototype.updateImagingAreaGeometry = function (t) {
			if (this._track.lastestFrame) {
				var e = this._track.lastestFrame.length != this._outlinePositions.length
				if (!e)
					for (var i = 0; i < this._track.lastestFrame.length; i++)
						if (
							!this._track.lastestFrame[i].equals(this._outlinePositions[i])
						) {
							e = !0
							break
						}
				if (!e) return
			}
			if (
				this._track.lastestFrame &&
				this._track.lastestFrame.length == this._outlinePositions.length
			)
				for (var i = 0; i < this._outlinePositions.length; i++)
					this._outlinePositions[i].clone(this._track.lastestFrame[i])
			else {
				this._track.lastestFrame = []
				for (var i = 0; i < this._outlinePositions.length; i++)
					this._track.lastestFrame.push(this._outlinePositions[i].clone())
			}
			var n = this.updateImagingAreaGeometry2(t)
			if ((this._trackGeometries.push(n), this._track.geometry)) {
				var r = this._track.geometry.attributes
				for (var i in r) r.hasOwnProperty(i) && delete r[i]
				for (var i in this._track.geometry)
					this._track.geometry.hasOwnProperty(i) &&
						delete this._track.geometry[i]
			}
			;(this._track.geometry = this.mergeGeometries(this._trackGeometries)),
				(this._track.needsUpdate = !0)
		})
	var g = new Cesium.Quaternion()
	;(n.prototype.computeMatrix = function (t, e) {
		if (
			(this._positionCartesian ||
				(this._positionCartesian = new Cesium.Cartesian3()),
			this.position instanceof Cesium.Cartesian3
				? (this._positionCartesian = this.position)
				: 'function' == typeof this.position.getValue
				? (this._positionCartesian = this.position.getValue(t))
				: this.position._value &&
				  this.position._value instanceof Cesium.Cartesian3 &&
				  (this._positionCartesian = this.position._value),
			!this._positionCartesian)
		)
			return this._matrix
		if (
			((this._modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
				this._positionCartesian,
				a,
				this._modelMatrix
			)),
			(this._positionCartographic = Cesium.Cartographic.fromCartesian(
				this._positionCartesian,
				a,
				this._positionCartographic
			)),
			Cesium.Transforms.eastNorthUpToFixedFrame(
				this._positionCartesian,
				a,
				this._modelMatrix
			),
			this.autoAngle && this._trackedEntity && this._trackedEntity.orientation)
		) {
			var i = Cesium.Property.getValueOrUndefined(
					this._trackedEntity.orientation,
					t,
					g
				),
				n = getHeadingPitchRollByOrientation(this._positionCartesian, i)
			this._rotation.heading = n.heading
		}
		return (
			Cesium.Quaternion.fromHeadingPitchRoll(this._rotation, this._quaternion),
			(this._matrix = Cesium.Matrix4.fromTranslationQuaternionRotationScale(
				this._translation,
				this._quaternion,
				this._scale,
				this._matrix
			)),
			Cesium.Matrix4.multiplyTransformation(
				this._modelMatrix,
				this._matrix,
				this._matrix
			),
			Cesium.Matrix4.inverseTransformation(this._matrix, this._inverseMatrix),
			this._matrix
		)
	}),
		(n.prototype.exportImagingArea = function (t, e) {
			var i = this._outlinePositions
			if (e) {
				if ((this.computeMatrix(e), !this._positionCartesian)) return
				i = o(
					this._positions,
					this._matrix,
					3,
					this._positions.length - 3,
					a,
					null,
					this._geometry.attributes.position.values
				)
			}
			for (var n = [], r = 0; r < i.length; r++) {
				var s = i[r]
				Cesium.Cartographic.fromCartesian(s, void 0, _)
				var l = [
					Cesium.Math.toDegrees(_.longitude),
					Cesium.Math.toDegrees(_.latitude),
				]
				t &&
					((l[0] = parseFloat(l[0].toFixed(t))),
					(l[1] = parseFloat(l[1].toFixed(t)))),
					n.push(turf.point(l))
			}
			var h = []
			if (n.length > 0) {
				n = turf.featureCollection(n)
				var d = turf.convex(n)
				if (d) {
					var m = turf.getCoords(d)
					m && m.length > 0 && (h = m[0])
				}
			}
			return h
		}),
		(n.prototype.updateImagingAreaGeometry2 = function (t) {
			for (
				var e = [], i = [], n = 0, r = 0;
				r < this._outlinePositions.length;
				r += 2
			) {
				var o = this._outlinePositions[0]
				e.push(o.x, o.y, o.z), i.push(n++)
			}
			return (
				(e = new Float32Array(e)),
				(i = new Int32Array(i)),
				new Cesium.Geometry({
					attributes: {
						position: new Cesium.GeometryAttribute({
							componentDatatype: Cesium.ComponentDatatype.DOUBLE,
							componentsPerAttribute: 3,
							values: e,
						}),
					},
					primitiveType: Cesium.PrimitiveType.LINES,
					indices: i,
					boundingSphere: Cesium.BoundingSphere.fromVertices(e),
				})
			)
		}),
		(n.prototype.remove = function () {
			this.viewer.scene.primitives.remove(this),
				this.groundAreaEntity &&
					this.viewer.entities.remove(this.groundAreaEntity)
		}),
		(n.prototype.destroy = function (t) {
			if (t) {
				this.viewer.scene.primitives.remove(this),
					this.groundAreaEntity &&
						this.viewer.entities.remove(this.groundAreaEntity),
					this._drawCommands.forEach(function (t) {
						t.vertexArray = t.vertexArray && t.vertexArray.destroy()
					}),
					(this._drawCommands = [])
				for (var e in this._outlineGeometry.attributes)
					this._outlineGeometry.attributes.hasOwnProperty(e) &&
						delete this._outlineGeometry.attributes[e]
				for (var e in this._geometry.attributes)
					this._geometry.attributes.hasOwnProperty(e) &&
						delete this._geometry.attributes[e]
				delete this._outlineGeometry,
					delete this._geometry,
					delete this._positionCartesian,
					delete this._position,
					(this._outlinePositions = [])
			}
		}),
		(n.prototype.addToScene = function () {
			this.viewer.scene.primitives.add(this),
				this.groundAreaEntity && this.viewer.entities.add(this.groundAreaEntity)
		}),
		(n.prototype.updateGeometry = function () {
			this._areaType == n.AreaType.Cone
				? ((this._geometry = CylinderGeometry.createGeometry(
						CylinderGeometry.fromAngleAndLength(this._angle1, this._length, !0),
						this._matrix
				  )),
				  (this._outlineGeometry = CylinderGeometry.createOutlineGeometry(
						CylinderGeometry.fromAngleAndLength(this._angle1, this._length, !0)
				  )))
				: ((this._geometry = FourPrismGeometry.createGeometry(
						FourPrismGeometry.fromAnglesLength(
							this._angle1,
							this._angle2,
							this._length,
							!0
						),
						this._matrix
				  )),
				  (this._outlineGeometry = FourPrismGeometry.createOutlineGeometry(
						FourPrismGeometry.fromAnglesLength(
							this._angle1,
							this._angle2,
							this._length,
							!0
						)
				  ))),
				(this._positions = new Float32Array(
					this._geometry.attributes.position.values.length
				))
			for (var t = 0; t < this._positions.length; t++)
				this._positions[t] = this._geometry.attributes.position.values[t]
			this._outlinePositions = []
		}),
		(n.prototype.updateVolumeGeometry = function () {
			var t = 1 + this._imagingAreaPositions.length,
				e = new Float32Array(3 + 3 * this._imagingAreaPositions.length),
				i = 0
			;(e[i++] = this._positionCartesian.x),
				(e[i++] = this._positionCartesian.y),
				(e[i++] = this._positionCartesian.z)
			for (var n = 0; n < this._imagingAreaPositions.length; n++)
				(e[i++] = this._imagingAreaPositions[n].x),
					(e[i++] = this._imagingAreaPositions[n].y),
					(e[i++] = this._imagingAreaPositions[n].z)
			for (var r = [], o = [], n = 1; n < t - 1; n++)
				r.push(0, n, n + 1), o.push(0, n)
			r = t >= 65535 ? new Uint32Array(r) : new Uint16Array(r)
			var a = {
					position: new Cesium.GeometryAttribute({
						componentDatatype: Cesium.ComponentDatatype.DOUBLE,
						componentsPerAttribute: 3,
						values: e,
					}),
				},
				s = Cesium.BoundingSphere.fromVertices(e),
				l = new Cesium.Geometry({
					attributes: a,
					indices: r,
					primitiveType: Cesium.PrimitiveType.TRIANGLES,
					boundingSphere: s,
				}),
				h = new Cesium.Geometry({
					attributes: a,
					indices: new Uint32Array(o),
					primitiveType: Cesium.PrimitiveType.LINES,
					boundingSphere: s,
				})
			;(0, computeVertexNormals)(l),
				(this._volumeGeometry = l),
				(this._volumeOutlineGeometry = h)
		}),
		(n.prototype.update = function (t) {
			if (this._show && (this.computeMatrix(t.time), this._positionCartesian)) {
				this._geometry || this.updateGeometry(),
					(this._outlinePositions = o(
						this._positions,
						this._matrix,
						3,
						this._positions.length - 3,
						a,
						this._outlinePositions,
						this._geometry.attributes.position.values
					)),
					this._imagingAreaPositions.splice(
						0,
						this._imagingAreaPositions.length
					)
				var e = this.exportImagingArea()
				if (e && e.length) {
					for (var i = 0; i < e.length; i++) {
						var n = e[i]
						this._imagingAreaPositions.push(
							Cesium.Cartesian3.fromDegrees(n[0], n[1])
						)
					}
					t.mode === Cesium.SceneMode.SCENE3D
						? (this.updateVolumeGeometry(),
						  this._volumeGeometry &&
								(this._volumeCommand &&
									((this._volumeCommand.vertexArray =
										this._volumeCommand.vertexArray &&
										this._volumeCommand.vertexArray.destroy()),
									(this._volumeCommand = null)),
								(this._volumeCommand = this.createDrawCommand(
									this._volumeGeometry,
									t,
									Cesium.Matrix4.IDENTITY.clone()
								)),
								t.commandList.push(this._volumeCommand),
								this._outline &&
									(this._volumeOutlineCommand &&
										((this._volumeOutlineCommand.vertexArray =
											this._volumeOutlineCommand.vertexArray &&
											this._volumeOutlineCommand.vertexArray.destroy()),
										(this._volumeOutlineCommand = null)),
									(this._volumeOutlineCommand = this.createDrawCommand(
										this._volumeOutlineGeometry,
										t,
										Cesium.Matrix4.IDENTITY.clone()
									)),
									t.commandList.push(this._volumeOutlineCommand))),
						  this.groundAreaEntity &&
								((this.groundAreaEntity.polygon.show =
									this._groundArea && this._show),
								(this.groundAreaEntity.polyline.show =
									this._groundOutLine && this._show)))
						: (this.groundAreaEntity || this.addGroundAreaEntity(!0),
						  (this.groundAreaEntity.polygon.show = !0))
				} else
					this._outline &&
						(this._outlineGeometry._drawCommand ||
							(this._outlineGeometry._drawCommand = this.createDrawCommand(
								this._outlineGeometry,
								t
							)),
						t.commandList.push(this._outlineGeometry._drawCommand)),
						this.groundAreaEntity &&
							((this.groundAreaEntity.polygon.show = !1),
							(this.groundAreaEntity.polyline.show = !1))
			}
		}),
		(n.prototype.getFragmentShaderSource = function (t) {
			return '\nvarying vec3 v_position;\nvarying vec3 v_normal;\nuniform float picked;\nuniform vec4  pickedColor;\nuniform vec4  defaultColor;\nuniform float specular;\nuniform float shininess;\nuniform vec3  emission;\nvarying vec2 v_st;\nuniform bool isLine;\nuniform float glowPower;\nvoid main() {\n    vec3 positionToEyeEC = -v_position; \n    vec3 normalEC =normalize(v_normal);\n    vec4 color=defaultColor;\n    if(picked!=0.0){\n        color = pickedColor;\n    }\n    //if(v_st.x<0.5){\n    //    color.a =0.75-v_st.x; \n    //}\n    //else  {\n    //    color.a =v_st.x-0.25; \n    //}\n    czm_material material;\n    material.specular = specular;\n    material.shininess = shininess;\n    material.normal =  normalEC;\n    material.emission =emission;//vec3(0.2,0.2,0.2);\n    material.diffuse = color.rgb ;\n    if(isLine){\n        material.alpha = 1.0; \n    }\n    else{\n        material.alpha =  color.a; \n    }\n        //float glow = glowPower / abs(v_st.t  ) - (glowPower / 0.5); \n        // \n        //material.emission = max(vec3(glow - 1.0 + color.rgb), color.rgb); \n        //if(isLine)\n        //    material.alpha = clamp(0.0, 1.0, glow) * color.a; \n         \n    if(v_st.x==0.0){ \n          gl_FragColor =color ;\n    }else { \n        gl_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC) ; \n    } \n}'
		}),
		(n.prototype.getVertexShaderSource = function (t) {
			return '\n#ifdef GL_ES\n    precision highp float;\n#endif\n\nattribute vec3 position;\nattribute vec2 st;\nattribute vec3 normal;\nuniform mat4 modelViewMatrix;\nuniform mat3 normalMatrix;\nuniform mat4 projectionMatrix;\nvarying vec3 v_position;\nvarying vec3 v_normal;\nvarying vec2 v_st;\n\nvarying vec3 v_light0Direction;\n\nvoid main(void) \n{\n    vec4 pos =  modelViewMatrix * vec4( position,1.0);\n    v_normal =  normalMatrix *  normal;\n    v_st = st;\n    v_position = pos.xyz;\n    v_light0Direction = mat3( modelViewMatrix) * vec3(1.0,1.0,1.0);\n    gl_Position =  projectionMatrix * pos;\n}'
		}),
		(n.prototype.createDrawCommand = function (t, e, i) {
			var n = e.context,
				r = new Cesium.Cartesian3()
			Cesium.Matrix4.multiplyByPoint(this._matrix, t.boundingSphere.center, r)
			var o =
					(new Cesium.BoundingSphere(r, t.boundingSphere.radius),
					new Cesium.DrawCommand({
						modelMatrix: i || this._matrix,
						owner: this,
						primitiveType: t.primitiveType,
						pass: Cesium.Pass.OPAQUE,
					})),
				a = this,
				s = Cesium.GeometryPipeline.createAttributeLocations(t)
			return (
				(o.vertexArray = Cesium.VertexArray.fromGeometry({
					context: n,
					geometry: t,
					attributeLocations: s,
					bufferUsage: Cesium.BufferUsage.STATIC_DRAW,
				})),
				(o.vertexArray._attributeLocations = s),
				(o.shaderProgram = Cesium.ShaderProgram.replaceCache({
					context: n,
					vertexShaderSource: this.getVertexShaderSource(t),
					fragmentShaderSource: this.getFragmentShaderSource(t),
					attributeLocations: s,
				})),
				(o.renderState = Cesium.RenderState.fromCache({
					blending: Cesium.BlendingState.ALPHA_BLEND,
					depthTest: {
						enabled: !0,
						func: Cesium.DepthFunction.LESS,
					},
					cull: {
						enabled: !1,
						face: Cesium.CullFace.BACK,
					},
					depthMask: !1,
				})),
				(o.uniformMap = {}),
				(o.uniformMap.projectionMatrix = function () {
					return e.context.uniformState.projection
				}),
				(o.uniformMap.modelViewMatrix = function () {
					return e.context.uniformState.modelView
				}),
				(o.uniformMap.shininess = function () {
					return a.shininess || (a.shininess = 0), a.shininess
				}),
				(o.uniformMap.emission = function () {
					return (
						a.emission || (a.emission = new Cesium.Cartesian3(0.2, 0.2, 0.2)),
						a.emission
					)
				}),
				(o.uniformMap.specular = function () {
					return a.specular || (a.specular = 0), a.specular
				}),
				(o.uniformMap.isLine = function () {
					return t.primitiveType == Cesium.PrimitiveType.LINES
				}),
				(o.uniformMap.defaultColor = function () {
					return t.color
						? t.color
						: t.primitiveType == Cesium.PrimitiveType.LINES
						? a.defaultLineColor ||
						  a.defaultColor ||
						  new Cesium.Color(1, 1, 0, 0.5)
						: a.defaultColor || new Cesium.Color(1, 0, 0, 1)
				}),
				(o.uniformMap.picked = function () {
					return a.picked || (a.picked = 0), a.picked
				}),
				(o.uniformMap.pickedColor = function () {
					return (
						a.pickedColor || (a.pickedColor = new Cesium.Color(1, 1, 0, 1)),
						a.pickedColor
					)
				}),
				(o.uniformMap.normalMatrix = function () {
					return e.context.uniformState.normal
				}),
				(o.uniformMap.glowPower = function () {
					return 0.25
				}),
				o
			)
		})
	return n
})()
