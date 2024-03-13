exports.crud = (Modelurl, crudName) => {
	var express = require("express");
	var router = express.Router();

	const apiResponse = require("../../helpers/apiResponse");
	// const auth = require("../../helpers/jwt");
	// const adminAuth = require("../../helpers/jwtadmin");
	var mongoose = require("mongoose");
	// mongoose.set("useFindAndModify", false);

	const Model = require(Modelurl).Model;
	console.log("Modelurl",Model);

	/**
	 * Model List.
	 *
	 * @returns {Object}
	 */
	var modelList = [
		// auth,
		// adminAuth,
		function (req, res) {
			try {
				Model.find().then((models) => {
					return apiResponse.successResponseWithData(
						res,
						"Operation success" + crudName,
						models
					);
				});
			} catch (err) {
				console.log(err.message);
				//throw error in json response with status 500.
				return apiResponse.ErrorResponse(res, err);
			}
		},
	];

	/**
	 * Model Detail.
	 *
	 * @param {string}      id
	 *
	 * @returns {Object}
	 */
	var modelDetail = [
		// auth,
		// adminAuth,
		function (req, res) {
			if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
				return apiResponse.successResponseWithData(
					res,
					"Operation success",
					{}
				);
			}
			try {
				Model.findOne({ _id: req.params.id }).then((model) => {
					if (model !== null) {
						return apiResponse.successResponseWithData(
							res,
							"Operation success" + crudName,
							model
						);
					} else {
						return apiResponse.successResponseWithData(
							res,
							"Operation success" + crudName,
							{}
						);
					}
				});
			} catch (err) {
				//throw error in json response with status 500.
				return apiResponse.ErrorResponse(res, err);
			}
		},
	];

	/**
	 * Model store.
	 *
	 * @param {string}      title
	 * @param {string}      description
	 * @param {string}      isbn
	 *
	 * @returns {Object}
	 */
	var modelStore = [
		// auth,
		// adminAuth,
		(req, res) => {
			try {
				var model = new Model(req.body);
				console.log(model);
				//Save model.
				model.save((err) => {
					console.log(err);
					if (err) {
						return apiResponse.ErrorResponse(res, err);
					}

					return apiResponse.successResponseWithData(
						res,
						"Model add Success." + crudName,
						model
					);
				});
			} catch (err) {
				//throw error in json response with status 500.
				return apiResponse.ErrorResponse(res, err);
			}
		},
	];

	/**
	 * Model update.
	 *
	 * @param {string}      title
	 * @param {string}      description
	 * @param {string}      isbn
	 *
	 * @returns {Object}
	 */
	var modelUpdate = [
		// auth,
		// adminAuth,
		(req, res) => {
			try {
				var model = req.body;
				if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
					return apiResponse.validationErrorWithData(
						res,
						"Invalid Error." + crudName,
						"Invalid ID " + crudName
					);
				} else {
					Model.findById(req.params.id, function (err, foundCustomer) {
						if (foundCustomer === null) {
							return apiResponse.notFoundResponse(
								res,
								"Model not exists with this id" + crudName
							);
						} else {
							Model.findByIdAndUpdate(
								req.params.id,
								model,
								function (err, newmodel) {
									if (err) {
										return apiResponse.ErrorResponse(res, err);
									} else {
										return apiResponse.successResponseWithData(
											res,
											"Model update Success." + crudName,
											newmodel
										);
									}
								}
							);
						}
					});
				}
			} catch (err) {
				//throw error in json response with status 500.
				return apiResponse.ErrorResponse(res, err);
			}
		},
	];

	/**
	 * Model Delete.
	 *
	 * @param {string}      id
	 *
	 * @returns {Object}
	 */
	var modelDelete = [
		// auth,
		// adminAuth,
		function (req, res) {
			if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
				return apiResponse.validationErrorWithData(
					res,
					"Invalid Error.",
					"Invalid ID"
				);
			}
			try {
				Model.findById(req.params.id, function (err, foundCustomer) {
					if (foundCustomer === null) {
						return apiResponse.notFoundResponse(
							res,
							"Model not exists with this id" + crudName
						);
					} else {
						//Check authorized user
						if (foundCustomer.user.toString() !== req.user._id) {
							return apiResponse.unauthorizedResponse(
								res,
								"You are not authorized to do this operation." + crudName
							);
						} else {
							//delete model.
							Model.findByIdAndRemove(req.params.id, function (err) {
								console.log(err.message);
								if (err) {
									return apiResponse.ErrorResponse(res, err);
								} else {
									return apiResponse.successResponse(
										res,
										"Model delete Success." + crudName
									);
								}
							});
						}
					}
				});
			} catch (err) {
				//throw error in json response with status 500.
				return apiResponse.ErrorResponse(res, err);
			}
		},
	];

	router.get("/", modelList);
	router.get("/:id", modelDetail);
	router.post("/", modelStore);
	router.put("/:id", modelUpdate);
	router.delete("/:id", modelDelete);

	return router;
};
