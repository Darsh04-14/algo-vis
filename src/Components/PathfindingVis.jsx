import React from 'react';
import {PriorityQueue} from './pq.js';
import './style.css';

let startRow = 0, startCol = 0, startUp = false;
let endRow = 24, endCol = 59, endUp  = false;
let drawWall = false;
let isSolving = false;
let time = 5000;

export default class PathfindingVis extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            grid: [],
        };
    }
    componentDidMount() {
        this.getGrid();
    }

    getGrid() {
        const grid = [];
        for (let i = 0; i < 25; i++) {
            const temp = [];
            for (let j = 0; j < 60; j++) temp.push('');
            grid.push(temp);
        }
        this.setState({grid});
    }

    resetSearched() {
        const {grid} = this.state;
        for (let i = 0; i < 25; i++)
            for (let j = 0; j < 60; j++) if (grid[i][j] !== 'w') grid[i][j] = '';
        this.setState({grid});
    }

    getGridCopy() {
        const {grid} = this.state;
        let gridCopy = [];
        for (let i = 0; i < 25; i++) {
            let temp = [];
            for (let j = 0; j < 60; j++) {
                temp.push(grid[i][j]);
            }
            gridCopy.push(temp);
        }
        return gridCopy;
    }

    handleClick(row, col) {
        if (isSolving) return;
        const {grid} = this.state;
        this.resetSearched();
        if (row === startRow && col === startCol && !drawWall) {startRow = -1; startCol = -1; startUp = true;}
        else if (endRow === row && col === endCol && !drawWall) {endRow = -1; endCol = -1; endUp = true;}
        else if (startUp && grid[row][col] !== 'w') {startRow = row; startCol = col; startUp = false;}
        else if (endUp && grid[row][col] !== 'w') {endRow = row; endCol = col; endUp = false;}
        else { drawWall = !drawWall; this.handleMouseEnter(row, col); }
        this.setState({grid});
    }

    handleMouseEnter(row, col) {
        if (isSolving) return;
        if ((row === startRow && col === startCol) || (endCol === col && endRow === row)) return;
        const {grid} = this.state;
        if(drawWall && grid[row][col] !== 'w') {
            grid[row][col] = 'w';
        } else if (drawWall) {
            grid[row][col] = '';
        }
        this.setState({grid});
    }

    breadthFirstSearch(animations) {
        let queue = [[startRow, startCol]];
        let gridCopy = this.getGridCopy();
        let prev = new Map();
        let found = false;
        gridCopy[startRow][startCol] = 'w';
        while (queue.length !== 0) {
            let temp = [];
            for (let i = 0; i < queue.length; i++) {
                let row = queue[i][0], col = queue[i][1];
                animations.push([row, col]);
                if (row === endRow && col === endCol) {found = true; break;}
                if (col + 1 < 60 && gridCopy[row][col + 1] !== 'w') {temp.push([row, col + 1]); gridCopy[row][col + 1] = 'w'; prev.set((row * 60) + col + 1, row*60+col);}
                if (col - 1 >= 0 && gridCopy[row][col - 1] !== 'w') {temp.push([row, col - 1]); gridCopy[row][col  -1] = 'w'; prev.set((row * 60 ) + col - 1, row*60+col);}
                if (row - 1 >= 0 && gridCopy[row - 1][col] !== 'w') {temp.push([row - 1, col]); gridCopy[row - 1][col] = 'w'; prev.set((row - 1) * 60 + col, row*60+col); }
                if (row + 1 < 25 && gridCopy[row + 1][col] !== 'w') {temp.push([row + 1, col]); gridCopy[row + 1][col] = 'w'; prev.set((row + 1)*60 + col, row*60+col);}
            }
            queue = temp;
            if (found) break;
        }
        if (found) {
            let path = [[endRow, endCol]];
            let rc = prev.get(endRow*60 + endCol);
            while (rc !== startRow*60 + startCol) {
                path.unshift([Math.floor(rc/60), rc%60]);
                rc = prev.get(rc);
            }
            path.unshift([startRow, startCol]);
            this.animateShortestPath(path, time);
        }
    }

    depthFirstSearch(animations) {
        let gridCopy = this.getGridCopy();
        let prev = new Map();
        let found = false;
        dfs(startRow, startCol);
        function dfs(row, col) {
            if (gridCopy[row][col] === 'w' || found) return;
            animations.push([row, col]);
            if (row === endRow && col === endCol) {found = true; return;}
            gridCopy[row][col] = 'w';
            if (row - 1 >= 0 && gridCopy[row - 1][col] !== 'w' && found === false) {prev.set((row - 1) * 60 + col, row*60+col); dfs(row - 1, col);}
            if (col + 1 < 60 && gridCopy[row][col + 1] !== 'w' && found === false) {prev.set((row * 60) + col + 1, row*60+col); dfs(row, col + 1);}
            if (row + 1 < 25 && gridCopy[row + 1][col] !== 'w' && found === false) {prev.set((row + 1)*60 + col, row*60+col); dfs(row + 1, col); }
            if (col - 1 >= 0 && gridCopy[row][col - 1] !== 'w' && found === false) {prev.set((row * 60 ) + col - 1, row*60+col); dfs(row, col - 1);}
        }
        if (found) {
            let path = [[endRow, endCol]];
            let rc = prev.get(endRow*60 + endCol);
            while (rc !== startRow*60 + startCol) {
                path.unshift([Math.floor(rc/60), rc%60]);
                rc = prev.get(rc);
            }
            path.unshift([startRow, startCol]);
            this.animateShortestPath(path, time);
        }
    }

    dijkstra(animations) {
        let gridCopy = this.getGridCopy();
        let prev = new Map();
        let found = false;
        let dist = new Array(1500).fill(Number.MAX_VALUE);
        dist[startRow*60+startCol] = 0;
        var pq = new PriorityQueue((a, b) => {return a[1] - b[1]});
        pq.enqueue([startRow*60 + startCol, 0]);
        while (pq.size() !== 0) {
            let [index, minValue] = pq.dequeue(), row = Math.floor(index/60), col = index % 60;
            gridCopy[row][col] = 'w';
            animations.push([row, col]);
            if (row === endRow && col === endCol) {found = true; break;}
            if (dist[index] < minValue) continue;
            if (col + 1 < 60 && gridCopy[row][col + 1] !== 'w' && dist[index] + 1 < dist[row*60 + col + 1]) {dist[row*60 + col + 1] = dist[index] + 1; pq.enqueue([row*60+col + 1, dist[index]+1]); prev.set(row*60+col + 1, row*60+col);}
            if (col - 1 >= 0 && gridCopy[row][col - 1] !== 'w' && dist[index] + 1 < dist[row*60 + col - 1]) {dist[row*60 + col - 1] = dist[index] + 1; pq.enqueue([row*60+col - 1, dist[index] +  1]); prev.set(row*60+col - 1, row*60+col);}
            if (row - 1 >= 0 && gridCopy[row - 1][col] !== 'w' && dist[index] + 1 < dist[(row - 1)*60+col]) {dist[(row-1)*60 + col] = dist[index] + 1; pq.enqueue([(row-1)*60+col, dist[index] + 1]); prev.set((row - 1)*60+col, row*60+col);}
            if (row + 1 < 25 && gridCopy[row + 1][col] !== 'w' && dist[index] + 1 < dist[(row + 1)*60+col]) {dist[(row+1)*60 + col] = dist[index] + 1; pq.enqueue([(row+1)*60+col, dist[index] + 1]); prev.set((row + 1)*60+col, row*60+col);}
        }
        if (found) {
            let path = [[endRow, endCol]];
            let rc = prev.get(endRow*60 + endCol);
            while (rc !== startRow*60 + startCol) {
                path.unshift([Math.floor(rc/60), rc%60]);
                rc = prev.get(rc);
            }
            path.unshift([startRow, startCol]);
            this.animateShortestPath(path, time);
        }
    }

    getH(row, col) {
        return Math.abs(col - endCol) + Math.abs(row - endRow);
    }

    aStarSearch(animations) {
        let gridCopy = this.getGridCopy();
        let prev = new Map();
        let found = false;
        let dist = new Array(1500).fill(Number.MAX_VALUE);
        dist[startRow*60 + startCol] = 0;
        let pq = new PriorityQueue((a, b) => {return a[3] === b[3] ? a[2] - b[2]: a[3] - b[3]});
        pq.enqueue([startRow*60 + startCol, 0, this.getH(startRow, startCol), dist[startRow*60 + startCol] + this.getH(startRow, startCol)]);
        while (pq.size() > 0) {
            let [index, g, h, f] = pq.dequeue(),row = Math.floor(index / 60), col = index % 60;
            gridCopy[row][col] = 'w';
            animations.push([row, col]);
            if (row === endRow && col === endCol) {found = true; break;}
            if (dist[index] < g) continue;
            if (col + 1 < 60 && gridCopy[row][col + 1] !== 'w' && dist[index] + 1 < dist[row*60 + col + 1]) {dist[row*60 + col + 1] = dist[index] + 1; pq.enqueue([row*60+col + 1, dist[index]+ 1, this.getH(row, col + 1), dist[index] + 1 + this.getH(row, col + 1)]); prev.set(row*60+col + 1, row*60+col);}
            if (col - 1 >= 0 && gridCopy[row][col - 1] !== 'w' && dist[index] + 1 < dist[row*60 + col - 1]) {dist[row*60 + col - 1] = dist[index] + 1; pq.enqueue([row*60+col - 1, dist[index] +  1, this.getH(row, col - 1), dist[index] + 1 + this.getH(row, col - 1)]); prev.set(row*60+col - 1, row*60+col);}
            if (row - 1 >= 0 && gridCopy[row - 1][col] !== 'w' && dist[index] + 1 < dist[(row - 1)*60+col]) {dist[(row-1)*60 + col] = dist[index] + 1; pq.enqueue([(row-1)*60+col, dist[index] + 1, this.getH(row - 1, col), dist[index] + 1 + this.getH(row - 1, col)]); prev.set((row - 1)*60+col, row*60+col);}
            if (row + 1 < 25 && gridCopy[row + 1][col] !== 'w' && dist[index] + 1 < dist[(row + 1)*60+col]) {dist[(row+1)*60 + col] = dist[index] + 1; pq.enqueue([(row+1)*60+col, dist[index] + 1, this.getH(row + 1, col), dist[index] + 1 + this.getH(row +1, col)]); prev.set((row + 1)*60+col, row*60+col);}
        }
        if (found) {
            let path = [[endRow, endCol]];
            let rc = prev.get(endRow*60 + endCol);
            while (rc !== startRow*60 + startCol) {
                path.unshift([Math.floor(rc/60), rc%60]);
                rc = prev.get(rc);
            }
            path.unshift([startRow, startCol]);
            this.animateShortestPath(path, time);
        }
    }

    buttonHandler(id) {
        if (isSolving) return;
        let animations = [];
        this.resetSearched();
        if (id === 'Cl') {this.getGrid(); return; }
        isSolving = true;
        if (id === 'Br') this.breadthFirstSearch(animations);
        else if (id === 'De') this.depthFirstSearch(animations);
        else if (id === 'Dj') this.dijkstra(animations);
        else if (id === 'A*') this.aStarSearch(animations);
        this.runAnimations(animations);
        setTimeout(() => {isSolving = false}, time + 3000);
    }

    runAnimations(animations) {
        const waitms = time/animations.length;
        for (let i = 0; i < animations.length; i++) {
            setTimeout(() => {
                const {grid} = this.state;
                grid[animations[i][0]][animations[i][1]] = 's';
                this.setState({grid});
                console.log('animations running');
            }, i*waitms);
        }
    }

    animateShortestPath(animations, waitTime) {
        const waitms = 3000/animations.length;
        console.log('shortest path animation', waitTime);
        for (let i = 0; i < animations.length; i++) {
            setTimeout(() =>{
                const {grid} = this.state;
                grid[animations[i][0]][animations[i][1]] = 'p';
                this.setState({grid});
                console.log('running');
            }, waitTime + i*waitms);
        }
    }

    slideHandler() {
        time = parseInt(document.getElementById('timeSlider2').value);
        let {grid} = this.state;
        this.setState(grid);
    }

    render() {
        const {grid} = this.state;
        return (
            <div className="pathfinding-container">
                <div className="btnslider-container">
                    <div className="btn-container">
                        <button onClick={() => this.buttonHandler("A*")}>A* Search</button>
                        <button onClick={() => this.buttonHandler("Br")}>Breadth-First Search</button>
                        <button onClick={() => this.buttonHandler("De")}>Depth-First Search</button>
                        <button onClick={() => this.buttonHandler("Dj")}>Dijkstra's Algorithm</button>
                        <button onClick={() => this.buttonHandler("Cl")}>Clear Board</button>
                    </div>
                    <div className="slider-container">
                        Pathfinding Time: ~ {time/1000}s
                        <input type="range" min='0' max='60000' defaultValue={time} className="slider pathfinding" onChange={() => this.slideHandler()} step="1000" id="timeSlider2"/>
                    </div>
                </div>
                <div className="grid-container">
                    {grid.map((row, rowIdx) => (
                        <div className="grid-row" key={rowIdx}>
                            {row.map((cell, cellIdx) => (
                                <div className={cell === 'w' ? 'grid-cell wall' : cell === 's' ? 'grid-cell searched' : cell === 'p' ? 'grid-cell path' : 'grid-cell'} key={cellIdx} onClick={() => this.handleClick(rowIdx, cellIdx)} onMouseEnter={() => this.handleMouseEnter(rowIdx, cellIdx)}>{
                                    (rowIdx === startRow && cellIdx === startCol ? '➤' : rowIdx === endRow && endCol === cellIdx ? '◎' : '')
                                }</div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}