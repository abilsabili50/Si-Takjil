let orang = [
	{ nama: "abil", alamat: "darmo", kontribusi: 4, pernah: false },
	{ nama: "syaugi", alamat: "balong", kontribusi: 3, pernah: false },
	{ nama: "fahrul", alamat: "balong", kontribusi: 4, pernah: false },
	{ nama: "julio", alamat: "balong", kontribusi: 3, pernah: false },
	{ nama: "arbi", alamat: "balong", kontribusi: 1, pernah: false },
	{ nama: "slur", alamat: "balong", kontribusi: 2, pernah: false },
	{ nama: "etta", alamat: "balong", kontribusi: 3, pernah: false },
	{ nama: "mama", alamat: "balong", kontribusi: 1, pernah: false },
	{ nama: "samsudin", alamat: "balong", kontribusi: 1, pernah: false },
	{ nama: "samsul", alamat: "balong", kontribusi: 2, pernah: false },
	{ nama: "lenovo", alamat: "balong", kontribusi: 1, pernah: false },
	{ nama: "kolu", alamat: "balong", kontribusi: 2, pernah: false },
	{ nama: "mobdev", alamat: "balong", kontribusi: 2, pernah: false },
	{ nama: "ilc", alamat: "balong", kontribusi: 1, pernah: false },
	{ nama: "danil", alamat: "balong", kontribusi: 2, pernah: false },
	{ nama: "mizhan", alamat: "balong", kontribusi: 1, pernah: false },
	{ nama: "honest", alamat: "balong", kontribusi: 3, pernah: false },
	{ nama: "ataks", alamat: "balong", kontribusi: 2, pernah: false },
	{ nama: "dinda", alamat: "balong", kontribusi: 1, pernah: false },
	{ nama: "sabrina", alamat: "balong", kontribusi: 2, pernah: false },
	{ nama: "chycix", alamat: "balong", kontribusi: 3, pernah: false },
	{ nama: "vito", alamat: "balong", kontribusi: 2, pernah: false },
	{ nama: "fatwa", alamat: "balong", kontribusi: 2, pernah: false },
	{ nama: "kuncoro", alamat: "balong", kontribusi: 2, pernah: false },
	{ nama: "azka", alamat: "balong", kontribusi: 2, pernah: false },
	{ nama: "fakran", alamat: "balong", kontribusi: 3, pernah: false },
	{ nama: "afifudin", alamat: "balong", kontribusi: 2, pernah: false },
	{ nama: "parlika", alamat: "balong", kontribusi: 3, pernah: false },
];

let jumlah_kontribusi = 0;

for (let i = 0; i < orang.length; i++) {
	jumlah_kontribusi += orang[i].kontribusi;
}

let hari = 30;
let jumlah_orang = orang.length;

for (let i = 1; i < 31; i++) {
	if (i % 7 == 0) {
		for (let p = 0; p < jumlah_orang; p++) {
			orang[p].pernah = false;
		}
	}
	console.log(`\n\n\nHari ke-${i}`);
	let ulang = jumlah_kontribusi / hari;
	// console.log(ulang);
	for (let j = 0; j < ulang; j++) {
		for (let k = 0; k < jumlah_orang; k++) {
			if (!orang[k].pernah && orang[k].kontribusi >= hari / 7) {
				console.log(j + 1 + ". " + orang[k].nama + " = " + orang[k].kontribusi);
				orang[k].pernah = true;
				orang[k].kontribusi--;
				jumlah_kontribusi--;
				break;
			}

			if (k == jumlah_orang - 1) {
				for (let h = 0; h < jumlah_orang; h++) {
					if (!orang[h].pernah && orang[h].kontribusi > 0) {
						console.log(
							j + 1 + ". " + orang[h].nama + " = " + orang[h].kontribusi
						);
						orang[h].pernah = true;
						orang[h].kontribusi--;
						jumlah_kontribusi--;
						break;
					}
				}
			}
		}
	}
	hari--;
}

console.log(jumlah_kontribusi);
