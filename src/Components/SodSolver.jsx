import React from 'react';
import Navbar from './Navbar.jsx'
import {useState, useEffect} from 'react';
import './style.css'

let prevRow = 0, prevCol = 0;
let boardCopy = new Array(9).fill('').map(row => new Array(9).fill('')), animationBoard = new Array(9).fill('').map(col => new Array(9).fill(''));
let isSolving = false;

function SodSolver() {
    const [board, setBoard] = useState(new Array(9).fill('').map(row => new Array(9).fill('')));
    const [time, setTime] = useState(10000);
    const [mes, setMes] = useState('hide');

    useEffect(() => {
        document.addEventListener('keydown', handleKey, true);
        return () => { document.removeEventListener('keydown', handleKey, true);}
    },[])

    const changeBoard = (num) => {
        let newBoard = new Array(9).fill('').map(() => new Array(9).fill(''));
        for (let i = 0; i < 9; i++)
            for (let j = 0; j < 9; j++)
                newBoard[i][j] = boardCopy[i][j];
        if (num !== 'del') {newBoard[prevRow][prevCol] = num;}
        else newBoard[prevRow][prevCol] = '';
        for (let i = 0; i < 9; i++)
            for (let j = 0; j < 9; j++)
                boardCopy[i][j] = newBoard[i][j];
        setBoard(newBoard);
    }

    const handleKey = (e) => {
        if (isSolving) return;
        let rowAdd = 0, colAdd = 0;
        const nums = ['1','2','3','4','5','6','7','8','9'];
        if (e.key === 'ArrowRight' && prevCol + 1 < 9) colAdd = 1;
        else if (e.key === 'ArrowLeft' && prevCol - 1 >= 0) colAdd = -1;
        else if (e.key === 'ArrowDown' && prevRow + 1 < 9) rowAdd = 1;
        else if (e.key === 'ArrowUp' && prevRow - 1 >= 0) rowAdd = -1;
        const cell = document.getElementsByClassName('cell');
        cell[prevRow*9+prevCol].style.backgroundColor = '#eee';
        cell[(prevRow + rowAdd)*9+(prevCol + colAdd)].style.backgroundColor = 'gold';
        prevRow += rowAdd;
        prevCol += colAdd; 
        for (let i = 0; i < 9; i++)
            if (nums[i] === e.key) {changeBoard(e.key); return;}
        if (e.key === 'Backspace') changeBoard('del');
    }

    const handleClick = (e) => {
        changeBoard(e.currentTarget.value);
    }

    function checkNum(row, col, num, animations) {
        for (let i = 0; i < 9; i++) {
            //animations.push(['hiGood', row, i]);
            if (boardCopy[row][i] === num){ /*animations.pop(); animations.push('hiBad', row, i);*/ return false; }
        }
        for (let j = 0; j < 9; j++) {
            //animations.push(['hiGood', j, col]);
            if (boardCopy[j][col] === num){/*animations.pop(); animations.push('hiBad', j, col);*/ return false;}
        }
        let r = Math.floor(row / 3) * 3, c = Math.floor(col / 3) * 3;
        for (let i = r; i < r + 3; i++) {
            for (let j = c; j < c + 3; j++) {
                //animations.push(['hiGood', i, j]);
                if (boardCopy[i][j] === num) { /*animations.pop(); animations.push('hiBad', i, j);*/ return false; }
            }
        }
        boardCopy[row][col] = num;
        return true;
    }

    function solver(row, col, animations) {
        if (col === 9) {row++; col = 0;}
        if (row === 9) return true;
        if (boardCopy[row][col] !== '') return solver(row, col + 1, animations);
        for (let i = 9; i > 0; i--) {
            animations.push(['stv', row, col, i.toString()]);
            if (checkNum(row, col, i.toString(), animations) && solver(row, col + 1, animations)) return true;
        }
        boardCopy[row][col] = '';
        animations.push(['stv', row, col, '']);
        return false;
    }

    function validSoduku() {
        for (let i = 0; i < 9; i++) {
            let rowNums = [0,0,0,0,0,0,0,0,0], colNums = [0,0,0,0,0,0,0,0,0];
            for (let j = 0; j < 9; j++) {
                if (board[i][j] !== '') {
                    rowNums[board[i][j].charCodeAt(0) - 49]++;
                    if (rowNums[board[i][j].charCodeAt(0) - 49] === 2) return false;
                }
                if (board[j][i]!== '') {
                    colNums[board[j][i].charCodeAt(0) - 49]++;
                    if (colNums[board[j][i].charCodeAt(0) - 49] === 2) return false;
                }
            }
        }
        for (let r = 0; r < 9; r += 3) {
            for (let c = 0; c < 9; c += 3) {
                let sqNums = [0,0,0,0,0,0,0,0,0];
                for (let i = r; i < r + 3; i++) {
                    for (let j = c; j < c + 3; j++) {
                        if (board[i][j]!== '') {
                            sqNums[board[i][j].charCodeAt(0) - 49]++;
                            if (sqNums[board[i][j].charCodeAt(0) - 49] === 2) return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    function SolveSoduku() {
        const isValid = validSoduku();
        if (!isValid) {
            setMes('');
            return;
        }
        if (isSolving) return;
        setMes('hide');
        let animations = [];
        const btns = document.getElementsByClassName('inp');
        for (let i = 0; i < btns.length; i++) btns[i].disabled = true;
        const cell = document.getElementsByClassName('cell');
        cell[prevRow*9+prevCol].style.backgroundColor = '#eee';
        const isSolved = solver(0,0, animations);
        console.log(isSolved);
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) animationBoard[i][j] = board[i][j];
        }
        let waitms = time/animations.length;
        console.log(waitms, animations.length);
        isSolving = true;
        runAnimation(animations, waitms);
    }

    function setValue(row, col, num) {
        let newBoard = new Array(9).fill('').map(() => new Array(9).fill(''));
        for (let i = 0; i < 9; i++)
            for (let j = 0; j < 9; j++)
                newBoard[i][j] = animationBoard[i][j];
        newBoard[row][col] = num;
        animationBoard[row][col] = num;
        setBoard(newBoard);
    }

    function runAnimation(animations, waitms) {
        for (let i = 0; i < animations.length; i++) {
            if (animations[i][0] === 'stv') {
                setTimeout(() => setValue(animations[i][1], animations[i][2], animations[i][3]), i*waitms);
            }
        }
        setTimeout(() => {
            const btns = document.getElementsByClassName('inp');
            for (let i = 0; i < btns.length; i++) btns[i].disabled = false;
            isSolving = false;
        }, animations.length * waitms);
    }

    function clearBoard() {
        const blankBoard = new Array(9).fill('').map(row => new Array(9).fill('')), animationBoard = new Array(9).fill('').map(col => new Array(9).fill(''));
        boardCopy = blankBoard;
        setBoard(blankBoard);
        changeBoard('');
    }

    const slideHandler = (e) => {
        setTime(e.currentTarget.value);
    }

    return (
        <>
        <Navbar/>
        <div className='sod-solver'>
            <div>
            <div className="board">
                {board.map((row, rowIdx) => (
                    <div key={rowIdx} className={rowIdx === 2 || rowIdx === 5 ? 'row border-bottom' : 'row'}>
                        {row.map((cell, colIdx) => (
                            <div key={colIdx} className={colIdx === 2 || colIdx === 5 ? 'cell border-right' : 'cell'} onClick={() => {
                                if (isSolving) return;
                                const cell = document.getElementsByClassName('cell');
                                cell[prevRow*9+prevCol].style.backgroundColor = '#eee';
                                cell[rowIdx*9+colIdx].style.backgroundColor = 'gold';
                                prevRow = rowIdx;
                                prevCol = colIdx;
                            }}>
                                {cell}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <button className="clear" onClick={clearBoard}>Clear</button>
            </div>
            <div>
                <h3>{`Solving Time: ~ ${time/1000}s`}</h3>
                <input type="range" min='0' max='60000' defaultValue="10000" className="slider sodSlider" onChange={slideHandler} step="1000"/>
            <div className="num-input">
                <button className="inp" value="1" onClick={handleClick}>1</button>
                <button className="inp" value="2" onClick={handleClick}>2</button>
                <button className="inp" value="3" onClick={handleClick}>3</button>
                <button className="inp" value="4" onClick={handleClick}>4</button>
                <button className="inp" value="5" onClick={handleClick}>5</button>
                <button className="inp" value="6" onClick={handleClick}>6</button>
                <button className="inp" value="7" onClick={handleClick}>7</button>
                <button className="inp" value="8" onClick={handleClick}>8</button>
                <button className="inp" value="9" onClick={handleClick}>9</button>
                <button className="inp del" value="del" onClick={handleClick}>✖️</button>
                <button className="inp sol" onClick={SolveSoduku}>Solve Soduku!</button>
            </div>
            <h2 className={mes}>Not A Valid Soduku!</h2>
            </div>
        </div>
        </>
    );
}

export default SodSolver;

