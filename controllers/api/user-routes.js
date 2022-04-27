const router = require('express').Router()

const { User, Post, Vote, Comment } = require('../../models')

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

// GET /api/users/:id
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_url', 'created_at']
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'created_at'],
        include: {
          model: Post,
          attributes: ['title']
        }
      },
      {
        model: Post,
        attributes: ['title'],
        through: Vote,
        as: 'voted_posts'
      }
    ]
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
    // gives the session easy access to the id, username, and whether user is logged in.
    .then(dbUserData => {
      // initiates the creation of the session and runs the callback once complete
      req.session.save(() => {
        req.session.user_id = dbUserData.id
        req.session.username = dbUserData.username
        req.session.loggedIn = true

        res.json(dbUserData)
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json
    })
})

router.post('/login', (req, res) => {
// expects {email: 'lernantino@gmail.com', password: 'password1234' }
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' })
      return 
    }

    const validPassword = dbUserData.checkPassword(req.body.password)

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' })
      return 
    }

    req.session.save(() => {
      // declare session variable
      req.session.user_id = dbUserData.id
      req.session.username = dbUserData.username
      req.session.loggedIn = true
      
      res.json({ user: dbUserData, message: 'You are now logged in!' })
    })
  })
})

router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end()
    })
  } else {
    res.status(404).end()
  }
})

// PUT /api/users/1
router.put('/:id', (req, res) => {
  // expects {username: ''myassine', email: 'moe@moe.com', password: 'password123'}

  // if req.body has exact key/value pairs to match the model, you can use 'req.body' instead
  User.update(req.body, {
    individualHooks: true,
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