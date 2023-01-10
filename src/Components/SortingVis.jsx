import React from 'react';
import "./style.css"

let length = 105;
let waitms  = 250;
export default class SortingVis extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: [],
        };
    }
    componentDidMount() {
        this.getArray(length);
    }

    getArray(len) {
        const array = [];
        let max = 70, min = 3;
        for (let i = 0; i < len; i++) {
            array.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        this.setState({array});
    }

    swap(i, j) {
        const {array} = this.state;
        const arrayBars = document.getElementsByClassName('array-bar');
        arrayBars[i].style.backgroundColor = "#d70000";
        arrayBars[j].style.backgroundColor = "#d70000";
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        this.setState({array});;
    }

    cmp(i, j) {
        const arrayBars = document.getElementsByClassName('array-bar');
        arrayBars[i].style.backgroundColor = "gold";
        arrayBars[j].style.backgroundColor = "gold";
    }

    setVal(i, val) {
        const {array} = this.state;
        const arrayBars = document.getElementsByClassName('array-bar');
        arrayBars[i].style.backgroundColor = "#d70000";
        array[i] = val;
        this.setState({array});
    }

    selectBar(i) {
        const arrayBars = document.getElementsByClassName('array-bar');
        arrayBars[i].style.backgroundColor = 'gold';
    }

    resetColor(i , j) {
        const arrayBars = document.getElementsByClassName('array-bar');
        for (let i = 0; i < arrayBars.length; i++) {
            arrayBars[i].style.backgroundColor = "#444";
        }
    }

    /*bubbleSort() {
        const {array} = this.state;
        const arrayBars = document.getElementsByClassName('array-bar');
        for (let i = 0; i < array.length - 1; i++) {
            setTimeout(() =>
            {for (let j = 0; j < array.length - i - 1; j++) {
                const barOne = arrayBars[j].style, barTwo = arrayBars[j + 1].style;
                setTimeout(() => {
                barOne.backgroundColor = '#d70000';
                barTwo.backgroundColor = 'gold';
                if (array[j] > array[j + 1]) {
                    this.swap(j, j + 1);
                }
                }, (i+j)*waitms/array.length)
                setTimeout(() => {
                barOne.backgroundColor = '#444';
                barTwo.backgroundColor = '#444';
                }, (i+j)*waitms/array.length + waitms/10);
            }}, i*waitms);
        }
    }*/

    /*insertionSort() {
        const {array} = this.state;
        const arrayBars = document.getElementsByClassName('array-bar');
        for (let i = 1; i < array.length; i++) {
            setTimeout(() => {
                let temp = array[i];
                let j = i - 1;
                const barOne = arrayBars[i].style;
                barOne.backgroundColor = '#d70000';
                while (j >= 0 && array[j] > temp) {
                    array[j+ 1] = array[j];
                    j--;
                }
                const barTwo = arrayBars[j + 1].style;
                setTimeout(() => {
                barOne.backgroundColor = '#444';
                array[j + 1] = temp;
                this.setState({array});    
                barTwo.backgroundColor = '#d70000';                  
                }, waitms/20);
                setTimeout(() => {
                    barTwo.backgroundColor = '#444';
                }, waitms/5);
            }, i*waitms);
            
        }
    }*/

    insertionSort() {
        const temp = this.state.array;
        let array = [];
        for (let i = 0; i < temp.length; i++) { array.push(temp[i]); }
        const animations = [];
        for (let i = 1; i < array.length; i++) {
            let temp = array[i];
            let j = i - 1;
            while (j >= 0 && array[j] > temp) {
                animations.push(["slt", j]);
                animations.push(["stv", j + 1, array[j]]);
                array[j+1] = array[j];
                j--;
            }
            array[j+1] = temp;
            animations.push(['stv', j + 1, temp]);
        }
        this.runAnimation(animations);
    }

    bubbleSort() {
        const temp = this.state.array;
        let array = [];
        for (let i = 0; i < temp.length; i++) { array.push(temp[i]); }
        const animations = [];
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                animations.push(["cmp", j, j + 1]);
                if (array[j] > array[j + 1]) {
                    let temp = array[j];
                    array[j] = array[j + 1];
                    array[j+1] = temp;
                    animations.push(["swp", j, j + 1]);
                }
            }   
        }
        this.runAnimation(animations);
    }

    quickSort() {
        const temp = this.state.array;
        let array = [];
        const animations = [];
        for (let i = 0; i < temp.length; i++) { array.push(temp[i]); }
        this.qs(array, 0, array.length - 1, animations);
        this.runAnimation(animations);
    }
    partition(array, low, high, animations) {
        let i = low - 1;
        for (let j = low; j <= high - 1; j++) {
            animations.push(["cmp", j, high]);
            if (array[j] < array[high]) {
                i++;
                let temp = array[i];
                array[i] = array[j];
                array[j] = temp;
                animations.push(["swp", i, j]);
            }
        }
        let temp = array[i + 1];
        array[i + 1] = array[high];
        array[high] = temp;
        animations.push(["swp", i + 1, high]);
        return (i + 1);

    }
    qs(array, low, high, animations) {
        if (low < high) {
            let p = this.partition(array, low, high, animations);
            this.qs(array, low, p - 1, animations);
            this.qs(array, p + 1, high, animations);
        }
    }

    doMerge(array, startIdx, middleIdx, endIdx, tempArray, animations) {
        let k = startIdx;
        let i = startIdx;
        let j = middleIdx + 1;
        while (i <= middleIdx && j <= endIdx) {
            animations.push(["cmp", i, j]);
            if (tempArray[i] <= tempArray[j]) {
                animations.push(["stv", k, tempArray[i]]);
                array[k++] = tempArray[i++];
            } else {
                animations.push(["stv", k, tempArray[j]]); 
                array[k++] = tempArray[j++];
            }
        }
        while (i <= middleIdx) {
            //animations.push(["cmp", i, k]);
            animations.push(["stv", k, tempArray[i]]);
            array[k++] = tempArray[i++];
        }
        while (j <= endIdx) {
            //animations.push(["cmp", j, k]);
            animations.push(["stv", k, tempArray[j]]);
            array[k++] = tempArray[j++];
        }
    }
    
    mergeSortHelper(array, startIdx, endIdx, tempArray, animations) {
        if (startIdx === endIdx) return;
        const middleIdx = Math.floor((startIdx + endIdx)/2);
        this.mergeSortHelper(tempArray, startIdx, middleIdx, array, animations);
        this.mergeSortHelper(tempArray, middleIdx + 1, endIdx, array, animations);
        this.doMerge(array, startIdx, middleIdx, endIdx, tempArray, animations);
    }

    mergeSort() {
        const temp = this.state.array;
        const array = [];
        for (let i = 0; i < temp.length; i++) { array.push(temp[i]); }
        const animations = [];
        const tempArray = array.slice();
        this.mergeSortHelper(array, 0, array.length - 1, tempArray, animations);
        this.runAnimation(animations);
    }

    runAnimation(array) {
        for (let i = 0; i < array.length; i++) {
            let type = array[i][0];
            if (type === "slt") {
                setTimeout(() => this.selectBar(array[i][1]), i*waitms);
            } else if (type === "stv") {
                setTimeout(() => this.setVal(array[i][1], array[i][2]), i*waitms);
            } else if (type === "swp") { 
                setTimeout(() => this.swap(array[i][1], array[i][2]), i*waitms);
            } else if (type === "cmp") {
                setTimeout(() => this.cmp(array[i][1], array[i][2]), i*waitms);
            }
            
            setTimeout(() => this.resetColor(), i*waitms + 3*waitms/4);
        } 
    }

    arraySizeSlider() {
        length = document.getElementById('sizeSlider').value;
        this.getArray(length);
    }

    arrayTimeSlider() {
        waitms = 500 - document.getElementById('timeSlider').value;
    }



    render() {
        const {array} = this.state;
        return (
            <>
            <div className="array-container">
            {array.map((value, idx) => (
            <div 
            className="array-bar" key={idx}
            style={{height: `${value}vh`, width: `${80/length - 0.2}vw`}}
            >
            </div>
            ))}
            </div>
            <hr className="line"/>
            <div className="inputs">
                <div className="btn-group">
                <button className="btn" onClick={() => this.getArray(length)}>New Array</button>
                <button className="btn" onClick={() => this.bubbleSort()}>Bubble Sort</button>
                <button className="btn" onClick={() => this.insertionSort()}>Insertion Sort</button>
                <button className="btn" onClick={() => this.quickSort()}>Quick Sort</button>
                <button className="btn" onClick={() => this.mergeSort()}>Merge Sort</button>
                </div>
                <div className="slider-group">
                    <h3>Array Size </h3><input type="range" min='5' max='200' defaultValue="105" className="slider" id="sizeSlider" onChange={() => this.arraySizeSlider()} />
                    <h3>Sorting Speed </h3><input type="range" min='0' max='500' defaultValue="250" className="slider" id="timeSlider" onChange={() => this.arrayTimeSlider()} />
                </div>
            </div>
            </>
        );
    }
}

