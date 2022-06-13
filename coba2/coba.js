const listRT = [1, 2, 1, 4, 5, 4, 2, 5, 6, 7, 1];
listRT.sort((a, b) => {
	if (a > b) return 1;
	if (a < b) return -1;
	return 0;
});
const terbesar = listRT[listRT.length - 1];
const totalRT = new Array(terbesar);
let j = 0;
for (let i = 0; i < terbesar; i++) {
	totalRT[i] = 0;
}
for (let i = 0; i < terbesar; ) {
	while (true) {
		if (listRT[j] == i + 1) {
			totalRT[i]++;
			j++;
		} else {
			i++;
			break;
		}
	}
}
for (let i = 0; i < totalRT.length; i++) {
	if (totalRT[i] === 0) {
		totalRT.splice(i, 1);
	}
}
let uniqueList = [...new Set(listRT)];
let hasil = [];
for (let i = 0; i < uniqueList.length; i++) {
	let chartObj = {};
	chartObj[`name`] = `RT ${uniqueList[i]}`;
	chartObj["value"] = totalRT[i];
	hasil.push(chartObj);
}

console.log(hasil);

console.log(uniqueList);
console.log(totalRT);

console.log(Object.keys(hasil[0]));
