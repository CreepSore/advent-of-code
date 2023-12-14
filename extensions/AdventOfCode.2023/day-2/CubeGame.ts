export const CubeGameColor: {[key: string]: number} = {
    NONE: 0,
    r: 1,
    g: 2,
    b: 3,
};

interface CubeGameSetEntry {
    count: number;
    color: number;
}

type CubeGameSet = CubeGameSetEntry[];

export default class CubeGame {
    static maxCubeAmounts = [
        0,  // NONE
        12, // R
        13, // G
        14, // B
    ];

    id: number;
    sets: CubeGameSet[] = [];

    valid: boolean = true;
    neededCubes: number[] = [-1, -1, -1, -1];

    constructor(id: number) {
        this.id = id;
    }

    addSet(...sets: CubeGameSet[]): void {
        sets.flat().every(set => {
            if(set.count > CubeGame.maxCubeAmounts[set.color]) {
                this.valid = false;
                return false;
            }

            return true;
        });

        sets.flat().forEach(set => {
            const isMore = set.count > this.neededCubes[set.color];
            if(isMore) {
                this.neededCubes[set.color] = set.count;
            }
        });

        this.sets.push(...sets);
    }

    clear(): void {
        this.sets = [];
    }

    static fromLine(line: string): CubeGame {
        const [, gameId, setString] = line.match(/^Game (\d+): (.+)$/);
        const sets: CubeGameSet[] = (
            setString
                .split(";")
                .map(set =>
                    set.match(/(?:\d+) (?:r|g|b)/g).map(setEntry => ({
                        count: Number(setEntry.substring(0, setEntry.length - 2)),
                        color: CubeGameColor[setEntry.substring(setEntry.length - 1)],
                    })),
                )
        );

        const cubeGame = new CubeGame(Number(gameId));
        cubeGame.addSet(...sets);
        return cubeGame;
    }
}
