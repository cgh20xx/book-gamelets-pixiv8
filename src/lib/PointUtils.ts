import { ObservablePoint, Point } from "pixi.js";
import 'pixi.js/math-extras';

declare module "pixi.js" {
    interface OurPoint {
        /** 計算向量的長度 */
        length(): number
        /** 加另一個向量，回傳新的向量 */
        // add(other: Point): Point
        /** 減另一個向量，回傳新的向量 */
        // sub(other: Point): Point
        /**　縮放向量 */
        scale(value: number): void
        /** 將向量正規化，並回傳原本的向量長度 */
        // normalize(length?: number): number
        /** 計算距離另一個座標的距離 */
        distanceTo(other: Point): number
        /** 將向量旋轉一個角度 */
        rotate(rotation: number): this
        /** 計算向量的內積(dot) */
        // dot(other: Point): number
        /** 計算向量的行列式(determinant) */
        det(other: Point): number
    }
    interface Point extends OurPoint {

    }
    interface ObservablePoint extends OurPoint {

    }
}

Point.prototype.length = function () {
    return this.magnitude();
}

ObservablePoint.prototype.length = Point.prototype.length;

// Point.prototype.add = function (other: Point) {
//     return new Point(this.x + other.x, this.y + other.y);
// }
// ObservablePoint.prototype.add = Point.prototype.add;

// Point.prototype.sub = function (other: Point) {
//     return new Point(this.x - other.x, this.y - other.y);
// }
// ObservablePoint.prototype.sub = Point.prototype.sub;

Point.prototype.scale = function (value: number) {
    this.x *= value;
    this.y *= value;
}
ObservablePoint.prototype.scale = Point.prototype.scale;

// Point.prototype.normalize = function (length: number = 1) {
//     let originLength = this.length();
//     // 如果向量原長不是０才有辦法調整長度
//     if (originLength != 0) {
//         this.scale(length / originLength);
//     }
//     return originLength;
// }
// ObservablePoint.prototype.normalize = Point.prototype.normalize;

Point.prototype.distanceTo = function (other: Point) {
    let dx = this.x - other.x;
    let dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
}
ObservablePoint.prototype.distanceTo = Point.prototype.distanceTo;

// 用泛型定義一個通用的旋轉函式
function vectorRotate<T extends Point>(vector: T, rotation: number): T {
    let cos = Math.cos(rotation);
    let sin = Math.sin(rotation);
    vector.set(
        vector.x * cos - vector.y * sin,
        vector.y * cos + vector.x * sin
    );
    return vector;
}
// 實作Point的rotate()
Point.prototype.rotate = function (rotation: number) {
    return vectorRotate<Point>(this, rotation);
}
// 實作ObservablePoint的rotate()
ObservablePoint.prototype.rotate = function (rotation: number) {
    return vectorRotate<ObservablePoint>(this, rotation);
}

// Point.prototype.dot = function (other: Point) {
//     return this.x * other.x + this.y * other.y;
// }
// ObservablePoint.prototype.dot = Point.prototype.dot;

Point.prototype.det = function (other: Point) {
    return this.x * other.y - other.x * this.y;
}
ObservablePoint.prototype.det = Point.prototype.det;
