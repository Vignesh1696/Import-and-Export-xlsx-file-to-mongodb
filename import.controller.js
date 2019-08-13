var mongoose = require('mongoose');
var personalModel = require('../personal');
var header = require('./header');
var _ = require('lodash');
var XLSX = require('xlsx')
var fs = require('fs')
var path = require('path')
var async = require('async');




//upload xlsx file
exports.ImportControl = async function(req, res) {
	try {
		console.log("test", req.files);
		var uploadFile = req.files.file.data
		var workbook = XLSX.read(uploadFile, {
			type: "buffer"
		});
		console.log("test", workbook);

		var wsname;
		var ws;

		wsname = workbook.SheetNames[0];
		ws = workbook.Sheets[wsname];

		const data = await XLSX.utils.sheet_to_json(ws, {
			header: 1,
			range: 0
		});

		var obj = {};

		await data.forEach(function(row, i) {
			if (i != 0) {
				const headers = header["headers"];
				if (_.isArray(row)) {
					for (let index = 0; index < row.length; index++) {
						const element = row[index];
						if (headers[index] != undefined)
							obj[headers[index]] = element;

					}

				}
				var create = personalModel.create(obj, function(data) {
					if (data) {
						res.send(data)
					} else {}
				})
			}
			console.log(obj)

		})
		res.send("success")
	} catch (err) {
		console.log("dddddddd", err)
		res.send(err)
	}
}

exports.ExportControl = async function(req, res) {
	personalModel.find({}).then((data) => {
		const wb = {
			SheetNames: [],
			Sheets: {}
		};
		var ws = XLSX.utils.json_to_sheet(data);
		var ws_name = "DataSheet 1";

		XLSX.utils.book_append_sheet(wb, ws, ws_name);
		var wbout = new Buffer(XLSX.write(wb, {
			bookType: 'xlsx',
			type: 'buffer'
		}));
		console.log("eeeee", wbout)
		var filename = "myDataFile.xlsx";
		res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
		res.type('application/octet-stream');
		res.send(wbout);
	})
}