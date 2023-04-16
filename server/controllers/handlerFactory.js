const { query } = require('express')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const { Op } = require('sequelize')

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
    const queryObj = { ...req.query }

    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach((el) => delete queryObj[el])

    let where = {}
    for (const key in queryObj) {
      where[key] = {
        [Op.eq]: queryObj[key],
      }
    }

    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 50
    const offset = (page - 1) * limit

    const sortOrder = req.query.sort || ''
    let order = []
    if (sortOrder) {
      const sortFields = sortOrder.split(',').map((field) => field.trim())
      order = sortFields.map((field) => {
        if (field.startsWith('-')) {
          return [field.slice(1), 'DESC']
        } else {
          return [field, 'ASC']
        }
      })
    }

    const results = await Model.findAll({
      where: where,
      order: order,
      offset: offset,
      limit: limit,
    })

    res.status(200).json({
      status: 'success',
      results: results.length,
      data: {
        data: results,
      },
    })
  })
