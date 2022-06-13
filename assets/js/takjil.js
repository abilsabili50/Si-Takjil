let db = openDatabase("db.takjil", "2.0", "Takjil DataBase", 2 * 1024 * 1024);
// module.exports = {db}
const username = localStorage.getItem("username");
const password = localStorage.getItem("password");
window.onload = function () {
	localStorage.removeItem("namaMasjid");
	localStorage.removeItem("namaMasjidStrip");
	if (username == null && password == null) {
		alert("Please Login First");
		window.location.href = "./signin/index.html";
	}
	$(".myinfo .name").text(username);
};

db.transaction(function (transaction) {
	let sql =
		"CREATE TABLE if not exists masjid" +
		"(id_masjid INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
		"id_user VARCHAR (50) NOT NULL," +
		"nama_masjid VARCHAR (50) NOT NULL," +
		"alamat_masjid VARCHAR (50) NOT NULL," +
		"CONSTRAINT nama_masjid_user UNIQUE (nama_masjid))";
	transaction.executeSql(sql, undefined);
});
db.transaction(function (transaction) {
	let sql =
		"CREATE TABLE if not exists warga" +
		"(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
		"id_masjid VARCHAR(100) NOT NULL," +
		"nama_warga VARCHAR(100) NULL," +
		"alamat_warga VARCHAR(100) NULL," +
		"RT INTEGER NULL," +
		"total_kontribusi INTEGER NULL," +
		"CONSTRAINT data_warga UNIQUE (nama_warga, alamat_warga))";
	transaction.executeSql(sql, undefined);
});
$(document).ready(function () {
	// CRUD
	// loadData();
	showList();

	alwaysCreateEntity();
	/* make side menu show up */
	$(".trigger").click(function () {
		$(".menuWrap").fadeIn(180);
		$(".menu").animate(
			{
				opacity: "1",
				left: "0px",
			},
			180
		);
	});

	/* make config menu show up */
	$(".cn").click(function () {
		$(".config").animate(
			{
				opacity: "1",
				right: "0px",
			},
			180
		);
		/* hide others */
		$(".menuWrap").fadeOut(180);
		$(".menu").animate(
			{
				opacity: "0",
				left: "-320px",
			},
			180
		);
	});

	$(".chartNav").click(function () {
		$(".chartSection").animate(
			{
				opacity: "1",
				right: "0px",
			},
			180
		);
		/* hide others */
		$(".menuWrap").fadeOut(180);
		$(".menu").animate(
			{
				opacity: "0",
				left: "-320px",
			},
			180
		);
	});

	//This also hide everything, but when people press ESC
	$(document).keydown(function (esc) {
		if (esc.keyCode == 27) {
			$(".menuWrap").fadeOut(180);
			$(".menu").animate(
				{
					opacity: "0",
					left: "-320px",
				},
				180
			);
			$(".config").animate(
				{
					opacity: "0",
					right: "-200vw",
				},
				180
			);
			$(".chartSection").animate(
				{
					opacity: "0",
					right: "-200vw",
				},
				180
			);
			$(".jadwalSection").animate(
				{
					opacity: "0",
					right: "-200vw",
				},
				180
			);
		}
	});

	$(".rightPanel").click(function () {
		$(".menuWrap").fadeOut(180);
		$(".menu").animate(
			{
				opacity: "0",
				left: "-320px",
			},
			180
		);
		$(".chartSection").animate(
			{
				opacity: "0",
				right: "-200vw",
			},
			180
		);
		$(".jadwalSection").animate(
			{
				opacity: "0",
				right: "-200vw",
			},
			180
		);
	});

	$(".rightPanel, .leftPanel").click(function () {
		$(".config").animate(
			{
				opacity: "0",
				right: "-200vw",
			},
			180
		);
		$(".chartSection").animate(
			{
				opacity: "0",
				right: "-200vw",
			},
			180
		);
		$(".jadwalSection").animate(
			{
				opacity: "0",
				right: "-200vw",
			},
			180
		);
	});

	$(".leftPanel").mouseenter(function () {
		$("#createEntity").animate(
			{
				opacity: "1",
				bottom: "50px",
			},
			180
		);
	});

	$(".leftPanel").mouseleave(function () {
		$("#createEntity").animate(
			{
				opacity: "0",
				bottom: "-70px",
			},
			180
		);
	});

	/* small conversation menu */
	$(".otherOptions").click(function () {
		$(".moreMenu").slideToggle("fast");
	});

	/* clicking the search button from the conversation focus the search bar outside it, as on desktop */
	$(".search").click(function () {
		$(".searchChats").focus();
	});

	$(".lo").click(function () {
		localStorage.clear();
		window.location.href = "./signin/index.html";
	});

	$("#createEntity").click(function () {
		$(".titleList").children().remove();
		let nama = prompt("Masukkan nama Masjid");
		let alamat = prompt("Masukkan alamat Masjid");

		if (nama && alamat) {
			insertDatabase(nama, alamat);
		} else {
			alwaysCreateEntity();
		}
	});

	$(".jadwal").click(function () {
		for (let i = 1; i < 31; i++) {
			$(`.data-${i}`).children().remove();
		}
		$(".jadwalSection").animate(
			{
				opacity: "1",
				right: "0px",
			},
			180
		);
		/* hide others */
		$(".menuWrap").fadeOut(180);
		$(".menu").animate(
			{
				opacity: "0",
				left: "-320px",
			},
			180
		);
		let namaMasjidStrip = localStorage.getItem("namaMasjidStrip");
		if (!namaMasjidStrip) {
			$(".jadwalSection h1").html("");
			$(".jadwalSection h1").html("Klik Masjid Terlebih Dahulu...🗿🗿🗿");
			$(".containerJadwal").hide();
		}
		if (namaMasjidStrip) {
			$(".jadwalSection h1").html("");
			$(".jadwalSection h1").html(`Jadwal Takjil ${namaMasjidStrip}`);
			$(".containerJadwal").show();
		}
		db.transaction(function (transaction) {
			let sql = "SELECT * FROM warga WHERE id_masjid='" + namaMasjidStrip + "'";
			transaction.executeSql(
				sql,
				undefined,
				function (transaction, results) {
					if (results.rows.length) {
						let orang = [];
						for (let x = 0; x < results.rows.length; x++) {
							let data = results.rows[x];
							let object = {};
							object["nama"] = data.nama_warga;
							object["alamat"] = data.alamat_warga;
							object["kontribusi"] = data.total_kontribusi;
							object["pernah"] = false;

							orang.push(object);
						}
						cetak_jadwal(orang);
					}
				},
				function (transaction, err) {
					swal(err.message, {
						icon: "error",
					});
				}
			);
		});
	});
});

