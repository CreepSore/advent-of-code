import Stopwatch from "../../service/Stopwatch.js";
import BingoBoard from "./Day4/BingoBoard.js";

export default class Solution {
    /**
     * @param {string} input 
     */
    parseInput(input) {
        const numbers = input.split("\n")[0].split(",").map(Number);
        const boardsString = input.match(/(?:(?: *(\d+) *){5}(?:\n|)){5}/g);
        const boards = boardsString.map(str => BingoBoard.fromString(str));

        return {numbers, boards};
    }

    /**
     * @param {{numbers: number[], boards: BingoBoard[]}} input 
     */
    async solvePart1(input) {
        const token = Stopwatch.instance.start();

        for(let callNum of input.numbers) {
            for(let board of input.boards) {
                board.callNumber(callNum);
                if(board.hasWon()) {
                    return {
                        stopwatch: Stopwatch.instance.stop(token),
                        result: board.getSum() * callNum
                    };
                }
            }
        }

        return {
            stopwatch: Stopwatch.instance.stop(token),
            result: null
        };
    }

    /**
     * @param {{numbers: number[], boards: BingoBoard[]}} input 
     */
    async solvePart2(input) {
        const token = Stopwatch.instance.start();
        let lastWin = null;

        for(let callNum of input.numbers) {
            for(let board of input.boards) {
                if(!board.hasWon()) {
                    board.callNumber(callNum);
                    if(board.hasWon()) {
                        lastWin = {board, callNum};
                    }
                }
            }
        }

        return {
            stopwatch: Stopwatch.instance.stop(token),
            result: lastWin.board.getSum() * lastWin.callNum
        };
    }

    async solve(input) {
        const parsedInput = this.parseInput(input);
        return [await this.solvePart1(parsedInput), await this.solvePart2(parsedInput)];
    }
};
