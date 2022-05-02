import React, { useEffect, useState, useRef } from 'react';
import levels from './data';
import './style.css';

const defaultLevel = 0;
const defaultWidth = 800;
const defaultRows = 16;
const defaultDir = new Map([
    ['ArrowUp', -16],
    ['ArrowDown', 16],
    ['ArrowLeft', -1],
    ['ArrowRight', 1],
]);

let canv;
let ctx;
let g = {
    wall: { color: '#333', data: [] },
    target: { color: '#9f3', data: [] },
    box: { color: 'rgba(255,50,0,0.8)', data: [] },
    player: { color: 'rgba(255,220,0,0.8)', data: [] },
};
let keys = ['wall', 'target', 'box', 'player'];

/**
 * 推箱子
 */
const PushBox = () => {
    const [currentLevel, setCurrentLevel] = useState(defaultLevel);
    const leave = useRef(defaultLevel);

    // 初始化地图
    const initMap = (currentLevel) => {
        let map = levels[currentLevel];
        keys.forEach((k) => (g[k].data = []));
        for (let i = 0; i < defaultRows; i++) {
            for (let j = 0; j < defaultRows; j++) {
                let d = map[i][j];
                let id = i * defaultRows + j;
                if (d > 0) {
                    let k = keys[d - 1];
                    if (d === 5) {
                        g['target'].data.push(id);
                        g['box'].data.push(id);
                    } else {
                        g[k].data.push(id);
                    }
                }
            }
        }

        if (ctx) {
            ctx.clearRect(0, 0, defaultWidth, defaultWidth);
            // 绘制地图
            keys.forEach((k) => g[k].data.forEach((n) => drawRRect(k, n)));
        }
    };

    // 画格子
    const drawRRect = (who, id) => {
        let w = defaultWidth / defaultRows; // width
        let r = 5; // radius
        let m = 2; // magin
        let [x, y] = [(id % defaultRows) * w, ~~(id / defaultRows) * w];
        if (who === 'target') {
            m = 5;
            r = 20;
        }
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, y + r);
        ctx.arcTo(x, y + w - m, x + w - m, y + w - m, r);
        ctx.arcTo(x + w - m, y + w - m, x + w - m, y, r);
        ctx.arcTo(x + w - m, y, x, y, r);
        ctx.arcTo(x, y, x, y + w - m, r);
        ctx.fillStyle = g[who].color;
        ctx.fill();
        ctx.restore();
    };

    // 移动角色(推箱子动作)
    const move = (who, id, dir) => {
        let next = id + dir;
        // 更新游戏数据
        let index = g[who].data.indexOf(id);
        g[who].data[index] = next;
        // 重绘地图
        ctx.clearRect(0, 0, defaultWidth, defaultWidth);
        keys.forEach((k) => g[k].data.forEach((n) => drawRRect(k, n)));
    };

    // 游戏结束，自动下一关
    const checkOver = () => {
        const over = g.box.data.every((b) => g.target.data.includes(b));
        if (over) {
            leave.current = leave.current + 1;
            if (leave.current <= 99) {
                initMap(leave.current);
                setCurrentLevel(leave.current);
            }
        }
    };

    // 键盘事件
    const keydownFn = (e) => {
        const dir = defaultDir.get(e.key);
        const player = g['player'].data[0];
        const next = player + dir;
        // 判断是否撞墙
        if (g.wall.data.includes(next)) return;
        // 判断是否推箱子
        if (g.box.data.includes(next)) {
            let box = next;
            // 判断箱子前面是否为墙或箱子
            let nextBox = box + dir;
            if (g.wall.data.includes(nextBox) || g.box.data.includes(nextBox)) {
                return;
            }

            // 推箱子
            move('box', box, dir);
            if (g.target.data.includes(nextBox)) {
                checkOver();
            }
        }
        if (dir) {
            // 移动角色
            move('player', player, dir);
        }
    };

    // 初始化数据
    const init = () => {
        canv = document.querySelector('#myCanv');
        ctx = canv.getContext('2d');
        initMap(currentLevel);
    };

    // 检测输入框变化
    const handleChange = (e) => setCurrentLevel(e.target.value);

    // 点击换关
    const handleClick = (n) => {
        let lv = currentLevel + n;
        if (n === undefined) lv = currentLevel;
        let level = lv < 0 ? 0 : lv > 99 ? 99 : lv;
        setCurrentLevel(n === 0 ? 0 : level);
        initMap(n === 0 ? 0 : level);
    };

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', keydownFn);

        return () => {
            document.removeEventListener('keydown', keydownFn);
        };
    }, []);

    return (
        <div className="box-center">
            <div className="nav">
                <button className="btn" onClick={() => handleClick(-1)}>
                    上一关
                </button>
                <button className="btn" onClick={() => handleClick(1)}>
                    下一关
                </button>
                <input
                    id="level"
                    className="level"
                    type="text"
                    value={currentLevel}
                    onChange={handleChange}
                />
                <button className="go-btn" onClick={() => handleClick()}>
                    GO
                </button>
                <button className="btn" onClick={() => handleClick(0)}>
                    重新开始
                </button>
            </div>
            <canvas id="myCanv" width="800" height="800" />;
        </div>
    );
};

export default PushBox;