let orang_temp = [
	{
		nama: "Bpk. AFANDI",
		alamat: "BLOK 6A/05",
		kontribusi: 4,
	},
	{
		nama: "Bpk. SUDIRO",
		alamat: "BLOK 6A/07",
		kontribusi: 3,
	},
	{
		nama: "Ibu MAEMUNAH",
		alamat: "BLOK 6A/09",
		kontribusi: 4,
	},
	{
		nama: "Bpk. H. RUSDI",
		alamat: "BLOK 6A/10",
		kontribusi: 3,
	},
	{
		nama: "Bpk. M. ALI",
		alamat: "BLOK 6A/11",
		kontribusi: 1,
	},
	{
		nama: "Bpk. AGUS WAHYU",
		alamat: "BLOK 6A/12",
		kontribusi: 2,
	},
	{
		nama: "Bpk.SUBAKIR",
		alamat: "BLOK 6F/02",
		kontribusi: 3,
	},
	{
		nama: "Bpk. Abd. MALIK",
		alamat: "BLOK 6F/02",
		kontribusi: 1,
	},
	{
		nama: "Ibu NUR FARIDAH",
		alamat: "BLOK 6F/03",
		kontribusi: 1,
	},
	{
		nama: "Bpk. RUSTAM",
		alamat: "BLOK 6F/06",
		kontribusi: 2,
	},
	{
		nama: "Bpk. MUNIR",
		alamat: "BLOK 6F/08",
		kontribusi: 1,
	},
	{
		nama: "Bpk. KUSNO W",
		alamat: "BLOK 6F/09",
		kontribusi: 2,
	},
	{
		nama: "Bpk.MUSTHOFA",
		alamat: "BLOK 6H/18",
		kontribusi: 2,
	},
	{
		nama: "Bpk. CHUSNI. A",
		alamat: "BLOK 6L/12",
		kontribusi: 1,
	},
	{
		nama: "Bpk. KUSWAHYUDI",
		alamat: "BLOK 7D/08",
		kontribusi: 2,
	},
	{
		nama: "Ibu IBNU",
		alamat: "BLOK 6A/14",
		kontribusi: 1,
	},
	{
		nama: "Bpk. H. Abd. ROFEK",
		alamat: "BLOK 6A/18",
		kontribusi: 3,
	},
	{
		nama: "Bpk. H. AMIN",
		alamat: "BLOK 6B/01",
		kontribusi: 2,
	},
	{
		nama: "Bpk. SYAIFULLAH",
		alamat: "BLOK 6B/01",
		kontribusi: 1,
	},
	{
		nama: "Bpk. THOLIB",
		alamat: "BLOK 6B/02",
		kontribusi: 2,
	},
	{
		nama: "Bpk. WAHYUDI",
		alamat: "BLOK 6B/03",
		kontribusi: 3,
	},
	{
		nama: "Bpk. SUPARDI",
		alamat: "BLOK 6F/12",
		kontribusi: 2,
	},
	{
		nama: "Bpk. ANDI",
		alamat: "BLOK 6F/16",
		kontribusi: 2,
	},
	{
		nama: "Bpk. BAGUS P",
		alamat: "BLOK 6F/17",
		kontribusi: 2,
	},
	{
		nama: "Bpk. SAHRIAL",
		alamat: "BLOK 6F/18",
		kontribusi: 2,
	},
	{
		nama: "Ibu ASUN",
		alamat: "BLOK 6F/19",
		kontribusi: 3,
	},
	{
		nama: "Bpk. DWI. A",
		alamat: "BLOK 6I/01",
		kontribusi: 2,
	},
	{
		nama: "Bpk. NUGROHO. B",
		alamat: "BLOK 6I/11",
		kontribusi: 3,
	},
];

