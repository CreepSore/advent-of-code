import Config from "./service/Config.js";
import AdventOfCodeService from "./service/AdventOfCodeService.js";
import minimist from "minimist";

const startDate = new Date();

const initConfig = function() {
    Config.instance.saveTemplate();
    return Config.instance.load();
}

const printResults = function(results) {
    [...results].forEach(result => {
        for(let i = 0; i < result.length; i++) {
            console.log(`Day ${result[0]}, Part ${i+1}: ${JSON.stringify(result[1][i].result)} completed in ${Math.round(result[1][i].stopwatch.duration * 100000) / 100000}ms`);
        }
        console.log();
    });
}

const runMainProgram = async function(year, fromDate, toDate) {
    const results = await AdventOfCodeService.executeDays(year, fromDate, toDate);
    printResults(results);
}

const main = async function() {
    const args = minimist(process.argv.slice(2), {
        alias: {
            "clear-data": "c"
        },
        string: [
            "year",
            "from-date",
            "to-date"
        ],
        boolean: [
            "c",
            "t"
        ]
    });

    if(!initConfig()) {
        console.error(`Failed to find config file. Please create one from the generated template.`)
        return false;
    }

    if(args.c) {
        AdventOfCodeService.deleteDataRange(startDate.getFullYear(), 1, 31);
    }
    else {
        runMainProgram(Number(args.year) || startDate.getFullYear(), Number(args["from-date"]) || 1, Number(args["to-date"]) || startDate.getDate());
    }

    return true;
};

main();
