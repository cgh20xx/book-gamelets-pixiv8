# 這個專案從pixi.js v7升級到v8所做的變更

# package.json

- "pixi.js": "^8.0.1"
- "@pixi/gif": "^3.0.0",
- "@pixi/sound": "^6.0.0",
- "eventemitter3": "^5.0.1", (新增，原本是包在pixi.js裏面)

# app.js

```typescript
let app = new Application<HTMLCanvasElement>();
document.body.appendChild(app.view);
//改成
let app = new Application();
document.body.appendChild(app.canvas);
```
```typescript
stageFrame.lineStyle({
        color: 0xFF0000,
        width: 2,
    });
stageFrame.drawRect(
    0,               // x
    0,               // y
    stageSize.width, // 寬
    stageSize.height // 高
);
// 改成
stageFrame.setStrokeStyle({
    color: 0xFF0000,
    width: 2,
});
stageFrame.rect(
    0,               // x
    0,               // y
    stageSize.width, // 寬
    stageSize.height // 高
);
```

# RectUtils.ts

```typescript
class Rectangle {
    ...
}
// 改成
interface ShapePrimitive {
    ...
}
```