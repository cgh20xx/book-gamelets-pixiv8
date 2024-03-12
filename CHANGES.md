# 這個專案從pixi.js v7升級到v8所做的變更

# package.json

- "pixi.js": "^8.0.1"
- "@pixi/gif": "^3.0.0",
- "@pixi/sound": "^6.0.0",
- "eventemitter3": "^5.0.1", (新增，原本是包在pixi.js裏面)

詳細變動請參考 https://github.com/haskasu/book-gamelets-pixiv8/commit/d4f193cc12a2a2c3ef5288c1a520bad3bd33971f

# v7升級到v8的重點

## App的初始化

Application的初始化改成非同步，所以我們在main.ts要用非同步的方式啟動Application，再設定其他有用到Application的物件。

另外，Application中原本代表繪圖板的view屬性，改了名字變成canvas。

```typescript
// v7的啟動
let app = new Application<HTMLCanvasElement>();
document.body.appendChild(app.view);

// v8的啟動
async function startApp() {
    let app = new Application();
    await app.init();
    document.body.appendChild(app.canvas);
    return app;
}
```


## Assets

以前用來載入資源的Loader改成Assets，而且v8版鼓勵事件預載資源，所以現在無法用 BaseTexture.from(url) 先建立材質，讓pixi在內部載入完成後自動更新繪圖。

```typescript
// v7以前可以這樣
let baseTexture = BaseTexture.from(url);
let texture = new Texture(baseTexture);
let sprite = new Sprite(texture);
// 此時的材質其實還沒載入完成，所以sprite實際上不會繪製圖形
baseTexture.once('loaded', () => {
    // 這個時候載入才完成，sprite也才會有正確的長寬屬性
});
```
在v8的時候可能就要改成這樣。
```typescript
async function preload() {
    Assets.add({alias: 'myImage', src: myImage_url});
    await Assets.load();
}
async function startGame() {
    // 以Assets先將圖形資源都載入
    await preload();
    // 然後再將材質取出來用
    let texture = Assets.get('myImage');
    let sprite = new Sprite({texture: texture});
}
```

## 建構子的參數

以前大部分的建構子會將重要的參數獨立成一個建構子參數，而在v8版則統一放到一個Object的參數物件。
```typescript
// v7的樣子
let texture = new Texture(baseTexture, frame);
// v8變成這樣
let texture = new Texture({
    source: baseTexture,
    frame: frame,
});
```

## DisplayObject與Container

在v7以前，繪圖物件的基底類別是DisplayObject，而Container是個比較高階的類別。

在v8中，繪圖物件的基底類別雖然變成了Container，包括Sprite、Graphics等都繼承了Container，但是只有 Container 可以加入子物件(children)。

```typescript
// v7 Sprite, Mesh, Graphics, Container 都可以加入子物件
const sprite = new Sprite();
const spriteChild = new Sprite();
sprite.addChild(spriteChild);

// v8 只允許 Container 可以加入子物件
const container = new Container();
const sprite = new Sprite();
const spriteChild = new Sprite();

container.addChild(sprite);
container.addChild(spriteChild);
```

## Graphics的繪圖方法

v8捨棄了以往從Flash學來的填色順序，改用比較簡潔的繪圖方法。

```typescript
// v7的繪圖方式
let graphics = new Graphics();
// 設定畫線的樣式
graphics.lineStyle({
    color: 0xFF0000,
    width: 2,
});
// 開始填色，並設定顏色
graphics.beginFill(0x00FF00, 0.5);
// 畫圖
graphics.drawCircle(0, 0, 10);
// 結束填色
```
以下用v8畫出一模一樣的圖形。
```typescript
// v8的繪圖方式
let graphics = new Graphics();
// 先畫圖稿(虛擬稿)
graphics.circle(0, 0, 10);
// 將稿子填色
graphics.fill({color: 0x00FF00, alpha: 0.5});
// 設定描線樣式
graphics.setStrokeStyle({
    color: 0xFF0000,
    width: 2,
});
// 將稿子描線
graphics.stroke();
```

## Ticker

pixi.js提供的Ticker在註冊更新函式時，更新函式的參數由deltaTime改成ticker自己，所以專案內所有以ticker更新的函式都要跟著改變。
```typescript
class example {
    constructor(public app: Application) {
        // 將updateV7加入ticker
        app.ticker.add(updateV7);
    }
    // v7的更新函式是這樣的
    function updateV7(dt: number) {
        ...
    }
}
```
在v8裏要這樣寫才對。
```typescript
class example {
    constructor(public app: Application) {
        // 將updateV8加入ticker
        app.ticker.add(updateV8);
    }
    // v8的更新函式是這樣的
    function updateV8(ticker: Ticker) {
        const dt = ticker.deltaTime;
        ...
    }
}
```

## Bounds

用來檢查繪圖物件邊界範圍的Bounds長得和v7的不一樣了。在v7的Bounds實際上就是一個Rectangle，但在v8中的Bounds有自己的類別。
```typescript
// v7的bounds
function collides(obj1: DisplayObject, obj2: DisplayObject): boolean {
    let bounds1: Rectangle = obj1.getBounds();
    let bounds2: Rectangle = obj2.getBounds();
    return bounds1.intersects(bounds2);
}
```
```typescript
// v8的bounds
function collides(obj1: Container, obj2: Container): boolean {
    let bounds1: Bounds = obj1.getBounds();
    let bounds2: Bounds = obj2.getBounds();
    return bounds1.rectangle.intersects(bounds2.rectangle);
}
```

## Point與Rectangle

我們原本的專案中有幫Point與Rectangle加了許多功能，比如length(), dot()等向量的計算，但在v8中都有內建這些功能了。

不過dot(內積), cross(外積), add(向量相加)等功能是寫在math-extras的外掛模組中，所以雖然寫程式時可以看到Point有這些功能，但實際在執行的時候呼叫這些函式會出錯。

所以在PointUtils.ts裏面，我們需要手動將math-extras載入我們的專案。
```typescript
/** PointUtils.ts */
...
import 'pixi.js/math-extras';
...
```

pixi.js v8中給Point配上的normalize()和先前我們專案寫的不一樣。我們寫的normalize(length?: number): number可以給一個最後要給向量的長度作為參數，並回傳執行前的向量長度。

v8的normalize()不接受參數，且回傳值為一個新的向量。所以要將向量調整成我們要的長度，就要用新的方法。
```typescript
// 在v8調整向量長度的方法
let point = new Point(3, 4);
// 將向量長度拉長到50
let currentLength = point.length();
if (currentLength) {
    point.scale(50 / currentLength);
}
```
