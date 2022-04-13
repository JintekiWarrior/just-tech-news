const router = require('express').Router()

const { User } = require('../../models')

// GET /api/users
router.get('/', (req, res) => {
  // Access our User model and run the findAll() method (a method from the Model class)
  User.findAll({
    attributes: { exclude: ['password'] }
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
})

// GET /api/users/1
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' })
        return
      }
      res.json(dbUserData)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
})

// POST /api/users
router.post('/', (req, res) => {
  // expects {username: ''myassine', email: 'moe@moe.com', password: 'password123'}
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err)
      res.status(500).json
    })
})

// PUT /api/users/1
router.put('/:id', (req, res) => {
  // expects {username: ''myassine', email: 'moe@moe.com', password: 'password123'}

  // if req.body has exact key/value pairs to match the model, you can use 'req.body' instead
  User.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with this id' })
        return
      }
      res.json(dbUserData)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
})

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
  User.delete('/:id', (req, res) => {
    User.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id '})
          return
        }
        res.json(dbUserData)
      })
      .catch(err => {
        console.log(err)
        res.status(500).json(err)
      })
  })
})

module.exports = router