function cetak_sekali() {
	cetak_sekali = function () {};
	db.transaction(function (transaction) {
		let sql =
			"INSERT INTO masjid (id_user, nama_masjid, alamat_masjid) VALUES (?, ?, ?)";
		transaction.executeSql(sql, ["admin", "Masjid Contoh", "Alamat Contoh"]);
	});
	db.transaction(function (transaction) {
		for (let i = 0; i < orang_temp.length; i++) {
			let sql =
				"INSERT INTO warga (id_masjid, nama_warga, alamat_warga, RT, total_kontribusi) VALUES (?, ?, ?, ?, ?)";
			transaction.executeSql(sql, [
				"Masjid Contoh",
				orang_temp[i].nama,
				orang_temp[i].alamat,
				(i % 5) + 1,
				orang_temp[i].kontribusi,
			]);
		}
	});
}

cetak_sekali();

function cetak_jadwal(orang) {
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
		// console.log(`\nHari ke-${i}`);
		let index_hari = i;
		let ulang = jumlah_kontribusi / hari;
		// console.log(ulang);
		for (let j = 0; j < ulang; j++) {
			for (let k = 0; k < jumlah_orang; k++) {
				if (!orang[k].pernah && orang[k].kontribusi >= hari / 7) {
					masukkan_jadwal(index_hari, j + 1, orang[k].nama, orang[k].alamat);
					// console.log(orang[k].nama);
					// console.log(
					// 	j + 1 + ". " + orang[k].nama + " = " + orang[k].kontribusi
					// );
					orang[k].pernah = true;
					orang[k].kontribusi--;
					jumlah_kontribusi--;
					break;
				}

				if (k == jumlah_orang - 1) {
					for (let h = 0; h < jumlah_orang; h++) {
						if (!orang[h].pernah && orang[h].kontribusi > 0) {
							masukkan_jadwal(
								index_hari,
								j + 1,
								orang[h].nama,
								orang[h].alamat
							);
							// console.log(orang[k].nama);
							// console.log(
							// 	j + 1 + ". " + orang[h].nama + " = " + orang[h].kontribusi
							// );
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
}

function masukkan_jadwal(hari, nomer, nama, alamat) {
	$(`.data-${hari}`).append(
		"<tr>" +
			`<td>${nomer}</td>` +
			`<td>${nama}</td>` +
			`<td>${alamat}</td>` +
			"</tr>"
	);
}

function redirect() {
	window.location.href = "./mobile/mobilepage.html";
}

function insertDatabase(nama, alamat) {
	db.transaction(function (transaction) {
		let sql =
			"INSERT INTO masjid (id_user, nama_masjid, alamat_masjid) VALUES (?, ?, ?)";
		transaction.executeSql(
			sql,
			[username, nama, alamat],
			function () {
				// $(".titleList").children().remove();
			},
			function (transaction, err) {
				swal(err.message, {
					icon: "error",
				});
			}
		);
		alwaysCreateEntity();
	});
}

function alwaysCreateEntity() {
	// $(".titleList").children().remove();
	db.transaction(function (transaction) {
		let sql = "SELECT * FROM masjid WHERE id_user = '" + username + "'";
		transaction.executeSql(
			sql,
			undefined,
			function (transaction, results) {
				if (results.rows.length) {
					for (let i = 0; i < results.rows.length; i++) {
						let result = results.rows[i];
						let nama = result.nama_masjid;
						var alamat = result.alamat_masjid;
						createEntity(nama, alamat);
					}
				} else {
					$(".titleList").append(noDataFound);
				}
			},
			function (transaction, err) {
				console.log(err.message);
			}
		);
	});
}

function openData(evt, nama_masjid, namaWoSpace) {
	// $(".dataSect").css("display", "none");
	// console.log(evt);
	$(".listButton").removeClass(" active");
	evt.currentTarget.className += " active";
	// $(".newDataSect").css("display", "none");
	// document.getElementById(namaData).style.display = "block";
	localStorage.removeItem("namaMasjid");
	localStorage.removeItem("namaMasjidStrip");
	localStorage.setItem("namaMasjid", namaWoSpace); // nama masjid tanpa spasi (masjidat-taubah) digunakan sebagai id
	localStorage.setItem("namaMasjidStrip", nama_masjid); // nama masjid menggunakan spasi (Masjid At-Taubah)
	$(".leftSide .name").html(nama_masjid);
	$(".leftSide .alamat").html(
		`${$(evt.currentTarget).find(".listInfo .alamat").html()}`
	);
	$(".rightPanel").fadeIn(180);
	$("#newDataSect").animate(
		{
			opacity: "1",
			right: "0",
		},
		180
	);
	loadData();
	// $(".chartTitle").html(`Data ${nama_masjid} Berdasarkan RT`);
	// $(".chart").css("display", "none");
	// $("canvas#myChartPie").remove();
}

function createEntity(name, alamat) {
	let nameWoSpace = name
		.split("")
		.filter((e) => e.trim().length)
		.join("");
	let listButton = createListButton(nameWoSpace, name, alamat);
	$(".titleList").append(listButton);

	// let newDataSect = createNewDataSect(id, name, alamat);
	// $(".rightPanel").append(newDataSect);
	// $(`#${id}`).css("display", "none");
}

function createListButton(nameWoSpace, name, alamat) {
	return (
		`<div onClick="openData(event, '${name}', '${nameWoSpace}')" class="listButton">` +
		'<div class="listInfo">' +
		'<div class="image"></div>' +
		`<p class="name">${name}</p>` +
		`<p class="alamat">${alamat}</p>` +
		"</div>" +
		"</div>"
	);
}

function deleteEntity() {
	const namaMasjid = $(`#newDataSect`).find(".name").text();
	const idMasjidWarga = localStorage.getItem("namaMasjid");
	// console.log("OKE");

	swal({
		title: "Do you want to delete this entity?",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	}).then((willDeleteTable) => {
		if (willDeleteTable) {
			db.transaction(function (transaction) {
				let sql = "DELETE FROM masjid WHERE nama_masjid='" + namaMasjid + "'";
				transaction.executeSql(
					sql,
					undefined,
					function (transaction) {
						sql = "DELETE FROM warga WHERE id_masjid='" + idMasjidWarga + "'";
						transaction.executeSql(sql, undefined, function () {
							swal("Poof! This Entity has been deleted!", {
								icon: "success",
							}).then(() => {
								localStorage.removeItem("namaMasjid");
								localStorage.removeItem("namaMasjidStrip");
								$(".listButton").removeClass(" active");
								$(".titleList").children().remove();
								$(".rightPanel").fadeOut(180);
								$("#newDataSect").animate(
									{
										opacity: "0",
										right: "-(calc(100% - 321px))",
									},
									180
								);
								alwaysCreateEntity();
							});
						});
					},
					function (transaction, error) {
						console.log(error.message);
					}
				);
			});
		} else {
			return;
		}
	});
}

function search() {
	const searchTitle = $("#searchTitle").val().toUpperCase();
	const titleList = document.getElementById("titleList");
	const listButton = document.querySelectorAll(".listButton");
	const listName = titleList.getElementsByClassName("name");
	const listAddress = titleList.getElementsByClassName("alamat");
	// const noListButtonFound = document.querySelectorAll(".listButton[style='display: block;']");

	for (let i = 0; i < listName.length; i++) {
		let name = listName[i].innerHTML.toUpperCase();
		let address = listAddress[i].innerHTML.toUpperCase();
		if (name.indexOf(searchTitle) > -1 || address.indexOf(searchTitle) > -1) {
			listButton[i].style.display = "block";
		} else {
			listButton[i].style.display = "none";
		}
	}
	// if(noListButtonFound.length == 0){
	//     $(".titleList").append(noDataFound);
	// }
}

function recancel() {
	$(`#newDataSect.update`).hide();
	$(`#newDataSect.insert`).show();
	$(`#newDataSect.cancel`).hide();
	$(`#newDataSect.personName`).val("");
	$(`#newDataSect.address`).val("");
	$(`#newDataSect.RT`).val("");
	$(`#newDataSect.total`).val("");
}

function reinsert() {
	let id_masjid = localStorage.getItem("namaMasjidStrip");
	let personName = $(`#newDataSect .personName`).val();
	let address = $(`#newDataSect .address`).val();
	let RT = $(`#newDataSect .RT`).val();
	let total = $(`#newDataSect .total`).val();
	if (personName == "" || address == "" || RT == "" || total == "") {
		return swal("FIELD CANNOT BE EMPTY", {
			icon: "error",
		});
	}
	if (RT == "0" || total == "0") {
		return swal("Value must be greater than or equal to 1", {
			icon: "error",
		});
	}

	db.transaction(function (transaction) {
		let sql =
			"INSERT INTO warga(id_masjid, nama_warga, alamat_warga, RT, total_kontribusi) VALUES(?, ?, ?, ?, ?)";
		transaction.executeSql(
			sql,
			[id_masjid, personName, address, RT, total],
			function () {
				swal("Success", {
					icon: "success",
				});
			},
			function (transaction, err) {
				swal(err.message, {
					icon: "error",
				});
			}
		);
	});
	$(`#newDataSect .personName`).val("");
	$(`#newDataSect .address`).val("");
	$(`#newDataSect .RT`).val("");
	$(`#newDataSect .total`).val("");
	loadData();
}

function deleteAll() {
	swal({
		title: "Do you want to delete all data?",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	}).then((willDeleteTable) => {
		if (willDeleteTable) {
			db.transaction(function (transaction) {
				const namaMasjid = localStorage.getItem("namaMasjidStrip");
				let sql = "DELETE FROM warga WHERE id_masjid ='" + namaMasjid + "'";
				transaction.executeSql(
					sql,
					undefined,
					function () {
						swal("Success", {
							icon: "success",
						});
					},
					function (transaction, err) {
						swal(err.message, {
							icon: "error",
						});
					}
				);
			});
			loadData();
		} else {
			return;
		}
	});
}

const noDataFound =
	"<div id='noDataFound' class='no-hover'>" +
	'<div class="listInfo">' +
	`<p class="name">NO DATA FOUND</p>` +
	"</div>" +
	"</div>";

//CRUD
function loadData() {
	$(`.tablejil`).children().remove();
	db.transaction(function (transaction) {
		let namaMasjid = localStorage.getItem("namaMasjid");
		let namaMasjidStrip = localStorage.getItem("namaMasjidStrip");
		var sql =
			"SELECT * FROM warga WHERE id_masjid = '" +
			namaMasjid +
			"' OR id_masjid ='" +
			namaMasjidStrip +
			"' ORDER BY id ASC";
		// var sql = "SELECT * FROM warga ORDER BY id ASC";
		transaction.executeSql(
			sql,
			undefined,
			function (transaction, result) {
				//console.log(result.rows);
				if (result.rows.length) {
					for (var i = 0; i < result.rows.length; i++) {
						$(`#dropdownMenuButton1`).attr("disabled", false);
						var row = result.rows.item(i);
						var id = row.id;
						var personName = row.nama_warga;
						var address = row.alamat_warga;
						var RT = row.RT;
						var total = row.total_kontribusi;
						var btnEdit =
							'<button class="btn btn-warning btn-edit"   onclick="edit(' +
							id +
							')">Ubah</button>';
						var btnDelete =
							'<button class="btn btn-danger btn-edit"  onclick="wipe(' +
							id +
							')">Hapus</button>';
						$(`.tablejil`).append(
							"<tr><td>" +
								(i + 1) +
								"</td><td>" +
								personName +
								"</td><td>" +
								address +
								"</td><td>" +
								RT +
								'</td><td align = "center">' +
								total +
								"</td>" +
								'</td><td align = "center">' +
								btnEdit +
								" " +
								btnDelete +
								"</td></tr>"
						);
					}
				} else {
					$(`.tablejil`).append(
						'<tr><td colspan="6" align="center">No Data Found</tr></td>'
					);
					$(`#dropdownMenuButton1`).attr("disabled", true);
				}
			},
			function (transaction, error) {
				console.log(error.message);
			}
		);
	});
	showList();
}

function showList() {
	db.transaction(function (transaction) {
		const namaMasjid = localStorage.getItem("namaMasjidStrip");
		var sql = "SELECT * FROM warga WHERE id_masjid = '" + namaMasjid + "'";
		transaction.executeSql(
			sql,
			[],
			function (transaction, results) {
				let len = results.rows.length,
					i;
				let temp = new Array();
				$(`#listRT`).html("");
				for (i = 0; i < len; i++) {
					temp[i] = results.rows.item(i).RT;
				}
				let uniqueTemp = [...new Set(temp)];
				uniqueTemp.sort((a, b) => {
					if (a > b) return 1;
					if (a < b) return -1;
					return 0;
				});
				$(`#listRT`).append(
					'<option value="0" onchange="filterRT()">Show All</option>'
				);
				for (i = 0; i < uniqueTemp.length; i++) {
					$(`#listRT`).append(
						"<option value=" + uniqueTemp[i] + ">" + uniqueTemp[i] + "</option>"
					);
				}
			},
			null
		);
	});
}

function filterRT() {
	const namaMasjid = localStorage.getItem("namaMasjid");
	let rtValue = $(`#${namaMasjid} #listRT`).val();
	$(`#${localStorage.getItem("namaMasjid")} .tablejil`)
		.children()
		.remove();
	db.transaction(function (transaction) {
		var sql =
			"SELECT * FROM warga WHERE RT=" +
			rtValue +
			" AND id_masjid = '" +
			namaMasjid +
			"'";
		transaction.executeSql(sql, [], function (transaction, result) {
			if (rtValue == 0) return loadData();
			if (result.rows.length) {
				for (var i = 0; i < result.rows.length; i++) {
					var row = result.rows.item(i);
					var id = row.id;
					var personName = row.nama_warga;
					var address = row.alamat_warga;
					var RT = row.RT;
					var total = row.total_kontribusi;
					var btnEdit =
						'<button class="btn-edit btn btn-warning"   id="btn-edit" onclick="edit(' +
						id +
						')">Edit</button>';
					var btnDelete =
						'<button class="btn btn-danger"  onclick="wipe(' +
						id +
						')">Delete</button>';
					$(`#${localStorage.getItem("namaMasjid")} .tablejil`).append(
						"<tr><td>" +
							(i + 1) +
							"</td><td>" +
							personName +
							"</td><td>" +
							address +
							"</td><td>" +
							RT +
							'</td><td align = "center">' +
							total +
							"</td>" +
							'</td><td align = "center">' +
							btnEdit +
							" " +
							btnDelete +
							"</td></tr>"
					);
				}
			} else {
				$(`#${localStorage.getItem("namaMasjid")} .tablejil`).append(
					'<tr><td colspan="6" align="center">No Data Found</tr></td>'
				);
			}
		});
	});
}

function edit(id) {
	swal({
		title: "Are you sure want to edit ?",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	}).then((willEdit) => {
		if (!willEdit) {
			return;
		} else {
			db.transaction(function (transaction) {
				var sql = "SELECT * FROM warga WHERE id=" + id;
				transaction.executeSql(sql, [], function (transaction, results) {
					$(`#personName`).val(results.rows.item(0).nama_warga);
					$(`#address`).val(results.rows.item(0).alamat_warga);
					$(`#RT`).val(results.rows.item(0).RT);
					$(`#total`).val(results.rows.item(0).total_kontribusi);
				});
			});
			$(`#insert`).hide();
			$(`#update`).show();
			$(`#cancel`).show();
			window.idValue = id;
		}
	});
}

function renew() {
	var id = window.idValue;
	var personName = $(`#personName`).val();
	var address = $(`#address`).val();
	var RT = $(`#RT`).val();
	var total = $(`#total`).val();

	if (personName == "" || address == "" || RT == "" || total == "") {
		return alert("FIELD CANNOT BE EMPTY");
	}
	if (RT == "0" || total == "0") {
		return alert("Value must be greater than or equal to 1");
	}

	if (RT == "") RT = "NULL";
	if (total == "") total = "NULL";

	db.transaction(function (transaction) {
		var sql =
			"UPDATE warga SET nama_warga ='" +
			personName +
			"',alamat_warga ='" +
			address +
			"',RT =" +
			RT +
			",total_kontribusi =" +
			total +
			" WHERE id =" +
			id +
			"";
		transaction.executeSql(sql, undefined);
	});
	$(`#update`).hide();
	$(`#cancel`).hide();
	$(`#insert`).show();
	$(`#personName`).val("");
	$(`#address`).val("");
	$(`#RT`).val("");
	$(`#total`).val("");
	loadData();
}

function wipe(id) {
	swal({
		title: "Are you sure want to delete?",
		text: "Once deleted, you will not be able to recover this selected data!",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	}).then((willDelete) => {
		if (!willDelete) {
			return;
		} else {
			db.transaction(function (transaction) {
				var sql = "DELETE FROM warga WHERE id =" + id;
				transaction.executeSql(sql, undefined);
			});
			loadData();
			swal("Poof! Your selected data has been deleted!", {
				icon: "success",
			});
		}
	});
}

function searchTable() {
	// Declare variables
	var input, filter, table, tr, td, i, txtValue;
	input = document.getElementById("myInput");
	filter = input.value.toUpperCase();
	table = document.getElementById("tableData");
	tr = table.getElementsByTagName("tr");

	// Loop through all table rows, and hide those who don't match the search query
	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[1];
		if (td) {
			txtValue = td.textContent || td.innerText;
			if (txtValue.toUpperCase().indexOf(filter) > -1) {
				tr[i].style.display = "";
			} else {
				tr[i].style.display = "none";
			}
		}
	}
}

const groupBy = (arr, prop) => {
	var grouped = {};
	for (var i = 0; i < arr.length; i++) {
		var p = arr[i][prop];
		if (!grouped[p]) {
			grouped[p] = [];
		}
		grouped[p].push(arr[i]);
	}
	return grouped;
};

let donutData = {};

function loadChart() {
	var data;
	db.transaction(function (transaction) {
		let sql = "SELECT * FROM warga";
		transaction.executeSql(sql, undefined, function (transaction, results) {
			if (results.rows.length) {
				// $(".chartPlace").children().remove();
				data = results.rows;
				// console.log(data);
				data = groupBy(data, "id_masjid");
				let namaMasjid = Object.keys(data);
				// console.log(data);
				let pjgTotal = namaMasjid.length;
				// console.log(data[namaMasjid[0]]);
				$(".chartPlace").children().remove();
				for (let i = 0; i < pjgTotal; i++) {
					let listRT = [];
					let listTotal = [],
						temp = "",
						temp2 = "";
					let dataPerMasjid = data[namaMasjid[i]];
					for (let j = 0; j < data[namaMasjid[i]].length; j++) {
						listRT.push(dataPerMasjid[j].RT);
					}

					temp = groupBy(dataPerMasjid, "RT");
					// console.log(temp);
					let namaTotal = Object.keys(temp);
					for (let j = 0; j < namaTotal.length; j++) {
						temp2 = temp[namaTotal[j]];
						// console.log(namaMasjid[i]);
						// console.log(temp2);
						let totalKontribusi = 0;
						for (let k = 0; k < temp2.length; k++) {
							totalKontribusi += temp2[k].total_kontribusi;
							// console.log(temp2[k].total_kontribusi);
						}
						listTotal.push(totalKontribusi);
					}

					// console.log(temp2[0].total_kontribusi);
					// for(let i=0; i<temp.length; i++){
					// 	listTotal.push(temp.total_kontribusi);
					// }

					listRT.sort((a, b) => {
						if (a > b) return 1;
						if (a < b) return -1;
						return 0;
					});
					// console.log(listRT);
					// console.log(listTotal);
					// console.log(listRT);
					const terbesar = listRT[listRT.length - 1];
					let totalRT = new Array(terbesar);
					let q = 0;
					for (let i = 0; i < terbesar; i++) {
						totalRT[i] = 0;
					}
					// console.log(listRT);
					for (let i = 0; i < terbesar; ) {
						while (true) {
							if (listRT[q] == i + 1) {
								totalRT[i]++;
								q++;
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
					for (let i = 0; i < totalRT.length; i++) {
						if (totalRT[i] === 0) {
							totalRT.splice(i, 1);
						}
					}
					let uniqueList = [...new Set(listRT)];
					// console.log(namaMasjid[i]);
					// console.log(uniqueList);
					// console.log(listTotal);
					let hasil = [];
					let hasilBar = [];
					for (let i = 0; i < uniqueList.length; i++) {
						let chartObj = {};
						let barObj = {};
						barObj["name"] = `RT ${uniqueList[i]}`;
						barObj["value"] = listTotal[i];
						chartObj["name"] = `RT ${uniqueList[i]}`;
						chartObj["quantity"] = totalRT[i];
						hasil.push(chartObj);
						hasilBar.push(barObj);
						// console.log(totalRT[i]);
					}
					// console.log(hasil);
					donutData["data"] = [];
					// console.log(hasil);
					donutData["data"] = hasil;
					// console.log(donutData);
					createChart(namaMasjid[i]);

					function createBarChart(hasilBar) {
						let nim = namaMasjid[i].replaceAll(" ", "-");
						const container = d3.select(`.chartContainer .bar${nim}`);
						const barChart = britecharts.bar();
						barChart
							.isAnimated(true)
							.margin({
								left: 40,
							})
							.isHorizontal(true)
							.height(400)
							.width(400);
						container.datum(hasilBar).call(barChart);
					}

					createBarChart(hasilBar);

					// FUNCTION CHART
					function createDonutChart(donutData) {
						let nim = namaMasjid[i].replaceAll(" ", "-");
						let donutChart = britecharts.donut(),
							donutContainer = d3.select(`.chartContainer .chart${nim}`),
							containerWidth = donutContainer.node()
								? donutContainer.node().getBoundingClientRect().width
								: false,
							legendChart = britecharts.legend(),
							legendContainer;

						donutChart
							.isAnimated(true)
							.highlightSliceById(2)
							.hasFixedHighlightedSlice(true)
							.width(containerWidth)
							.height(containerWidth)
							.externalRadius(containerWidth / 2.5)
							.internalRadius(containerWidth / 5);

						legendChart.width(200).height(100).numberFormat("s");

						donutContainer.datum(donutData.data).call(donutChart);
						legendContainer = d3.select(`.chartContainer .legend${nim}`);
						legendContainer.datum(donutData.data).call(legendChart);

						donutChart.highlightSliceById(3).isAnimated(true); //not working
						donutContainer.datum(donutData.data).call(donutChart);
					}

					// createDonutChart();
					// END FUNCTION CHART

					createDonutChart(donutData);
				}
			}
		});
	});
}

function createChart(namaMasjid) {
	let nim = namaMasjid.replaceAll(" ", "-");
	// pembungkus
	let div = document.createElement("div");
	let attr = document.createAttribute("class");
	attr.value = "card--chart";
	div.setAttributeNode(attr);
	$(".chartPlace").append(div);
	// judul chart
	let title = document.createElement("h3");
	title.textContent = namaMasjid;
	div.appendChild(title);
	// pembungkus judul per chart
	let titleChart = document.createElement("div");
	let titleChartClass = document.createAttribute("class");
	titleChartClass.value = "title-per-chart";
	titleChart.setAttributeNode(titleChartClass);
	div.appendChild(titleChart);
	// judul per chart
	let donutChartTitle = document.createElement("h4");
	donutChartTitle.textContent = "Jumlah Warga Per RT";
	let barChartTitle = document.createElement("h4");
	barChartTitle.textContent = "Jumlah Kontribusi Warga Per RT";
	titleChart.appendChild(donutChartTitle);
	titleChart.appendChild(barChartTitle);
	// tempat pembungkus chart
	let chartCont = document.createElement("div");
	let contClass = document.createAttribute("class");
	contClass.value = "chartContainer";
	chartCont.setAttributeNode(contClass);
	div.appendChild(chartCont);
	// tempat donut chart
	let donutChart = document.createElement("div");
	let donutClass = document.createAttribute("class");
	donutClass.value = `js-donut-chart-container chart${nim}`;
	donutChart.setAttributeNode(donutClass);
	chartCont.appendChild(donutChart);
	// tempat legend chart
	let legendChart = document.createElement("div");
	let legendCont = document.createAttribute("class");
	legendCont.value = `js-legend-chart-container legend${nim}`;
	legendChart.setAttributeNode(legendCont);
	chartCont.appendChild(legendChart);
	// tempat bar chart
	let barChart = document.createElement("div");
	let barClass = document.createAttribute("class");
	barClass.value = `bar-container bar${nim}`;
	barChart.setAttributeNode(barClass);
	chartCont.appendChild(barChart);
}

function tableToJson(table) {
	var data = [];

	// first row needs to be headers
	var headers = [];
	for (var i = 0; i < table.rows[0].cells.length; i++) {
		headers[i] = table.rows[0].cells[i].innerHTML
			.toLowerCase()
			.replace(/ /gi, "");
	}

	// go through cells
	for (var i = 1; i < table.rows.length; i++) {
		var tableRow = table.rows[i];
		var rowData = {};

		for (var j = 0; j < tableRow.cells.length; j++) {
			rowData[headers[j]] = tableRow.cells[j].innerHTML;
		}

		data.push(rowData);
	}

	return data;
}

function exportPdf() {
	const doc = new jsPDF();
	const tableData = tableToJson($("#tableData").get(0));
	const Footers = (doc) => {
		const pageCount = doc.internal.getNumberOfPages();

		doc.setFont("helvetica", "italic");
		doc.setFontSize(8);
		for (var i = 1; i <= pageCount; i++) {
			doc.setPage(i);
			doc.text(
				"Page " + String(i) + " of " + String(pageCount),
				doc.internal.pageSize.width / 2,
				287,
				{
					align: "center",
				}
			);
		}
	};
	doc.autoTable({
		columns: [
			{
				header: "No",
				dataKey: "no",
			},
			{
				header: "Nama Warga",
				dataKey: "namawarga",
			},
			{
				header: "Alamat",
				dataKey: "alamatwarga",
			},
			{
				header: "RT",
				dataKey: "rt",
			},
			{
				header: "Jumlah Kontribusi",
				dataKey: "totalkontribusi",
			},
		],
		body: tableData,
		margin: {
			top: 34,
		},
		didDrawPage: function (data) {
			doc.text("Daftar Warga", 90, 30);
		},
	});
	Footers(doc);
	doc.save(`Laporan Data Takjil Warga${Date.now()}.pdf`);
}

function exportExcel() {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet("Sheet 1");
	worksheet.mergeCells("A1", "E2");
	worksheet.getCell("A1").value = "Daftar Warga";
	worksheet.getCell("A1").alignment = {
		horizontal: "center",
	};
	worksheet.getRow(2).values = [
		"No",
		"Nama Warga",
		"Alamat",
		"RT",
		"Jumlah Kontribusi",
	];
	worksheet.columns = [
		{
			key: "no",
			width: 30,
		},
		{
			key: "namawarga",
			width: 30,
		},
		{
			key: "alamatwarga",
			width: 30,
		},
		{
			key: "rt",
			width: 30,
		},
		{
			key: "totalkontribusi",
			width: 30,
		},
	];
	worksheet.addRows(tableToJson($("#tableData").get(0)));
	workbook.xlsx
		.writeBuffer()
		.then((buffer) =>
			saveAs(new Blob([buffer]), `Laporan Data Takjil Warga_${Date.now()}.xlsx`)
		)
		.catch((err) => console.log("Error writing excel export", err));
}
