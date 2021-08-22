const fs = require('fs')
const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true, // restaurants 資料處理
      nest: true // restaurants 資料處理
    }).then(restaurants => {
      return res.render('admin/restaurants', { restaurants })
    })
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  postRestaurnat: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body

    if (!name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req // equal to const file = req.file
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.create({
            name, tel, address, opening_hours, description,
            image: file ? `/upload/${file.originalname}` : null
          }).then(restaurant => {
            req.flash('success_messages', 'restaurant was successfully created')
            res.redirect('/admin/restaurants')
          })
        })
      })
    } else {
      return Restaurant.create({
        name, tel, address, opening_hours, description,
        image: null
      }).then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created')
        return res.redirect('/admin/restaurants')
      })
    }
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        return res.render('admin/restaurant', { restaurant: restaurant.toJSON() }) // restaurant 資料處理
      })
  },

  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        return res.render('admin/create', { restaurant: restaurant.toJSON() }) // restaurant 資料處理
      })
  },

  putRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body

    if (!name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.findByPk(req.params.id)
            .then((restaurant) => {
              restaurant.update({
                name, tel, address, opening_hours, description,
                image: file ? `/upload/${file.originalname}` : restaurant.image
              }).then((restaurant) => {
                req.flash('success_messages', 'restaurant was successfully to update')
                res.redirect('/admin/restaurants')
              })
            })
        })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name, tel, address, opening_hours, description,
            image: restaurant.image
          }).then((restaurant) => {
            req.flash('success_messages', 'restaurant was successfully to update')
            res.redirect('/admin/restaurants')
          })
        })
    }
  },

  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
          .then(restaurant => {
            req.flash('success_messages', 'restaurant was successfully to delete')
            res.redirect('/admin/restaurants')
          })
      })
  }
}

module.exports = adminController