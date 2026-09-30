//import express
const express = require('express')

//import CORS
const cors = require('cors')

//import bodyParser
const bodyParser = require('body-parser')

//import path
const path = require('path')

//import router
const router = require('./routes')

//init app
const app = express()

//use cors
app.use(cors())

//use body parser
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//define port
const port = 3000;

//route
app.get('/', (req, res) => {
  res.send('Hello World!')
})

//define routes
app.use('/api', router);

// Route to serve uploaded files (if needed)
app.get('/uploads/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, 'uploads', req.params.filename));
});
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); 
// Catatan: Jika folder uploads berada di root project (bukan di dalam public), gunakan:
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//start server
app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on port 3000');

    // Example in screens/posts/Index.jsx
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);

const fetchPosts = async () => {
  try {
    const response = await Api.get('/posts');
    setPosts(response.data.data); // Stores []
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false); // ALWAYS stop loading, even if array is empty
  }
};
})
