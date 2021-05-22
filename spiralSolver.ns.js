let ns;
let output;
let arr;

export async function main(nets) {
    ns = nets;
    var input = ns.args[0];

    log("input:");
    log(input);

    arr = toArray(input);

    traverse(arr);

    log("output:");
    log(output);

}

function toArray(input) {
    var lines = input.split('\n');
    var i;
    for (i = 0; i < lines.length; i++) {
        lines[i] = lines[i].split(',');
        lines[i].pop();
    }
    log("\n\nLines:");
    log(lines);
    return lines;
}

function traverse(arr) {
    var width = arr[0].length;
    var height = arr.length;
    output = [];

    right(0, width, 0, height);
}

function right(x0, x1, y0, y1) {
    if (!sizeCheck(x0, x1, y0, y1)) return;
    log("x0, x1, y0, y1: " + x0 + ", " + x1 + ", " + y0 + ", " + y1);
    var i;
    for (i = x0; i < x1; i++) {
        output.push(arr[y0][i]);
    }
    log("output:");
    log(output);
    down(x0, x1, y0 + 1, y1);
}

function down(x0, x1, y0, y1) {
    if (!sizeCheck(x0, x1, y0, y1)) return;
    log("x0, x1, y0, y1: " + x0 + ", " + x1 + ", " + y0 + ", " + y1);
    var i;
    for (i = y0; i < y1; i++) {
        output.push(arr[i][y1 - 1]);
    }
    log("output:");
    log(output);
    left(x0, x1 - 1, y0, y1);

}

function left(x0, x1, y0, y1) {
    if (!sizeCheck(x0, x1, y0, y1)) return;
    var i;
    for (i = x1 - 1; i >= x0; i--) {
        output.push(arr[y1 - 1][i]);
    }
    log("output:");
    log(output);
    up(x0, x1, y0, y1 - 1);
}

function up(x0, x1, y0, y1) {
    if (!sizeCheck(x0, x1, y0, y1)) return;

    var i;
    for (i = y1; i >= y0; i--) {
        output.push(arr[i][x0]);
    }
    log("output:");
    log(output);
    left(x0 + 1, x1, y0, y1);
}

function sizeCheck(x0, x1, y0, y1) {
    return (x1 - x0 > 0) && (y1 - y0 > 0);
}

function log(s) {
    ns.tprint(s);
    ns.print(s);
}