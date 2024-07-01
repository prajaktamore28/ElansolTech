import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jsonwebtoken from 'jsonwebtoken' 


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/ElansolDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('DB Connected'))
.catch(err => console.error('DB Connection Error: ', err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User =   mongoose.model('User', userSchema);



app.post('/api/register',  (req, res) => {
  const { username, email, password } = req.body;
 
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newUser = new User({ username, email, password });
       newUser.save(err=>{
    
    });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    if (err.code == 11000) {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

app.get('/api/members', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
const PORT = 9002;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});






// Login route
app.post('/Login',async  (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await  User.findOne({ email });
    console.log(!user)
    console.log(user.password)
    console.log(password)
    if (!user) {  
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id,
        email: user.email,
      },
    };

    jsonwebtoken.sign(payload, 'yourjwtsecret', { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


