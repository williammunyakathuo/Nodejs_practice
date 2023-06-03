const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const { render } = require('ejs')

const server = express()
//register view engine
const port = 4000;
const dburi = 'mongodb+srv://netninja:test1234@cluster0.fellqog.mongodb.net/nodetuts?retryWrites=true&w=majority'
mongoose.connect(dburi)
  .then((res) => {
    server.listen(port, () => {
      console.log(`listening to port ${port}`)
    })
    console.log('connected to db')
  })
  .catch((err) => console.log(err))


server.set('view engine', 'ejs');
server.use(express.urlencoded({extended: true}))
server.use(express.static('public'));

server.get('/add-blog', (req, res) => {
  const blog = new Blog({
    title: 'old blog',
    snippet: 'about my new blog',
    body: 'my new blog'
  })

  blog.save()
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      console.log(err)
    })
})

server.get('/all-blog', (req, res) => {
  Blog.find()
    .then((result) => res.send(result))
    .catch((err) => console.log(err))
})

server.get('/one-blog', (req, res) => {
  Blog.findById("647b129437f93fe1c6d52755")
    .then((result) => res.send(result))
    .catch((err) => console.log(err))

})

server.use((req, res, next) => {
  console.log('method', req.method);
  next();
})

server.use(morgan('tiny'))
server.use(express.static('public'))

server.get('/', (req, res) => {
  res.redirect("/blogs")
});

server.get('/blogs', (req, res)=>{
  Blog.find()
    .then((result) => {
      res.render('index', {title: 'All blogs', blogs: result})
    })
    .catch((err) => console.log(err))
})

server.post('/blogs', (req,res) =>{
  const blog = new Blog(req.body);

  blog.save()
  .then((result)=>{
    res.redirect('/blogs')
  })
  .catch((err)=>{
    console.log(err)
  })
})

server.get('/blogs/:id', (req, res)=>{
  const id =  req.params.id;
  Blog.findById(id)
  .then(results=>{
    res.render('details', {blog: results, title: 'blog details'})
  })
  .catch(err =>{
    console.log(err)
  })
})

server.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

server.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

// 404 page
server.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});





// server.listen(port, () => {
//   console.log(`listening to port ${port}`)
// })