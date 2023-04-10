const { query } = require('express')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByPk(req.params.id)
    if (!doc) {
      return next(new AppError('no document found with that id', 404))
    }

    await doc.update(req.body)
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    })
  })

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByPk(req.params.id)
    if (!doc) {
      return next(new AppError('no document found with that id', 404))
    }

    await doc.destroy()
    res.status(204).json({
      status: 'success',
    })
  })

exports.createOne = (Model) =>
  catchAsync(async (req, res, nex) => {
    const doc = await Model.create(req.body)
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    })
  })

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByPk(req.params.id)
    if (!doc) {
      return next(new AppError('no document found with that id', 404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    })
  })

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findAll()

    res.status(200).json({
      status: 'success',
      results: doc.length,
      requestedAt: req.requestedAt,
      data: {
        data: doc,
      },
    })
  })
